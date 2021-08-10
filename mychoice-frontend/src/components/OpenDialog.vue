<template>
  <v-row>
    <v-col>
      <h3>From INRAE's server</h3>
      <v-row>
        <v-col cols="12" class>
          <v-form
            @submit.prevent="
              handleOpenIco(state.fields.projectName);
              state.openDialog = false;
            "
          >
            <v-combobox
              :items="
                Object.entries(state.recentProjectNames).map(
                  ([text, value]) => ({
                    text: value.name,
                    value: value.name
                  })
                )
              "
              item-text="text"
              item-value="value"
              label="Project name"
              id="comboprojectname"
              autocomplete="off"
              :search-input.sync="state.fields.projectName"
              outlined
            >
              <template v-slot:item="{ index, item }">
                <v-list-item @click="handleOpenIco(item.value)">
                  <v-list-item-title>{{ item.text }}</v-list-item-title>
                  <v-spacer></v-spacer>
                  <v-list-item-action @click.stop>
                    <v-btn
                      icon
                      @click.stop.prevent="
                        removeFromRecentProjectNames(item.text)
                      "
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </template>
            </v-combobox>

            <!-- <v-text-field
              outlined
              clearable
              hide-details=""
              v-model="projectName"
              label="Project name"
              class="mb-0"
            ></v-text-field>

            <v-list subheader dense="" class="">
              <template v-for="(value, name) in state.recentProjectNames">
                <v-list-item @click="openIco(value)" :key="name">
                  <v-list-item-content>
                    <v-list-item-title v-text="value"></v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-btn icon @click="removeFromRecentProjectNames(value)">
                      <v-icon small color="grey lighten-1">
                        mdi-close
                      </v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </template>
            </v-list>-->

            <v-btn
              class="ml-auto d-flex"
              color="secondary"
              :disabled="!state.fields.projectName"
              type="submit"
              >Open from Ico</v-btn
            >
          </v-form>
        </v-col>
      </v-row>
      <v-divider class="mt-3 mb-6"></v-divider>
      <h3>From public Google Spreadsheet</h3>
      <v-row>
        <v-col cols="12" class>
          <v-form
            @submit.prevent="
              handleOpenSpreadsheet(state.fields.spreadsheetUrl);
              state.openDialog = false;
            "
          >
            <v-combobox
              :items="
                Object.entries(state.recentProjectSpreadsheets).map(
                  ([text, value]) => ({
                    text: value.name,
                    value: value.id
                  })
                )
              "
              item-text="text"
              item-value="value"
              label="Spreadsheet URL or ID"
              id="combospreadsheets"
              autocomplete="off"
              :search-input.sync="state.fields.spreadsheetUrl"
              :messages="[`${spreadsheetId}`]"
              outlined
            >
              <template v-slot:item="{ index, item }">
                <v-list-item @click="handleOpenSpreadsheet(item.value)">
                  <v-list-item-title>{{ item.text }}</v-list-item-title>
                  <v-list-item-subtitle>{{ item.value }}</v-list-item-subtitle>
                  <v-spacer></v-spacer>
                  <v-list-item-action @click.stop>
                    <v-btn
                      icon
                      @click.stop.prevent="
                        removeFromRecentProjectSpreadsheets(item.text)
                      "
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </template>
              <v-icon :color="spreadsheetId ? 'green' : ''" slot="append"
                >mdi-google-spreadsheet</v-icon
              >
            </v-combobox>

            <!-- <v-text-field
              outlined
              clearable
              :messages="[`${spreadsheetId}`]"
              v-model="spreadsheetUrl"
              label="Spreadsheet URL"
              class="mb-1"
            >
              <v-icon :color="spreadsheetId ? 'green' : ''" slot="append"
                >mdi-google-spreadsheet</v-icon
              >
            </v-text-field>-->

            <!-- <v-list subheader dense="" class="">
              <template
                v-for="(value, name) in state.recentProjectSpreadsheets"
              >
                <v-list-item @click="openSpreadsheet(value)" :key="name">
                  <v-list-item-content>
                    <v-list-item-title v-text="name"></v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-btn
                      icon
                      @click="removeFromRecentProjectSpreadsheets(name)"
                    >
                      <v-icon small color="grey lighten-1">
                        mdi-close
                      </v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </template>
            </v-list>-->

            <v-btn
              class="d-flex ml-auto"
              type="submit"
              color="secondary"
              :disabled="!spreadsheetId"
              >Open from Spreadsheet Url</v-btn
            >
          </v-form>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import {
  loadAll,
  state,
  getSpreadsheetIdFromUrl,
  spreadsheetIdRouteQuery,
  projectNameRouteQuery,
  removeFromRecentProjectNames,
  removeFromRecentProjectSpreadsheets,
  openIco,
  openSpreadsheet
} from "@/store";
export default {
  data: () => ({
    state
  }),

  computed: {
    spreadsheetId() {
      return state.fields.spreadsheetUrl
        ? getSpreadsheetIdFromUrl(state.fields.spreadsheetUrl)
        : "";
    }
  },
  methods: {
    removeFromRecentProjectSpreadsheets,
    removeFromRecentProjectNames,
    handleOpenIco: async function(value) {
      await openIco(value);
      state.fields.projectName = "";
    },
    handleOpenSpreadsheet: async function(value) {
      await openSpreadsheet(value);
      state.fields.spreadsheetUrl = "";
    }
  }
};
</script>
