<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <h1 class="font-bold text-h1 text-primary mb-6">活動</h1>
        <h5 class="h5 text-gray font-bold mb-12">
          365天，各種活動任你玩。
          <br />
          等你一同來體驗這座生活的樂趣！
        </h5>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col">
        <Calendar></Calendar>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  import Calendar from '@/components/Calendar.vue';

  import query from '@/utility/queryHelper';

  @Component({
    components: {
      Calendar,
    },
  })
  export default class Activity extends Vue {}
</script>

<style lang="scss" scoped></style>
