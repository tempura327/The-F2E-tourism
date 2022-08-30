<template>
  <div class="modal" v-show="isShow">
    <div class="modal_body" :class="[size, isShow ? 'modal-show' : '']">
      <slot name="control">
        <button @click="onCloseClick" class="ml-auto">
          <font-awesome-icon class="text-gray-80 ml-auto mb-2 hover:scale-150 cursor-pointer" icon="xmark" />
        </button>
      </slot>

      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

  @Component({ components: {} })
  export default class SimpleModal extends Vue {
    // props
    @Prop({ default: 'md' }) size!: number;
    @Prop({ default: false }) isShow!: boolean;
    @Prop() position!: number[];

    // data

    // methods
    onCloseClick(): void {
      this.$emit('onCloseClick');
    }

    // watch
    @Watch('isShow')
    showWatch(newVal: boolean): void {
      this.$store.commit('toggleModal', newVal);
    }
  }
</script>
