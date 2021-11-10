<template>
  <div id="app">
    <Header></Header>
    <Carousel></Carousel>
    <router-view></router-view>
    <div class="bottom-banner" v-if="this.$router.currentRoute.fullPath === '/'">
      <h1 class="banner-text">
        “To travel is to live” <br>
        – Hans Christian Anderson-
      </h1>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
  import Header from './components/Header.vue';
  import Footer from './components/Footer.vue';
  import Carousel from './components/Carousel.vue';

  export default {
    name: 'App',    
    components: {
      Header,
      Footer,
      Carousel,

    },

  }
</script>


<style src="./../node_modules\bootstrap\dist\css\bootstrap.min.css"></style>
<style src="./../node_modules\bootstrap-vue\dist\bootstrap-vue.css"></style>
<style src="./style/App.css"></style>

<style scoped>
  .bottom-banner{
    background-image: url('./assets/unsplash_dQejX2ucPBs.png');
    background-size: cover;
    height: 300px;
    
  }

  .bottom-banner .banner-text{
    line-height: 56px;
    text-align: center;
    font-size: 32px !important;
    font-weight: 700;
    color: white;
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    position: relative;
    top: 120px;    
  }
</style>



