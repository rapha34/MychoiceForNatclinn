<template>
  <td
    :class="getLabels().length ? '' : 'is-empty'"
    alternative
    :key="`${alternativeId}${subOptionId}`"
  >
  <template v-if="is1stLevelStakeholdersMode">
    
    <TableListCard
      v-for="(value, key) in getCardsByStakeholder()"
      :superset="{
        criterion: criterionId,
        aim: aim.id,
        alternative: alternativeId,
        subOption: subOptionId,
        stakeholder: Number(key)
      }"
      :key="`superset-${aim.id}-stakeholder-${key}`"
      
    />
  </template>
  <template v-else>
    <TableListCard
      v-for="(label, index) in getLabels()"
      :superset="{
        criterion: criterionId,
        aim: aim.id,
        alternative: alternativeId,
        subOption: subOptionId,
        property: label.property,
        value: label.value,
      }"
      :key="`superset-${label.property}-${label.value}-${index}`"
    />
  </template>
  </td>
</template>

<script>
import { getUniqueFilteredLabelsBy, getFilteredItemsBy, getFilteredItemsGroupByProp, is1stLevelStakeholdersMode } from "@/store";
import { sortBy } from "lodash";
import { defineComponent } from "@vue/composition-api";
import TableListCard from "./TableListCard";
export default defineComponent({
  setup() {
    return {
      is1stLevelStakeholdersMode
    }
  },
  components: {
    TableListCard
  },
  methods: {
    getLabels: function() {
      return sortBy(
        getUniqueFilteredLabelsBy({
          alternative: this.alternativeId,
          subOption: this.subOptionId,
          aim: this.aim.id,
          criterion: this.criterionId
        }),
        "property"
      );
    },
    getItems: function() {

      return getFilteredItemsBy({
        alternative: this.alternativeId,
          subOption: this.subOptionId,
          aim: this.aim.id,
          criterion: this.criterionId
      })

    },

    getCardsByStakeholder: function() {
      return getFilteredItemsGroupByProp({
        alternative: this.alternativeId,
          subOption: this.subOptionId,
          aim: this.aim.id,
          criterion: this.criterionId
      }, "stakeholder")
    }
  },
  props: ["alternativeId", "subOptionId", "aim", "criterionId"]
});
</script>
