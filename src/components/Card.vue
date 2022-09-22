<template>
  <div class="card">
    <slot name="card-image">
      <div class="card_img h-48" :style="`background-image: url(${data.Picture.PictureUrl1}); background-size: cover;`"></div>
    </slot>

    <slot>
      <div class="card_body">
        <div class="card_body_top">
          <h2 class="card_title mr-3">{{ data.ScenicSpotName }}</h2>

          <span class="card_type">
            <font-awesome-icon class="text-gray-blue ml-auto mr-2" :icon="['far', 'clock']" />
            {{ type }}
          </span>
        </div>

        <h4 class="flex items-center">
          <font-awesome-icon class="text-primary mr-2" icon="location-dot" />

          <span class="no-more-word">{{ data.Address }}</span>
        </h4>
        <div>
          <button class="btn btn-block" @click="showModal(data, 'attraction')">了解更多</button>
        </div>
      </div>
    </slot>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator';

  @Component
  export default class Header extends Vue {
    // props
    @Prop() data: any;

    // data

    // hook
    // created(): void {}

    // methods
    showModal(data: any, type: string): void {
      this.$emit('showModal', {
        data: data,
        type: type,
      });
    }

    // computed
    get type(): string {
      const match = this.data.OpenTime?.match(/24 hours/g);
      if (match === null) return this.data.OpenTime;
      return match.length === 7 ? '全天開放' : this.data.OpenTime;
    }
  }
</script>
