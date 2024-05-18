<template>
  <h1>精华文章</h1>
  <div class="list">
    <div v-for="item in allList" :key="item.action" class="item" @click="choose(item)">
      {{ item }}
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
      const allList: Array<{
        text: string;
        action: string;
      }> = [];
      // @ts-ignore
      for (let i = splitIndexs[0] + 1; i < window.lastReciveData.length - 1; i++) {
        // @ts-ignore
        const item = window.lastReciveData[i];
        // @ts-ignore
        for (let j = 0; j < item.length; j++) {
          // @ts-ignore
          const matchText = item[j].match(
            /(\d+)[\.|\)]\s*[★|☆|◆]\s*(\S+)/
          );
          if (matchText) {
            allList.push({
              text: matchText[2],
              action: matchText[1],
            });
          }
        }
      }
      // @ts-ignore
      this.allList = allList;
      // @ts-ignore
      window.onReciveData = async (strs: string[][]) => {
        const single = new StrObj(strs);
        if (single.findTwoIndex("新位置 (可輸入多層數字): ")) {
          pttSend("\r");
        }
      };
    },
    choose(item: any) {
      // @ts-ignore
      pttInput(item.action);
    },
  },
});
</script>
