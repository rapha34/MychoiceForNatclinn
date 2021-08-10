<template>
  <v-container fluid>
    <v-row dense>
      <v-col :key="superset + state.mode" :cols="4" v-for="superset in selectedSupersets">
        <SupersetCard :superset="JSON.parse(superset)" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SupersetCard from "@/components/SupersetCard.vue";
import {selectedSupersets} from "@/store"
import { defineComponent } from "@vue/composition-api";
export default defineComponent({
  setup() {
    return {
      selectedSupersets
    }
  },
  components: {
    SupersetCard
  }
});
</script>