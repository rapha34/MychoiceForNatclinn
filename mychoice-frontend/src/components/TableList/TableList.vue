<template>
  <v-container fluid class="pa-0 fill-height d-flex flex-column">
    <div class="table-wrapper">
      <table class="custom-table">
        <thead>
          <TableListHead />
        </thead>
        <tbody>
          <template v-for="criterionId in c_criterionsIds" :key="`criterion-block-${criterionId}`">
            <tr
              v-for="(aim, index) in getAimsBy('criterion', criterionId)"
              :key="`aim-${criterionId}-${aim.id}`"
            >
              <TableListCriterion
                v-if="index === 0"
                v-show="getFilteredCriterions.includes(criterionId)"
                :aim="aim"
                :criterionId="criterionId"
              />
              <TableListAim v-show="getFilteredAims.includes(aim.id)" :aim="aim" />
              <template v-for="alternativeId in alternativesIds" :key="`alternative-block-${alternativeId}`">
                <TableListAlternative
                  v-show="getFilteredAims.includes(aim.id)"
                  v-for="subOptionId in subOptionsIds"
                  :key="`alternative-${alternativeId}-${subOptionId}`"
                  :aim="aim"
                  :criterionId="criterionId"
                  :alternativeId="alternativeId"
                  :subOptionId="subOptionId"
                  :alternativesIds="alternativesIds"
                  :subOptionsIds="subOptionsIds"
                />
              </template>
            </tr>
          </template>

          <template v-if="!getFilteredItems.length">
            <tr style="height:100%;" class="text-center">
              <td class="pt-10" :colspan="5 + alternativesIds.length">
                <b class="text-grey">
                  No results.
                  <br /><br />
                  <v-btn size="small" color="secondary" @click="clearAppFilters">clear filters</v-btn>
                </b>
              </td>
            </tr>
          </template>
        </tbody>
        <tfoot>
          <TableListFoot />
        </tfoot>
      </table>
    </div>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, onUnmounted, ref} from "vue";
import { sortBy } from "lodash";

import TableListHead from "./TableListHead.vue";
import TableListFoot from "./TableListFoot.vue";
import TableListAim from "./TableListAim.vue";
import TableListCriterion from "./TableListCriterion.vue";
import TableListAlternative from "./TableListAlternative.vue";

import {
  clearAppFilters,
  subOptionsIds,
  alternativesIds,
  criterionsIds,
  c_criterionsIds,
  aimsIds,
  getAimsBy,
  getAlternatives,
  getSubOptions,
  state,
  getFilteredCriterions,
  getFilteredItems,
  getFilteredAims
} from "@/store";

export default defineComponent({
  name: "TableList",
  components: {
    TableListCriterion,
    TableListHead,
    TableListFoot,
    TableListAlternative,
    TableListAim
  },
  setup() {
    
    const filteredCriterions = computed(() => getFilteredCriterions());
    const filteredItems = computed(() => getFilteredItems());
    const filteredAims = computed(() => getFilteredAims());

    const alternatives = computed(() => alternativesIds());
    const subOptions = computed(() => subOptionsIds());
    const criterions = computed(() => criterionsIds());
    const aims = computed(() => aimsIds());

    return {
      state,
      sortBy,
      getAimsBy,
      clearAppFilters,

      c_criterionsIds,

      getFilteredCriterions: filteredCriterions,
      getFilteredItems: filteredItems,
      getFilteredAims: filteredAims,

      alternativesIds: alternatives,
      subOptionsIds: subOptions,
      criterionsIds: criterions,
      aimsIds: aims,

      getAlternatives: computed(() => getAlternatives()),
      getSubOptions: computed(() => getSubOptions())
    };
  }
});
</script>

<style scoped>
.table-wrapper {
  height: 100%;
  overflow: auto;
  border: 1px solid #ccc;
  position: relative;
  flex: 1 1 auto;
}

/* Table */
.custom-table {
  border-collapse: separate;
  border-spacing: 0;
  width: 100vw;
  min-width: 100%;
}

/* Header sticky */
:deep(.custom-table thead th) {
  position: sticky;
  top: 0;
  background: white;
  z-index: 3;
  border-bottom: 2px solid #ccc;
  padding: 8px;
  text-align: center;
}

/* Footer sticky */
.custom-table tfoot td {
  position: sticky;
  bottom: -8px;
  background: white;
  z-index: 2;
  border-top: 2px solid #ccc;
  padding: 8px;
}

/* Cellules normales */
.custom-table td {
  padding: 8px;
  border-bottom: 1px solid #eee;
  border-right: 1px solid #eee;
}

.custom-table th {
  border-right: 1px solid #ccc;
}
</style>


