<template>
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

        <v-btn
          class="ml-auto d-flex"
          color="secondary"
          :disabled="!state.fields.projectName"
          type="submit"
        >Open from Ico</v-btn>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
import { removeFromRecentProjectNames, state, openIco } from "@/store";
export default {
  data: () => ({
    state
  }),
  methods: {
    removeFromRecentProjectNames,
    handleOpenIco: async function(value) {
      await openIco(value);
      state.fields.projectName = "";
    }
  }
};
</script>