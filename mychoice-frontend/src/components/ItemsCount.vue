<template>
  <v-chip outlined x-small :title="title">{{count}}</v-chip>
</template>

<script lang="ts">
import { pluralize } from "@/store";
import { computed, defineComponent } from "@vue/composition-api";
export default defineComponent({
  props: ["count"],

  setup(props) {

    return {
      title: computed(() => {
        return pluralize("{count} {argument:count}", {
          count: props.count
        })
      })
    }

  }
  
});
</script>