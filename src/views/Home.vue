<template>
  <div class="container">
    <FadeCarousel :data="carouselData" :config="carouselConfig" carouselClass="mb-28"></FadeCarousel>

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

    <div class="grid mb-32 grid-cols-4 gap-x-8 gap-y-20 xs:grid-cols-1">
      <div class="col-span-4 mx-auto" v-if="isAttractionLoading">
        <Spinner></Spinner>
      </div>

      <div class="" v-for="(data, index) in attractionData" :key="index" v-else>
        <Card :data="data" @showModal="showModal"></Card>
      </div>

      <h3 class="message error col-span-4" v-if="attractionErrorMsg">{{ attractionErrorMsg }}</h3>
    </div>

    <div class="row">
      <div class="col">
        <h1 class="font-bold text-h1 text-primary mb-6">本月活動</h1>
        <h5 class="h5 text-gray font-bold mb-12">
          各種不同的活動內容
          <br />
          邀請您一同來共襄盛舉！
        </h5>
      </div>
    </div>

    <div class="grid mb-32 grid-cols-4 gap-x-8 gap-y-20 xs:grid-cols-1">
      <div class="col-span-4 mx-auto" v-if="isActivityLoading">
        <Spinner></Spinner>
      </div>

      <div class="" v-for="(data, index) in activityData" :key="index" v-else>
        <SimpleCard :data="data" @showModal="showModal"></SimpleCard>
      </div>

      <h3 class="message error col-span-4" v-if="activityErrorMsg">{{ activityErrorMsg }}</h3>
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

      <h4 class="text-h5 text-gray-80">{{ modalData.OpenTime }}</h4>
      <h4 class="text-h5 text-gray-80">{{ modalData.Address }}</h4>
      <h4 class="text-h5 text-gray-80">{{ modalData.Phone }}</h4>
      <hr class="my-3" v-if="modalData.DescriptionDetail" />
      <h4 class="text-h5 text-gray-80">{{ modalData.DescriptionDetail }}</h4>
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
  import Spinner from '@/components/Spinner.vue';

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
      Spinner,
    },
  })
  export default class Home extends Vue {
    // props

    // data
    isModalShow = false;
    attractionData: attraction[] = [];
    activityData: activity[] = [];
    isAttractionLoading = false;
    isActivityLoading = false;
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
    activityErrorMsg = '';
    attractionErrorMsg = '';

    // hooks
    created(): void {
      this.queryAttraction();
      this.queryActivity();
    }

    // methods
    async queryAttraction(): Promise<void> {
      this.isAttractionLoading = true;

      try {
        // filter attractions which Picture.PictureUrl1 !== null
        const res = await query(`
          https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?%24filter=Picture%2FPictureUrl1%20ne%20null&%24top=8&%24format=JSON
        `);

        this.attractionData = res;
      } catch (e: any) {
        this.attractionErrorMsg = `錯誤。${e.message}`;
      } finally {
        this.isAttractionLoading = false;
      }
    }
    async queryActivity(): Promise<void> {
      this.isActivityLoading = true;
      const range = this.getActivityDateRange(new Date());

      try {
        // filter activities which Picture.PictureUrl1 !== null && startTime between first day and last day of this month.
        const res = await query(`
          https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity?%24filter=Picture%2FPictureUrl1%20ne%20null%20and%20StartTime%20ge%20${range[0]}%20and%20StartTime%20le%20${range[1]}&%24orderby=StartTime%20asc&%24top=8&%24format=JSON
        `);

        this.activityData = res;
      } catch (e: any) {
        this.activityErrorMsg = `錯誤。${e.message}`;
        console.log('fail');
      } finally {
        this.isActivityLoading = false;
      }
    }
    getActivityDateRange(firstDay: Date): string[] {
      const year = firstDay.getFullYear();
      const month = firstDay.getMonth();

      return [dateConvertor(new Date(year, month, 1)), dateConvertor(new Date(year, month + 1, 0))];
    }
    showModal(data: { data: attraction; type: string }): void {
      this.modalData = data.data;
      console.log(data);
      this.images = Object.values(data.data.Picture).filter((d: string) => d.startsWith('https'));
      this.isModalShow = true;

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
</style>
