<template>
  <td aim>
    <!-- <router-link :to="`aim/${aim.id}`">{{aim.name}}</router-link> -->
    <div class="d-flex flex-column justify-space-between text-break">
      <div class="d-flex">{{aim.name}}</div>
      <div class="mt-1 flex-grow-1 flex-wrap d-flex">
        <Acceptability
          :key="'aim-alternative-'+index+aimsItems[alternativeId]"
          v-for="(alternativeId, index) in c_alternativesIds"
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

<script lang="ts">
import ItemsCount from "@/components/ItemsCount.vue";
import Acceptability from "@/components/Acceptability.vue";
import { getFilteredItemsBy, c_alternativesIds } from "@/store";
import { computed, defineComponent, PropType, ref, toRefs  } from "vue";
import { NormalizedAim, NormalizedArgument } from "@/@types";
export default defineComponent({


  props: {
    aim: {
      type: Object as PropType<NormalizedAim>
    }
  },


  setup(props) {

    const {aim} = toRefs(props)

  
    const aimsItems = computed(() => {
      let obj : {[key: string]: NormalizedArgument[]} = {};
      c_alternativesIds.value.forEach(alternativeId => {
        const items = getFilteredItemsBy({
          alternative: alternativeId,
          aim: aim.value.id
        });

        obj[alternativeId] = items;
      });
      return obj;
    })

    const totalItems = computed(() => {
      return Object.values(aimsItems.value).reduce((acc, items) => {
        return acc + items.length;
      }, 0)
      })

    return {
      

      c_alternativesIds,
      aimsItems,
      totalItems,

      getFilteredItemsBy

    }

  },
  // props: ["aim"],
  components: {
    Acceptability,
    ItemsCount
  },
  // computed: {
    
    
    
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
  // },
  // methods: {
    
  // }
});
</script>

