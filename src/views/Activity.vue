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
  import { current, activity } from '@/utility/type';

  import taiwanCity from '@/config/taiwanCity.json';

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
    activityData: activity[] = [];
    map: { [key: string]: activity[] } = {};

    // hooks
    created(): void {
      const { year: currentYear, month: currentMonth } = this.today;
      const firstDateStr = dateConvertor(new Date(currentYear, currentMonth, 1));
      const lastDateStr = dateConvertor(new Date(currentYear, currentMonth + 1, 0));

      this.queryActivity(firstDateStr, lastDateStr);
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
      const { year, month } = this.today;

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
  }
</script>
