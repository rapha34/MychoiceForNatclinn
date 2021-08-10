<template>
  <div>
    {{ getCriterionById(item.criterion).name }}
    <!-- <br :key="n" v-for="n in row" /> -->
  </div>
</template>

<script>
import { getCriterionById } from "@/store";
export default {
  props: ["item", "row"],
  methods: {
    getCriterionById
  }
};
</script>