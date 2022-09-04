<template>
  <div @click="showModal(data, 'activity')">
    <slot>
      <div
        class="card_img rounded-lg h-48 mb-6"
        :style="`background-image: url(${data.Picture.PictureUrl1});  background-color:'gold'; background-size: cover;`"></div>

      <a :href="data.WebsiteUrl" target="_blank" class="card_title block text-center" :class="{ 'hover:text-primary': data.WebsiteUrl }">
        {{ data.ActivityName }}
      </a>

      <h2 class="h2 text-center">{{ data.StartTime.slice(0, 10) }} ~ {{ data.EndTime.slice(0, 10) }}</h2>
    </slot>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator';

  @Component
  export default class SimpleCard extends Vue {
    // props
    @Prop() data!: any;
    @Prop({ default: '' }) title!: string;
    @Prop({ default: '' }) imgSrc!: string;

    // data

    // methods
    showModal(data: any, type: string): void {
      this.$emit('showModal', data, type);
    }
  }
</script>
