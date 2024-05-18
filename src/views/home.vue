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
      // @ts-ignore
      const single = new StrObj(window.lastReciveData);
      const splitIndexs = single.findTwoIndex(
        "上方為使用者心情點播留言區，不代表本站立場"
      );
      const splitEndIndexs = single.findTwoIndex("離開，再見");
      const allList: Array<{
        text: string;
        action: string;
      }> = [];
      if (splitIndexs && splitEndIndexs) {
        for (let i = splitIndexs[0] + 1; i < splitEndIndexs[0]; i++) {
          // @ts-ignore
          const item = window.lastReciveData[i];
          // @ts-ignore
          for (let j = 0; j < window.lastReciveData[i].length; j++) {
            // @ts-ignore
            const matchText = window.lastReciveData[i][j].match(/【\s?(.+?)\s?】/);
            if (matchText) {
              allList.push({
                text: matchText[1],
                // @ts-ignore
                action: window.lastReciveData[i][j - 1],
              });
            }
          }
        }
      }
      // @ts-ignore
      this.allList = allList;

      // @ts-ignore
      window.onReciveData = async (strs: string[][]) => {
        const single = new StrObj(strs);
        if (single.findTwoIndex("【精華文章】")) {
          this.$router.push({
            name: "essenceArticle",
          });
        } else if (false) {
          // avorite
        } else if (single.findTwoIndex("【分類看板】")) {
          this.$router.push({
            name: "class",
          });
        }
      };
    },
    choose(item: any) {
      // @ts-ignore
      pttInput(item.action);
      // @ts-ignore
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
    width: 200px;
    height: 80px;
    flex-shrink: 0;
    margin: 24px;
    border-radius: 8px;
  }
}
</style>
