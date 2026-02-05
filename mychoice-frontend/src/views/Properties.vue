<template>
  <v-container v-if="state.project && state.data" style="max-width: 1400px;">
    <Header />

    <v-card class="mt-2">
      <v-table class="properties-table" style="min-width: 1000px;">
        <thead>
          <tr>
            <th class="text-start">Property</th>
            <th class="text-start">Criterion</th>
            <th class="text-start">Aim</th>
            <th
              v-for="(alternativeId, index) in c_alternativesIds"
              :key="index"
              class="text-center"
            >
              {{ getAlternativeById(alternativeId).name }}
            </th>
          </tr>
        </thead>
        <tbody>
          <PropertyListRow
            v-for="(items, property) in getNormalizedItemsByUniqueItemProp('property')"
            :key="property"
            :items="items"
            :property="property"
          />
        </tbody>
      </v-table>
    </v-card>
  </v-container>
</template>



<script lang="ts">
import PropertyListRow from "@/components/PropertiesList/PropertyListRow.vue";
import Header from "@/components/Header.vue";
import {
  getNormalizedItemsByUniqueItemProp,
  getAlternativeById,
  c_alternativesIds,
  state
} from "@/store";
import { defineComponent, ref } from "vue";

export default defineComponent({
  // props: {
  //   id: Number
  // },

  setup(props) {

    const height = ref<number | null>(null)


    return {
      state,
      height,

      c_alternativesIds,


      setHeight: () => {
        const tableFilters = document.querySelector("[table-filters]");

        if (tableFilters) {
          const tableFiltersRect = tableFilters.getBoundingClientRect();
          height.value = window.innerHeight - tableFiltersRect.bottom - 24;
        }
      },
      getNormalizedItemsByUniqueItemProp,
      getAlternativeById
    }

  },
  
  // data: () => ({
  //   state,
  //   height: ""
  // }),
  components: {
    Header,
    PropertyListRow
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
  // methods: {
    
  // },
  // props: ["id"]
});
</script>

<style>
.v-data-table thead th {
  text-transform: uppercase;
}
</style>
