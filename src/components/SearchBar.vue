<template>
  <InputGroup :className="className">
    <template #input-group-prepend>
      <select name="type" id="type" class="group_input group_prepend" v-model="search.type" v-if="isSelectorShow">
        <option v-for="(item, index) in options" :value="item.value" :key="index">{{ item.label }}</option>
      </select>
    </template>

    <input v-model="search.keyword" class="group_input" :class="{ 'group_input-block': isBlock }" type="text" />

    <template #input-group-append>
      <button class="btn group_append" @click="searchClick">
        <font-awesome-icon class="text-white" icon="magnifying-glass" />
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
    @Prop({ default: '' }) className?: string;
    @Prop() defaultType!: string | number;
    @Prop({ default: false }) isSelectorShow!: boolean;
    @Prop({ default: true }) isBlock!: boolean;
    @Prop() options?: { value: number | string; label: string }[];

    // data
    search: { keyword: string; type: number | string } = {
      keyword: '',
      type: 20,
    };

    // hook
    created(): void {
      if (this.defaultType !== undefined) {
        this.search.type = this.defaultType;
      }
    }

    // methods
    searchClick(): void {
      this.$emit('searchClick', this.search);
    }
  }
</script>
