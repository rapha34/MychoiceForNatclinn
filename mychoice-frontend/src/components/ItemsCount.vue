<template>
  <v-chip outlined x-small :title="title">{{count}}</v-chip>
</template>

<script>
import { pluralize } from "@/store";
export default {
  props: ["count"],
  computed: {
    title() {
      return pluralize("{count} {argument:count}", {
        count: this.count
      });
    }
  }
};
</script>