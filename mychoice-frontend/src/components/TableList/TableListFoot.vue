<template>
  <tr tablelistfoot>
    <th criterion-aim class="text-right" colspan="2">
      <v-container>
        <small class="text-grey" style="font-weight: normal;">
          Arguments:
          <b>{{ getFilteredItems.length }}/{{ getAllItems.length }}</b>
        </small>
      </v-container>
    </th>

    <!-- <template v-for="alternativeId in subOptionsIds" :key="`subOption-${alternativeId}`">
      <th
        alternative
        :colspan="subOptionsIds.length"
      > -->
    <template v-for="alternativeId in alternativesIds" :key="`subOption-${alternativeId}`">
      <th
        alternative
        :colspan=2
      >
        <table style="width: 90%;">
          <tr>
            <td class="text-left">
              <v-icon
                color="green"
                :title="
                  pluralize('{count} {argument:count}', {
                    count: getFilteredItemsBy({
                      alternative: alternativeId,
                      favorable: true
                    }).length
                  })
                "
              >
                mdi-emoticon-happy-outline
              </v-icon>
            </td>
            <td>
              Attitude: {{ totalAcceptability[alternativeId] }}
              <ScoreIcon
                :alternative="alternativeId"
                :score="totalAcceptability[alternativeId]"
              />
            </td>
            <td class="text-right">
              <v-icon
                color="red"
                :title="
                  pluralize('{count} {argument:count}', {
                    count: getFilteredItemsBy({
                      alternative: alternativeId,
                      favorable: false
                    }).length
                  })
                "
              >
                mdi-emoticon-sad-outline
              </v-icon>
            </td>
          </tr>
        </table>
      </th>
    </template>
  </tr>
</template>

<script>
// import Acceptability from "@/components/Acceptability.vue";
import ScoreIcon from "@/components/ScoreIcon.vue";
import {
  pluralize,
  alternativesIds,
  subOptionsIds,
  getSubOptions,
  getFilteredItemsBy,
  getWeightedAcceptability,
  getAcceptabilityFromAlternativeId,
  getFilteredItems,
  getAllItems,
  state
} from "@/store";
import { computed, defineComponent } from "vue";
export default defineComponent({
  setup() {

    return  {
      state,

      getAcceptabilityFromAlternativeId,
      getFilteredItemsBy,
      getWeightedAcceptability,
      pluralize,

      totalAcceptability: computed(() => {
        return getWeightedAcceptability(getFilteredItems());
      }),
      alternativesIds: computed(() => alternativesIds()),
      subOptionsIds: computed(() => subOptionsIds()),
      getSubOptions: computed(() => getSubOptions()),
      getFilteredItems: computed(() => getFilteredItems()),
      getAllItems: computed(() => getAllItems())
    }
  },
  
  components: {
    ScoreIcon
  }
});
</script>

<style>
/* Footer sticky */
.custom-table tfoot tr {
  display: table-cells; 
  position: sticky;
  bottom: 0;
  background: white;
  z-index: 1;
  border-top: 2px solid #ccc;
  padding: 8px;
}
</style>