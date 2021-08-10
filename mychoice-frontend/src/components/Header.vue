<template>
  <v-row table-filters>
    <v-col class="flex-grow-0" style="align-self: center;">
      <v-row>
        <v-toolbar color="transparent" flat>
          <!-- <v-btn icon>
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>-->
          <!-- <v-toolbar-title>{{state.project.name}}</v-toolbar-title> -->

          <!-- <v-btn icon :to="{ path: '/', query: $router.currentRoute.query }">
            <v-icon>mdi-table</v-icon>
          </v-btn>
          <v-btn icon :to="{ path: '/properties', query: $router.currentRoute.query }">
            <v-icon>mdi-format-list-bulleted</v-icon>
          </v-btn>-->

          <v-btn-toggle
            light
            color="transparent"
            background-color="transparent"
            @change="switchToView"
            mandatory
            :value="$router.currentRoute.name"
          >
          <v-menu offset-y bottom >
      <template v-slot:activator="{ on: menu, attrs }">
            <v-tooltip top>
              <template v-slot:activator="{ on: tooltip  }">
                <v-btn
                  :color="$router.currentRoute.name === 'global-view' ? '' : ''"
                                v-on="{ ...tooltip }"
                  v-bind="attrs"
                  :value="'global-view'"
                >
                  <v-icon
                    :color="
                      $router.currentRoute.name === 'global-view'
                        ? 'primary'
                        : 'grey'
                    "
                  >mdi-table</v-icon>
                <v-btn x-small icon color="transparent" :value="'global-view'" v-on="{ ...menu }" v-bind="attrs">
                  <v-icon :color="
                      $router.currentRoute.name === 'global-view'
                        ? 'primary'
                        : 'grey'
                    ">mdi-chevron-down</v-icon>
                  </v-btn>
                </v-btn>
              </template>
              <span>Global view</span>
            </v-tooltip>
            </template>
            <v-list>
              <v-list-item v-if="!is1stLevelStakeholdersMode"
              @click="state.globalCardType = 'stakeholder'"
              >
                <v-list-item-title>By Stakeholder</v-list-item-title>
              </v-list-item>
              <v-list-item v-if="is1stLevelStakeholdersMode"
              @click="state.globalCardType = 'label'"
              >
                <v-list-item-title>By Label</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

  

            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  text
                  :color="
                    $router.currentRoute.name === 'stakeholder-view' ? '' : ''
                  "
                  v-on="on"
                  :value="'stakeholder-view'"
                >
                  <v-icon
                    :color="
                      $router.currentRoute.name === 'stakeholder-view'
                        ? 'primary'
                        : 'grey'
                    "
                  >mdi-account-multiple</v-icon>
                </v-btn>
              </template>
              <span>Stakeholder view</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  text
                  :color="
                    $router.currentRoute.name === 'property-view' ? '' : ''
                  "
                  v-on="on"
                  :value="'property-view'"
                >
                  <v-icon
                    :color="
                      $router.currentRoute.name === 'property-view'
                        ? 'primary'
                        : 'grey'
                    "
                  >mdi-format-list-bulleted</v-icon>
                </v-btn>
              </template>
              <span>Property view</span>
            </v-tooltip>
          </v-btn-toggle>
          <!-- <v-spacer></v-spacer> -->
          <v-overflow-btn
            :items="getSelectModes"
            v-model="state.mode"
            hide-selected
            label="Select mode"
            hide-details
            solo
            style="min-width: 200px;"
            class="ml-6 flex-grow-1"
          ></v-overflow-btn>
          <!-- <v-divider vertical></v-divider> -->
          <!-- <v-select
            class
            hide-details
            append-icon="mdi-filter-variant"
            label="Mode"
            outlined
            light
            dense
            :items="getSelectModes"
            v-model="state.mode"
          ></v-select>-->
          <!-- <v-spacer></v-spacer> -->
        </v-toolbar>
      </v-row>
    </v-col>

    <v-col class="py-0 px-6">
      <v-row>
        <v-col>
          <v-autocomplete
            clearable
            flat
            item-color="secondary"
            color="secondary"
            :label="`Stakeholders`"
            v-model="state.selectedStakeholders"
            :items="orderByPropName(getSelectStakeholders, 'text')"
            multiple
            :hint="
              `${state.selectedStakeholders.length}/${getSelectStakeholders.length}`
            "
            persistent-hint
            autocomplete="off"
            id="selected-stakeholders"
          ></v-autocomplete>
        </v-col>

        <v-col>
          <v-autocomplete
            clearable
            flat
            item-color="secondary"
            color="secondary"
            label="Criteria"
            v-model="state.selectedCriterions"
            :items="orderByPropName(getSelectCriterions, 'text')"
            multiple
            :hint="
              `${state.selectedCriterions.length}/${getSelectCriterions.length}`
            "
            persistent-hint
            autocomplete="off"
            id="selected-criteria"
          ></v-autocomplete>
        </v-col>
        <v-col>
          <v-autocomplete
            clearable
            flat
            item-color="secondary"
            color="secondary"
            label="Aims"
            v-model="state.selectedAims"
            :items="orderByPropName(getSelectAims, 'text')"
            :hint="`${state.selectedAims.length}/${getSelectAims.length}`"
            persistent-hint
            multiple
            autocomplete="off"
            id="selected-aims"
          ></v-autocomplete>
        </v-col>
      </v-row>
    </v-col>

    <v-col class="flex-grow-0" style="min-width: 200px;">
      <v-text-field
        flat
        item-color="secondary"
        color="secondary"
        label="Search"
        :value="state.searchInput"
        @input="debounceInput"
      >
        <v-icon v-show="state.searchInput" @click="clearSearch" slot="append">mdi-close</v-icon>
        <v-icon slot="append">mdi-magnify</v-icon>
      </v-text-field>
    </v-col>
  </v-row>
</template>

<script>
import {
  getSelectStakeholders,
  getSelectAims,
  getSelectCriterions,
  state,
  getFilteredItems,
  getAllItems,
  orderByPropName,
  getSelectModes,
  clearState,
  loadAll,
  switchToView,
  is1stLevelStakeholdersMode
} from "@/store";
import { debounce } from "lodash";
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  setup() {
    return  {
      is1stLevelStakeholdersMode
    }
  },
  data: () => ({
    state
  }),
  methods: {
    clearSearch() {
      state.searchInput = "";
    },
    switchToView: function(routeName) {
      return switchToView(routeName);
    },
    orderByPropName,
    debounceInput: debounce(value => {
      state.searchInput = value;
    }, 200)
  },
  computed: {
    getSelectModes,
    getAllItems,
    getSelectStakeholders,
    getSelectAims,
    getSelectCriterions,
    getFilteredItems,
    
    mode: function() {
      return this.state.mode;
    }
  },
  watch: {
    async mode() {
      
      await loadAll(this.$router.currentRoute, false);
    },
    
  }
});
</script>
