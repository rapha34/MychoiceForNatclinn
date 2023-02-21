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
                recentIcoProjects.map(([key, value]) => ({
                text: value.name,
                value: value}))
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
                <v-list-item :to="getHrefFromTypeId({type: item.value.type, id: item.value.id})">
                  <v-list-item-title>{{ item.text }}</v-list-item-title>
                  <v-spacer></v-spacer>
                  <v-list-item-action @click.stop>
                    <v-btn
                      icon
                      @click.stop.prevent="
                        removeFromRecentProjects(item.value.type, {id: item.value.id})
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


    </v-col>
  </v-row>
</template>

<script lang="ts">
import {
  
  state,
  getSpreadsheetIdFromUrl,
  
  removeFromRecentProjectNames,
  removeFromRecentProjectSpreadsheets,
  openIco,
  openSpreadsheet,
  isValidNextcloudUrl,
  openNextcloudUrl,
  recentSpreadsheetProjects,recentIcoProjects, recentNextcloudProjects,
  removeFromRecentProjects, getHrefFromTypeId
} from "@/store";
import { computed, defineComponent } from "@vue/composition-api";
export default defineComponent({
  

  setup() {

    const handleOpenIco = async function(value: string) {
      await openIco(value);
      state.fields.projectName = "";
    }
    const handleOpenSpreadsheet = async function(value: string) {
      await openSpreadsheet(value);
      state.fields.spreadsheetUrl = "";
    }
    const handleOpenNextcloudUrl = async function(value: string) {
      await openNextcloudUrl(value);
      state.fields.nextcloudUrl = "";
    }
    const spreadsheetId = computed(() => state.fields.spreadsheetUrl ? getSpreadsheetIdFromUrl(state.fields.spreadsheetUrl): "")

    return  {
      state,
      isValidNextcloudUrl,
      spreadsheetId,
      openNextcloudUrl,
      removeFromRecentProjectSpreadsheets,
      removeFromRecentProjectNames,
      handleOpenIco,
      handleOpenSpreadsheet,
      handleOpenNextcloudUrl, 
      recentSpreadsheetProjects,
      recentNextcloudProjects,
      recentIcoProjects,removeFromRecentProjects, getHrefFromTypeId
    }

  }
});
</script>
