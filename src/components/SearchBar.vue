<template>
  <InputGroup>
    <template #input-group-prepend>
      <select name="type" id="type" class="group_input" v-model="search.type" v-if="isSelectorShow">
        <option v-for="(item, index) in options" :value="item.value" :key="index">{{ item.label }}</option>
      </select>
    </template>

    <input v-model="search.keyword" class="group_input" :class="{ 'group_input-block': isBlock }" type="text" />

    <template #input-group-append>
      <button class="btn" @click="searchClick">
        <img src="../assets/search.svg" alt="" />
      </button>
    </template>
  </InputGroup>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator';

  import InputGroup from '@/components/InputGroup.vue';

  @Component({
    components: {
      InputGroup,
    },
  })
  export default class SearchBar extends Vue {
    // props
    @Prop({ default: false }) isSelectorShow!: boolean;
    @Prop({ default: true }) isBlock!: boolean;
    @Prop() options?: { value: any; label: string }[];

    // data
    search: { keyword: string; type: any } = {
      keyword: '',
      type: 20,
    };
    // hook
    // methods
    searchClick(): void {
      this.$emit('searchClick', this.search);
    }
  }
</script>
