const { hostname } = require('os');
const puppeteer = require('puppeteer');

let browser;
let page;

let pageDetail0;
let pageDetail1;
let pageDetailList = [];

exports.loadPage = async (url) => {
  try {
    console.log('-------------list-------------')
    console.time()
    console.log(0)
    if (browser === undefined) {
      browser = await puppeteer.launch();
    }
    console.log(0.1)
    if (page === undefined) {
      page = await browser.newPage();
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
    }

    console.log(1)
    console.timeLog()
    await page.goto(url);
    console.log(2)
    console.timeLog()
    const pageNumLink = (await page.$$('.btn-group-paging>a'))[1];
    if (pageNumLink === undefined) {
      let content = await page.evaluate(() => document.body.innerHTML)
      console.log(content);
      console.log('pageNumLink为空')

    }
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

exports.loadDetail = async (url, pageNum) => {
  try {
    console.log('-------------detail-------------')
    if (browser === undefined) {
      browser = await puppeteer.launch();
    }
    // let pageDetail = pageDetailList[pageNum];//pageNum === 0 ? pageDetail0 : pageDetail1;
    if (pageDetailList[pageNum] === undefined) {
      pageDetailList[pageNum] = await browser.newPage();
      await pageDetailList[pageNum].setRequestInterception(true);
      pageDetailList[pageNum].on('request', request => {
        if (request.resourceType() === 'document') {
          const headers = Object.assign({}, request.headers(), {
            cookie: 'over18=1',
          });
          request.continue({ headers });
        } else {
          request.abort();
        }
      });
    }

    await pageDetailList[pageNum].goto(url);
    try {
      const img = await pageDetailList[pageNum].$$('#main-content img');
      const imgs = [];
      for (let i = 0; i < img.length; i++) {
        const temp = await img[i].evaluate((v) => v.src)
        if (temp) {
          imgs.push(temp)
          if (imgs.length === 3) {
            break;
          }
        }
      }
      return imgs;
    } catch (e) {
      return null;
    }
  } catch (e) {
    console.log(e)
  }
}
