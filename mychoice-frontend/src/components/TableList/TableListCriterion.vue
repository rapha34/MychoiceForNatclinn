<template>
  <td criterion :rowspan="getAimsBy('criterion', criterionId).length">
    <div class="d-flex flex-column justify-space-between text-break">
      <div>{{getCriterions[aim.criterion].name}}</div>
      <div class="mt-1 flex-grow-1 flex-wrap d-flex">
        <Acceptability
          :key="'citerion-alternative-'+index+criterionItems[alternativeId]"
          v-for="(alternativeId, index) in alternativesIds"
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


<script>
import {
  getFilteredItemsBy,
  getAimsBy,
  getCriterions,
  getFilteredCriterions,
  alternativesIds
} from "@/store";
import ItemsCount from "@/components/ItemsCount.vue";
import Acceptability from "@/components/Acceptability.vue";

export default {
  components: {
    Acceptability,
    ItemsCount
  },
  methods: {
    getAimsBy
  },
  computed: {
    alternativesIds,
    totalItems: function() {
      return Object.values(this.criterionItems).reduce((acc, items) => {
        return acc + items.length;
      }, 0);
    },
    criterionItems: function() {
      let obj = {};
      this.alternativesIds.forEach(alternativeId => {
        const items = getFilteredItemsBy({
          alternative: alternativeId,
          criterion: this.criterionId
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
    },
    getCriterions,
    getFilteredCriterions
  },
  props: ["criterionId", "aim"]
};
</script>

