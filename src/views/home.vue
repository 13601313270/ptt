<template>
  <div class="home">
    <div>主功能表</div>
    <div class="list">
      <div v-for="item in allList" :key="item.action" class="item" @click="choose(item)">
        {{ item }}
      </div>
    </div>
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
    async init() {
      console.log("lastReciveData", window.lastReciveData);
      const single = new StrObj(window.lastReciveData);
      const splitIndexs = single.findTwoIndex(
        "上方為使用者心情點播留言區，不代表本站立場"
      );
      const splitEndIndexs = single.findTwoIndex("離開，再見");
      const allList: Array<{
        text: string;
        action: string;
      }> = [];
      for (let i = splitIndexs[0] + 1; i < splitEndIndexs[0]; i++) {
        const item = window.lastReciveData[i];
        for (let j = 0; j < window.lastReciveData[i].length; j++) {
          console.log("window.lastReciveData[i]", window.lastReciveData[i][j]);
          const matchText = window.lastReciveData[i][j].match(/【\s?(.+?)\s?】/);
          if (matchText) {
            allList.push({
              text: matchText[1],
              action: window.lastReciveData[i][j - 1],
            });
          }
        }
      }
      this.allList = allList;
    },
    choose(item) {
      pttInput(item.action);
      pttSend("\r");
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
    width: 300px;
    height: 200px;
    flex-shrink: 0;
    margin: 24px;
  }
}
</style>
