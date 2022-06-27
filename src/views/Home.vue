<template>
  <div>
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

      <div class="row grid grid-cols-4 gap-4 mb-30">
        <div class="col" v-if="isLoading">
          <!-- <b-spinner></b-spinner> -->
        </div>

        <div class="mb-20" lg="3" v-for="(data, index) in attractionData" :key="index" v-else>
          <Card
            :data="data"
            :title="data.Name"
            :address="data.Address"
            :type="data.OpenTime === 'Sun 24 hours；Mon 24 hours；Tue 24 hours；Wed 24 hours；Thu 24 hours；Fri 24 hours；Sat 24 hours' ? '全天開放' : modalData.OpenTime"
            :imgSrc="data.Picture.PictureUrl1"
            @showModal="showModal"></Card>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <h1 class="font-bold text-h1 text-primary mb-6">活動類別</h1>
          <h5 class="h5 text-gray font-bold mb-12">
            各種不同的活動內容
            <br />
            邀請您一銅來共襄盛舉！
          </h5>
        </div>
      </div>

      <div class="row mb-25">
        <div class="col" v-if="isLoading2">
          <!-- <b-spinner></b-spinner> -->
        </div>
        <div class="col-3 mb-20" lg="3" v-for="(data, index) in activityData" :key="index" v-else>
          <SimpleCard :title="data.Name" :imgSrc="data.Picture.PictureUrl1" :data="data" @showModal="showModal"></SimpleCard>
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
    <!-- 
    <b-modal id="detail-modal" :title="modalData.Name" size="lg">
        <h5 class="h5 mb-5 grey-blue">
          <svg width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2">
            <path d="M5.99999 15C4.91736 14.1024 3.91387 13.1183 2.99999 12.0581C1.62857 10.4659 7.53336e-07 8.09468 7.53336e-07 5.83512C-0.000594015 4.68115 0.351007 3.55294 1.01031 2.59327C1.66961 1.63361 2.60697 0.885634 3.70376 0.444003C4.80056 0.0023718 6.00748 -0.113061 7.1718 0.112313C8.33611 0.337687 9.40547 0.893737 10.2445 1.71009C10.8032 2.2507 11.246 2.89364 11.5473 3.6017C11.8486 4.30976 12.0025 5.06888 12 5.83512C12 8.09468 10.3714 10.4659 8.99998 12.0581C8.0861 13.1183 7.0826 14.1024 5.99999 15ZM5.99999 3.33561C5.318 3.33561 4.66395 3.59895 4.18172 4.0677C3.69948 4.53645 3.42856 5.17221 3.42856 5.83512C3.42856 6.49803 3.69948 7.13379 4.18172 7.60254C4.66395 8.07129 5.318 8.33463 5.99999 8.33463C6.68197 8.33463 7.33602 8.07129 7.81826 7.60254C8.30049 7.13379 8.57141 6.49803 8.57141 5.83512C8.57141 5.17221 8.30049 4.53645 7.81826 4.0677C7.33602 3.59895 6.68197 3.33561 5.99999 3.33561Z" fill="#08A6BB"/>
          </svg>          
          {{modalData.Address}}
        </h5>

        <h5 class="h5 grey-blue mb-15" v-if="isAttraction">{{modalData.text-grayDetail}}</h5>
        <h5 class="h5 grey-blue mb-15" v-else>{{modalData.text-gray}}</h5>

        <div class="d-flex mb-5">
          <div class="mr-5  picture-frame-big" :class="modalData.Picture.PictureUrl2 || modalData.Picture.PictureUrl3? 'w-60' : 'w-100'">
            <img :src="modalData.Picture.PictureUrl1" alt="" :class="modalData.Picture.PictureUrl2 || modalData.Picture.PictureUrl3? 'h-100' : 'w-100'">
          </div>

          <div class="d-flex flex-column w-40 " v-if="modalData.Picture.PictureUrl2 || modalData.Picture.PictureUrl3">
            <div class="mb-5" v-if="modalData.Picture.PictureUrl2"  :class="!modalData.Picture.PictureUrl3? 'picture-frame-big' : 'picture-frame-small'">
              <img :src="modalData.Picture.PictureUrl2" alt="" :class="!modalData.Picture.PictureUrl3? 'h-100' : 'w-100'">
            </div>

            <div class="picture-frame-small mb-5"  v-if="modalData.Picture.PictureUrl3">
              <img :src="modalData.Picture.PictureUrl3" alt="" class="w-100">
            </div>            
          </div>
        </div>

        <template #modal-footer>
          <ul class="d-flex justify-content-between w-100 primary font-weight-3">
            <li>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2">
                <path d="M9 0C4.0374 0 0 4.0374 0 9C0 13.9626 4.0374 18 9 18C13.9626 18 18 13.9626 18 9C18 4.0374 13.9626 0 9 0ZM9 16.2C5.0301 16.2 1.8 12.9699 1.8 9C1.8 5.0301 5.0301 1.8 9 1.8C12.9699 1.8 16.2 5.0301 16.2 9C16.2 12.9699 12.9699 16.2 9 16.2Z" fill="#08A6BB"  />
                <path d="M9.9 4.49998H8.1V9.89999H13.5V8.09999H9.9V4.49998Z" fill="#08A6BB"/>
              </svg>             

              <span v-if="isAttraction">{{modalData.OpenTime === 'Sun 24 hours；Mon 24 hours；Tue 24 hours；Wed 24 hours；Thu 24 hours；Fri 24 hours；Sat 24 hours'? '全天開放' : modalData.OpenTime}}</span>
              <span v-else>{{modalData.StartTime}}</span>
            </li>

            <li>
              <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M0.966548 0.988515C1.58542 0.355579 2.42479 0 3.3 0H18.7C19.5752 0 20.4146 0.355579 21.0335 0.988515C21.6523 1.62145 22 2.47989 22 3.375V6.75C22 7.04837 21.8841 7.33452 21.6778 7.5455C21.4715 7.75647 21.1917 7.875 20.9 7.875C20.6083 7.875 20.3285 7.99353 20.1222 8.2045C19.9159 8.41548 19.8 8.70163 19.8 9C19.8 9.29837 19.9159 9.58452 20.1222 9.7955C20.3285 10.0065 20.6083 10.125 20.9 10.125C21.5075 10.125 22 10.6287 22 11.25V14.625C22 15.5201 21.6523 16.3785 21.0335 17.0115C20.4146 17.6444 19.5752 18 18.7 18H3.3C2.42479 18 1.58542 17.6444 0.966548 17.0115C0.347678 16.3785 0 15.5201 0 14.625V11.25C0 10.6287 0.492487 10.125 1.1 10.125C1.39174 10.125 1.67153 10.0065 1.87782 9.7955C2.08411 9.58452 2.2 9.29837 2.2 9C2.2 8.70163 2.08411 8.41548 1.87782 8.2045C1.67153 7.99353 1.39174 7.875 1.1 7.875C0.492487 7.875 0 7.37132 0 6.75V3.375C0 2.47989 0.347677 1.62145 0.966548 0.988515ZM15.4 15.75V14.625C15.4 14.0037 14.9075 13.5 14.3 13.5C13.6925 13.5 13.2 14.0037 13.2 14.625V15.75H3.3C3.00826 15.75 2.72847 15.6315 2.52218 15.4205C2.31589 15.2095 2.2 14.9234 2.2 14.625V12.182C2.65969 12.0158 3.08211 11.7458 3.43345 11.3865C4.05232 10.7535 4.4 9.89511 4.4 9C4.4 8.10489 4.05232 7.24645 3.43345 6.61352C3.08211 6.25418 2.65969 5.98425 2.2 5.81802V3.375C2.2 3.07663 2.31589 2.79048 2.52218 2.5795C2.72847 2.36853 3.00826 2.25 3.3 2.25H13.2V3.375C13.2 3.99632 13.6925 4.5 14.3 4.5C14.9075 4.5 15.4 3.99632 15.4 3.375V2.25H18.7C18.9917 2.25 19.2715 2.36853 19.4778 2.5795C19.6841 2.79048 19.8 3.07663 19.8 3.375V5.81802C19.3403 5.98425 18.9179 6.25419 18.5665 6.61352C17.9477 7.24645 17.6 8.10489 17.6 9C17.6 9.89511 17.9477 10.7535 18.5665 11.3865C18.9179 11.7458 19.3403 12.0158 19.8 12.182V14.625C19.8 14.9234 19.6841 15.2095 19.4778 15.4205C19.2715 15.6315 18.9917 15.75 18.7 15.75H15.4ZM14.3 6.75C14.9075 6.75 15.4 7.25368 15.4 7.875V10.125C15.4 10.7463 14.9075 11.25 14.3 11.25C13.6925 11.25 13.2 10.7463 13.2 10.125V7.875C13.2 7.25368 13.6925 6.75 14.3 6.75Z" fill="#08A6BB"/>
              </svg>

              <span v-if="isAttraction">{{modalData.TicketInfo}}</span>
              <span v-else>{{modalData.EndTime}}</span>
            </li>

            <li>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M3.19566 0.520011C3.85742 -0.143083 4.99754 -0.215791 5.66753 0.557269L8.41545 3.7292C8.4222 3.73644 8.42883 3.74382 8.43535 3.75135C9.0402 4.44965 8.91638 5.45753 8.31422 6.06261L8.31304 6.0638L7.43581 6.94167C8.34121 8.41081 9.57706 9.64848 11.0448 10.556L11.9239 9.67568C12.5263 9.07182 13.531 8.94698 14.2288 9.54599C14.2288 9.546 14.2288 9.54597 14.2288 9.54599L17.4358 12.2989C18.2152 12.9685 18.1435 14.114 17.4798 14.7777L15.183 17.0786C14.2818 17.9809 12.9048 18.2745 11.7564 17.7168C6.74676 15.2885 2.70379 11.2398 0.282583 6.22665C-0.27401 5.07817 0.0192332 3.70175 0.919674 2.80009M0.919674 2.80009L3.19566 0.520011C3.1957 0.519971 3.19562 0.52005 3.19566 0.520011M10.7953 10.8062C10.7976 10.8038 10.7999 10.8014 10.8023 10.7991L10.7953 10.8062ZM7.18681 7.19054L7.19411 7.1834C7.19171 7.18581 7.18928 7.18818 7.18681 7.19054ZM7.19444 4.81574C7.19448 4.81571 7.19463 4.81608 7.1948 4.81691L7.19444 4.81574ZM7.19515 4.81948L4.43755 1.63639C4.43657 1.63633 4.43545 1.63629 4.43419 1.6363C4.41769 1.63635 4.38609 1.64348 4.3538 1.67584L2.0777 3.95603C1.62384 4.41044 1.52908 5.04753 1.75529 5.51365L1.75596 5.51504C4.01693 10.1964 7.79237 13.9771 12.4705 16.2446C12.9354 16.4704 13.5715 16.3765 14.025 15.9226C14.0251 15.9225 14.025 15.9226 14.025 15.9226L16.3223 13.6212C16.3549 13.5886 16.3628 13.5558 16.3629 13.5384C16.3629 13.5368 16.3628 13.5354 16.3627 13.5342L13.1678 10.7916C13.1659 10.7915 13.163 10.7914 13.159 10.7917C13.141 10.793 13.1113 10.8022 13.0823 10.8313L11.9708 11.9444C11.7911 12.129 11.5564 12.2508 11.3017 12.2913C11.0431 12.3325 10.7781 12.2876 10.5474 12.1636C10.5437 12.1616 10.54 12.1596 10.5363 12.1575C10.5331 12.1557 10.5298 12.1538 10.5265 12.152C8.5772 11.0294 6.9602 9.41033 5.84021 7.45954C5.83641 7.45292 5.83271 7.44626 5.8291 7.43954C5.70508 7.20882 5.66018 6.94379 5.70127 6.6851C5.74173 6.43041 5.86333 6.19572 6.04782 6.01585L7.15444 4.90843C7.15457 4.9083 7.15432 4.90855 7.15444 4.90843C7.184 4.87855 7.19381 4.84753 7.19511 4.82872C7.1954 4.82457 7.19533 4.82156 7.19515 4.81948ZM13.1709 10.7922C13.1709 10.7922 13.1705 10.7921 13.1699 10.7919L13.1709 10.7922ZM13.163 10.7875C13.1631 10.7875 13.163 10.7875 13.163 10.7875V10.7875Z" fill="#08A6BB"/>
              </svg>

              {{modalData.Phone}}</li>
            <li>
              <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2">
                <path d="M2.7027 6.1875L5.40541 11.25H0L2.7027 6.1875ZM0.540541 0H4.86486V4.5H0.540541V0ZM2.7027 18C3.27614 18 3.8261 17.7629 4.23158 17.341C4.63707 16.919 4.86486 16.3467 4.86486 15.75C4.86486 15.1533 4.63707 14.581 4.23158 14.159C3.8261 13.7371 3.27614 13.5 2.7027 13.5C2.12926 13.5 1.57931 13.7371 1.17382 14.159C0.768339 14.581 0.540541 15.1533 0.540541 15.75C0.540541 16.3467 0.768339 16.919 1.17382 17.341C1.57931 17.7629 2.12926 18 2.7027 18ZM7.02703 1.125V3.375H20V1.125H7.02703ZM7.02703 16.875H20V14.625H7.02703V16.875ZM7.02703 10.125H20V7.875H7.02703V10.125Z" fill="#08A6BB"/>
              </svg>

              {{modalData.Class1? modalData.Class1 : modalData.Level}}</li>
          </ul>
        </template>
    </b-modal> -->
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  import Card from '../components/Card.vue';
  import SimpleCard from '../components/SimpleCard.vue';

  import getAuthorization from '@/utility/auth';
  import modalHelper from '@/utility/modalHelper.ts';

  @Component({
    components: {
      Card,
      SimpleCard,
    },
  })
  export default class Home extends Vue {
    // props

    // data
    attractionData: any[] = [];
    activityData: any[] = [];
    isLoading = false;
    isLoading2 = false;
    modalData = {
      Name: '',
      Address: '',
      Picture: {
        PictureUrl1: '',
      },
    };
    isAttraction = false;

    // hooks
    created(): void {
      this.queryAttraction();
      this.queryAactivity();
    }

    // methods
    async queryAttraction(): Promise<void> {
      this.isLoading = true;

      try {
        const res = await fetch(`https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?$skip=50&$top=8&?$format=JSON`, {
          method: 'GET',
          headers: getAuthorization(),
        });

        res.json().then((d) => {
          this.attractionData = d;
        });
      } finally {
        this.isLoading = false;
      }
    }
    async queryAactivity(): Promise<void> {
      this.isLoading = true;
    }
    showModal(data: any, type: string): void {
      this.modalData = data;

      modalHelper(this, 'detail-modal');
      // this.$bvModal.show('detail-modal');
      this.isAttraction = type === 'activity' ? false : true;
    }

    //     async queryAactivity(){
    //       this.isLoading2 = true;
    //       try{
    //         let res = await fetch(`https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity?$skip=5&$top=4&?$format=JSON`, {
    //           method:'GET',
    //           header:{
    //             Authorization:'hmac username=83592d8c997f4933ae965e60e5995a2d',
    //             'X-Date':new Date().toGMTString(),
    //           }
    //           'Accept-Encoding': 'gzip'
    //         })

    //         res.json().then((d) => {
    //           this.activityData = d;
    //         })
    //       }catch{
    //         console.log('fail');
    //       }finally{
    //         this.isLoading2 = false;
    //       }
    //     }
    //     showModal(data, type){
    //       this.modalData = data;
    //       this.$bvModal.show('detail-modal');
    //       this.isAttraction = type === 'activity'? false : true;
    //     }
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
