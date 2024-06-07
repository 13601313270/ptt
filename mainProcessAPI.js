const { hostname } = require('os');
const puppeteer = require('puppeteer');

let browser;
let page;

exports.loadPage = async (url) => {
  try {
    if (browser === undefined) {
      browser = await puppeteer.launch();
    }
    if (page === undefined) {
      page = await browser.newPage();
    }
    await page.setRequestInterception(true);
    page.on('request', request => {
      if (request.resourceType() === 'document') {
        const headers = Object.assign({}, request.headers(), {
          cookie: 'over18=1',
        });
        request.continue({ headers });
      } else {
        request.abort();
      }
    });
    await page.goto(url);
    const pageNumLink = (await page.$$('.btn-group-paging>a'))[1];
    const pageNum = (await pageNumLink.evaluate((v) => v.href)).match(/index(\d+).html/)[1];
    const list = await page.$$('.r-list-container>.r-ent');
    const returnListMap = [];
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      let title;
      try {
        title = await item.$eval('.title>a', e => {
          return {
            link: e.href,
            title: e.textContent,
          }
        });
      } catch (e) {
        title = await item.$eval('.title', e => {
          return {
            title: e.textContent,
          }
        });
      }

      returnListMap.push({
        title: title.title,
        link: title.link,
      })
    }
    return {
      maxPage: (+pageNum) + 1,
      list: returnListMap
    };
  } catch (e) {
    console.log(e)
  }
}

exports.loadDetail = async (url) => {
  try {
    if (browser === undefined) {
      browser = await puppeteer.launch();
    }
    if (page === undefined) {
      page = await browser.newPage();
    }

    await page.goto(url);
    try {
      const img = await page.$eval('#main-content img', e => {
        return e.src;
        // return {
        //   img: e.innerHTML,
        // }
      });
      return img
    } catch (e) {
      return null;
    }
    // let content = await page.evaluate(() => document.body.innerHTML);
    // if (content.includes('您即將進入之看板內容需滿十八歲方可瀏覽。')) {
    //   const elements = await page.$$('[name=yes]');
    //   if (elements.length > 0) {
    //     await elements[0].click();
    //     await new Promise(resolve => {
    //       setTimeout(resolve, 500)
    //     })
    //     await page.goto(url);
    //     content = await page.evaluate(() => document.body.innerHTML);
    //   }
    // }


    // const pageNumLink = (await page.$$('.btn-group-paging>a'))[1];
    // const pageNum = (await pageNumLink.evaluate((v) => v.href)).match(/index(\d+).html/)[1];
    // console.log('!!!!!=====11', pageNum);

    // const list = await page.$$('.r-list-container>.r-ent');
    // console.log('总共条数', list.length);
    // const returnListMap = [];
    // for (let i = 0; i < list.length; i++) {
    //   const item = list[i];
    //   console.log('item:', item);
    //   let title;
    //   try {
    //     title = await item.$eval('.title>a', e => {
    //       return {
    //         link: e.href,
    //         title: e.textContent,
    //       }
    //     });
    //   } catch (e) {
    //     title = await item.$eval('.title', e => {
    //       return {
    //         title: e.textContent,
    //       }
    //     });
    //   }

    //   returnListMap.push({
    //     title: title.title,
    //     link: title.link,
    //   })
    // }
    // return {
    //   maxPage: (+pageNum) + 1,
    //   list: returnListMap
    // };
  } catch (e) {
    console.log(e)
  }
}
