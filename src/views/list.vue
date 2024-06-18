<template>
  <div class="home">
    <!-- <div>文章列表</div> -->
    <div class="columnList" ref="columnList">
      <div v-for="column in column" :key="column.id" class="column">
        <div v-for="article in column.list" :key="article.id" class="article" @click="choose(article)">
          <img :src="article.img" v-if="article.img" style="width: 100%;" />
          <div class="title">{{ article.title }}</div>
        </div>
      </div>
    </div>
    <div v-if="loading" class="loading">加載中</div>
    <div v-else @click="initPage" class="nextPage">
      <div class="button">下一頁</div>
    </div>
    <div v-if="popArticle" class="popArticle">
      <div class="nav">
        <div class="back" @click="popArticle = null">
          <img src="@/assets/back.png" />
        </div>
        <div class="title">{{ popArticle.title }}</div>
      </div>
      <div class="content">
        <div v-html="popArticle.content"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import sleep from "../common/sleep";
import StrObj from "../common/StrObj";
import { load } from 'cheerio'

type Article = {
  id: number,
  title: string,
  link: string,
  img: string | null,
  height: number,
  content: string | null,// null的时候点击再请求一次
}

const page = ref<number>(-1);
const column = ref<{
  id: number,
  height: number,
  list: Article[]
}[]>([
  { id: 1, height: 0, list: [], },
  { id: 2, height: 0, list: [], },
])
const linkToImg = ref<any>({});
const loading = ref<boolean>(false)
const columnList = ref(null)
const popArticle = ref<Article | null>(null)

console.log('!!!!', onMounted)
onMounted(() => {
  initPage()
});
async function initPage() {
  loading.value = true
  const html: string = await new Promise(resolve => {
    fetch(page.value === -1 ? "https://www.ptt.cc/bbs/Beauty/index.html" : `https://www.ptt.cc/bbs/Beauty/index${page.value}.html`)
      .then(function (response) {
        return response.text()
      })
      .then(text => {
        resolve(text)
      })
  })
  const $ = load(html);
  const pageNumLink = $('.btn-group-paging>a')
  // @ts-ignore
  const maxPage: number = (pageNumLink[1].attribs.href as string).match(/index(\d+).html/)[1]
  console.log('maxPage', maxPage)
  page.value = page.value === -1 ? maxPage - 1 : page.value - 1

  const listLink = $('.r-list-container>.r-ent>.title>a');
  const returnListMap = [];
  for (let i = 0; i < listLink.length; i++) {
    const item = listLink[i];
    // @ts-ignore
    let title = item.children[0].data;
    returnListMap.push({
      title,
      link: 'https://www.ptt.cc' + item.attribs.href,
    });
  }
  const newList = returnListMap.reverse();

  page.value = page.value === -1 ? maxPage - 1 : page.value - 1
  for (let i = 0; i < newList.length; i++) {
    const item = newList[i];
    const html: string | null = await new Promise<string | null>(resolve => {
      let result: null | true | false = null
      setTimeout(() => {
        if (result === null) {
          resolve(null)
          result = true;
        }
      }, 2000)
      fetch(item.link)
        .then(function (response) {
          return response.text()
        })
        .then(text => {
          if (result === null) {
            resolve(text)
            result = true;
          }
        })
    })
    if (html === null) {
      addDetail({
        id: Math.random() * 10000,
        title: item.title,
        img: null,
        height: 0,
        link: item.link,
        content: null,// $('#main-content').html() as string,
      })
      continue;
    }
    const $ = load(html);
    // @ts-ignore
    let imgUrls = (Array.from($('#main-content img')) as Element[]).slice(0, 1)
    // @ts-ignore
    window.sss = imgUrls;
    if (imgUrls && imgUrls.length === 0) {
      addDetail({
        id: 1,
        title: item.title,
        img: null,
        height: 20,
        link: item.link,
        // @ts-ignore
        content: $('#main-content').html(),
      })
      continue;
    }
    let detailTemp: Article = {
      id: 1,
      title: item.title,
      img: null,
      link: item.link,
      height: 40,
      content: '',
    };
    if (imgUrls) {
      for (let j = 0; j < imgUrls.length; j++) {
        // @ts-ignore
        const url = imgUrls[j].attribs.src;
        const isCanInclude = await (new Promise<boolean>(resolve => {
          let result: null | true | false = null;
          setTimeout(() => {
            if (result === null) {
              detailTemp = {
                id: 1,
                title: item.title,
                img: null,
                link: item.link,
                height: 0,
                content: $('#main-content').html() as string,
              }
              resolve(false);
              result = false;
            }
          }, 3000);
          const image = new Image();
          image.onload = function () {
            const width = window.innerWidth / column.value.length
            detailTemp = {
              id: 1,
              title: item.title,
              img: url,
              link: item.link,
              height: image.height / image.width * width,
              content: $('#main-content').html() as string,
            }
            if (result === null) {
              resolve(true)
              result = true;
            }

          };
          image.onerror = function () {
            if (result === null) {
              resolve(false)
              result = false;
            }
          }
          image.src = url;
        }))
        if (isCanInclude) {
          break
        }
      }
    }
    addDetail(detailTemp)
  }
  loading.value = false;
}
function addDetail(item: Article) {
  let minHeightIndex = 0;

  const allColumn = columnList.value.children
  for (let i = 0; i < allColumn.length; i++) {
    if (allColumn[i].clientHeight < allColumn[minHeightIndex].clientHeight) {
      minHeightIndex = i;
    }
  }
  column.value[minHeightIndex].height += item.height;
  column.value[minHeightIndex].list.push(item)
}
function choose(item: Article) {
  console.log(item)
  if (item.content === null) {
    fetch(item.link)
      .then(function (response) {
        return response.text()
      })
      .then(text => {
        const $ = load(text);
        item.content = $('#main-content').html();
      })
  }
  popArticle.value = item;
}
</script>

<style lang="less" scoped>
.home {
  background-color: #f8f7f3;
  height: 100vh;
  overflow-y: auto;
}

.columnList {
  display: flex;
  align-items: flex-start;
  padding: 16px;

  .column {
    flex-grow: 1;
    width: 358px;

    &:not(:first-child) {
      margin-left: 12px;
    }

    .article {
      border: solid 1px rgb(245, 245, 245);
      box-sizing: border-box;
      background-color: white;
      min-height: 120px;
      margin-top: 16px;
      border-radius: 12px;
      display: flex;
      flex-direction: column;

      .title {
        padding: 16px;
      }
    }
  }
}

.list {
  display: flex;
  flex-wrap: wrap;

  .item {
    border: solid 1px black;
    width: 200px;
    flex-shrink: 0;
    margin: 24px;
    border-radius: 8px;
  }
}

.popArticle {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: white;
  height: 100vh;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  .nav {
    height: 88px;
    display: flex;
    align-items: center;
    border-bottom: solid 1px #efefef;

    .back {
      height: 88px;
      width: 88px;
      display: flex;
      align-items: center;
      justify-content: center;

      >img {
        width: 66px;
        height: 66px;
      }
    }

    .title {
      margin-right: 88px;
      text-align: center;
      flex-grow: 1;
      font-size: 40px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .content {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
  }

  :deep(.richcontent) {
    max-width: 100%;

    img {
      max-width: 100%;
      // opacity: 0.05;
    }
  }

  :deep(.article-metaline) {
    border: solid 1px red;
    display: none;
  }

  :deep(.article-metaline-right) {
    border: solid 1px red;
    display: none;
  }
}

.loading {
  min-height: 160px;
  line-height: 160px;
}

.nextPage {
  padding: 16px;

  .button {
    height: 88px;
    line-height: 88px;
    border: solid 1px rgb(202, 202, 202);
    box-sizing: border-box;
    border-radius: 8px;
  }
}
</style>
