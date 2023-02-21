<template>
  <!-- <v-chip
    x-small
    dark
    :color="getColorName(getAcceptabilityName(acceptability))"
    :title="acceptability"
  ></v-chip>-->

  <ScoreIcon
    :title="
      `${
        acceptability !== null
          ? `${pluralize('{count} {argument:count}', {
              count: items.length
            })} - ${acceptability * 100}% pro`
          : ''
      }`
    "
    :alternative="alternative"
    :icon="icon"
    :score="acceptability"
  />

  <!-- <span
    v-if="items.length"
    :title="acceptability"
    :class="'acceptability '+getAcceptabilityName(acceptability)"
  >-->
  <!-- <span :key="index" v-for="(item, index) in items">{{item.favorable}}</span> -->
  <!-- </span> -->
</template>

<script lang="ts">
import { NormalizedArgument } from "@/@types";
import { getAcceptabilityFromProCon, pluralize } from "@/store";
import { computed, defineComponent, PropType, toRefs } from "@vue/composition-api";
import ScoreIcon from "./ScoreIcon.vue";
export default defineComponent({

  props: {
    items: {
      type: Array as PropType<NormalizedArgument[]>
    },
    alternative: {
      type: Number
    },
    icon: {
      type: Boolean
    }
  },

  setup(props) {

    const {items, alternative, icon} = toRefs(props)

    return {
      

      acceptability: computed(() => getAcceptabilityFromProCon(items.value)),

      getAcceptabilityFromProCon,
      pluralize
    
    }
  },

  components: {
    ScoreIcon
  },
  // props: ["items", "alternative", "icon"],
  computed: {
    
  },
  methods: {
    
  }
});
</script>

<style lang="scss"></style>
