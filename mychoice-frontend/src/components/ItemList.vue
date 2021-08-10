<template>
  <div>
    <h1>{{ getPropById(pluralizedRouteName, id).name }}</h1>
    <div
      v-for="(item, index) in getUniqueItemsBy({ [routeName]: id }, 'property')"
      :key="`${index}-${item.id}`"
    >
      {{ item.property }}
    </div>
  </div>
</template>

<script>
import { getPropById, getUniqueItemsBy } from "@/store";
export default {
  props: ["id"],
  methods: {
    getPropById,
    getUniqueItemsBy
  },
  computed: {
    routeName: function() {
      return this.$router.currentRoute.name;
    },
    pluralizedRouteName: function() {
      return this.routeName + "s";
    }
  }
};
</script>
