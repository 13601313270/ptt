<template>
  <div class="home">
    <div>文章列表</div>
    <div class="columnList">
      <div v-for="column in column" :key="column.id" class="column">
        <div v-for="article in column.list" :key="article.id" class="article"
          :style="{ height: article.height + 'px' }">
          {{ article.title }}
          <img :src="article.img" style="width: 90%;" />
        </div>
      </div>
    </div>
    <div class="list">
      <div v-for="item in allList" :key="item.id" class="item" @click="choose(item)">
        {{ item.title }}
        <!-- {{ item.link }} -->
        <img v-if="item.img" :src="linkToImg[item.img]" width="80" />
      </div>
    </div>
    <div v-if="loading">加载中</div>
    <div v-else @click="initPage">下一页</div>
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
  img: string | null,
  height: number,
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
const allList = ref<Article[]>([]);
const linkToImg = ref<any>({});
const loading = ref<boolean>(false)

console.log('!!!!', onMounted)
onMounted(() => {
  initPage()
  // alert(1);
  // setInterval(() => {
  //   addDetail({
  //     id: 1,
  //     title: '第一个',
  //     img: '',
  //     height: Math.round(Math.random() * 100) + 10,
  //   })
  // }, 1000)

});
async function initPage() {
  loading.value = true
  const html: string = await new Promise(resolve => {
    fetch('https://www.ptt.cc/bbs/Beauty/index.html')
      .then(function (response) {
        return response.text()
      })
      .then(text => {
        resolve(text)
      })
  })
  // console.log(html); // 输出获取到的文本内容
  const $ = load(html);
  const pageNumLink = $('.btn-group-paging>a')
  // @ts-ignore
  const maxPage: number = (pageNumLink[1].attribs.href as string).match(/index(\d+).html/)[1]
  console.log('maxPage', maxPage)
  page.value = page.value === -1 ? maxPage - 1 : page.value - 1

  const listLink = $('.r-list-container>.r-ent>.title>a');
  const returnListMap = [];
  // @ts-ignore
  window.llll = listLink
  for (let i = 0; i < listLink.length; i++) {
    const item = listLink[i];
    // @ts-ignore
    let title = item.children[0].data;
    // try {
    //   item.children[0].data
    //   title = await item.$eval('.title>a', e => {
    //     return {
    //       link: e.href,
    //       title: e.textContent,
    //     }
    //   });
    // } catch (e) {
    //   title = await item.$eval('.title', e => {
    //     return {
    //       title: e.textContent,
    //     }
    //   });
    // }

    returnListMap.push({
      title,
      link: 'https://www.ptt.cc/' + item.attribs.href,
    })
  }
  const newList = returnListMap.reverse();

  page.value = page.value === -1 ? maxPage - 1 : page.value - 1
  // this.allList = newList;
  for (let i = 0; i < newList.length; i++) {
    const item = newList[i];
    // @ts-ignore
    const imgUrls: string[] = await loadDetail(item.link, i);
    console.log(imgUrls);
    if (imgUrls && imgUrls.length === 0) {
      addDetail({
        id: 1,
        title: item.title,
        img: null,
        height: 20,
      })
      continue;
    }
    let detailTemp: Article = {
      id: 1,
      title: item.title,
      img: null,
      height: 40,
    };
    if (imgUrls) {
      for (let j = 0; j < imgUrls.length; j++) {
        const url = imgUrls[j];
        const isCanInclude = await (new Promise<boolean>(resolve => {
          const image = new Image();
          image.onload = function () {
            // this.linkToImg[url] = imgUrl;
            console.log('!!!!' + image.height)
            const width = window.innerWidth / column.value.length
            detailTemp = {
              id: 1,
              title: item.title,
              img: url,
              height: image.height / image.width * width,
            }
            resolve(true)
          };
          image.onerror = function () {
            resolve(false)
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
  return
  // for (let i = 0; i < list.length; i++) {
  //   const item = list[i];
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
  return;
  // @ts-ignore
  loadPage(page.value === -1 ? "https://www.ptt.cc/bbs/Beauty/index.html" : `https://www.ptt.cc/bbs/Beauty/index${page.value}.html`).then(async (result) => {
    console.log("##########", result);
    const { maxPage, list } = result;
    const newList = list.reverse();
    page.value = page.value === -1 ? maxPage - 1 : page.value - 1
    // this.allList = newList;
    for (let i = 0; i < newList.length; i++) {
      const item = newList[i];
      // @ts-ignore
      const imgUrls: string[] = await loadDetail(item.link, i);
      console.log(imgUrls);
      if (imgUrls && imgUrls.length === 0) {
        addDetail({
          id: 1,
          title: item.title,
          img: null,
          height: 20,
        })
        continue;
      }
      let detailTemp: Article = {
        id: 1,
        title: item.title,
        img: null,
        height: 40,
      };
      if (imgUrls) {
        for (let j = 0; j < imgUrls.length; j++) {
          const url = imgUrls[j];
          const isCanInclude = await (new Promise<boolean>(resolve => {
            const image = new Image();
            image.onload = function () {
              // this.linkToImg[url] = imgUrl;
              console.log('!!!!' + image.height)
              const width = window.innerWidth / column.value.length
              detailTemp = {
                id: 1,
                title: item.title,
                img: url,
                height: image.height / image.width * width,
              }
              resolve(true)
            };
            image.onerror = function () {
              resolve(false)
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
  });
}
function addDetail(item: Article) {
  let minHeightIndex = 0;
  if (column.value.length) {
    for (let i = 0; i < column.value.length; i++) {
      if (column.value[i].height < column.value[minHeightIndex].height) {
        minHeightIndex = i;
      }
    }
  }
  column.value[minHeightIndex].height += item.height;
  column.value[minHeightIndex].list.push(item)
}
function choose(item: Article) {
  console.log(item)
}
</script>

<style lang="less" scoped>
.columnList {
  display: flex;

  .column {
    flex-grow: 1;
    width: 50%;

    &:not(:first-child) {
      margin-left: 12px;
    }

    .article {
      border: solid 1px rgb(255, 64, 0);
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
</style>
