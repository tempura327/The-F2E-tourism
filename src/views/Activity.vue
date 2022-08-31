<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <h1 class="font-bold text-h1 text-primary mb-6">活動</h1>
        <h5 class="h5 text-gray font-bold mb-12">
          365天，各種活動任你玩。
          <br />
          等你一同來體驗這座生活的樂趣！
        </h5>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col">
        <SearchBar className="mb-4" :options="searchOption" :defaultType="''" :isSelectorShow="true" @searchClick="searchActivity"></SearchBar>

        <Calendar :isLoading="isLoading" :activityData="map" @onCurrentChange="onCurrentChange"></Calendar>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  import Calendar from '@/components/Calendar.vue';
  import SearchBar from '@/components/SearchBar.vue';

  import query from '@/utility/queryHelper';
  import dateConvertor from '@/utility/dateConvertor';
  import { current, activity, googleActivity } from '@/utility/type';

  import taiwanCity from '@/config/taiwanCity.json';

  import { decodeJwt } from 'jose';

  @Component({
    components: {
      Calendar,
      SearchBar,
    },
  })
  export default class Activity extends Vue {
    // data
    isLoading = true;
    searchOption = taiwanCity;
    baseUrl = `https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity`;
    todayDateObj = new Date();
    today = {
      year: this.todayDateObj.getFullYear(),
      month: this.todayDateObj.getMonth(), // 7
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

    // hooks
    created(): void {
      this.current = JSON.parse(JSON.stringify(this.today));
      const { year: currentYear, month: currentMonth } = this.today;
      const firstDateStr = dateConvertor(new Date(currentYear, currentMonth, 1));
      const lastDateStr = dateConvertor(new Date(currentYear, currentMonth + 1, 0));

      this.queryActivity(firstDateStr, lastDateStr);
    }
    mounted(): void {
      // eslint-disable-next-line no-undef
      window.onGoogleLibraryLoad = () => {
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
      };
    }

    // methods
    async queryActivity(firstDate: string, lastDate: string): Promise<void> {
      this.isLoading = true;

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

      return `${res}&%24orderby=StartTime%20ASC&%24format=JSON`;
    }
    onCurrentChange(current: current): void {
      this.current = current;
      const { startDateObj, endDateObj } = current;

      const firstDateStr = dateConvertor(startDateObj as Date);
      const lastDateStr = dateConvertor(endDateObj as Date);

      // if data of current month is exist in map, don't query again.
      if (this.checkMonthData(firstDateStr)) return;

      this.queryActivity(firstDateStr, lastDateStr);
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
          console.log(`token: ${this.accessToken}`);
          this.queryGoogleCalendar();

          return this.accessToken;
        },
      });

      this.getToken();
    }
    getToken(): void {
      this.clientInstance.requestAccessToken();
    }
    revokeToken() {
      // eslint-disable-next-line no-undef
      google.accounts.oauth2.revoke(this.accessToken, () => {
        console.log('access token revoked');
        console.log(this.clientInstance);
      });
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

          console.log(this.userCalendarActivity);
        });
    }
  }
</script>
