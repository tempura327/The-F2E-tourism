<template>
  <div class="calendar">
    <div class="calendar_title">{{ current.year }}年{{ current.month + 1 }}月</div>

    <div class="calendar_navigator">
      <div>
        <button class="btn btn-outline" @click="changeTime(-12)">prev year</button>
        <button class="btn btn-outline ml-2" @click="changeTime(-1)">prev month</button>
      </div>
      <button class="btn btn-outline" @click="changeTime(0)">today</button>
      <div>
        <button class="btn btn-outline" @click="changeTime(1)">next month</button>
        <button class="btn btn-outline ml-2" @click="changeTime(12)">next year</button>
      </div>
    </div>

    <div v-for="(day, index) in weekDayArray" :key="`day-${index}`" class="calendar_cell bg-primary font-bold text-white">
      {{ day }}
    </div>

    <div v-if="isLoading" class="spinner_wrapper col-start-1 col-end-8 py-6 flex justify-center items-center">
      <Spinner></Spinner>
    </div>

    <template v-else>
      <div v-for="(date, index) in currentDateArray" :key="`date-${index}`" class="calendar_cell date">
        {{ date }}
        <div class="calendar_marker" v-for="(item, index) in activityData[date]?.slice(0, 3)" :key="`${date}-${index}`">{{ item.ActivityName }}</div>
        <div v-if="activityData[date]?.length > 3">...</div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

  import Spinner from '@/components/Spinner.vue';

  import { dateStringConvertor } from '@/utility/dateConvertor';
  import { activity, current } from '@/utility/type';

  @Component({
    components: {
      Spinner,
    },
  })
  export default class Calendar extends Vue {
    // props
    @Prop({ default: true }) isLoading!: boolean;
    @Prop({
      default: () => {
        return {};
      },
    })
    activityData!: { [key: string]: activity[] };

    // data
    weekDayArray = ['日', '一', '二', '三', '四', '五', '六'];
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
    moveMonth = 0;

    // hook
    created(): void {
      this.initCurrent();
    }
    // mounted(): void {}

    // methods
    initCurrent(): void {
      const { year: currentYear, month: currentMonth } = this.today;

      this.current = {
        year: currentYear,
        month: currentMonth,
        startDateObj: new Date(currentYear, currentMonth, 1),
        endDateObj: new Date(currentYear, currentMonth + 1, 0),
      };
    }
    changeTime(num: number): void {
      if (num === 0) {
        this.moveMonth = 0;
        return;
      }

      this.moveMonth += num;
    }

    // computed
    get currentDateArray(): number[] {
      const lastMonthBlank = [...Array((this.current.startDateObj as Date).getDay()).values()];
      const length = (this.current.endDateObj as Date).getDate();
      const nextMonthBlank = [...Array(6 - (this.current.endDateObj as Date).getDay()).values()];

      return lastMonthBlank.concat(
        Array.from({ length: length }, (d, i) => dateStringConvertor(this.current.year, this.current.month, i + 1)),
        nextMonthBlank,
      );
    }

    // watch
    @Watch('moveMonth')
    moveWatch(newVal: number, oldVal: number): void {
      if (newVal === 0) {
        this.initCurrent();
        return;
      }

      const needToChange = Math.abs(newVal - oldVal) > 11 ? 'year' : 'month';

      this.current[needToChange] += newVal > oldVal ? 1 : -1;

      this.current.startDateObj = new Date(this.current.year, this.current.month, 1);
      this.current.endDateObj = new Date(this.current.year, this.current.month + 1, 0);

      this.$emit('onCurrentChange', this.current);
    }
  }
</script>

<style scoped>
  .spinner_wrapper {
    height: 500px;
  }
</style>
