<template>
  <v-card
    
    tile
    class="flex-grow-1 white--text grey lighten-4"
  >
  <template v-if="state.project">
    <v-img
      class="align-center "
      height="300px"
      :src="`${getImagePath(state.project.image)}`"
    >
      <v-card-title class="display-1 mb-4 justify-center">{{
        state.project.name
      }}</v-card-title>
      <v-card-subtitle
        class="title font-weight-light pb-0 white--text justify-center text-center"
        >The alternatives discussed in the project are:
      </v-card-subtitle>
      <div class="text-center mt-0">
        <span
          class="title"
          v-for="(alternativeId, index) in alternativesIds"
          :key="alternativeId"        >
          <small v-if="index !== 0" class="font-weight-light caption mx-2"
            >VS</small
          >
          <v-icon dark>{{ getAlternatives[alternativeId].icon }}</v-icon>
          {{ getAlternatives[alternativeId].name }}
        </span>
        </div>
    </v-img>

    <div class="text-center  mt-n6 mb-3">
      <v-btn @click="switchToView('global-view')" x-large color="primary"
        >Open {{ state.project.name }} project</v-btn
      >
    </div>

    <v-container>
      <v-card-text class="text--primary d-flex justify-center">
        <p class="text-justify body-1	">
          {{ state.project.description }}
        </p>
      </v-card-text>

      <v-row>
        <v-col style="overflow-x:auto; text-align:center;">
        <div class="versus-list">
          <div
            class="versus-list__item"
            v-for="(alternativeId, index) in alternativesIds"
            :key="'card-' + alternativeId + index"
          >
            <div v-if="index !== 0" class="d-flex align-center mx-auto">
              <small
                
                class="grey--text text--lighten-1 font-weight-bold title px-6"
                >VS</small
              >
            </div>
            <v-card min-width="280" max-width="320" class outlined="">
              <v-list-item three-line>
                <v-list-item-content>
                  <!-- <div class="overline mb-4">OVERLINE</div> -->
                  <div class="title lh-1 mb-1 font-weight-bold">
                    <v-icon class="primary--text text--lighten-2" light>{{
                      getAlternatives[alternativeId].icon
                    }}</v-icon>
                    {{ getAlternatives[alternativeId].name }}
                  </div>
                  <!-- <v-list-item-subtitle v-if="state.data">
                        from
                        {{
                        getFilteredItemsBy({
                            alternative: alternativeId
                        }).length
                        }}
                        arguments
                    </v-list-item-subtitle> -->
                </v-list-item-content>

                <v-list-item-avatar size="56" color="grey">
                  <img
                    :src="
                      `${getImagePath(getAlternatives[alternativeId].image)}`
                    "
                  />
                </v-list-item-avatar>
              </v-list-item>

              <v-card-text>
                <p>
                  {{ getAlternatives[alternativeId].description }}
                </p>
              </v-card-text>
            </v-card>
          </div>
          
          

        </div>
        </v-col>
      </v-row>
      <v-row>
        <div class="disclaimer">
        <div class="title">Disclaimer</div>
        <ul class="caption">
          <li >The authors and publisher of the software cannot be held liable in any way for the consequences that may result from the use or interpretation of the information processed by the MyChoice software. In addition, the information entered is that of the users. Their quality conditions the quality of the final result. The user is solely responsible for the use made of the information as it results from the processing by the MyChoice software.
          </li> 
          <li>By using the MyChoice software, users agree to explicitly cite the tool (home page <a href="https://ico.iate.inra.fr/MyChoice/">https://ico.iate.inra.fr/MyChoice/</a> and associated publications indicated on the home page) in any communication using MyChoice, clearly indicating the contributions from the MyChoice software (in particular methods to structure and analyze arguments and associated data). The use of contributors' attributes (logo, brands, etc.) without explicit, duly formalized acceptance, is prohibited.
          </li> 
        </ul>
        </div>
      </v-row>
    </v-container>
  </template>
  <template v-if="!state.project">
    <Empty />
  </template>
  </v-card>
</template>

<script lang="ts">
import Empty from "@/components/Empty.vue"
import {
  state,
  alternativesIds,
  getAlternatives,
  getImagePath,
  getFilteredItemsBy,
  switchToView
} from "@/store";
import { defineComponent, computed } from "@vue/composition-api";
export default defineComponent ({
  setup() {    

    return {
      alternativesIds: computed(() => alternativesIds()),
      getAlternatives: computed(() => getAlternatives()),
      switchToView: function(routeName: string) {
        return switchToView(routeName);
      },
      getImagePath,
      getFilteredItemsBy,
      state
    }
  },
  components: {
    Empty
  }
});
</script>
