<template>
  <div>1321312</div>
  <router-view />
</template>
<script lang="ts">
import { defineComponent } from "vue";
import StrObj from "./common/StrObj";

export default defineComponent({
  name: "HomeView",
  components: {},
  data() {
    return {};
  },
  created() {
    // @ts-ignore
    window.onReciveData = async (strs: string[][]) => {
      const single = new StrObj(strs);
      if (single.findTwoIndex("請輸入代號")) {
        this.$router.push({
          name: "login",
        });
      }
    };
    // @ts-ignore
    initOldPtt();
  },
});
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: white;
  min-height: 400px;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
