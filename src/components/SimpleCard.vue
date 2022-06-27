<template>
  <div>
    <div class="mb-6 card" :style="`background-image: url(${imgSrc}); background-size: cover;`" @click="showModal(data, 'activity')"></div>
    <h2 class="card-title h2 text-center" @click="showModal(data, 'activity')">
      {{ title }}
    </h2>
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

<style scoped lang="scss">
  .card-title,
  .card {
    cursor: pointer;
  }

  .card-title:hover {
    color: #08a6bb;
  }

  .card {
    width: 100%;
    height: 324px;
    border-radius: 10px;
    box-shadow: 2px 2px 4px rgba(114, 142, 171, 0.1), -6px -6px 20px rgba(255, 255, 255, 0.6), 4px 4px 20px rgba(111, 140, 176, 0.41);
  }

  .card-img {
    width: 100%;
    height: 100%;
  }
</style>
