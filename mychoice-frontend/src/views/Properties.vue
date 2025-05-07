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
                v-for="(alternativeId, index) in c_alternativesIds"
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

    const height = ref(null)


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
