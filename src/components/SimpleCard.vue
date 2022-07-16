<template>
  <div @click="showModal(data, 'activity')">
    <slot>
      <div class="card_img rounded-lg h-48 mb-6" :style="`background-image: url(${data.Picture.PictureUrl1}); background-size: cover;`"></div>

      <h2 class="card_title h2 text-center" @click="showModal(data, 'activity')">
        {{ data.ActivityName }}
      </h2>

      <h2 class="h2 text-center">{{ data.StartTime.slice(0, 10) }}</h2>
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
