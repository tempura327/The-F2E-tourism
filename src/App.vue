<template>
  <div id="app">
    <Header></Header>
    <router-view></router-view>
    <Footer></Footer>
  </div>
</template>

<script>
  import Header from './components/Header.vue';
  import Footer from './components/Footer.vue';

  import router from './router/index';

  export default {
    name: 'App',
    router,
    components: {
      Header,
      Footer,

    },
    created(){
 
    }
  }
</script>

<style src="./style/App.css"></style>


