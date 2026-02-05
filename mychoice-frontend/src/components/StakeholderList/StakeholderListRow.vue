<template>

<!-- <tbody> -->
      <template v-for="(aimItem, aimIndex) in aimItems"  >
      <tr v-for="(stakeholderItem, stakeholderIndex) in uniqBy(
            filterItemsBy(items, {
              aim: aimItem.aim
            }),
            'stakeholder'
          )" :key="`stakeholder-${stakeholderIndex}-${aimIndex}`" >

        
        <td criterion v-if="aimIndex === 0 && stakeholderIndex === 0" :rowspan="uniqBy(
            filterItemsBy(items, {
              criterion: aimItem.criterion
            }),
            'stakeholder'
          ).length * aimItems.length" >
          

          <a :name="`${property}`" :id="property"></a>
          <Highlighter class="inline-block" :searchWords="[state.searchInput]" :text-to-highlight="property" />

        </td>

        <td aim v-if="stakeholderIndex === 0" :rowspan="uniqBy(
            filterItemsBy(items, {
              aim: aimItem.aim
            }),
            'stakeholder'
          ).length">

          
          <span >{{
              getAimById(aimItem.aim).name
            }}</span>
        </td>

        <td stakeholder>
          <b>{{ getStakeholderName(stakeholderItem.stakeholder) }}</b>
        </td>

        <td class="text-center" alternative :key="alternativeIndex" v-for="(alternativeId, alternativeIndex) in c_alternativesIds">
      
        
          <Acceptability
            :items="
              filterItemsBy(items, {
                alternative: alternativeId,
                aim: aimItem.aim,
                stakeholder: stakeholderItem.stakeholder
              })
            "
            :alternative="alternativeId"
            :icon="false"          
          />
        
      
        </td>



      </tr>
      </template>

    
<!-- 
    <td criterion>
      <a :name="`${property}`" :id="property"></a>
      <text-highlight class="inline-block" :searchWords"[state.searchInput]">{{
        property
      }}</text-highlight>
    </td>

    <td aim>
      <template>
        <div :key="index" v-for="(argument, index) in aimItems">
          <div
            class="inline-block"
            :key="index + stakeholderItem + stakeholderIndex"
            v-for="(stakeholderItem, stakeholderIndex) in uniqBy(
              filterItemsBy(items, {
                aim: argument.aim
              }),
              'stakeholder'
            )"
          >
            <span v-if="stakeholderIndex !== 0" v-html="'&#8291;'"></span>
            <span v-if="stakeholderIndex === 0">{{
              getAimById(argument.aim).name
            }}</span>
          </div>
        </div>
      </template>
    </td>

    <td stakeholder>
      <template v-for="(aimItem, aimIndex) in aimItems">
        <template>
          <div
            class="inline-block"
            :key="index + aimItem + aimIndex"
            v-for="(stakeholderItem, index) in uniqBy(
              filterItemsBy(items, {
                aim: aimItem.aim
                
              }),
              'stakeholder'
            )"
          >
            <b>{{ getStakeholderName(stakeholderItem.stakeholder) }}</b>
          </div>
        </template>
      </template>
    </td>

    <td alternative :key="index" v-for="(alternativeId, index) in c_alternativesIds">
      <template v-for="(aimItem, aimIndex) in aimItems">
        <div
          class="text-center"
          :key="index + aimItem + aimIndex"
          v-for="(stakeholderItem, index) in uniqBy(
            filterItemsBy(items, {
              aim: aimItem.aim
            }),
            'stakeholder'
          )"
        >
          <Acceptability
            :items="
              filterItemsBy(items, {
                alternative: alternativeId,
                aim: aimItem.aim,
                stakeholder: stakeholderItem.stakeholder
              })
            "
          />
        </div>
      </template>
    </td> -->
  
<!-- </tbody> -->
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
  state,
  getStakeholderName,
} from "@/store";
import { NormalizedArgument } from "@/@types";

import Acceptability from "@/components/Acceptability.vue";
import PropertiesListCriterion from "@/components/PropertiesList/PropertiesListCriterion.vue";
import { computed, defineComponent, toRefs, PropType } from "vue";
export default defineComponent({

  props: {
    items: Array as PropType<NormalizedArgument[]>,
    property: {
      type: String,
      required: true
    }
  },

  setup(props) {

    const {items, property} = toRefs(props)

    const stakeholderItems = computed(() => {
      return uniqBy(items.value, "stakeholder");
    })

    const criterionItems = computed(() => {
      return uniqBy(items.value, "criterion");
    })

    const aimItems = computed(() => {
      return uniqBy(items.value, "aim");
    })
    
    console.log("aimItems")
    console.log(aimItems.value)

    return {
      state,

      c_alternativesIds,

      stakeholderItems,
      criterionItems,
      aimItems,
      
      hasMany: computed(() => {
        return criterionItems.value.length > 1 || aimItems.value.length > 1;
      }),


      getStakeholderName,
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
    Acceptability
  },
  // props: ["items", "property"],
  // methods: {
    
  // }
});
</script>
