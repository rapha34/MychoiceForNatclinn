<template>
  <v-container v-if="state.project && state.data" style="max-width: 1400px;">
    <Header />

    <v-card class="mt-2">
      <!-- Conteneur scrollable horizontalement -->
      <div style="overflow-x: auto;">
        <v-table class="properties-table" style="min-width: 1000px;">
          <thead>
            <tr>
              <th class="text-start">Criterion</th>
              <th class="text-start">Aim</th>
              <th class="text-start">Stakeholder</th>
              <th
                v-for="(alternativeId, index) in c_alternativesIds"
                :key="`alt-${index}`"
                class="text-center"
              >
                {{ getAlternativeById(alternativeId).name }}
              </th>
            </tr>
          </thead>
          <tbody>
            <StakeholderListRow
              v-for="(items, criterionId) in getNormalizedItemsByUniqueItemProp('criterion')"
              :key="`crit-${criterionId}`"
              :items="items"
              :property="getCriterionName(criterionId)"
            />
          </tbody>
        </v-table>
      </div>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import StakeholderListRow from "@/components/StakeholderList/StakeholderListRow.vue";
import Header from "@/components/Header.vue";
import {
  getNormalizedItemsByUniqueItemProp,
  getAlternativeById,
  c_alternativesIds,
  state,
  getCriterionName
} from "@/store";
import { defineComponent, ref, onMounted, onUpdated, onBeforeUnmount } from "vue";

export default defineComponent({
  props: {
    id: Number
  },
  setup() {
    const height = ref<number | null>(null);

    const setHeight = () => {
      const tableFilters = document.querySelector("[table-filters]");
      if (tableFilters) {
        const tableFiltersRect = tableFilters.getBoundingClientRect();
        height.value = window.innerHeight - tableFiltersRect.bottom - 24;
      }
    };

    onMounted(() => {
      setHeight();
      window.addEventListener("resize", setHeight);
    });

    onUpdated(setHeight);

    onBeforeUnmount(() => {
      window.removeEventListener("resize", setHeight);
    });

    return {
      state,
      height,
      c_alternativesIds,
      getCriterionName,
      getNormalizedItemsByUniqueItemProp,
      getAlternativeById,
      setHeight
    };
  },
  components: {
    Header,
    StakeholderListRow
  }
});
</script>

<style scoped>
.v-data-table thead th {
  text-transform: uppercase;
}
</style>
