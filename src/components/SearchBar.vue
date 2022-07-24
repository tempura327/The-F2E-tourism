<template>
  <InputGroup>
    <template #input-group-prepend>
      <select name="type" id="type" v-model="search.type">
        <option value="">全部</option>
        <option value="attraction">景點</option>
        <option value="activity">活動</option>
      </select>
    </template>

    <input v-model="search.keyword" class="group_input" type="text" />

    <template #input-group-append>
      <button class="btn" @click="searchClick">
        <img src="../assets/search.svg" alt="" />
      </button>
    </template>
  </InputGroup>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  import InputGroup from '@/components/InputGroup.vue';

  @Component({
    components: {
      InputGroup,
    },
  })
  export default class SearchBar extends Vue {
    // data
    search: { keyword: string; type: string } = {
      keyword: '',
      type: '',
    };
    // hook
    // methods
    searchClick(): void {
      this.$emit('searchClick', this.search);
    }
  }
</script>
