<template>
  <div id="app">
    <Header></Header>
    <Carousel></Carousel>
    <b-container>
      <b-row>
        <b-col>
          <h1 class="big-title mb-6">熱門景點</h1>
          <h5 class="h5 description mb-12">
            台灣的各個美景，都美不勝收。<br>
            等你一同來發現這座寶島的奧妙！
          </h5>
        </b-col>
      </b-row>

      <b-row class="mb-30">
        <b-col>
          <Card title="AAA" address="BBB" type="CCC" imgSrc="https://images.unsplash.com/photo-1542312743-e4a4a04f412a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1169&q=80"></Card>
        </b-col>
        <b-col>
          <Card></Card>
        </b-col>
        <b-col>
          <Card></Card>
        </b-col>        
        <b-col>
          <Card></Card>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <h1 class="big-title mb-6">活動類別</h1>
          <h5 class="h5 description mb-12">
            各種不同的活動內容<br>
            邀請您一銅來共襄盛舉！
          </h5>
        </b-col>
      </b-row>

      <b-row  class="mb-25">
        <b-col>
          <SimpleCard title="XXX" imgSrc="https://images.unsplash.com/photo-1542312743-e4a4a04f412a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1169&q=80"></SimpleCard>
        </b-col>
        <b-col>
          <SimpleCard></SimpleCard>
        </b-col>   
        <b-col>
          <SimpleCard></SimpleCard>
        </b-col>
        <b-col>
          <SimpleCard></SimpleCard>
        </b-col>               
      </b-row>
    </b-container>
    <!-- <router-view></router-view> -->
    <Footer></Footer>
  </div>
</template>

<script>
  import Header from './components/Header.vue';
  import Footer from './components/Footer.vue';

  import Carousel from './components/Carousel.vue';
  import Card from './components/Card.vue';
  import SimpleCard from './components/SimpleCard.vue';
  

  export default {
    name: 'App',
    
    components: {
      Header,
      Footer,
      Carousel,
      Card,
      SimpleCard,
    },
    created(){
 
    }
  }
</script>


<style src="./../node_modules\bootstrap\dist\css\bootstrap.min.css"></style>
<style src="./../node_modules\bootstrap-vue\dist\bootstrap-vue.css"></style>
<style src="./style/App.css"></style>



