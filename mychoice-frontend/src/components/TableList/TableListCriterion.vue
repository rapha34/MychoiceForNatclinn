<template>
  <td criterion :rowspan="getAimsBy('criterion', criterionId).length">
    <div class="d-flex flex-column justify-space-between text-break">
      <div>{{c_criterions[aim.criterion].name}}</div>
      <div class="mt-1 flex-grow-1 flex-wrap d-flex">
        <Acceptability
          :key="'citerion-alternative-'+index+criterionItems[alternativeId]"
          v-for="(alternativeId, index) in c_alternativesIds"
          class="mb-1 mr-1"
          :icon="true"
          :alternative="alternativeId"
          :items="criterionItems[alternativeId]"
        />

        <!-- <Acceptability :icon="true" :alternative="2" :items="criterionItems[2]" /> -->
      </div>
    </div>
    <ItemsCount :count="totalItems" />
  </td>
</template>


<script lang="ts">
import {
  getFilteredItemsBy,
  getAimsBy,
  c_criterions,
  getFilteredCriterions,
  c_alternativesIds
} from "@/store";
import ItemsCount from "@/components/ItemsCount.vue";
import Acceptability from "@/components/Acceptability.vue";
import { defineComponent, computed, PropType, toRefs } from "@vue/composition-api";
import { NormalizedAim, NormalizedArgument } from "@/@types";

export default defineComponent({

  props: {
    aim: {
      type: Object as PropType<NormalizedAim>
    },
    criterionId: {
      type: Number
    }

  },


  setup(props) {

    const {aim, criterionId} = toRefs(props)
  
    const criterionItems = computed(() => {
      let obj: {[key: string]: NormalizedArgument[]} = {};
      c_alternativesIds.value.forEach(alternativeId => {
        const items = getFilteredItemsBy({
          alternative: alternativeId,
          criterion: criterionId.value
        });

        
        obj[alternativeId] = items;

        // return {
        //   1: getFilteredItemsBy({
        //     alternative: 1,
        //     criterion: this.criterionId
        //   }),
        //   2: getFilteredItemsBy({
        //     alternative: 2,
        //     criterion: this.criterionId
        //   })
        // };
      });
      return obj;
    })


    return {

      getAimsBy,
      c_alternativesIds,
      criterionItems,

      totalItems: computed(()=> {
        return Object.values(criterionItems.value).reduce((acc, items) => {
          return acc + items.length;
        }, 0);
      }),

    
      c_criterions,
      getFilteredCriterions
    }

  },
  components: {
    Acceptability,
    ItemsCount
  }
  
  
});
</script>

