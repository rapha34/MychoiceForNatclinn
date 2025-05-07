<template>
  <div>
    {{ getCriterionById(item.criterion).name }}
    <!-- <br :key="n" v-for="n in row" /> -->
  </div>
</template>

<script lang="ts">
import { getCriterionById } from "@/store";
import { defineComponent } from "vue";
export default defineComponent({

  props: {
    item: {},
    row: {}
  },

  setup() {

    return {
      getCriterionById
    }

  },
  // props: ["item", "row"],
  
});
</script>