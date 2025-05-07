<template>
  <v-navigation-drawer v-model="state.drawer" fixed temporary hide-overlay>
    <v-list-item>
      <!-- <v-list-item-content> -->
        <v-list-item-title class="title">
          <router-link to="/">
            <img
              style="padding: 2rem 0; width:100%; margin:auto;"
              :src="state.baseUrl + 'logo-mychoice-color.svg'"
            />
          </router-link>
        </v-list-item-title>
      <!-- </v-list-item-content> -->
    </v-list-item>

    <v-divider />

    <v-list nav dense>
      <!-- <v-list-item-group> -->
      <v-item-group>  
        <v-list-item @click="handleLoadFile">
          <!-- <v-list-item-icon> -->
            <v-icon>mdi-upload</v-icon>
          <!-- </v-list-item-icon> -->
          <v-list-item-title>Open local project <small>(.xlsx)</small></v-list-item-title>
        </v-list-item>

        <v-list-item @click="state.openDialog = true">
          <!-- <v-list-item-icon> -->
            <v-icon>mdi-cloud-upload</v-icon>
          <!-- </v-list-item-icon> -->
          <v-list-item-title>Open online project</v-list-item-title>
        </v-list-item>
      </v-item-group>     
      <!-- </v-list-item-group> -->

      <v-list-item
        href="https://docs.google.com/spreadsheets/d/1Cj5tC6JyLQxCHdtZJ8d9_-FSV9UbHT7AGE3wrLEMlig/copy"
        target="_blank"
      >
        <!-- <v-list-item-icon> -->
          <v-icon>mdi-plus-circle-outline</v-icon>
        <!-- </v-list-item-icon> -->
        <!-- <v-list-item-content> -->
          <v-list-item-title>Create new project</v-list-item-title>
          <v-list-item-subtitle>from spreadsheet template</v-list-item-subtitle>
        <!-- </v-list-item-content> -->
      </v-list-item>
    </v-list>

    <v-divider />

    <!-- <v-subheader>Recent projects</v-subheader> -->
    <v-list-subheader>Recent projects</v-list-subheader>

    <v-card v-if="!hasRecentProjects" disabled flat tile>
      <v-card-subtitle>No recent projects</v-card-subtitle>
    </v-card>

    <v-list v-else subheader nav dense>
      <v-list-item
        v-for="(value, id) in recentProjects"
        :key="id"
        :to="getHrefFromTypeId({ type: value.type, id: value.id })"
      >
        <v-list-item-title>{{ value.name || value.id }}</v-list-item-title>
        <!-- <v-list-item-icon v-if="value.type === 'googlespreadsheet'"> -->
          <v-icon v-if="value.type === 'googlespreadsheet'">mdi-google-spreadsheet</v-icon>
        <!-- </v-list-item-icon> -->
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <div class="pa-2">
        <v-btn
          block
          color="red"
          class="white--text"
          @click="refreshProject"
          :disabled="!route.path.includes('project')"
        >
          <v-icon small class="mr-3">mdi-autorenew</v-icon>
          Refresh project
        </v-btn>
      </div>

      <v-list nav dense>
        <!-- <v-list-item-group> -->
        <v-item-group>  
          <v-list-item @click="state.aboutDialog = true">
            <v-list-item-title>About</v-list-item-title>
          </v-list-item>
        <!-- </v-list-item-group> -->
        </v-item-group> 
      </v-list>

      <v-divider />

      <v-footer class="flex-grow-1">
        <Version />
      </v-footer>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { defineComponent } from "vue";
import { useRoute } from "vue-router";
import Version from "@/components/Version.vue";
import {
  state,
  exportToCSV,
  getImagePath,
  openIco,
  openSpreadsheet,
  hasRecentProjects,
  refreshProject,
  recentProjects,
  getHrefFromTypeId,
  handleLoadFile,
  isExportableToCSV,
} from "@/store";

export default defineComponent({
  components: {
    Version,
  },
  setup() {
    const route = useRoute();

    return {
      state,
      route,
      recentProjects,
      hasRecentProjects,
      getHrefFromTypeId,
      handleLoadFile,
      isExportableToCSV,
      openIco,
      openSpreadsheet,
      getImagePath,
      exportToCSV,
      refreshProject,
    };
  },
});
</script>
