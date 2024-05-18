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
    // @ts-ignore
    window.onReciveData = async (strs: string[][]) => {
      const single = new StrObj(strs);

      if (single.findTwoIndex(" 請按任意鍵繼續 ")) {
        await sleep(10);
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
          pttInput("Y");
        } else {
          pttInput("n");
        }
      } else if (single.findTwoIndex("【主功能表】")) {
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
