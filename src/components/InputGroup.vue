<template>
  <div class="group">
    <slot name="input-group-prepend"></slot>

    <slot></slot>

    <slot name="input-group-append"></slot>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component
  export default class InputGroup extends Vue {
    // data
    // hook
    // methods
  }
</script>
