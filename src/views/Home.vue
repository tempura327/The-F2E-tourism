<template>
  <div>
    <FadeCarousel :data="carouselData" :config="carouselConfig" carouselClass="mb-28"></FadeCarousel>

    <div class="container">
      <div class="row">
        <div class="col">
          <h1 class="font-bold text-h1 text-primary mb-6">熱門景點</h1>
          <h5 class="h5 text-gray font-bold mb-12">
            台灣的各個美景，都美不勝收。
            <br />
            等你一同來發現這座寶島的奧妙！
          </h5>
        </div>
      </div>

      <div class="row grid grid-cols-4 gap-y-20 mb-32">
        <div class="col" v-if="isLoading">
          <!-- <b-spinner></b-spinner> -->
        </div>

        <div class="col-3" v-for="(data, index) in attractionData" :key="index" v-else>
          <Card :data="data" @showModal="showModal"></Card>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <h1 class="font-bold text-h1 text-primary mb-6">下月活動</h1>
          <h5 class="h5 text-gray font-bold mb-12">
            各種不同的活動內容
            <br />
            邀請您一同來共襄盛舉！
          </h5>
        </div>
      </div>

      <div class="row grid grid-cols-4 gap-y-20 mb-32">
        <div class="col" v-if="isLoading2">
          <!-- <b-spinner></b-spinner> -->
        </div>

        <div class="col-3" v-for="(data, index) in activityData" :key="index" v-else>
          <SimpleCard :data="data" @showModal="showModal"></SimpleCard>
        </div>
      </div>
    </div>

    <div class="banner-bottom" v-if="this.$router.currentRoute.fullPath === '/'">
      <h1 class="banner_text">
        “To travel is to live”
        <br />
        – Hans Christian Anderson-
      </h1>
    </div>

    <SimpleModal id="detail-modal" :isShow="isModalShow" @onCloseClick="closeModal">
      <h2 class="text-h2 text-gray-80 font-bold mb-2">
        {{ modalData.ScenicSpotName }}
        <span class="text-h5">/ {{ modalData.Class1 || '未分類' }}</span>
      </h2>

      <Gallery :images="images" galleryClass="mb-4"></Gallery>

      <h4 class="text-h5 textgray-80">{{ modalData.OpenTime }}</h4>
      <h4 class="text-h5 textgray-80">{{ modalData.Address }}</h4>
      <h4 class="text-h5 textgray-80">{{ modalData.Phone }}</h4>
      <hr class="my-3" v-if="modalData.DescriptionDetail" />
      <h4 class="text-h5 textgray-80">{{ modalData.DescriptionDetail }}</h4>
    </SimpleModal>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  import Card from '@/components/Card.vue';
  import SimpleCard from '@/components/SimpleCard.vue';
  import SimpleModal from '@/components/SimpleModal.vue';
  import FadeCarousel from '@/components/FadeCarousel.vue';
  import Gallery from '@/components/Gallery.vue';

  import query from '@/utility/queryHelper';
  import dateConvertor from '@/utility/dateConvertor';
  import { activity, attraction } from '@/utility/type';

  @Component({
    components: {
      Card,
      SimpleCard,
      SimpleModal,
      FadeCarousel,
      Gallery,
    },
  })
  export default class Home extends Vue {
    // props

    // data
    isModalShow = false;
    attractionData: attraction[] = [];
    activityData: activity[] = [];
    isLoading = false;
    isLoading2 = false;
    modalData: attraction = {
      Address: '',
      City: '',
      Class1: '',
      Description: '',
      DescriptionDetail: '',
      OpenTime: '',
      ParkingPosition: {
        PositionLon: undefined,
        PositionLat: undefined,
        GeoHash: undefined,
      },
      Phone: '',
      Picture: {
        PictureUrl1: '',
        PictureDescription1: '',
      },
      Position: {
        PositionLon: 0,
        PositionLat: 0,
        GeoHash: '',
      },
      ScenicSpotID: '',
      ScenicSpotName: '',
      SrcUpdateTime: '',
      UpdateTime: '',
      ZipCode: '',
    };
    isAttraction = false;
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
    carouselConfig = { autoPlay: false, period: 3000 };
    images: string[] = [];

    // hooks
    created(): void {
      this.queryAttraction();
      this.queryActivity();
    }

    // methods
    async queryAttraction(): Promise<void> {
      this.isLoading = true;

      try {
        // filter attractions which Picture.PictureUrl1 !== null
        const res = await query(`
          https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?%24filter=Picture%2FPictureUrl1%20ne%20null&%24top=8&%24format=JSON
        `);

        this.attractionData = res;
      } finally {
        this.isLoading = false;
      }
    }
    async queryActivity(): Promise<void> {
      this.isLoading = true;
      const range = this.getActivityDateRange(new Date());

      try {
        // filter activities which Picture.PictureUrl1 !== null && startTime between today and the day 2 months later.
        const res = await query(`
          https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity?%24filter=Picture%2FPictureUrl1%20ne%20null%20and%20StartTime%20ge%20${range[0]}%20and%20StartTime%20le%20${range[1]}&%24orderby=StartTime%20asc&%24top=8&%24format=JSON
        `);

        this.activityData = res;
      } catch {
        console.log('fail');
      } finally {
        this.isLoading2 = false;
      }
    }
    getActivityDateRange(fistDay: Date): string[] {
      const twoMonthsLater = new Date(Number(fistDay) + 31 * 24 * 60 * 60 * 1000);

      return [dateConvertor(fistDay), dateConvertor(twoMonthsLater)];
    }
    showModal(data: { data: attraction; type: string }): void {
      this.modalData = data.data;
      console.log(data);
      this.images = Object.values(data.data.Picture).filter((d: string) => d.startsWith('https'));
      this.isModalShow = true;
      // modalHelper(this, 'detail-modal');

      this.isAttraction = data.type === 'activity' ? false : true;
    }
    closeModal(): void {
      this.isModalShow = false;
    }
  }
</script>

<style lang="scss" scoped>
  .banner {
    &-bottom {
      background-image: url('../assets/unsplash_dQejX2ucPBs.png');
      background-size: cover;
      height: 300px;
    }

    &_text {
      font-size: 32px;
      font-weight: 700;
      text-align: center;
      text-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
      color: white;
      position: relative;
      top: 120px;
      line-height: 56px;
    }
  }

  .scroll-button {
    width: 40px;
    height: 40px;
    font-size: 30px;
    text-align: center;
    color: white;
    background-color: #08a6bb;
    border: 1px solid white;
    border-radius: 50%;
    position: fixed;
    top: 90vh;
    left: 95vw;
    cursor: pointer;
    transform: rotate(0deg);
    transition-duration: 0.5s;

    &-top {
      transition-duration: 0.5s;
      transform: rotate(180deg);
    }
  }
</style>
