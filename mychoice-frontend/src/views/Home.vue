<template>
  <div class="flex-grow-1 d-flex flex-column">
    <div class="flex-grow-1 d-flex flex-column">
      <!-- <v-container class="my-auto">
        <v-row class align="center" justify="center">
          <v-btn @click="state.openDialog = true">
            <v-icon class="mr-2">mdi-folder-open-outline</v-icon>Open project
          </v-btn>
        </v-row>
      </v-container>-->

      <v-container class="mb-auto">
        <v-row>
          <v-col cols="12">
            <v-row>
              <v-col>
                <img
                  style="padding: 2rem 0; width:100%; max-width: 240px;"
                  class="d-flex mr-auto"
                  :src="state.baseUrl + 'logo-mychoice-color.svg'"
                />
              </v-col>
            </v-row>
            <v-row justify="center" class="grey lighten-5">
              <v-col cols="12" sm="8" lg="8">           
                <b>MyChoice</b> is a web application supporting collective
                decision, designed by INRAE. The software enables project
                participants to:
                <ul class="mb-6">
                  <li>
                    Analyze, compare and assess stakeholders' attitudes towards
                    different alternatives.
                  </li>
                  <li>
                    Review explanatory arguments stemming from various sources
                    and reflecting different concerns.
                  </li>
                  <li>Explain the criteria, aims and features pursued.</li>
                  <li>Highlight potential synergies or competing concerns.</li>
                  <li>
                    Propose different modes of decision support (expert,
                    consensual, prospective, etc.).
                  </li>
                </ul>
                <br>
                <div  class align="center" justify="center">
                <video controls width="50%" height="30%">
                <source src="presentation_mychoice.mp4">
                Votre navigateur ne gère pas l'élément <code>video</code>.
                </video>
                </div>
                  
               
                <br>
                <h6 class="overline mb-2">References</h6>
                <ul class="caption">
                  <li>
                    Rallou Thomopoulos, Julien Cufi, Maxime Le Breton. A Generic
                    Software to Support Collective Decision in Food Chains and
                    in Multi-Stakeholder Situations.
                    <em>FoodSim 2020</em>, Sep 2020, Ghent, Belgium. (<a
                      href="https://hal.archives-ouvertes.fr/hal-02484363"
                      target="_blank"
                      >hal-02484363</a
                    >)
                  </li>
                  <li>
                    Rallou Thomopoulos. A practical application approach to
                    argumentation for multicriteria analysis and decision
                    support.
                    <em>EURO journal on decision processes</em>, Springer, 2018,
                    6 (3-4), pp.237-255. (<a
                      href="https://dx.doi.org/10.1007/s40070-018-0087-2"
                      target="_blank"
                      >10.1007/s40070-018-0087-2</a
                    >). (<a
                      href="https://hal.archives-ouvertes.fr/hal-01918020"
                      target="_blank"
                      >hal-01918020</a
                    >)
                  </li>
                </ul><br/>

                 <h6 class="overline mb-2">Disclaimer</h6>
                <div class="caption">                    
                  <ul>
                    <li>The authors and publisher of the software cannot be held liable in any way for the consequences that may result from the use or interpretation of the information processed by the MyChoice software. In addition, the information entered is that of the users. Their quality conditions the quality of the final result. The user is solely responsible for the use made of the information as it results from the processing by the MyChoice software.
                    </li> 
                    <li>By using the MyChoice software, users agree to explicitly cite the tool (home page <a href="https://ico.iate.inra.fr/MyChoice/">https://ico.iate.inra.fr/MyChoice/</a> and associated publications indicated on the home page) in any communication using MyChoice, clearly indicating the contributions from the MyChoice software (in particular methods to structure and analyze arguments and associated data). The use of contributors' attributes (logo, brands, etc.) without explicit, duly formalized acceptance, is prohibited.
                    </li> 
                  </ul>
                </div>
              </v-col>
              <!-- <v-divider vertical style="margin-left:-1px;" /> -->

              <v-col class="py-0" lg="4">
                <v-row>
                  <v-col class="d-flex" lg="12">
                    <v-row>
                      <v-col class="d-flex">
                    <v-btn
                      class="mx-auto my-auto"
                      @click="handleLoadFile"
                    >
                      <v-icon class="mr-2">mdi-upload</v-icon>Open local project
                    </v-btn>
                      </v-col>
                      <v-col class="d-flex">
                     <v-btn
                      class="mx-auto my-auto"
                      @click="state.openDialog = true"
                    >
                      <v-icon class="mr-2">mdi-cloud-upload</v-icon>Open
                      online project
                    </v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                  

                  <v-col lg="12">
                    <!-- <v-subheader>Recent projects</v-subheader> -->
                    <v-list-subheader>Recent projects</v-list-subheader>
                    <v-card :disabled="!recentProjects.length" flat tile>
                      <v-card-subtitle v-if="!recentProjects.length"
                        >No recent projects</v-card-subtitle
                      >
                      <!-- <v-skeleton-loader
                        boilerplate="false"
                        ref="skeleton"
                        type="list-item"
                        class="mx-auto"
                        loading="false"
                      ></v-skeleton-loader>-->
                      
                      <v-list v-if="recentProjects.length">
                        <v-list-item
                          :to="getHrefFromTypeId({type: value.type, id: value.id})
                          "
                          :key="'home-recent-' + projectName"
                          v-for="(value, projectName) in recentProjects"
                        >
                          <v-list-item-title>
                            {{ value.name || value.id }}
                          </v-list-item-title>
                          <!-- <v-list-item-icon pos v-if="value.type === 'googlespreadsheet'"> -->
                            <v-icon pos v-if="value.type === 'googlespreadsheet'">
                              mdi-google-spreadsheet
                            </v-icon>
                          <!-- </v-list-item-icon> -->
                          <v-spacer></v-spacer>
                  <v-list-item-action @click.stop>
                    <v-btn
                      icon
                      @click.stop.prevent="
                        removeFromRecentProjects(value.type, {id: value.id})
                      "
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-list-item-action>
                        </v-list-item>
                      </v-list>
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <!-- <v-row>
              <v-col cols="6">
                <OpenIcoField />
              </v-col>
              <v-col cols="6">
                <OpenSpreadsheetField />
              </v-col>
            </v-row>-->
          </v-col>
        </v-row>
        <v-row></v-row>
      </v-container>
      <v-footer>
        <Version />
      </v-footer>
    </div>
  </div>

  <!-- <div class="flex-grow-1">
    <v-card tile>
      <v-toolbar flat>
        <v-toolbar-title>Welcome My Choice</v-toolbar-title>
      </v-toolbar>
      <v-banner single-line :sticky="sticky">
        We can't save your edits while you are in offline mode.
        <template v-slot:actions>
          <v-btn text color="deep-purple accent-4">Get Online</v-btn>
        </template>
      </v-banner>
    </v-card>
    <v-container>
      <OpenDialog class></OpenDialog>
    </v-container>
  </div>-->
</template>

<script>
// import OpenIcoField from "@/components/Open/OpenIcoField.vue";
// import OpenSpreadsheetField from "@/components/Open/OpenSpreadsheetField.vue";
import Version from "@/components/Version.vue";
import { state, openSpreadsheet, openIco, getRecentProjects, recentProjects, getHrefFromTypeId,removeFromRecentProjects, handleLoadFile } from "@/store";
import { defineComponent } from "vue";
export default defineComponent({
  setup() {

    return {
      state,
      recentProjects,
      getHrefFromTypeId,
      removeFromRecentProjects,
      handleLoadFile
    }

  },
  
  components: {
    Version
    // OpenIcoField,
    // OpenSpreadsheetField
  }
  
});
</script>
