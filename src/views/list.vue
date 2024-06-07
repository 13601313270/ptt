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
        <img :src="linkToImg[item.img]" width="80" />
      </div>
    </div>
    <div @click="initPage">下一页</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import sleep from "../common/sleep";
import StrObj from "../common/StrObj";

type Article = {
  id: number,
  title: string,
  img: '',
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
      const imgUrl = await loadDetail(item.link);
      console.log('11111', imgUrl, item)
      const image = new Image();
      image.onload = function () {
        // this.linkToImg[url] = imgUrl;
        console.log('!!!!' + image.height)
        const width = window.innerWidth / column.value.length
        addDetail({
          id: 1,
          title: item.title,
          img: imgUrl,
          height: image.height / image.width * width,
        })
      };
      image.src = imgUrl;

      // @ts-ignore
      // this.allList.push(item);
    }
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
  // allList.value.push({

  // })
}
function choose(item: Article) {
  console.log(item)
}
// export default defineComponent({
//   name: "HomeView",
//   components: {},
//   data() {

//   },
//   created() {
//     this.init();
//   },
//   methods: {
//     init() {
//       // @ts-ignore
//       // loadPage("https://www.ptt.cc/bbs/Beauty/index.html").then(async (result) => {
//       //   console.log("##########", result);
//       //   const { maxPage, list } = result;
//       //   const newList = list.reverse();
//       //   this.page = maxPage;
//       //   // this.allList = newList;
//       //   for (let i = 0; i < newList.length; i++) {
//       //     const item = newList[i];
//       //     const imgUrl = await this.loadDetail(item.link);
//       //     const image = new Image();
//       //     image.onload = function () {
//       //       this.linkToImg[url] = imgUrl;
//       //     };
//       //     image.src = imgUrl;

//       //     // @ts-ignore
//       //     // this.allList.push(item);
//       //   }
//       // });
//     },
//     async initPage() {
//       this.page--;
//       // @ts-ignore
//       loadPage(`https://www.ptt.cc/bbs/Beauty/index${this.page}.html`).then((result) => {
//         console.log(result);
//         const { list } = result;
//         // @ts-ignore
//         this.allList = [...this.allList, ...list.reverse()];
//       });
//     },
//     async loadDetail(url: string) {
//       // @ts-ignore
//       const result = await loadDetail(url);
//       return result;
//       // console.log("============", url, result);
//     },
//     async choose(item: any) {
//       // @ts-ignore
//       // pttInput(item.action);
//       // sleep(100);
//       // // @ts-ignore
//       // pttSend("\r");
//       // sleep(100);
//       // pttSend("\r");
//     },
//   },
// });
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
