<template>
    <b-container>
      <b-row>
        <b-col>
          <h1 class="big-title mb-6">景點</h1>
          <h5 class="h5 description mb-12">
            台灣的各個美景，都美不勝收。<br>
            等你一同來發現這座寶島的奧妙！
          </h5>
        </b-col>
      </b-row>

      <b-row class="mb-20">
        <b-col lg="3" v-for="(data, index) in attractionData" :key="index" class="mb-20">
          <Card :data="data" :title="data.Name" :address="data.Address" :type="data.OpenTime" :imgSrc="data.Picture.PictureUrl1" @showModal="showModal"></Card>
          <!-- <Card :data="data" :title="data.Name" :address="data.Address" :type="data.OpenTime === 'Sun 24 hours；Mon 24 hours；Tue 24 hours；Wed 24 hours；Thu 24 hours；Fri 24 hours；Sat 24 hours'? '全天開放' : modalData.OpenTime" :imgSrc="data.Picture.PictureUrl1" @showModal="showModal"></Card> -->
        </b-col>       
      </b-row>
    </b-container>
</template>

<script>
  import Card from '../components/Card.vue';

  export default({
      name:'Attraction',
      components:{
          Card,
      },
      data(){
        return{
          attractionData:this.$store.state.attraction
        }
      },
      mounted(){
        this.attractionData = this.$store.state.attraction;
        console.log(this.$store.state);
      },
      methods:{
        showModal(){
          console.log('show');
        }
      }
  })
</script>