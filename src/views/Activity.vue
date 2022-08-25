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
        <Calendar :isLoading="!isDone" :activityData="map" @onCurrentChange="onCurrentChange"></Calendar>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  import Calendar from '@/components/Calendar.vue';

  import query from '@/utility/queryHelper';
  import dateConvertor from '@/utility/dateConvertor';
  import { current, activity } from '@/utility/type';

  @Component({
    components: {
      Calendar,
    },
  })
  export default class Activity extends Vue {
    // data
    isDone = false;
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
      this.isDone = false;

      try {
        const res = await query(`
          https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity?%24filter=StartTime%20ge%20${firstDate}%20and%20EndTime%20le%20${lastDate}&%24orderby=StartTime%20ASC&%24format=JSON
        `);

        this.mappingActivity(res);
        this.activityData = this.activityData.concat(res);
        console.log(res);
      } catch {
        console.log('query failed');
      } finally {
        this.isDone = true;
      }
    }
    mappingActivity(data: activity[]): void {
      for (const i of data) {
        const firstDate = i.StartTime.slice(0, 10);

        if (firstDate in this.map) {
          this.map[firstDate].push(i);
        } else {
          this.map[firstDate] = [i];
        }
      }
      console.log(this.map);
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
