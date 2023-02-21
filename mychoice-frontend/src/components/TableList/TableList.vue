<template>
  <!-- <div class="tablelist-overflow"> -->
  <table class="tablelist table">
    <thead>
      <!-- <TableListHead class="is-sticky-clone" /> -->
      <!-- <TableListHead class="is-sticky-reference" /> -->
      <TableListHead />
      <!-- <TableListHead /> -->
    </thead>
    <tfoot>
      <!-- <TableListFoot class="is-sticky-clone" /> -->
      <!-- <TableListFoot class="is-sticky-reference" /> -->
      <TableListFoot />
      <!-- <TableListFoot /> -->
    </tfoot>
    <tbody>
      <template v-for="criterionId in c_criterionsIds">
        <tr
          :key="`aim-${criterionId}-${index}`"
          v-for="(aim, index) in getAimsBy('criterion', criterionId)"
        >
          <TableListCriterion
            v-if="index === 0"
            v-show="getFilteredCriterions.includes(criterionId)"
            :aim="aim"
            :criterionId="criterionId"
          />
          <TableListAim v-show="getFilteredAims.includes(aim.id)" :aim="aim" />
          <template v-for="alternativeId in alternativesIds">
            <TableListAlternative
              v-show="getFilteredAims.includes(aim.id)"
              :key="`alternative-${alternativeId}-${subOptionId}`"
              v-for="subOptionId in subOptionsIds"
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
            <b class="grey--text">
              No results.
              <br />
              <br />
              <v-btn small color="secondary" @click="clearAppFilters()"
                >clear filters</v-btn
              >
            </b>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
  <!-- </div> -->
</template>

<script lang="ts">
import TableListHead from "./TableListHead.vue";
import TableListFoot from "./TableListFoot.vue";
import TableListAim from "./TableListAim.vue";
import TableListCriterion from "./TableListCriterion.vue";
import TableListAlternative from "./TableListAlternative.vue";

import { sortBy } from "lodash";

import { setStickyTable, handleStickyTableResize } from "./TableList";

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
import { computed, defineComponent } from "@vue/composition-api";

export default defineComponent({
  setup() {
    return {

      state,
      
      sortBy,
      getAimsBy,
      setStickyTable,
      handleStickyTableResize,
      clearAppFilters,

      c_criterionsIds,

      getFilteredCriterions: computed(() => getFilteredCriterions()),
      subOptionsIds: computed(() => subOptionsIds()),
      alternativesIds: computed(() => alternativesIds()),
      criterionsIds: computed(() => criterionsIds()),
      aimsIds: computed(() => aimsIds()),
      getAlternatives: computed(() => getAlternatives()),
      getSubOptions: computed(() => getSubOptions()),
      getFilteredItems: computed(() => getFilteredItems()),
      getFilteredAims: computed(() => getFilteredAims()),
      project: computed(() => state.project)
    }
  },
  
  
  mounted() {
    this.$nextTick(setStickyTable);
  },
  created() {
    window.addEventListener("resize", this.handleStickyTableResize);
  },
  destroyed() {
    window.removeEventListener("resize", this.handleStickyTableResize);
  },
  watch: {
    // project() {
    //   this.$forceUpdate();
    //   setStickyTable();
    // }
  },

  components: {
    TableListCriterion,
    TableListHead,
    TableListFoot,
    TableListAlternative,
    TableListAim
  }
});
</script>
