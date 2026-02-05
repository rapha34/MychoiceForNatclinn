<template>
  <v-card class="superset-card">
    <div class="d-flex" style="background: rgba(0,0,0,.7);position: relative;">
      <div
        class="card-background"
        :style="`background-image: url(${getImagePath(state.data.alternatives[superset.alternative].image)}); background-size: cover;`"
      ></div>

      <div class="mr-auto zi-front">
        <div class="subtitle-2 text-white text-uppercase">
          {{ getAlternativeName(superset.alternative) }}
        </div>
        <div class="font-weight-light text-white text-caption">
          {{ getCriterionName(superset.criterion) }}
        </div>
      </div>

      <div class="mx-4 my-4 zi-front">
        <v-icon style="color: white;" v-if="state.data">
          {{ state.data.alternatives[superset.alternative].icon }}
        </v-icon>
      </div>
    </div>

    <v-card-text>
      <div class="mt-0 mb-3 d-flex">
        <span class="mr-auto">{{ getAimName(superset.aim) }}</span>
        <v-icon class="ml-2" size="small">mdi-bullseye-arrow</v-icon>
      </div>

      <div>
        <div style="margin-bottom: -.33em;" class="title d-flex text-primary">
          <b v-if="is1stLevelStakeholdersMode">{{ getStakeholderName(superset.stakeholder) }}</b>
          <template v-else>
            <b>{{ superset.property }}</b>
            <v-icon
              :class="['ml-auto', superset.subOption === 1 ? 'text-success' : 'text-error']"
            >
              {{ state.icons.subOption[superset.subOption] }}
            </v-icon>
          </template>
        </div>

        <div
          v-if="!is1stLevelStakeholdersMode"
          :class="['title font-weight-regular', superset.subOption === 1 ? 'text-success' : 'text-error']"
        >
          {{ superset.value }}
        </div>
      </div>
    </v-card-text>

    <v-divider class="my-1" />

    <v-card-text>
      <v-list-subheader class="px-0" v-text="`Arguments (${supersetItems.length})`" />

      <div
        v-for="(items, index) in duplicateGroups"
        :key="index"
        class="mb-5 no-mb-last"
      >
        <SupersetCardItem
          :item="items[0]"
          :index="index"
          :duplicatesCount="items.length"
        />
      </div>
    </v-card-text>

    <v-divider />

    <template #actions>
      <v-btn
        v-if="!findSuperset(superset) && !compare"
        @click="addSupersetInSelection(superset)"
        class="mr-auto"
        variant="text"
        icon="mdi-plus-circle-outline"
      />

      <v-btn
        v-if="findSuperset(superset)"
        :class="compare ? 'mx-auto' : 'mr-auto'"
        color="secondary"
        @click="removeSupersetInSelection(superset)"
        variant="text"
      >
        <v-icon>
          {{ compare ? "mdi-close" : "mdi-plus-circle" }}
        </v-icon>
      </v-btn>

      <v-btn
        v-if="!compare"
        @click="unselectSuperset(superset)"
        variant="text"
        icon="mdi-close"
      />
    </template>
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
  getDuplicatesGroups,
  is1stLevelStakeholdersMode
} from "@/store";

import SupersetCardItem from './SupersetCardItem.vue';
import { defineComponent } from "vue";

export default defineComponent({
  components: { SupersetCardItem },
  props: ["superset", "compare"],

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
    };
  },

  computed: {
    supersetItems() {
      return getItemsBy(this.superset);
    },
    duplicateGroups() {
      return getDuplicatesGroups(this.supersetItems);
    }
  }
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
