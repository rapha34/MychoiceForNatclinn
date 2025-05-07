<template>
  <div class="full" v-if="state.project && state.data">
    <div class="full__item" style="flex-shrink: 1; flex-grow: 0;">
      <v-container fluid>
        <Header />
      </v-container>
    </div>
    <div class="full__item" style="padding: 0; margin:0 12px 12px 12px; position: relative; overflow: hidden;">
      <v-container class="tablelist-container" style="margin: 0 0 0 0; padding-left: 0;" fluid>
        <v-card  elevation="0" rounded-card>
          <div class="tablelist-x-shadow"></div>
          <div class="tablelist-y-shadow"></div>
          <TableList :key="state.project.name" />
        </v-card>
      </v-container>
    </div>
    <div class="full__item" style="flex-shrink: 1; flex-grow: 0;">
      <!-- <br /> -->
      <!-- <v-container fluid>{{ getFilteredItems.length }}/{{ getAllItems.length }} arguments</v-container> -->
    </div>
    <v-btn
      @click="state.compareDialog = !state.compareDialog"
      fab
      color="secondary"
      :disabled="selectedSupersets.length === 0"
      :dark="selectedSupersets.length === 0 ? false : true"
      absolute
      bottom
      left
      style="transform: translateY(calc(-50% - 32px)) translateX(0); "
    >
      <v-icon>mdi-select-compare</v-icon>
      <v-badge v-if="selectedSupersets.length > 0" style="margin-top:-50%;" dark>
        <template v-slot:badge>
          <span>{{ selectedSupersets.length }}</span>
        </template>
      </v-badge>
    </v-btn>
    <v-dialog
      @click:outside="state.selectedSuperset = ''"
      :value="state.selectedSuperset.length ? true : false"
      max-width="480px"
    >
      <div>
        <SupersetCard
          v-if="state.selectedSuperset.length"
          :superset="JSON.parse(state.selectedSuperset)"
        />
      </div>
    </v-dialog>

    <v-expand-transition>
      <div
        class="compare-container elevation-3"
        v-show="state.compareDialog && selectedSupersets.length"
      >
        <v-card color="grey lighten-4" tile>
          <div
            style="position: fixed; left: 0; transform: translateY(-50%) translateX(-25%);"
            class="overline ml-4 pt-3"
          >
            <v-btn @click="state.compareDialog = false" fab x-small color="secondary" dark>
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
          <!-- <v-toolbar
          color="grey"
          elevation="1"
          style="position: sticky; top: 0; z-index: 1;"
          dense
          flat
          light
        >
          <v-btn color="primary" icon light @click="state.compareDialog = !state.compareDialog">
            <v-icon>{{state.compareDialog ? 'mdi-minus' : 'mdi-plus'}}</v-icon>
          </v-btn>
          <v-toolbar-title class="pl-0">Compare</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items></v-toolbar-items>
          </v-toolbar>-->
          <v-container class="supersets-container" fluid>
            <div class="card-compare" :key="superset+state.mode" v-for="superset in selectedSupersets">
              <!-- <v-btn
                class="mr-auto card-compare-btn-top"
                @click="removeSupersetInSelection(JSON.parse(superset))"
                fab
                dark
                x-small
                color="red"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>-->
              <SupersetCard :compare="true" :cols="4" :superset="JSON.parse(superset)" />
            </div>
          </v-container>
        </v-card>
      </div>
    </v-expand-transition>
  </div>
</template>

<script>
import TableList from "@/components/TableList/TableList.vue";
import Header from "@/components/Header.vue";
import SupersetCard from "@/components/SupersetCard.vue";
import {
  state,
  getFilteredItems,
  getAllItems,
  removeSupersetInSelection,
  selectedSupersets
} from "@/store";
import { defineComponent, computed } from "vue";

export default defineComponent({
  setup() {
    return {
      state,
      selectedSupersets,
      getFilteredItems: computed(() => getFilteredItems()),
      getAllItems: computed(() => getAllItems()),

      removeSupersetInSelection
    }
  },
  
  components: {
    Header,
    TableList,
    SupersetCard
  }
});
</script>
