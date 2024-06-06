const puppeteer = require('puppeteer');
let browser;
let page;

exports.loadPage = async (url) => {
  try {
    console.log('-----> 0')
    if (browser === undefined) {
      console.log('-----> 0.1')
      browser = await puppeteer.launch();
    }
    if (page === undefined) {
      console.log('-----> 0.2')
      page = await browser.newPage();
    }
    console.log('-----> 1')
    await page.goto(url);
    console.log('-----> 1.1')
    let content = await page.evaluate(() => document.body.innerHTML);
    if (content.includes('您即將進入之看板內容需滿十八歲方可瀏覽。')) {
      console.log('-----> 2')
      console.log(typeof content);
      const elements = await page.$$('[name=yes]');
      if (elements.length > 0) {
        console.log('-----> 3')
        console.log(elements);
        await elements[0].click();
        console.log('点击点击');
        await new Promise(resolve => {
          setTimeout(resolve, 500)
        })
        console.log('-----> 4')
        await page.goto(url);
        console.log('-----> 5')
        content = await page.evaluate(() => document.body.innerHTML);
        console.log('-----> 6')
        // r-list-container
      }
    }
    const list = await page.$$('.r-list-container>.r-ent');
    // console.log(list);
    const returnListMap = [];
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const title = await item.$eval('.title>a', e => {
        return {
          link: e.href,
          title: e.textContent,
        }
      });
      console.log(item, title)
      returnListMap.push({
        title: title.title,
        link: title.link,
      })
    }
    return returnListMap;
  } catch (e) {
    console.log(e)
  }
}