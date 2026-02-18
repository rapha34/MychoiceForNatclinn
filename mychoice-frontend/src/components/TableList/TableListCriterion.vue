<template>
  <td class="criterion" :rowspan="getAimsBy('criterion', criterionId).length">
    <div class="d-flex flex-column justify-space-between text-break">
      <div>{{ c_criterions[aim.criterion].name }}</div>
      <div class="mt-1 flex-grow-1 flex-wrap d-flex">
        <Acceptability
          v-for="(alternativeId, index) in c_alternativesIds"
          :key="`criterion-alternative-${index}-${criterionItems[alternativeId]}`"
          class="mb-1 mr-1"
          :icon="true"
          :alternative="alternativeId"
          :items="criterionItems[alternativeId]"
        />
      </div>
    </div>
    <ItemsCount :count="totalItems" />
  </td>
</template>

<script lang="ts">
import { defineComponent, computed, PropType, toRefs } from "vue";
import { getFilteredItemsBy, getAimsBy, c_criterions, c_alternativesIds } from "@/store";
import ItemsCount from "@/components/ItemsCount.vue";
import Acceptability from "@/components/Acceptability.vue";
import type { NormalizedAim, NormalizedArgument } from "@/@types";

export default defineComponent({
  name: "TableListCriterion",

  components: {
    Acceptability,
    ItemsCount
  },

  props: {
    aim: {
      type: Object as PropType<NormalizedAim>,
      required: true
    },
    criterionId: {
      type: Number,
      required: true
    }
  },

  setup(props) {
    const { criterionId } = toRefs(props);

    const criterionItems = computed(() => {
      const result: Record<string, NormalizedArgument[]> = {};
      c_alternativesIds.value.forEach(alternativeId => {
        result[alternativeId] = getFilteredItemsBy({
          alternative: alternativeId,
          criterion: criterionId.value
        });
      });
      return result;
    });

    const totalItems = computed(() => {
      return Object.values(criterionItems.value).reduce((acc, items) => acc + items.length, 0);
    });

    return {
      c_criterions,
      c_alternativesIds,
      getAimsBy,
      criterionItems,
      totalItems
    };
  }
});
</script>

<style scoped>
.criterion {
  vertical-align: top;
  max-width: 150px;
  width: 150px;
}
</style>
