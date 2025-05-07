<template>
  <tr class="text-uppercase">
    <th criterion>Criterion</th>
    <th aim>Aim</th>
    <th
      alternative
      :key="`alternative-${alternativeId}`"
      v-for="alternativeId in alternativesIds"
      :colspan="subOptionsIds.length"
    >
      <v-icon v-if="state.data">{{state.data.alternatives[alternativeId].icon}}</v-icon>
      {{getAlternatives[alternativeId].name}}
    </th>
  </tr>
</template>


<script>
import {
  state,
  alternativesIds,
  subOptionsIds,
  getAlternatives,
  
} from "@/store";
import { computed, defineComponent } from "vue";
export default defineComponent({
  setup() {

    return {
      state,
      

      alternativesIds: computed(() => alternativesIds()),
      subOptionsIds: computed(() => subOptionsIds()),
      getAlternatives: computed(() => getAlternatives())

    }
  }
});
</script>