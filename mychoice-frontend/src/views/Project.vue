<template>
  <v-card class="flex-grow-1 bg-grey-lighten-4">
    <template v-if="state.project">
      <v-img
        class="align-center my-v-img"
        max-height="300"
        width="100%"
        :src="getImagePath(state.project.image)"
        cover
      >
        <div class="d-flex flex-column align-center justify-center h-100 text-white text-center px-4">
          <h1 class="text-h3 mb-2">{{ state.project.name }}</h1>
          <div class="text-h6 font-weight-light mb-2">
            The alternatives discussed in the project are:
          </div>
          <div class="d-flex flex-wrap justify-center">
            <template v-for="(alternativeId, index) in alternativesIds" :key="alternativeId">
              <span v-if="index !== 0" class="mx-2 text-caption font-weight-light my-span-vs">VS</span>
              <div class="d-flex align-center mx-2">
                <v-icon class="me-1">{{ getAlternatives[alternativeId].icon }}</v-icon>
                <span>{{ getAlternatives[alternativeId].name }}</span>
              </div>
            </template>
          </div>
        </div>
      </v-img>

      <div class="text-center my-4 mt-n6">
        <v-btn @click="switchToView('global-view')" size="x-large" color="primary">
          Open {{ state.project.name }} project
        </v-btn>
      </div>

      <v-container style="max-width: 1200px;">
        <v-card-text class="text-primary text-center">
          <p class="text-body-1">
            {{ state.project.description }}
          </p>
        </v-card-text>

        <v-row>
          <v-col style="overflow-x: auto; text-align: center;">
            <div class="d-flex flex-wrap justify-center">
              <template v-for="(alternativeId, index) in alternativesIds" :key="'card-' + alternativeId + index">
                <div v-if="index !== 0" class="d-flex align-center mx-4">
                  <small class="text-grey-darken-1 font-weight-bold text-h6">VS</small>
                </div>

                <v-card min-width="280" max-width="320" class="mx-2 mb-4" variant="outlined">
                  <v-list-item>
                    <div class="text-h6 font-weight-bold mb-1">
                      <v-icon class="text-primary me-2">{{ getAlternatives[alternativeId].icon }}</v-icon>
                      {{ getAlternatives[alternativeId].name }}
                    </div>
                    <v-avatar size="56" color="grey">
                      <img :src="getImagePath(getAlternatives[alternativeId].image)" />
                    </v-avatar>
                  </v-list-item>
                  <v-card-text>
                    <p>{{ getAlternatives[alternativeId].description }}</p>
                  </v-card-text>
                </v-card>
              </template>
            </div>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <div class="mt-6">
              <h2 class="text-h6 font-weight-bold">Disclaimer</h2>
              <ul class="text-caption ps-4">
                <li>
                  The authors and publisher of the software cannot be held liable in any way for the consequences that may result from the use or interpretation of the information processed by the MyChoice software...
                </li>
                <li>
                  By using the MyChoice software, users agree to explicitly cite the tool (home page
                  <a href="https://ico.iate.inra.fr/MyChoice/" target="_blank">https://ico.iate.inra.fr/MyChoice/</a>)...
                </li>
              </ul>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </template>

    <template v-else>
      <Empty />
    </template>
  </v-card>
</template>

<script lang="ts">
import Empty from '@/components/Empty.vue';
import {
  state,
  alternativesIds,
  getAlternatives,
  getImagePath,
  getFilteredItemsBy,
  switchToView
} from '@/store';
import { defineComponent, computed } from 'vue';

export default defineComponent({
  components: {
    Empty,
  },
  setup() {
    return {
      state,
      getImagePath,
      getFilteredItemsBy,
      switchToView,
      alternativesIds: computed(() => alternativesIds()),
      getAlternatives: computed(() => getAlternatives()),
    };
  },
});
</script>

<style scoped>
img {
  object-fit: cover;
}
</style>
