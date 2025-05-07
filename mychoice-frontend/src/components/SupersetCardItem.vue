<template>
    <v-card :ripple="false" outlined @click="openMe(index)">
          <v-container fluid>
            <div class="d-flex">
              <div class="mb-5 overflow-hidden">
                <div :class="`caption ${!open[index] ? 'text-truncate' : ''}`">
                  <b v-if="is1stLevelStakeholdersMode">{{item.property}}</b>
                  <b v-else>by {{ getStakeholderName(item.stakeholder) }}</b>
                </div>
                <div :class="`caption ${!open[index] ? 'text-truncate' : ''}`">
                  <span :class="
            `font-weight-regular	  ${
              item.subOption === 1 ? 'green--text' : 'red--text'
            }`
          " v-if="is1stLevelStakeholdersMode">{{item.value}}</span>
                  <em v-else>in {{ item.source }}</em>
                </div>
              </div>

              <div class="ml-auto flex-shrink-0">
                <v-chip outlined x-small>{{duplicatesCount}}</v-chip>
                <v-btn icon>
                  <v-icon>
                    {{
                    open[index] ? "mdi-chevron-up" : "mdi-chevron-down"
                    }}
                  </v-icon>
                </v-btn>
              </div>
            </div>

            <div class="text--secondary body-1" v-if="!open[index]">{{ item.assertion }}</div>

            
            

            <v-expand-transition>
              <div v-show="open[index]">
                <div class="overline">Explanation</div>
                <p class="mb-5 body-1">{{ item.explanation }}</p>

                <div class="overline">Assertion</div>
                <p class="body-1 text--secondary">{{ item.assertion }}</p>

                <div v-if="item.date" class="text-right text--secondary caption">
                  <small>{{ formatDate(item.date) }}</small>
                </div>
              </div>
            </v-expand-transition>
          </v-container>
        </v-card>
</template>


<script>

import {
  getItemsBy,
  getCriterionById,
  getStakeholderById,
  getAlternativeName,
  getCriterionName,
  getStakeholderName,
  getAimName,
  addSupersetInSelection,
  unselectSuperset,
  removeSupersetInSelection,
  findSuperset,
  state,
  formatDate,
  getImagePath,
  is1stLevelStakeholdersMode
} from "@/store";
import { defineComponent } from "vue";
export default defineComponent({
  setup() {
    return {
      state,
      getImagePath,
      openMe(index) {
        this.open[index] = !this.open[index];
      },
      addSupersetInSelection,
      removeSupersetInSelection,
      unselectSuperset,
      findSuperset,
      getItemsBy,
      getCriterionById,
      getAlternativeName,
      getCriterionName,
      getStakeholderName,
      getAimName,
      formatDate,
      is1stLevelStakeholdersMode
    }
  },
  props: ["item", "index", "duplicatesCount"],
  data: () => ({
    open: [false],
    
  }),
  computed: {
    supersetItems: function() {
      return getItemsBy(this.superset);
    }
  },
  mounted() {
    this.open = this.supersetItems.map(() => false);
  }
});
</script>

<style>

</style>
