<template>
  <div id="app" :class="{ fix: isFixed }">
    <Header></Header>
    <router-view></router-view>

    <div class="scroll-button" :class="isScrollBottom ? 'scroll-button' : 'scroll-button-top'" @click="scrollTopDown"></div>

    <Footer></Footer>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  import Header from '@/components/Header.vue';
  import Footer from '@/components/Footer.vue';

  @Component({
    components: {
      Header,
      Footer,
    },
  })
  export default class App extends Vue {
    // props

    // data
    isScrollBottom = true;
    isFixed = false;

    // hooks
    mounted(): void {
      if (document.getElementById('gapi-script')) return; // if script has been loaded, return.

      const scriptTag = document.createElement('script');

      scriptTag.src = 'https://apis.google.com/js/api.js';
      scriptTag.id = 'gapi-script';

      // append script tag into head tag
      document.getElementsByTagName('head')[0].appendChild(scriptTag);
    }

    // methods
    scrollTopDown(): void {
      const distance = document.documentElement.scrollTop < document.documentElement.scrollHeight - window.innerHeight;
      let top =
        document.documentElement.scrollTop < document.documentElement.scrollHeight - window.innerHeight
          ? document.documentElement.scrollHeight - window.innerHeight
          : 0;
      this.isScrollBottom = document.documentElement.scrollTop < document.documentElement.scrollHeight - window.innerHeight;

      window.scrollTo({
        top: top,
        left: 0,
        behavior: 'smooth',
      });
    }

    //watch
  }
</script>

<style lang="scss">
  #app {
    font-family: Arial, Helvetica, sans-serif;
  }

  .fix {
    position: fixed;
  }
</style>
