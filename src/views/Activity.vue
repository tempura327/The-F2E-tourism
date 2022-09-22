<template>
  <div class="container">
    <div class="row">
      <div class="col-span-12">
        <h1 class="font-bold text-h1 text-primary mb-6">活動</h1>
        <h5 class="h5 text-gray font-bold mb-12">
          365天，各種活動任你玩。
          <br />
          等你一同來體驗這座生活的樂趣！
        </h5>
      </div>
    </div>

    <div class="row mb-32">
      <div class="w-full">
        <SearchBar className="mb-4" :options="searchOption" :defaultType="''" :isSelectorShow="true" @searchClick="searchActivity"></SearchBar>

        <Calendar
          :isLoading="isLoading"
          :activityData="map"
          @onCurrentChange="onCurrentChange"
          @onMarkerClick="showModal"
          @onMoreClick="showMoreActivity"></Calendar>
      </div>
    </div>

    <SimpleModal :isShow="isModalShow" :size="isMobile ? 'lg' : 'md'" @onCloseClick="closeModal">
      <template #control>
        <div class="flex mb-2">
          <button class="" @click="clearSelectedActivity">
            <font-awesome-icon v-show="isActivitySelected" class="text-gray-80 ml-auto mb-2 hover:scale-150 cursor-pointer" icon="angle-left" />
          </button>

          <button class="ml-auto" @click="closeModal">
            <font-awesome-icon class="text-gray-80 ml-auto mb-2 hover:scale-150 cursor-pointer" icon="xmark" />
          </button>
        </div>
      </template>

      <!-- level1. activity list -->
      <div class="grid gap-2 grid-cols-2" v-if="!isActivitySelected">
        <div
          class="calendar_marker"
          v-for="(item, index) in selectedDateActivity"
          :key="`selected-${index}`"
          @click="showModal({ data: item, list: selectedDateActivity })">
          {{ item.ActivityName }}
        </div>
      </div>

      <!-- level2. activity detail -->
      <section class="flex flex-col" v-else>
        <div class="flex items-center">
          <button class="mr-2" @click="insertToGoogleCalendar" :disabled="userCalendarActivity.includes(info.ActivityName)">
            <font-awesome-icon
              class="text-primary text-h4 ml-auto mb-2"
              :class="{ 'hover:scale-125 cursor-pointer': !userCalendarActivity.includes(info.ActivityName) }"
              :icon="[userCalendarActivity.includes(info.ActivityName) ? 'fas' : 'far', 'bookmark']" />
          </button>

          <a :href="info.WebsiteUrl" class="text-h2 text-gray-80 font-bold mb-4" :class="{ 'hover:text-primary': info.WebsiteUrl }">
            {{ info.ActivityName }}
            <span class="text-h5">/ {{ info.Class1 || '未分類' }}</span>
          </a>
        </div>

        <Gallery :images="images" galleryClass="mb-4"></Gallery>

        <h4 class="text-h5 text-gray-80 mb-2">{{ extractDateRangeStr(`${info.StartTime}~${info.EndTime}`) }}</h4>
        <h4 class="text-h5 text-gray-80 mb-2">{{ info.Address }}</h4>
        <h4 class="text-h5 text-gray-80 mb-2">{{ info.Phone }}</h4>
        <hr class="my-3" v-if="info.Description" />
        <h4 class="text-h5 text-gray-80">{{ info.Description }}</h4>
      </section>
    </SimpleModal>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  import Calendar from '@/components/Calendar.vue';
  import SearchBar from '@/components/SearchBar.vue';
  import Spinner from '@/components/Spinner.vue';
  import SimpleModal from '@/components/SimpleModal.vue';
  import Gallery from '@/components/Gallery.vue';

  import query from '@/utility/queryHelper';
  import dateConvertor, { extractDateRangeStr } from '@/utility/dateConvertor';
  import { current, activity, googleActivity } from '@/utility/type';

  import taiwanCity from '@/config/taiwanCity.json';

  import { decodeJwt } from 'jose';

  @Component({
    components: {
      Calendar,
      SearchBar,
      Spinner,
      SimpleModal,
      Gallery,
    },
  })
  export default class Activity extends Vue {
    // data
    isLoading = true;
    isModalShow = false;
    isActivitySelected = false;
    isMobile = this.$store.state.isMobile;
    searchOption = taiwanCity;
    extractDateRangeStr = extractDateRangeStr;
    baseUrl = `https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity`;
    todayDateObj = new Date();
    today = {
      year: this.todayDateObj.getFullYear(),
      month: this.todayDateObj.getMonth(),
      date: this.todayDateObj.getDate(),
    };
    current: current = {
      endDateObj: undefined,
      month: 0,
      startDateObj: undefined,
      year: 0,
    };
    activityData: activity[] = [];
    map: { [key: string]: activity[] } = {};
    // below are used to interact with google calendar.
    clientInstance: any = undefined;
    accessToken = '';
    userCalendarActivity: googleActivity[] = []; // name of activities queried from google calendar
    info: activity = {
      ActivityID: '',
      ActivityName: '',
      City: '',
      Description: '',
      EndTime: '',
      Location: '',
      Organizer: '',
      Picture: {},
      Position: {
        GeoHash: '',
        PositionLat: 0,
        PositionLon: 0,
      },
      SrcUpdateTime: '',
      StartTime: '',
      UpdateTime: '',
    };
    selectedDateActivity: activity[] = [];
    images: string[] = [];

    // hooks
    created(): void {
      this.current = JSON.parse(JSON.stringify(this.today));

      this.queryActivity();
    }
    mounted(): void {
      // eslint-disable-next-line no-undef
      google.accounts.id.initialize({
        client_id: '554869584316-335mdko65uc6jqjefjf1djh06hcvi8mb.apps.googleusercontent.com',
        callback: (d: { credential: string }) => {
          this.accessToken = d.credential;
          const userData = decodeJwt(d.credential);

          this.$store.commit('setCurrentUser', {
            firstName: userData.given_name,
            lastName: userData.family_name,
            mail: userData.email,
            avatar: userData.picture,
            token: d.credential,
          });
          this.initClient();
        },
      });

      // eslint-disable-next-line no-undef
      google.accounts.id.renderButton(document.querySelector('.auth'), {
        type: 'icon',
        theme: 'outline', // default style
        text: '登入',
        shape: 'circle',
      });

      // You can cancel the One Tap flow if you remove the prompt from the relying party DOM
      // eslint-disable-next-line no-undef
      google.accounts.id.cancel();
    }

    // methods
    async queryActivity(): Promise<void> {
      this.isLoading = true;

      const { firstDate, lastDate } = this.getFirstAndLastDate();

      try {
        const res = await query(`
          ${this.baseUrl}?%24filter=StartTime%20ge%20${firstDate}%20and%20EndTime%20le%20${lastDate}&%24orderby=StartTime%20ASC&%24format=JSON
        `);

        this.mappingActivity(res);
        this.activityData = this.activityData.concat(res);
      } catch {
        throw Error('query activity failed');
      } finally {
        this.isLoading = false;
      }
    }
    async searchActivity(data: { keyword: string; type: string }): Promise<void> {
      this.isLoading = true;

      try {
        const res = await query(this.getQueryUrl(data));

        this.map = {};
        this.mappingActivity(res);

        this.activityData = res;
      } catch (e: any) {
        throw Error(`search activity fail. ${e.message}`);
      } finally {
        this.isLoading = false;
      }
    }
    mappingActivity(data: activity[]): void {
      const { year, month } = this.current;

      const lastDate = new Date(year, month + 1, 0).getDate();

      for (let i = 1; i < lastDate + 1; i++) {
        const key = dateConvertor([year, month, i]);

        if (!(key in this.map)) {
          this.map[key] = data.filter((i) => i.StartTime.slice(0, 10) <= key && i.EndTime.slice(0, 10) >= key);
        }
      }
    }
    getQueryUrl(data: { keyword: string; type: string }): string {
      let res = this.baseUrl;

      if (data.type) {
        res += `${data.type}?`;
      }

      if (!res.endsWith('?')) {
        res += '?';
      }

      if (data.keyword) {
        res += `%24filter=contains(ActivityName%2C'${data.keyword}')`;
      }

      const { firstDate, lastDate } = this.getFirstAndLastDate();

      return `${res}%20and%20StartTime%20ge%20${firstDate}%20and%20EndTime%20le%20${lastDate}&%24orderby=StartTime%20ASC&%24format=JSON`;
    }
    getFirstAndLastDate(): { firstDate: string; lastDate: string } {
      const { year, month } = this.current;

      const firstDate = dateConvertor(new Date(year, month, 1));
      const lastDate = dateConvertor(new Date(year, month + 1, 0));

      return { firstDate, lastDate };
    }
    onCurrentChange(current: current): void {
      this.current = current;
      const { year, month } = current;

      // if data of current month is exist in map, don't query again.
      if (this.checkMonthData(`${year}-${month + 1}`)) return;

      this.queryActivity();
    }
    checkMonthData(dateStr: string): boolean {
      const yearMonth = dateStr.slice(0, 7);

      return new RegExp(yearMonth).test(JSON.stringify(this.map));
    }
    initClient(): void {
      // 2. Initialize the JavaScript client library.
      // eslint-disable-next-line no-undef
      this.clientInstance = google.accounts.oauth2.initTokenClient({
        client_id: '554869584316-335mdko65uc6jqjefjf1djh06hcvi8mb.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/calendar',
        callback: (tokenResponse: {
          access_token: string;
          authuser: string;
          expires_in: number;
          prompt: string;
          scope: string;
          token_type: string;
        }) => {
          this.accessToken = tokenResponse.access_token;

          this.queryGoogleCalendar();

          return this.accessToken;
        },
      });

      this.getToken();
    }
    getToken(): void {
      this.clientInstance.requestAccessToken();
    }
    // revokeToken() {
    //   // eslint-disable-next-line no-undef
    //   google.accounts.oauth2.revoke(this.accessToken, () => {
    //     console.log('access token revoked');
    //   });
    // }
    showModal(data: { data: activity; list: activity[] }): void {
      this.info = data.data;
      this.images = Object.values(data.data.Picture).filter((d: string) => d.startsWith('https'));
      this.selectedDateActivity = data.list;

      this.isModalShow = true;
      this.isActivitySelected = true;
    }
    showMoreActivity(data: activity[]): void {
      this.selectedDateActivity = data;

      this.isModalShow = !this.isModalShow;
    }
    closeModal(): void {
      this.clearSelectedActivity();
      this.isModalShow = !this.isModalShow;
    }
    clearSelectedActivity(): void {
      this.info = {
        ActivityID: '',
        ActivityName: '',
        City: '',
        Description: '',
        EndTime: '',
        Location: '',
        Organizer: '',
        Picture: {},
        Position: {
          GeoHash: '',
          PositionLat: 0,
          PositionLon: 0,
        },
        SrcUpdateTime: '',
        StartTime: '',
        UpdateTime: '',
      };

      this.isActivitySelected = false;
    }
    async queryGoogleCalendar(): Promise<void> {
      await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      })
        .then((d) => {
          return d.json();
        })
        .then((d) => {
          this.userCalendarActivity = d.items.map((i: googleActivity) => {
            if (i.description?.includes('從The-F2E-tourism加入')) {
              return i.summary;
            }
          });
        });
    }
    async insertToGoogleCalendar(): Promise<void> {
      if (!this.$store.state.currentUser.token) {
        // eslint-disable-next-line no-undef
        google.accounts.id.prompt();
        return;
      }

      const { StartTime, EndTime, ActivityName, Address, Phone, Organizer } = this.info;

      // start and end are required field.
      const resource = {
        summary: ActivityName,
        description: `主辦單位: ${Organizer || '{不明)'}。電話: ${Phone || '(未提供)'}。(從The-F2E-tourism加入)`,
        location: Address,
        start: {
          dateTime: StartTime,
          timeZone: 'Asia/Taipei',
        },
        end: {
          dateTime: EndTime,
          timeZone: 'Asia/Taipei',
        },
        colorId: '2', // green
        reminders: {
          useDefault: false,
          overrides: [
            // The maximum number of override reminders is 5. if > 5, will get HTTP code 400.
            { method: 'email', minutes: 24 * 60 },
            { method: 'email', minutes: 12 * 60 },
            { method: 'popup', minutes: 10 },
          ],
        },
      };

      // 400: Bad Request. User error. This can mean that a required field or parameter has not been provided, the value supplied is invalid, or the combination of provided fields is invalid.
      // 401: Invalid Credentials. Invalid authorization header. The access token you're using is either expired or invalid.
      await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?alt=json&key=AIzaSyB2bn-xLPTPVWMQeQmBxVaez5SWY9mmbX8`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resource),
      })
        .then((d) => {
          return d.json();
        })
        .then(() => {
          this.queryGoogleCalendar();
        });
    }
  }
</script>
