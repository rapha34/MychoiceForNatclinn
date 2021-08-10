<template>
  <v-card class="text-center">
    <v-card-title class="justify-center">About MyChoice</v-card-title>
    <v-card-text>
      <b>MyChoice</b> is a web application supporting collective decision,
      designed by INRAE.
    </v-card-text>

    <!-- <v-card-subtitle class="subtitle-1">Credits</v-card-subtitle> -->
    <v-card-text>
      <div>
        <v-divider class="my-2" />

        <v-card-subtitle class="p-0">Scientific contacts</v-card-subtitle>

        <!-- <v-row>
      <v-subheader>Credits</v-subheader>
    </v-row>-->

        <v-row>
          <v-col>
            <b>
              <a href="mailto:rallou.thomopoulos@inrae.fr"
                >Rallou Thomopoulos</a
              >
            </b>
            <br />
            <small>INRAE (IATE lab) / INRIA (GraphIK lab)</small>
          </v-col>
          <v-col>
            <b>
              <a href="mailto:julien.cufi@inrae.fr">Julien Cufi</a>
            </b>
            <br />
            <small>INRAE (IATE lab)</small>
          </v-col>
        </v-row>
        <v-divider class="my-2" />
        <v-card-subtitle>UX &amp; front-end development</v-card-subtitle>

        <v-row>
          <v-col>
            <b>
              <a href="https://maximelebreton.com" target="_blank"
                >Maxime Le Breton</a
              >
            </b>
            <br />
            <small
              >Independent designer &amp;&nbsp;front-end&nbsp;developer</small
            >
          </v-col>
        </v-row>

        <v-divider class="my-2" />
        <v-card-subtitle>Other contributors</v-card-subtitle>

        <v-row>
          <v-col>
            <b>
              Thomas Bosch
            </b>
            <br />
            <small>Former student at IATE lab</small>
          </v-col>
        </v-row>

        <v-divider class="my-2" />
        <v-row>
          <v-col>
            <a :href="state.baseUrl + 'licenses.txt'" target="_blank"
              >Open source licenses</a
            >
          </v-col>
          <v-col>
            <a :href="state.baseUrl + 'Open_source_license_terms.pdf'" target="_blank"
              >Open source licenses terms</a
            >
          </v-col>
        </v-row>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { state } from "@/store";
export default {
  data: () => ({
    state
  })
};
</script>
