<template>
  <!-- <v-chip outlined x-small :title="title">{{count}}</v-chip> -->
  <v-chip
    variant="outlined"
    size="x-small"
    color="default"
    title="title"
  >
    <strong>{{count}}</strong>
  </v-chip>
</template>

<script lang="ts">
import { pluralize } from "@/store";
import { computed, defineComponent } from "vue";
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