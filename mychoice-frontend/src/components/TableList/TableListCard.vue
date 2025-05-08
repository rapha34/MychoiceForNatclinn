<template>
  <v-card elevation="1" @click="toggleSuperset(superset)" class="text-center mb-3" max-width="344">
    
    <!-- <v-btn
      x-small
      absolute
      bottom
      right
      text
      icon
      :color="findSuperset(superset) ? 'green' : ''"
      @click="toggleSuperset(superset)"
    >
      <v-icon>mdi-eye</v-icon>
    </v-btn>-->
    <v-container>
      <div>
        <b v-if="is1stLevelStakeholdersMode"><text-highlight :searchWords="[state.searchInput]">{{getStakeholderName(superset.stakeholder)}}</text-highlight></b>
        <b v-else>
          <text-highlight :searchWords="[state.searchInput]">{{superset.property}}</text-highlight>
        </b>
      </div>
      <div :class="superset.subOption === 1 ? 'green--text' : 'red--text'">
        <text-highlight :searchWords="[state.searchInput]">{{superset.value}}</text-highlight>
      </div>
      <v-chip outlined x-small>{{items.length}}</v-chip>
      <!-- <small>
        <b>{{ items.length > 1 ? `${items.length} arguments` : `${items.length} argument`}}</b>
      </small>-->
      <!-- <ul>
      <li :key="'item-' + index" v-for="(item, index) in supersetItems">
        {{ item.assertion }}
        <br />
        <br />
      </li>
      </ul>-->
    </v-container>

  <div class="d-flex">
    <div class="card-compare-btn">
      <v-btn
        v-if="!findSuperset(superset)"
        @click.stop="addSupersetInSelection(superset)"
        text
        icon
        small
      >
        <v-icon x-small>mdi-plus-circle-outline</v-icon>
      </v-btn>
      <v-btn
        v-if="findSuperset(superset)"
        @click.stop="removeSupersetInSelection(superset)"
        text
        icon
        small
        color="secondary"
      >
        <v-icon x-small>mdi-plus-circle</v-icon>
      </v-btn>

    </div>
      <small v-if="condition" class="ml-auto mr-2 mb-1 text-right" style="text-overflow: ellipsis;display: block;overflow: hidden;width: calc(100% - 4em);white-space: nowrap;">{{condition}}</small>
  </div>
  </v-card>
</template>

<script>
import {
  state,
  getItemsBy,
  toggleSuperset,
  findSuperset,
  addSupersetInSelection,
  removeSupersetInSelection,
  getStakeholderName,
  is1stLevelStakeholdersMode
} from "@/store";
import { defineComponent } from "vue";
export default defineComponent({
  setup() {
    return {
      state,
      addSupersetInSelection,
    removeSupersetInSelection,
    getItemsBy,
    toggleSuperset,
    findSuperset,
    getStakeholderName,
    is1stLevelStakeholdersMode
    }  
  },
  
  computed: {
    items: function() {
      if (is1stLevelStakeholdersMode.value) {
        return getItemsBy({
          stakeholder: this.superset.stakeholder,
          alternative: this.superset.alternative,
          subOption: this.superset.subOption,
          aim: this.superset.aim,
          criterion: this.superset.criterion
        });
      } else {
        return getItemsBy({
          property: this.superset.property,
          value: this.superset.value,
          alternative: this.superset.alternative,
          subOption: this.superset.subOption,
          aim: this.superset.aim,
          criterion: this.superset.criterion
        });
      }
      
    },
    condition: function() {
      return this.items.reduce((acc, item) => {
        if (item.condition) {
          if (acc.length) {
            return acc + ", " + item.condition
          } else {
            return acc + item.condition
          }
        } else {
          return acc
        }
      }, "")
    }
    // supersetItems: function() {
    //   return getItemsBy({
    //     alternative: this.superset.alternative,
    //     subOption: this.superset.subOption,
    //     aim: this.superset.aim,
    //     criterion: this.superset.criterion,
    //     property: this.superset.property,
    //     value: this.superset.value
    //   });
    //}
  },
  props: ["superset", "label"]
});
</script>

<style>
.card {
  padding: 1em;
  margin-bottom: 1em;
}
</style>