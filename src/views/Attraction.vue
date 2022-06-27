<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <h1 class="big-title mb-6">景點</h1>
        <h5 class="h5 description mb-12">
          台灣的各個美景，都美不勝收。
          <br />
          等你一同來發現這座寶島的奧妙！
        </h5>
      </div>
    </div>

    <div class="mb-20">
      <div class="col" v-if="isLoading">
        <!-- <b-spinner></b-spinner> -->
      </div>
      <div class="col mb-20" lg="3" v-for="(data, index) in attractionData" :key="index" v-else>
        <Card :data="data" :title="data.Name" :address="data.Address" :type="data.OpenTime" :imgSrc="data.Picture.PictureUrl1" @showModal="showModal(index)"></Card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator';

  import modalHelper from '@/utility/modalHelper.ts';

  @Component
  export default class SimpleCard extends Vue {
    // props

    // data
    attractionData = this.$store.state.attraction;
    modalData = {
      Picture: {
        PictureUrl1: '',
      },
    };
    isLoading = false;

    // hooks
    created(): void {
      if (localStorage.getItem('attractionData')) {
        this.attractionData = JSON.parse(localStorage.getItem('attractionData') as string);
      } else {
        this.queryData();
      }
    }

    // methods
    async queryData(): Promise<void> {
      this.isLoading = true;
      // try{
      //   let res = await fetch(`https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?$top=8&?$format=JSON`,{
      // 		method:'GET',
      // 		header:{
      // 			':'hmac username=83592d8c997f4933ae965e60e5995a2d',
      // 			'X-Date':new Date().toGMTString(),
      // 		},
      // 		'Accept-Encoding': 'gzip'
      //   })
      //   res.json().then((d) => {
      //     this.attractionData = d;
      //     console.log(d);
      //   })
      // }finally{
      //   this.isLoading = false;
      // }
    }
    showModal(index: number): void {
      this.modalData = this.attractionData[index];

      modalHelper(this, 'detail-modal');
      //   this.$bvModal.show('detail-modal');
    }

    // watch
    @Watch('$store.state.attraction')
    attractionWatch(): void {
      this.attractionData = this.$store.state.attraction;
      this.isLoading = this.$store.state.isAttractionLoading;
    }
  }
</script>
