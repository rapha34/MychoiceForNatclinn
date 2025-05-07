<template>
  <tr tablelistfoot>
    <!-- <th class="text-right" criterion>
      <v-container>
        <small
          style="font-weight: normal;"
        >{{ getFilteredItems.length }}/{{ getAllItems.length }} arguments</small>
      </v-container>
    </th>
    <th class="text-left" aim></th>-->
    <th criterion-aim class="text-right" colspan="2">
      <v-container>
        <small class="grey--text" style="font-weight: normal;">
          Arguments:
          <b>{{ getFilteredItems.length }}/{{ getAllItems.length }}</b>
        </small>
      </v-container>
    </th>

    <template v-for="alternativeId in subOptionsIds" :key="`subOption-${alternativeId}`">
      <th
        alternative
        :colspan="subOptionsIds.length"
      >
        <table style="width: 100%;">
          <tr>
            <td class="text-left">
              <v-icon
                color="green"
                :title="
                  pluralize('{count} {argument:count}', {
                    count: getFilteredItemsBy({
                      alternative: alternativeId,
                      favorable: true
                    }).length
                  })
                "
                >mdi-emoticon-happy-outline</v-icon
              >
              <!-- <small class="green--text">
                {{
                  getFilteredItemsBy({
                    alternative: alternativeId,
                    favorable: true
                  }).length
                }}
              </small> -->
            </td>
            <td>
              <!-- {{getAcceptabilityFromAlternativeId(alternativeId)}} -->
              Attitude: {{ totalAcceptability[alternativeId] }}
              <!-- <Acceptability
                :items="getFilteredItemsBy({
              alternative: alternativeId
          })"
              />-->
              <ScoreIcon
                :alternative="alternativeId"
                :score="totalAcceptability[alternativeId]"
              />
            </td>
            <td class="text-right">
              <!-- <small class="red--text">
                {{
                  getFilteredItemsBy({
                    alternative: alternativeId,
                    favorable: false
                  }).length
                }}
              </small> -->
              <v-icon
                color="red"
                :title="
                  pluralize('{count} {argument:count}', {
                    count: getFilteredItemsBy({
                      alternative: alternativeId,
                      favorable: false
                    }).length
                  })
                "
                >mdi-emoticon-sad-outline</v-icon
              >
              <!-- <div>{{getSubOptions[2].name}}</div> -->
            </td>
          </tr>
        </table>

        <!-- <tr>
            <td :colspan="subOptionsIds.length">
              
            </td>
        </tr>-->
      </th>
    </template>
  </tr>
</template>

<script>
// import Acceptability from "@/components/Acceptability.vue";
import ScoreIcon from "@/components/ScoreIcon.vue";
import {
  pluralize,
  alternativesIds,
  subOptionsIds,
  getSubOptions,
  getFilteredItemsBy,
  getWeightedAcceptability,
  getAcceptabilityFromAlternativeId,
  getFilteredItems,
  getAllItems,
  state
} from "@/store";
import { computed, defineComponent } from "vue";
export default defineComponent({
  setup() {

    return  {
      state,

      getAcceptabilityFromAlternativeId,
      getFilteredItemsBy,
      getWeightedAcceptability,
      pluralize,

      totalAcceptability: computed(() => {
        return getWeightedAcceptability(getFilteredItems());
      }),
      alternativesIds: computed(() => alternativesIds()),
      subOptionsIds: computed(() => subOptionsIds()),
      getSubOptions: computed(() => getSubOptions()),
      getFilteredItems: computed(() => getFilteredItems()),
      getAllItems: computed(() => getAllItems())
    }
  },
  
  components: {
    ScoreIcon
  }
});
</script>
