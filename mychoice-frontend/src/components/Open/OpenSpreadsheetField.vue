<template>
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
                        removeFromRecentProjectSpreadsheets(item.value)
                      "
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </template>
          <v-icon :color="spreadsheetId ? 'green' : ''" slot="append">mdi-google-spreadsheet</v-icon>
        </v-combobox>

        <v-btn
          class="d-flex ml-auto"
          type="submit"
          color="secondary"
          :disabled="!spreadsheetId"
        >Open from Spreadsheet Url</v-btn>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
import {
  state,
  getSpreadsheetIdFromUrl,
  removeFromRecentProjectSpreadsheets,
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
    handleOpenSpreadsheet: async function(value) {
      await openSpreadsheet(value);
      state.fields.spreadsheetUrl = "";
    }
  }
};
</script>
