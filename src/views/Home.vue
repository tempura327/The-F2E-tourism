<template>
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
      <b-col lg="3" v-for="(data, index) in attractionData" :key="index" class="mb-20">
        <Card :data="data" :title="data.Name" :address="data.Address" :type="data.OpenTime" :imgSrc="data.Picture.PictureUrl1"></Card>
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
      <b-col lg="3" v-for="(data, index) in activityData" :key="index" class="mb-20">
        <SimpleCard :title="data.Name" :imgSrc="data.Picture.PictureUrl1"></SimpleCard>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import Card from '../components/Card.vue';
  import SimpleCard from '../components/SimpleCard.vue';

  export default({
      name:'Home',
      components:{
          Card,
          SimpleCard,
      },
      data(){
        return{
          attractionData:[],
          activityData:[],
          isLoading:false,
          isLoading2:false,
        }
      },
      created(){
        this.queryAttraction();
        this.queryAactivity();

      },
      methods:{
        async queryAttraction(){
          this.isLoading = true;
          try{
            let res = await fetch(`https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?$skip=15&$top=8&?$format=JSON`,{
                method:'GET',
                header:{
                  Authorization:'hmac username=83592d8c997f4933ae965e60e5995a2d',
                  'X-Date':new Date().toGMTString(),
                },
                'Accept-Encoding': 'gzip'
            })

            res.json().then((d) => {
              this.attractionData = d;
            })
          }finally{
            this.isLoading = false;
          }
        },
        async queryAactivity(){
          this.isLoading2 = true;
          try{
            let res = await fetch(`https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity?$skip=5&$top=4&?$format=JSON`, {
              method:'GET',
              header:{
                Authorization:'hmac username=83592d8c997f4933ae965e60e5995a2d',
                'X-Date':new Date().toGMTString(),
              },
              'Accept-Encoding': 'gzip'
            })

            res.json().then((d) => {
              this.activityData = d;
              console.log(d);
            })
          }catch{
            console.log('fail');
          }finally{
            this.isLoading2 = false;
          }
        }

      }
  })
</script>
