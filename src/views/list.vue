<template>
  <div class="home">
    <div>文章列表</div>
    <div class="list">
      <div v-for="item in allList" :key="item.action" class="item" @click="choose(item)">
        {{ item.title }}
        <!-- {{ item.link }} -->
        <img :src="linkToImg[item.link]" width="80" />
      </div>
    </div>
    <div @click="initPage">下一页</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import sleep from "../common/sleep";
import StrObj from "../common/StrObj";

export default defineComponent({
  name: "HomeView",
  components: {},
  data() {
    return {
      page: -1,
      allList: [],
      linkToImg: {},
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      // @ts-ignore
      loadPage("https://www.ptt.cc/bbs/Beauty/index.html").then(async (result) => {
        console.log("##########", result);
        const { maxPage, list } = result;
        const newList = list.reverse();
        this.page = maxPage;
        this.allList = newList;
        for (let i = 0; i < newList.length; i++) {
          const item = newList[i];
          await this.loadDetail(item.link);
        }
      });
    },
    async initPage() {
      this.page--;
      // @ts-ignore
      loadPage(`https://www.ptt.cc/bbs/Beauty/index${this.page}.html`).then((result) => {
        console.log(result);
        const { list } = result;
        // @ts-ignore
        this.allList = [...this.allList, ...list.reverse()];
      });
    },
    async loadDetail(url: string) {
      // @ts-ignore
      const result = await loadDetail(url);
      // @ts-ignore
      this.linkToImg[url] = result
      console.log("============", url, result);
    },
    async choose(item: any) {
      // @ts-ignore
      // pttInput(item.action);
      // sleep(100);
      // // @ts-ignore
      // pttSend("\r");
      // sleep(100);
      // pttSend("\r");
    },
  },
});
</script>

<style lang="less" scoped>
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
