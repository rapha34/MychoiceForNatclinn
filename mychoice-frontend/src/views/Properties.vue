<template>
  <v-container fluid v-if="state.project && state.data">
    <Header />

    <v-card class="mt-2">
      <v-simple-table class="properties-table" fixed-header :height="height">
        <template v-slot:default>
          <thead>
            <tr>
              <th>Property</th>
              <th>Criterion</th>
              <th>Aim</th>
              <th
                class="text-center"
                :key="index"
                v-for="(alternativeId, index) in alternativesIds"
              >
                {{ getAlternativeById(alternativeId).name }}
              </th>
            </tr>
          </thead>
          <tbody>
            <PropertyListRow
              :key="property"
              :items="items"
              :property="property"
              v-for="(items, property) in getNormalizedItemsByUniqueItemProp(
                'property'
              )"
            />
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </v-container>
</template>

<script>
import PropertyListRow from "@/components/PropertiesList/PropertyListRow.vue";
import Header from "@/components/Header.vue";
import {
  getNormalizedItemsByUniqueItemProp,
  getAlternativeById,
  alternativesIds,
  state
} from "@/store";

export default {
  data: () => ({
    state,
    height: ""
  }),
  components: {
    Header,
    PropertyListRow
  },
  computed: {
    alternativesIds
  },
  mounted() {
    this.$nextTick(this.setHeight);
  },
  updated() {
    this.$nextTick(this.setHeight);
  },
  created() {
    window.addEventListener("resize", this.setHeight);
  },
  destroyed() {
    window.removeEventListener("resize", this.setHeight);
  },
  methods: {
    setHeight() {
      const tableFilters = document.querySelector("[table-filters]");

      if (tableFilters) {
        const tableFiltersRect = tableFilters.getBoundingClientRect();
        this.height = window.innerHeight - tableFiltersRect.bottom - 24;
      }
    },
    getNormalizedItemsByUniqueItemProp,
    getAlternativeById
  },
  props: ["id"]
};
</script>

<style>
.v-data-table thead th {
  text-transform: uppercase;
}
</style>
