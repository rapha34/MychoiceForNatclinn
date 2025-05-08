<template>
  <tr
    @click="hasMany ? showDetails = !showDetails : ''"
    :key="`${property}-${criterionItems.length}-${aimItems.length}`"
  >
    <td>
      <a :name="`${property}`" :id="property"></a>
      <b>
        <text-highlight :searchWords="[state.searchInput]">{{ property }}</text-highlight>
      </b>
      <v-icon
        v-if="criterionItems.length > 1 || aimItems.length > 1"
      >{{showDetails ? 'mdi-chevron-up' : 'mdi-chevron-down'}}</v-icon>
    </td>

    <td>
      <template v-if="criterionItems.length > 1 && !showDetails">
        <div class="grey--text">
          <!-- {{`${pluralize('{count} {criterion:count}', {
          count: criterionItems.length,
          plural: 'criteria'
          })}`}}-->
          {{criterionItems.length}} criteria
        </div>
      </template>
      <template v-if="criterionItems.length <= 1 || (criterionItems.length > 1 && showDetails)">
        <template v-for="(item, index) in criterionItems" :key="index">
          <PropertiesListCriterion
            :item="item"
            :row="getAimsCountFromAimsAndCriterion(getAimsFromItems(items), item.criterion)"
          />
        </template>
      </template>
    </td>

    <td>
      <template v-if="aimItems.length > 1 && !showDetails">
        <div class="grey--text">{{aimItems.length}} aims</div>
      </template>
      <template v-if="aimItems.length <= 1 || (aimItems.length > 1 && showDetails)">
        <div :key="index" v-for="(argument, index) in aimItems">{{ getAimById(argument.aim).name }}</div>
      </template>
    </td>

    <td :key="index" v-for="(alternativeId, index) in c_alternativesIds">
      <template v-if="!showDetails">
        <div class="text-center">
          <Acceptability
            :items="filterItemsBy(items, {
                alternative: alternativeId
          })"
          />
        </div>
      </template>
      <template v-if="showDetails">
        <div class="text-center" :key="index" v-for="(item, index) in aimItems">
          <Acceptability
            :items="filterItemsBy(items, {
                alternative: alternativeId,
                aim: item.aim
          })"
          />
        </div>
      </template>
    </td>
  </tr>
</template>

<script lang="ts">
import { sortBy, uniqBy, countBy } from "lodash";
import {
  getAcceptabilityFromProCon,
  getSubOptionById,
  getCriterionById,
  getAimById,
  normalizeByAlternative,
  filterItemsBy,
  c_alternativesIds,
  getAimsCountFromAimsAndCriterion,
  getAimsFromItems,
  state
} from "@/store";
import { NormalizedArgument } from "@/@types";

import Acceptability from "@/components/Acceptability.vue";
import PropertiesListCriterion from "@/components/PropertiesList/PropertiesListCriterion.vue";
import { computed, defineComponent, ref, toRefs, PropType } from "vue";
export default defineComponent({

  props: {
    items: Array as PropType<NormalizedArgument[]>,
    property: {}
  },

  setup(props) {

    const {items, property} = toRefs(props);

    const showDetails = ref(false);

    const criterionItems = computed(() => {
      return uniqBy(items.value, "criterion");
    });
    const aimItems = computed(() => {
      return uniqBy(items.value, "aim");
    });

    const hasMany = computed(() => {
      return criterionItems.value.length > 1 || aimItems.value.length > 1;
    });

    return {
      state,
      c_alternativesIds,
      showDetails,

      criterionItems,
      aimItems,
      hasMany,

      getAimsCountFromAimsAndCriterion,
      getAimsFromItems,
      countBy,
      sortBy,
      getSubOptionById,
      getCriterionById,
      getAimById,
      getAcceptabilityFromProCon,
      normalizeByAlternative,
      filterItemsBy,
      uniqBy
    }
  },

  // data: () => ({
  //   state,
  //   showDetails: false
  // }),
  // computed: {
    
    
  // },
  components: {
    Acceptability,
    PropertiesListCriterion
  }
  // props: ["items", "property"],
  
});
</script>