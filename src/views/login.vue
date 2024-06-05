<template>
  <div>
    访客{{ guestCount }}人
    <input v-model="account" />
    <input v-model="password" />
    <button @click="login">登录</button>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import sleep from "../common/sleep";
import StrObj from "../common/StrObj";

export default defineComponent({
  name: "login",
  components: {},
  data() {
    return {
      account: "h94g41up",
      password: "0961313677",
      guestCount: 0,
    };
  },
  created() {
    const single = new StrObj(window.lastReciveData);
    const matchIndex = single.findTwoIndex("目前有");
    console.log("matchIndex", matchIndex);
    if (matchIndex) {
      console.log("matchIndex", window.lastReciveData[matchIndex[0]][matchIndex[1] + 1]);
      // @ts-ignore
      this.guestCount = +window.lastReciveData[matchIndex[0]][matchIndex[1] + 1].match(
        /\d+/
      )[0];
    }
    // @ts-ignore
    window.onReciveData = async (strs: string[][]) => {
      const single = new StrObj(strs);
      if (single.findTwoIndex("目前有") && single.findTwoIndex("請輸入代號")) {
        const matchIndex = single.findTwoIndex("目前有");
        console.log("matchIndex", matchIndex);
        if (matchIndex) {
          console.log(
            "matchIndex",
            window.lastReciveData[matchIndex[0]][matchIndex[1] + 1]
          );
          // @ts-ignore
          this.guestCount = (+window.lastReciveData[matchIndex[0]][
            matchIndex[1] + 1
          ] || '0').match(/\d+/)[0];
        }
      } else if (
        single.findTwoIndex(" 請按任意鍵繼續 ") ||
        single.findTwoIndex("按任意鍵繼續")
      ) {
        await sleep(10);
        // @ts-ignore
        pttInput("a");
      } else if (single.findTwoIndex("您要刪除以上錯誤嘗試的記錄嗎")) {
        // @ts-ignore
        pttInput("y");
        // @ts-ignore
        pttSend("\r");
      } else if (single.findTwoIndex("注意: 您有其它連線已登入此帳號。")) {
        const result = window.confirm(
          "注意: 您有其它連線已登入此帳號。您想刪除其他重複登入的連線嗎？"
        );
        if (result) {
          // @ts-ignore
          pttInput("Y");
        } else {
          // @ts-ignore
          pttInput("n");
        }
      } else if (single.findTwoIndex("【主功能表】")) {
        pttInput("C");
        sleep(100);
        pttSend("\r");
        pttInput("14");
        sleep(100);
        pttSend("\r");
        // this.$router.push({
        //   name: "home",
        // });
      } else if (single.findTwoIndex("【主功能表】")) {
        pttInput("C");
        sleep(100);
        pttSend("\r");
        pttInput("14");
        sleep(100);
        pttSend("\r");
      } else if (single.findTwoIndex("看板列表")) {
        this.$router.push({
          name: "home",
        });
      }
    };
  },
  methods: {
    async login() {
      // @ts-ignore
      pttInput(this.account);
      // await sleep(1000)
      // @ts-ignore
      pttSend("\r");
      // await sleep(1000);
      // @ts-ignore
      pttInput(this.password);
      // await sleep(1000);
      // @ts-ignore
      pttSend("\r");
    },
  },
});
</script>
