<template>
  <div class="tooltip flex flex-col rounded bg-white shadow-lg shadow-gray-80/30" :style="style" v-show="isShow">
    <slot name="control">
      <button @click="onCloseClick" class="ml-auto">
        <font-awesome-icon class="text-white ml-auto mb-2 hover:scale-150 cursor-pointer" icon="xmark" />
      </button>
    </slot>

    <slot></slot>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

  @Component({ components: {} })
  export default class Tooltip extends Vue {
    // props
    @Prop({ default: false }) isShow!: boolean;
    @Prop() position!: number[];

    // data
    style = '';

    // methods
    onCloseClick(): void {
      this.$emit('onCloseClick');
    }

    // watch
    @Watch('position')
    positionWatch(val: number[]): void {
      this.style = `top:${val[0]}px; left:${val[1]}px`;
    }

    // computed
    // get style(): string {
    //   console.log(this.position);
    //   return `top:${this.position[0]}; left:${this.position[1]}`;
    // }
  }
</script>

<style scoped>
  .tooltip {
    width: 460px;
    padding: 20px;
    position: absolute;
    z-index: 100;
  }
</style>
