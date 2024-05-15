<template>
  <div class="home">
    访客{{guestCount}}人
    <input/>
    <input/>
    <button>保存</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HomeView',
  components: {
  },
  data(){
    return {
      guestCount: 0,
    }
  },
  created() {
    // @ts-ignore
    window.onReciveData = (strs: string[][]) => {
      console.log('=====---->', strs)
      const lineIndex = strs.findIndex(str => str.find(v => v==='目前有'))
      if(lineIndex>-1) {
        const wordIndex = strs[lineIndex].findIndex(v => v==='目前有');
        if(lineIndex>-1 && wordIndex>-1) {
          this.guestCount = +(strs[lineIndex][wordIndex+1].slice(1, strs[lineIndex][wordIndex+1].length-1));
        }
      }
    }
    // @ts-ignore
    initOldPtt();
  },
});
</script>
