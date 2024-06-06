<template>
  <div class="home">
    <div>文章列表</div>
    <div class="list">
      <div v-for="item in allList" :key="item.action" class="item" @click="choose(item)">
        {{ item.title }}
        {{ item.link }}
      </div>
    </div>
    <div @click="loadPage">下一页</div>
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
      allList: [],
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.initPage();
    },
    async initPage() {
      // @ts-ignore
      loadPage("https://www.ptt.cc/bbs/Beauty/index.html").then((list) => {
        this.allList = list.reverse();
      });
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
    height: 80px;
    flex-shrink: 0;
    margin: 24px;
    border-radius: 8px;
  }
}
</style>
