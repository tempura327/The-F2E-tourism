<template>
  <div class="relative" :class="carouselClass">
    <div class="overflow-hidden relative h-56 sm:h-64 xl:h-80 2xl:h-96">
      <div class="ease-in-out relative top-1/2" v-for="(item, index) in carouselData" :key="`image-${index}`" :class="item.class">
        <span
          class="absolute z-10 top-1/2 left-1/2 text-2xl font-semibold text-white -translate-x-1/2 -translate-y-1/2 sm:text-3xl dark:text-gray-800"
          v-if="carouselConfig.isContentShow">
          {{ item.content }}
        </span>
        <img :src="item.image" class="block absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2" alt="..." />
      </div>
    </div>

    <!-- indicators -->
    <div class="flex absolute bottom-5 left-1/2 z-30 space-x-3 -translate-x-1/2">
      <button
        v-for="(i, index) in carouselData"
        :key="`carousel-${index}`"
        type="button"
        class="w-3 h-3 rounded-full"
        :class="count === index ? 'bg-yellow-100' : 'bg-white'"
        @click="slideTo(index)"></button>
    </div>

    <!-- control buttons -->
    <button
      @click="slideToPrevious"
      type="button"
      class="flex absolute top-0 left-0 z-30 justify-center items-center px-4 h-full cursor-pointer group focus:outline-none"
      data-carousel-prev>
      <span
        class="inline-flex justify-center items-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
        <svg class="w-5 h-5 text-white sm:w-6 sm:h-6 dark:text-gray-800" fill="none" stroke="#ffffff" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        <span class="hidden">Previous</span>
      </span>
    </button>

    <button
      @click="slideToNext"
      type="button"
      class="flex absolute top-0 right-0 z-30 justify-center items-center px-4 h-full cursor-pointer group focus:outline-none"
      data-carousel-next>
      <span
        class="inline-flex justify-center items-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
        <svg class="w-5 h-5 text-white sm:w-6 sm:h-6 dark:text-gray-800" fill="none" stroke="#ffffff" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
        <span class="hidden">Next</span>
      </span>
    </button>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator';

  @Component({
    components: {},
  })
  export default class SlideCarousel extends Vue {
    // props
    @Prop({
      default: () => {
        return { autoPlay: false, isContentShow: false, period: 3000 };
      },
    })
    carouselConfig!: { autoPlay: boolean; period: number };
    @Prop({ default: () => [] }) data!: {
      content: string;
      image: string;
      class: string;
    }[];
    @Prop() carouselClass!: string;

    // data
    carouselData: { content?: string; image: string; class?: string }[] = [];
    count = 0;

    // hooks
    created(): void {
      if (this.data.length > 0) {
        this.carouselData = this.data;
      }

      if (this.carouselConfig.autoPlay) {
        setInterval(() => {
          this.slideToNext();
        }, this.carouselConfig.period);
      }
    }

    // methods
    slideToPrevious(): void {
      this.changeClassToPrevious(this.count);

      this.count = this.count - 1 < 0 ? this.carouselData.length - 1 : this.count - 1;
    }
    slideToNext(): void {
      this.changeClassToNext(this.count);

      this.count = this.count + 1 > this.carouselData.length - 1 ? 0 : this.count + 1;
    }
    slideTo(index: number): void {
      const step = Math.abs(index - this.count);
      const method = index > this.count ? this.slideToNext : this.slideToPrevious;

      for (let i = 0; i < step; i++) {
        method();
      }
    }
    changeClassToPrevious(count: number): void {
      const targetIndex = count - 1 >= 0 ? count - 1 : this.carouselData.length - 1;

      // move target to left side
      this.carouselData[targetIndex].class = 'translate-100';

      setTimeout(() => {
        // then move it from left side to center.
        this.carouselData[targetIndex].class = 'duration-700 translate0';
        // move current one to right side.
        this.carouselData[count].class = 'duration-700 translate100';
      }, 0);
    }
    changeClassToNext(count: number): void {
      const targetIndex = count + 1 >= this.carouselData.length ? 0 : count + 1;

      // move target to right side
      this.carouselData[targetIndex].class = 'translate100';

      setTimeout(() => {
        // then move it from right side to center.
        this.carouselData[targetIndex].class = 'duration-700 translate0';
        // move current one to left side.
        this.carouselData[count].class = 'duration-700 translate-100';
      }, 0);
    }
  }
</script>

<style lang="scss" scoped>
  .translate-100 {
    transform: translateX(-100%);
  }

  .translate0 {
    transform: translateX(0);
  }

  .translate100 {
    transform: translateX(100%);
  }
</style>
