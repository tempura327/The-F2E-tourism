<template>
  <div class="calendar">
    <div class="calendar_title">{{ current.year }}年{{ current.month + 1 }}月</div>

    <div class="calendar_navigator">
      <div>
        <button class="btn btn-transparent" @click="changeTime(-12)">
          <font-awesome-icon class="text-primary" icon="angles-left" />
        </button>

        <button class="btn btn-transparent ml-2" @click="changeTime(-1)">
          <font-awesome-icon class="text-primary" icon="angle-left" />
        </button>
      </div>
      <button class="btn btn-transparent" @click="changeTime(0)">
        <font-awesome-icon class="text-primary" icon="fa-solid fa-circle" />
      </button>
      <div>
        <button class="btn btn-transparent" @click="changeTime(1)">
          <font-awesome-icon class="text-primary" icon="angle-right" />
        </button>
        <button class="btn btn-transparent ml-2" @click="changeTime(12)">
          <font-awesome-icon class="text-primary" icon="angles-right" />
        </button>
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
        <div
          class="calendar_marker"
          v-for="(item, index) in activityData[date]?.slice(0, 3)"
          :key="`${date}-${index}`"
          @click="onMarkerClick($event.target, item)">
          {{ item.ActivityName }}
        </div>

        <div v-if="activityData[date]?.length > 3" class="cursor-pointer" @click="showMoreActivity($event.target, activityData[date])">...</div>
      </div>
    </template>

    <SimpleModal :isShow="isTooltipSHow">
      <template #control>
        <div class="flex mb-2">
          <button class="">
            <font-awesome-icon v-show="isActivitySelected" class="text-gray-80 ml-auto mb-2 hover:scale-150 cursor-pointer" icon="angle-left" />
          </button>

          <button class="ml-auto" @click="isTooltipSHow = !isTooltipSHow">
            <font-awesome-icon class="text-gray-80 ml-auto mb-2 hover:scale-150 cursor-pointer" icon="xmark" />
          </button>
        </div>
      </template>

      <div class="grid gap-2 grid-cols-2" v-if="!isActivitySelected">
        <div
          class="calendar_marker"
          v-for="(item, index) in selectedDateActivity"
          :key="`selected-${index}`"
          @click="onMarkerClick($event.target, item)">
          {{ item.ActivityName }}
        </div>
      </div>

      <section class="flex flex-col" v-else>
        <!-- if activity is added to google calendar show this. -->
        <!-- <button> -->
        <!-- <font-awesome-icon class="text-primary ml-auto mb-2 hover:scale-150 cursor-pointer" :icon="['fas', 'bookmark']" /> -->
        <!-- </button> -->

        <div class="flex items-center">
          <button class="mr-2">
            <font-awesome-icon class="text-primary text-h4 ml-auto mb-2 hover:scale-125 cursor-pointer" :icon="['far', 'bookmark']" />
          </button>

          <h2 class="text-h2 text-gray-80 font-bold mb-4">
            {{ info.ActivityName }}
            <span class="text-h5">/ {{ info.Class1 || '未分類' }}</span>
          </h2>
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
  import { Component, Vue, Prop } from 'vue-property-decorator';

  import Spinner from '@/components/Spinner.vue';
  import SimpleModal from '@/components/SimpleModal.vue';
  import Gallery from '@/components/Gallery.vue';

  import dateConvertor, { extractDateRangeStr } from '@/utility/dateConvertor';
  import { activity, current } from '@/utility/type';

  @Component({
    components: {
      Spinner,
      SimpleModal,
      Gallery,
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
    extractDateRangeStr = extractDateRangeStr;
    isTooltipSHow = false;
    isActivitySelected = false;
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
    position = [0, 0];
    selectedDateActivity: activity[] = [];
    images: string[] = [];

    // hook
    created(): void {
      this.initCurrent();
    }

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
      // 26
      if (num === 0) {
        this.initCurrent();
        return;
      }

      const property = Math.abs(num) > 11 ? 'year' : 'month';
      this.current[property] += num > 0 ? 1 : -1;

      // if month is not between 0 and 11, means cross year.
      if (this.current.month > 11 || this.current.month < 0) {
        // once month === 12, take away 12 from it. once month === -1, add 12 to it.
        // because 12 === 11 + 1(num) and -1 === 0 + (-1)(num), so I put minus marker in front of num.
        this.current.month += -num * 12;
        this.current.year += num;
      }

      this.current.startDateObj = new Date(this.current.year, this.current.month, 1);
      this.current.endDateObj = new Date(this.current.year, this.current.month + 1, 0);

      this.$emit('onCurrentChange', this.current);
    }
    onMarkerClick(ele: HTMLElement, data: activity): void {
      this.info = data;
      this.images = Object.values(data.Picture).filter((d: string) => d.startsWith('https'));

      this.position = [ele.offsetTop + 20, ele.offsetLeft];
      this.isActivitySelected = true;
      this.isTooltipSHow = true;

      this.$emit('onMarkerClick', data);
    }
    showMoreActivity(ele: HTMLElement, data: activity[]): void {
      this.selectedDateActivity = data;
      this.position = [ele.offsetTop + 20, ele.offsetLeft];

      this.isTooltipSHow = !this.isTooltipSHow;
    }
    clearSelectedActivity(): void {
      console.log('clear');
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

      this.isActivitySelected = !this.isActivitySelected;
    }

    // computed
    get currentDateArray(): number[] {
      const lastMonthBlank = [...Array((this.current.startDateObj as Date).getDay()).values()];
      const length = (this.current.endDateObj as Date).getDate();
      const nextMonthBlank = [...Array(6 - (this.current.endDateObj as Date).getDay()).values()];

      return lastMonthBlank.concat(
        Array.from({ length: length }, (d, i) => dateConvertor([this.current.year, this.current.month, i + 1])),
        nextMonthBlank,
      );
    }
  }
</script>

<style scoped>
  .spinner_wrapper {
    height: 500px;
  }
</style>
