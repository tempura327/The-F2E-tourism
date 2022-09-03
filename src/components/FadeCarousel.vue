<template>
  <div class="carousel" :class="carouselClass">
    <div class="carousel_slide">
      <div
        class="carousel_slide_item"
        v-for="(item, index) in carouselData"
        :key="`image-${index}`"
        :class="index === count ? 'opacity-1 duration-2000' : 'opacity-0 duration-2000'">
        <span class="carouse_slide_item_caption" v-if="config.isContentShow">
          {{ item.content }}
        </span>
        <img :src="item.image" class="carousel_slide_item_img" alt="..." />
      </div>
    </div>

    <!-- indicators -->
    <div class="carousel_indicator">
      <button
        v-for="(i, index) in carouselData"
        :key="`carousel-${index}`"
        type="button"
        class="w-3 h-3 rounded-full"
        :class="count === index ? 'bg-primary' : 'bg-white'"
        @click="changeTo(index)"></button>
    </div>

    <!-- control buttons -->
    <button @click="prev" type="button" class="carousel_control left-0" data-carousel-prev>
      <span class="carousel_control_content">
        <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="#ffffff" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        <span class="hidden">Previous</span>
      </span>
    </button>

    <button @click="next" type="button" class="carousel_control right-0" data-carousel-next>
      <span class="carousel_control_content">
        <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="#ffffff" viewBox="0 0 24 24">
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
  export default class FadeCarousel extends Vue {
    // props
    @Prop({
      default: () => {
        return { autoPlay: false, isContentShow: false, period: 3000 };
      },
    })
    config!: { autoPlay: boolean; isContentShow?: boolean; period: number };
    @Prop({ default: () => [] }) data!: {
      content?: string;
      image: string;
      class?: string;
    }[];
    @Prop() carouselClass!: string;

    // data
    count = 0;
    carouselData: { content?: string; image: string; class?: string }[] = [];

    // hook
    created(): void {
      if (this.data.length > 0) {
        this.carouselData = this.data;
      }

      if (this.config.autoPlay) {
        setInterval(() => {
          this.next();
        }, this.config.period);
      }
    }

    // methods
    prev(): void {
      this.count = this.count - 1 < 0 ? this.carouselData.length - 1 : this.count - 1;
    }
    next(): void {
      this.count = this.count + 1 > this.carouselData.length - 1 ? 0 : this.count + 1;
    }
    changeTo(index: number): void {
      const step = Math.abs(index - this.count);
      const method = index > this.count ? this.next : this.prev;

      for (let i = 0; i < step; i++) {
        method();
      }
    }
  }
</script>
