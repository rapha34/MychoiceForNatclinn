<template>
  <v-app-bar elevation="0" color="secondary" dark app>
    <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->

    <v-app-bar-nav-icon @click.stop="state.drawer = !state.drawer"></v-app-bar-nav-icon>
    <v-toolbar-title  class="d-flex align-center" style="width: calc(50% - 2px - 20px - (48px - 12px) - (132px / 2) - 48px); margin-right: 48px;" >
      <a v-if="state.project && isProjectRoute" style="text-overflow: ellipsis; display:block; overflow:hidden;" class="white--text" :title="state.project.name" @click="switchToView('project')">
        {{
        state.project.name
        }}
      </a>
      <v-tooltip v-if="state.project && isProjectRoute && state.spreadsheet" bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            target="_blank"
            :href="
              `${getSpreadsheetLink(state.spreadsheet)}`
            "
          >
            <v-icon v-on="on" title>mdi-google-spreadsheet</v-icon>
          </v-btn>
        </template>
        <span>Open Spreadsheet</span>
      </v-tooltip>
    </v-toolbar-title>

    <!-- <v-spacer v-if="!isProjectRoute" class="flex-grow-1 flex-shrink-1"></v-spacer> -->

    <div class="d-flex">
      <router-link to="/" class="logo-mychoice">
        <img :src="state.baseUrl + 'logo-mychoice.svg'" />
      </router-link>
    </div>
    <v-spacer class="flex-grow-1"></v-spacer>

    <div class="logo-inrae">
      <img :src="state.baseUrl + 'logo-inrae-white-transparent.png'" />
    </div>
  </v-app-bar>
</template>

<script>
import { state, switchToView, getSpreadsheetLink } from "@/store";
export default {
  data: () => ({
    state
  }),
  methods: {
    switchToView,
    getSpreadsheetLink
  },
  computed: {
    isProjectRoute: function() {
      return this.$route.path.includes("/project");
    }
  }
};
</script>
