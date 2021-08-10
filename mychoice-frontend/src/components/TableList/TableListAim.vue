<template>
  <td aim>
    <!-- <router-link :to="`aim/${aim.id}`">{{aim.name}}</router-link> -->
    <div class="d-flex flex-column justify-space-between text-break">
      <div class="d-flex">{{aim.name}}</div>
      <div class="mt-1 flex-grow-1 flex-wrap d-flex">
        <Acceptability
          :key="'aim-alternative-'+index+aimsItems[alternativeId]"
          v-for="(alternativeId, index) in alternativesIds"
          class="mb-1 mr-1"
          :icon="true"
          :alternative="alternativeId"
          :items="aimsItems[alternativeId]"
        />
        <!-- <Acceptability
          class="mb-1 mr-1"
          :icon="true"
          :alternative="1"
          :items="alternativeItems[1]"
        />
        <Acceptability :icon="true" :alternative="2" :items="alternativeItems[2]" />-->
      </div>
    </div>
    <ItemsCount :count="totalItems" />
  </td>
</template>

<script>
import ItemsCount from "@/components/ItemsCount.vue";
import Acceptability from "@/components/Acceptability.vue";
import { getFilteredItemsBy, alternativesIds } from "@/store";
export default {
  props: ["aim"],
  components: {
    Acceptability,
    ItemsCount
  },
  computed: {
    alternativesIds,
    totalItems: function() {
      return Object.values(this.aimsItems).reduce((acc, items) => {
        return acc + items.length;
      }, 0);
    },
    aimsItems: function() {
      let obj = {};
      this.alternativesIds.forEach(alternativeId => {
        const items = getFilteredItemsBy({
          alternative: alternativeId,
          aim: this.aim.id
        });

        obj[alternativeId] = items;
      });
      return obj;
    }
    // alternativeItems: function() {
    //   return {
    //     1: getFilteredItemsBy({
    //       alternative: 1,
    //       aim: this.aim.id
    //     }),
    //     2: getFilteredItemsBy({
    //       alternative: 2,
    //       aim: this.aim.id
    //     })
    //   };
    // }
  },
  methods: {
    getFilteredItemsBy
  }
};
</script>

