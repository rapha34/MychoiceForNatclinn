<template>
  <v-card superset class="superset-card">
    <div class="d-flex" style="background: rgba(0,0,0,.7);position: relative;">
      <div
        class="card-background"
        :style="`background-image: url(${getImagePath(state.data.alternatives[superset.alternative].image
            )}); background-size: cover;`"
      ></div>
      <div class="mr-auto zi-front">
        <v-card-title class="subtitle-2 white--text text-uppercase">
          {{
          getAlternativeName(superset.alternative)
          }}
        </v-card-title>
        <v-card-subtitle class="font-weight-light white--text">
          {{
          getCriterionName(superset.criterion)
          }}
        </v-card-subtitle>
      </div>
      <div class="mx-4 my-4 zi-front">
        <v-icon color="white" v-if="state.data">
          {{
          state.data.alternatives[superset.alternative].icon
          }}
        </v-icon>
      </div>
      <!-- <v-toolbar color="transparent" flat>
        <v-spacer></v-spacer>

        <v-btn
          @click="unselectSuperset(superset); addSupersetInSelection(superset)"
          text
          icon
          color="white"
        >
          <v-icon>mdi-plus-circle</v-icon>
        </v-btn>
        <v-btn @click="unselectSuperset(superset)" text icon color="white">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>-->
    </div>

    <v-card-text>
      <div class="mt-0 mb-3 d-flex">
        <span class="mr-auto">{{ getAimName(superset.aim) }}</span>
        <v-icon class="ml-2" small>mdi-bullseye-arrow</v-icon>
      </div>
      <div>
        <div style="margin-bottom: -.33em;" class="title d-flex text--primary">
          <b v-if="is1stLevelStakeholdersMode">{{getStakeholderName(superset.stakeholder)}}</b>
          <template v-else>
          <b>{{ superset.property }}</b>
          <v-icon
            :color="superset.subOption === 1 ? 'green' : 'red'"
            class="ml-auto"
          >{{ state.icons.subOption[superset.subOption] }}</v-icon>
          </template>
        </div>
        <div v-if="!is1stLevelStakeholdersMode"
          :class="
            `title font-weight-regular	  ${
              superset.subOption === 1 ? 'green--text' : 'red--text'
            }`
          "
        >{{ superset.value }}</div>
      </div>
    </v-card-text>

    <v-divider class="my-1" />
    <v-card-text>
      <!-- <v-subheader class="px-0" v-text="`Arguments (${supersetItems.length})`"></v-subheader> -->
      <v-list-subheader class="px-0" v-text="`Arguments (${supersetItems.length})`"></v-list-subheader>

      
      
      <div :key="index" v-for="(items, index) in duplicateGroups" class="mb-5 no-mb-last">

        <superset-card-item :item="items[0]" :index="index" :duplicatesCount="items.length" />
        
      </div>
      
    </v-card-text>
    <!-- explication (explanation) -> conclusion 'assertion' -->
    <v-divider />
    <v-card-actions>
      <v-btn
        @click="addSupersetInSelection(superset)"
        class="mr-auto"
        text
        icon
        v-if="!findSuperset(superset) && !compare"
      >
        <v-icon>mdi-plus-circle-outline</v-icon>
      </v-btn>
      <v-btn
        v-if="findSuperset(superset)"
        :class="compare ? 'mx-auto' : 'mr-auto'"
        color="secondary"
        @click="removeSupersetInSelection(superset)"
        text
        icon
      >
        <v-icon>{{ compare ? "mdi-close" : "mdi-plus-circle" }}</v-icon>
      </v-btn>
      <v-btn v-if="!compare" @click="unselectSuperset(superset)" text icon>
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
// import Vue from "vue";

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
  getDuplicatesGroups,
  is1stLevelStakeholdersMode
} from "@/store";
import SupersetCardItem from './SupersetCardItem.vue';
import { defineComponent } from "vue";
export default defineComponent({
  setup() {
    return {
      state,
      getImagePath,
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
  components: { SupersetCardItem },
  props: ["superset", "compare"],
  
  computed: {
    supersetItems: function() {
      
      return getItemsBy(this.superset);
    },
    duplicateGroups: function() {
      return getDuplicatesGroups(this.supersetItems)
    }
  },
  mounted() {
    
  },
  
});
</script>

<style>
.card-background {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center center;
  opacity: 0.3;
  z-index: 0;
}
.zi-front {
  z-index: 1;
  position: relative;
}
</style>
