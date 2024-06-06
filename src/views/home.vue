<template>
  <div class="home">
    <div>看板列表</div>
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
      const splitIndexs = single.findTwoIndex("編號");
      const splitEndIndexs = single.findTwoIndex("選擇看板");
      const allList: Array<{
        text: string;
        action: string;
      }> = [];
      console.log("==========");
      if (splitIndexs && splitEndIndexs) {
        for (let i = splitIndexs[0] + 1; i < splitEndIndexs[0]; i++) {
          // @ts-ignore
          const item = window.lastReciveData[i];
          console.log("!!!!!!", item, item[5]);
          const matchNumber = item[1].match(/\d+/);
          if (matchNumber) {
            // @ts-ignore
            const action = matchNumber[0];
            let text;
            for (let j = 0; j < item.length; j++) {
              const match = item[j].match(/◎(.+?)\s*$/);
              if (match) {
                text = match[1];
              }
            }

            // allList.push({
            //   text,
            //   action,
            // });
          }
        }
      }
      console.log("allList", allList);
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
    async choose(item: any) {
      // @ts-ignore
      // pttInput(item.action);
      // sleep(100);
      // // @ts-ignore
      // pttSend("\r");
      // sleep(100);
      // pttSend("\r");
      // this.$router.push({
      //   name: "essenceArticle",
      // });
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
