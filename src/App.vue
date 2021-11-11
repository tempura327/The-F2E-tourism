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

    <div class="scroll-button" :class="isScrollBottom? 'scroll-button' : 'scroll-button-top'" @click="scrollTopDown">
      <font-awesome-icon icon="caret-down"></font-awesome-icon>
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
    data(){
      return{
        isScrollBottom:true
      }
    },
    methods:{
      scrollTopDown(){
        let top = document.documentElement.scrollTop < document.documentElement.scrollHeight - window.innerHeight? document.documentElement.scrollHeight - window.innerHeight : 0;
        this.isScrollBottom = document.documentElement.scrollTop < document.documentElement.scrollHeight - window.innerHeight? '' : 'scroll-button-top';

        window.scrollTo({
            top: top,
            left:0,
            behavior: 'smooth'
        });                
      }
    }

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

  .scroll-button{
    border-radius: 50%;
    width: 40px;
    height: 40px;
    background-color: #08A6BB;
    position: fixed;     
    left: 95vw;
    top: 90vh;  
    cursor: pointer; 
    font-size: 30px;
    color: white;
    text-align: center;
    border: 1px solid white;
    transition-duration: 0.5s;
    transform: rotate(0deg);        
  }

  .scroll-button-top{
    transition-duration: 0.5s;
    transform: rotate(180deg);
  }  
</style>



