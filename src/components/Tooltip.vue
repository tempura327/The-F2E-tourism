<template>
  <div class="tooltip" v-show="isShow">
    <div class="tooltip_body">
      <slot name="control">
        <button @click="onCloseClick" class="ml-auto">
          <font-awesome-icon class="tooltip_body_close" icon="xmark" />
        </button>
      </slot>

      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator';

  @Component({ components: {} })
  export default class Tooltip extends Vue {
    // props
    @Prop({ default: false }) isShow!: boolean;

    // data

    // methods
    onCloseClick(): void {
      this.$emit('onCloseClick');
    }

    // watch
  }
</script>
