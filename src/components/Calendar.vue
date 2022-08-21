<template>
  <div class="calendar">
    <div class="calendar_title">{{ current.year }}年{{ current.month + 1 }}月</div>

    <div class="calendar_navigator">
      <div>
        <button class="btn btn-outline" @click="moveMonth -= 12">prev year</button>
        <button class="btn btn-outline ml-2" @click="moveMonth -= 1">prev month</button>
      </div>
      <button class="btn btn-outline" @click="moveMonth = 0">today</button>
      <div>
        <button class="btn btn-outline" @click="moveMonth += 1">next month</button>
        <button class="btn btn-outline ml-2" @click="moveMonth += 12">next year</button>
      </div>
    </div>

    <div v-for="(day, index) in weekDayArray" :key="`day-${index}`" class="calendar_cell bg-primary font-bold text-white">{{ day }}</div>
    <div v-for="(date, index) in currentDateArray" :key="`date-${index}`" class="calendar_cell date">
      {{ date }}
      <!-- <div class="calendar_marker"></div> -->
    </div>
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

    // computed
    get currentDateArray(): number[] {
      const lastMonthBlank = [...Array((this.current.startDateObj as Date).getDay()).values()];
      const length = (this.current.endDateObj as Date).getDate();
      const nextMonthBlank = [...Array(6 - (this.current.endDateObj as Date).getDay()).values()];

      return lastMonthBlank.concat(
        Array.from({ length: length }, (d, i) => i + 1),
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
    }
  }
</script>
