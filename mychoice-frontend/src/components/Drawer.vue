<template>
  <v-navigation-drawer v-model="state.drawer" fixed temporary hide-overlay>
    <v-list-item>
      <!-- <v-list-item-avatar>
        <img style="width:100%;" :src="state.baseUrl + 'logo-mychoice-color.svg'" />
      </v-list-item-avatar>-->

      <v-list-item-content>
        <v-list-item-title class="title">
          <router-link to="/">
            <img
              style="padding: 2rem 0; width:100%; margin:auto;"
              :src="state.baseUrl + 'logo-mychoice-color.svg'"
            />
          </router-link>
        </v-list-item-title>
        <!-- <v-list-item-subtitle>Collective decision</v-list-item-subtitle> -->
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list nav dense>
      <v-list-item-group>
        <v-list-item
          :input-value="state.openDialog"
          @click="state.openDialog = true"
        >
          <v-list-item-icon>
            <v-icon>mdi-folder-open-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Open project</v-list-item-title>
        </v-list-item>
      </v-list-item-group>

      <v-list-item
        href="https://docs.google.com/spreadsheets/d/1Cj5tC6JyLQxCHdtZJ8d9_-FSV9UbHT7AGE3wrLEMlig/copy"
        target="_blank"
      >
        <v-list-item-icon>
          <v-icon>mdi-folder-plus-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Create new project</v-list-item-title>
          <v-list-item-subtitle>from spreadsheet template</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-subheader>Recent projects</v-subheader>
    <v-card v-if="!recentProjects.length" disabled="" flat tile>
      <v-card-subtitle>No recent projects</v-card-subtitle>
    </v-card>
    <v-list v-if="recentProjects.length" subheader nav dense>
      <v-list-item
        @click="value.id ? openSpreadsheet(value.id) : openIco(value.name)"
        :key="id"
        v-for="(value, id) in recentProjects"
      >
        
        <v-list-item-title>{{ value.name || value.id }}</v-list-item-title>
        <v-list-item-icon pos v-if="value.id">
          <v-icon>
            mdi-google-spreadsheet
          </v-icon>
        </v-list-item-icon>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>

    <!-- <v-list nav dense>
      <v-list-item-group class="my-5"> -->
    <!--    <v-select
          class
          hide-details
          append-icon="mdi-filter-variant"
          label="Mode"
          outlined
          block
          light
          dense
          :items="getSelectModes"
          v-model="state.mode"
        ></v-select>
      </v-list-item-group>

      <v-list-item-group active-class>
        <v-list-item :to="{ path: '/', query: $router.currentRoute.query }">
          <v-list-item-icon>
            <v-icon>mdi-table</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Global view</v-list-item-title>
        </v-list-item>

        <v-list-item :to="{ path: '/properties', query: $router.currentRoute.query }">
          <v-list-item-icon>
            <v-icon>mdi-format-list-bulleted</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Property view</v-list-item-title>
    </v-list-item>-->

    <!-- <v-list-item
            v-if="$router.currentRoute.query.spreadsheet"
            @click="exportToCSV($router.currentRoute.query.spreadsheet)"
          >
            <v-list-item-title>Export to CSV</v-list-item-title>
    </v-list-item>
    </v-list-item-group>
    </v-list> -->

    <template v-slot:append>
      
      <div class="pa-2">
        <v-tooltip color="info" top>
        <template v-slot:activator="{ on }">
          <div v-on="!isSpreadsheet ? on : ''">
        <v-btn
          block
          color="primary"
          class="white--text"
          @click="exportToCSV($router.currentRoute.query.spreadsheet)"
          :disabled="
            !isSpreadsheet || !$router.currentRoute.path.includes('project')
          "
        >
          <v-icon small class="mr-3">mdi-database-export-outline</v-icon>Export
          to CSV
        </v-btn>
          </div>
        </template>
        <span v-if="!isSpreadsheet">This feature is only available for Spreadsheets</span>
        </v-tooltip>
      </div>

      <div class="pa-2">
        <v-btn
          block
          color="red"
          class="white--text"
          @click="refreshProject"
          :disabled="!$router.currentRoute.path.includes('project')"
        >
          <v-icon small class="mr-3">mdi-autorenew</v-icon>Refresh project
        </v-btn>
      </div>

      <v-list nav dense>
        <v-list-item-group>
          <v-list-item
            :input-value="state.aboutDialog"
            @click="state.aboutDialog = true"
          >
            <v-list-item-title>About</v-list-item-title>
          </v-list-item>
          <!-- <v-list-item :input-value="state.creditsDialog" @click="state.creditsDialog = true">
            <v-list-item-title>Credits</v-list-item-title>
          </v-list-item>-->
        </v-list-item-group>
      </v-list>

      <v-divider></v-divider>

      <v-footer class="flex-grow-1">
        <Version></Version>
      </v-footer>
    </template>
  </v-navigation-drawer>
</template>

<script>
import {
  // clearApplicationCache,
  state,
  exportToCSV,
  getImagePath,
  openIco,
  openSpreadsheet,
  getRecentProjects,
  refreshProject
} from "@/store";
import Version from "@/components/Version.vue";

export default {
  components: {
    Version
  },
  data: () => ({
    state
  }),
  computed: {
    recentProjects() {
      return getRecentProjects();
    },
    isSpreadsheet() {
      return state.spreadsheet !== null ? true : false;
    }
    //   recentProjects() {
    //     const merge = {
    //       ...state.recentProjectNames,
    //       ...state.recentProjectSpreadsheets
    //     };
    //     return Object.keys(merge)
    //       .sort((a, b) => {
    //         return merge[b].date - merge[a].date;
    //       })
    //       .reduce((prev, curr, i) => {
    //         prev[i] = merge[curr];
    //         return prev;
    //       }, {});
    //   }
  },

  methods: {
    openIco,
    openSpreadsheet,
    getImagePath,
    exportToCSV,
    // clearApplicationCache,
    refreshProject
    // refresh: async () => {
    //   clearApplicationCache();
    //   await loadAll(this.$router.currentRoute);
    // }
  }
};
</script>
