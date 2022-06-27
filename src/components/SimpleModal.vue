<template>
  <div :id="id" class="modal" v-if="isModalShow">
    <div class="modal_dialog">
      <div class="modal_dialog_title">{{ title }}</div>
      <div class="modal_dialog_body">
        <slot></slot>
      </div>
      <div class="modal_dialog_footer">
        <slot name="footer">
          <button @click="isModalShow = false">取消</button>
          <button @click="confirm">確認</button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator';

  @Component
  export default class SimpleModal extends Vue {
    // props
    @Prop({ default: '' }) title!: string;
    @Prop({ default: 'simple-modal' }) id?: string;

    // data
    isModalShow = false;

    // methods
    show(): void {
      this.isModalShow = true;
    }
    confirm(): void {
      this.isModalShow = false;
    }
    // methods
  }
</script>

<style lang="scss" scoped>
  // @import '@/style/app.scss';

  .modal {
    // @include sizeHelper(100vw, 100vh);
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    outline: 2px solid gold;

    &_dialog {
      width: 80%;
      padding: 16px;
      background: #fff;
      border-radius: 0.25rem;

      &_title {
        color: #6f7789;
        border-bottom: 1px solid #ccc;
      }
    }
  }
</style>
