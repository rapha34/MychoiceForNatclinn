<template>
  <div class="page-bg bg-grey-lighten-4">
    <div class="page-container page-container--home">
      <v-row class="page-row py-6" justify="center">
        <!-- Colonne principale avec texte et vidéo -->
        <v-col cols="12" sm="8" lg="8">
          <v-sheet elevation="0" class="pa-0" max-width="100%">
            <!-- Logo -->
            <div class="text-left mb-6">
              <img
                :src="state.baseUrl + 'logo-mychoice-color.svg'"
                style="max-width: 240px; width: 100%;"
                alt="MyChoice Logo"
              />
            </div>

            <!-- Présentation -->
            <p>
              <b>MyChoice</b> is a web application supporting collective decision,
              designed by INRAE. The software enables project participants to:
            </p>
            <ul>
              <li>Analyze, compare and assess stakeholders' attitudes towards different alternatives.</li>
              <li>Review explanatory arguments stemming from various sources and reflecting different concerns.</li>
              <li>Explain the criteria, aims and features pursued.</li>
              <li>Highlight potential synergies or competing concerns.</li>
              <li>Propose different modes of decision support (expert, consensual, prospective, etc.).</li>
            </ul>

            <!-- Vidéo responsive plus petite et centrée -->
            <div class="my-6 d-flex justify-center">
              <v-responsive
                aspect-ratio="16/9"
                style="max-width: 600px; width: 100%;"
              >
                <video controls style="width: 100%; height: 100%;">
                  <source src="presentation_mychoice.mp4" />
                  Your browser does not support the <code>video</code> element.
                </video>
              </v-responsive>
            </div>


            <!-- Références -->
            <h6 class="text-overline mb-2">References</h6>
            <ul class="text-caption">
              <li>
                Rallou Thomopoulos, Julien Cufi, Maxime Le Breton. A Generic Software to Support Collective Decision in Food Chains and in Multi-Stakeholder Situations.
                <em>FoodSim 2020</em>, Sep 2020, Ghent, Belgium.
                (<a href="https://hal.archives-ouvertes.fr/hal-02484363" target="_blank">hal-02484363</a>)
              </li>
              <li>
                Rallou Thomopoulos. A practical application approach to argumentation for multicriteria analysis and decision support.
                <em>EURO journal on decision processes</em>, Springer, 2018, 6 (3-4), pp.237-255.
                (<a href="https://dx.doi.org/10.1007/s40070-018-0087-2" target="_blank">10.1007/s40070-018-0087-2</a>)
                (<a href="https://hal.archives-ouvertes.fr/hal-01918020" target="_blank">hal-01918020</a>)
              </li>
            </ul>

            <!-- Disclaimer -->
            <h6 class="text-overline mt-6 mb-2">Disclaimer</h6>
            <div class="text-caption">
              <ul>
                <li>
                  The authors and publisher of the software cannot be held liable for the consequences resulting from the use of MyChoice. Information entered is the user's responsibility and affects the final result.
                </li>
                <li>
                  Users agree to cite the tool in any communication and not use contributor branding without explicit consent.
                </li>
              </ul>
            </div>
          </v-sheet>
        </v-col>

        <!-- Colonne actions (boutons et projets récents) -->
        <v-col lg="4" py="0" class="d-none d-lg-flex">
          <v-sheet elevation="0">
            <v-row>
              <v-col cols="12" class="d-flex justify-center mb-4">
                <v-btn @click="handleLoadFile" prepend-icon="mdi-upload">
                  Open local project
                </v-btn>
              </v-col>
              <v-col cols="12" class="d-flex justify-center mb-4">
                <v-btn @click="state.openDialog = true" prepend-icon="mdi-cloud-upload">
                  Open online project
                </v-btn>
              </v-col>
              <v-col cols="12">
                <v-list-subheader>Recent projects</v-list-subheader>
                <v-card flat>
                  <v-card-text v-if="!recentProjects.length" class="text-grey">No recent projects</v-card-text>
                  <v-list v-else density="compact">
                    <v-list-item
                      v-for="(value, projectName) in recentProjects"
                      :key="'home-recent-' + projectName"
                      :to="getHrefFromTypeId({ type: value.type, id: value.id })"
                    >
                      <v-list-item-title>
                        {{ value.name || value.id }}
                      </v-list-item-title>
                      <template #append>
                        <v-icon v-if="value.type === 'googlespreadsheet'">mdi-google-spreadsheet</v-icon>
                        <v-btn
                          icon="mdi-close"
                          variant="text"
                          size="small"
                          @click.stop.prevent="removeFromRecentProjects(value.type, { id: value.id })"
                        />
                      </template>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-col>
            </v-row>
          </v-sheet>
        </v-col>
      </v-row>
    </div>

    <!-- Version en bas de page -->
    <!-- <v-row class="mt-6">
      <Version />
    </v-row> -->
    
    <footer class="v-footer v-theme--mychoiceTheme" style="height: auto;">  
      <Version />
    </footer>
  </div>
</template>


<script>
import Version from "@/components/Version.vue";
import {
  state,
  getRecentProjects,
  recentProjects,
  getHrefFromTypeId,
  removeFromRecentProjects,
  handleLoadFile
} from "@/store";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    Version
  },
  setup() {
    return {
      state,
      recentProjects,
      getHrefFromTypeId,
      removeFromRecentProjects,
      handleLoadFile
    };
  }
});
</script>
