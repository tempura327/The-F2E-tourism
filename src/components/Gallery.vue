<template>
  <div class="gallery" :class="galleryClass">
    <div
      v-for="(img, index) in images"
      :key="index"
      class="gallery_image"
      :class="{ 'gallery_image-current': currentImageIndex === index }"
      :style="`background-image:url(${img});`"
      @click="currentImageIndex = index"></div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator';

  @Component
  export default class Gallery extends Vue {
    // props
    @Prop({ default: [] }) images!: string[];
    @Prop({ default: '' }) galleryClass?: string;

    // data
    currentImageIndex = 0;

    // hook

    // computed
    get otherImages(): string[] {
      return this.images.slice(1, this.images.length);
    }
  }
</script>

<style lang="scss" scoped>
  .gallery {
    display: flex;

    &_image {
      height: 300px;
      flex-grow: 1;
      flex-basis: 24px;
      background-size: cover;
      background-position: center;
      filter: brightness(0.5);
      cursor: pointer;

      &-current {
        transition: all 0.8s;
        filter: brightness(1);
        flex-grow: 36;
      }
    }
  }
</style>
