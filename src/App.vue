<template>
  <div id="app" :class="{ fix: isFixed }">
    <Header></Header>
    <FadeCarousel :data="carouselData" :config="carouselConfig"></FadeCarousel>
    <router-view></router-view>

    <div class="scroll-button" :class="isScrollBottom ? 'scroll-button' : 'scroll-button-top'" @click="scrollTopDown">
      <!-- <font-awesome-icon icon="caret-down"></font-awesome-icon> -->
    </div>

    <Footer></Footer>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator';

  import Header from '@/components/Header.vue';
  import Footer from '@/components/Footer.vue';
  import FadeCarousel from '@/components/FadeCarousel.vue';

  @Component({
    components: {
      Header,
      Footer,
      FadeCarousel,
    },
  })
  export default class App extends Vue {
    // props

    // data
    isScrollBottom = true;
    isFixed = false;
    carouselConfig = { autoPlay: false, period: 3000 };
    carouselData = [
      {
        image:
          'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
      },
      {
        image:
          'https://images.unsplash.com/photo-1566371486490-560ded23b5e4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
      },
      {
        image:
          'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      },
      {
        image:
          'https://images.unsplash.com/photo-1621682372775-533449e550ed?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
      },
    ];

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
