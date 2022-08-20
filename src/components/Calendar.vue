<template>
  <div class="calendar">
    <div class="calendar_title">{{ current.year }}年{{ current.month + 1 }}月</div>

    <div class="calendar_navigator">
      <div>
        <button class="btn btn-outline" @click="changeCurrent('year', -1)">prev year</button>
        <button class="btn btn-outline ml-2" @click="changeCurrent('month', -1)">prev month</button>
      </div>
      <button class="btn btn-outline" @click="changeCurrent('today', 0)">today</button>
      <div>
        <button class="btn btn-outline" @click="changeCurrent('month', 1)">next month</button>
        <button class="btn btn-outline ml-2" @click="changeCurrent('year', 1)">next year</button>
      </div>
    </div>

    <div v-for="(day, index) in weekDayArray" :key="`day-${index}`" class="calendar_cell bg-primary font-bold text-white">{{ day }}</div>
    <div v-for="(date, index) in currentDateArray" :key="`date-${index}`" class="calendar_cell">{{ date }}</div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

  declare type current = {
    endDateObj?: Date;
    month: number;
    startDateObj?: Date;
    year: number;
  };

  @Component
  export default class Calendar extends Vue {
    // props
    @Prop({
      default: () => {
        return [];
      },
    })
    activityData!: any[];

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

    // hook
    created(): void {
      const { year: currentYear, month: currentMonth } = this.today;

      this.current = {
        year: currentYear,
        month: currentMonth,
        startDateObj: new Date(currentYear, currentMonth, 1),
        endDateObj: new Date(currentYear, currentMonth + 1, 0),
      };
    }
    // mounted(): void {}

    // methods
    changeCurrent(type: string, num: number): void {
      if (type === 'month') {
        // 0 / +12
        // 1~12 / +num
        // 13 / -12
        this.current.month = this.current.month + num || 12;
      } else if (type === 'year') {
        this.current.year += num;
      } else {
        this.current.year = this.today.year;
        this.current.month = this.today.month;
      }
    }

    // computed
    get currentDateArray(): number[] {
      const blank = [...Array((this.current.startDateObj as Date).getDay()).values()];
      const length = (this.current.endDateObj as Date).getDate();

      return blank.concat(Array.from({ length: length }, (d, i) => i + 1));
    }

    // watch
    // @Watch('', { immediate: true, deep: true })
    // (newVal: any): void {

    // }
  }
</script>
