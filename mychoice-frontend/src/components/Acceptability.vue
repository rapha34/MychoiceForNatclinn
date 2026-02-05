<!-- <template>
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
</template> -->
<!-- <template>
  <ScoreIcon
    :title="acceptability !== null
      ? `${pluralize('{count} {argument:count}', { count: items.length })} - ${acceptability * 100}% pro`
      : ''"
    :alternative="alternative"
    :icon="icon"
    :score="acceptability"
  />
</template>


<script lang="ts">
import { NormalizedArgument } from "@/@types";
import { getAcceptabilityFromProCon, pluralize } from "@/store";
import { computed, defineComponent, PropType, toRefs } from "vue";
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

<style lang="scss"></style> -->
<template>
  <ScoreIcon
    :title="scoreTitle"
    :alternative="alternative"
    :icon="icon"
    :score="acceptability"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NormalizedArgument } from '@/@types'
import { getAcceptabilityFromProCon, pluralize } from '@/store'
import ScoreIcon from './ScoreIcon.vue'

const props = defineProps<{
  items: NormalizedArgument[]
  alternative: number
  icon: boolean
}>()

const acceptability = computed(() => getAcceptabilityFromProCon(props.items))

const scoreTitle = computed(() => {
  return acceptability.value !== null
    ? `${pluralize('{count} {argument:count}', {
        count: props.items.length
      })} - ${acceptability.value * 100}% pro`
    : ''
})
</script>

