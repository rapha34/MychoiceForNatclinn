<template>
  <div class="d-flex flex-column align-center justify-center flex-grow-1" style="min-height: 100%;" v-if="isEmptyProject && !isLoading">
            <v-card color="transparent" class="text-center" elevation="0">
                <v-container>
                    <!-- <Menu />
                    <v-divider />
                    <RecentProjects /> -->
                    <h4 class="mb-5">
                        
                        <span v-if="!isSpreadsheet">{{getRouteProjectId}}</span>
                        
                        <a target="_blank" :href="getSpreadsheetLink(getRouteProjectId)" v-if="isSpreadsheet">{{getRouteProjectId}}</a>
                        <v-icon class="ml-2" v-if="isSpreadsheet">mdi-google-spreadsheet</v-icon>
                    </h4>

                    <v-btn @click="refreshProject">
                        <v-icon small class="mr-3">mdi-autorenew</v-icon>Refresh project
                    </v-btn>

                </v-container>
            </v-card>

        </div>
</template>

<script>
import { state, refreshProject, isLoading, isEmptyProject, getRouteProjectId, isSpreadsheet, getSpreadsheetLink } from "@/store";

import {defineComponent} from "@vue/composition-api"

export default defineComponent({
  setup() {
    return {
        getSpreadsheetLink,
        isSpreadsheet,
        getRouteProjectId,
      state,
      refreshProject,
      isLoading,
      isEmptyProject
    }
  }
});
</script>
