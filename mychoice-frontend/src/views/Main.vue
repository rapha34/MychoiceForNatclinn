<template>
  <div class="view-container" v-if="state.project && state.data">
    <!-- Header -->
    <div class="header-section">
      <v-container style="max-width: 1400px;">
        <Header />
      </v-container>
    </div>

    <!-- Table List -->
    <div class="tablelist-section">
      <v-container class="tablelist-container" fluid style="max-width: 1600px;">
        <v-card class="tablelist-card" elevation="0" rounded="lg">
          <div class="tablelist-x-shadow"></div>
          <div class="tablelist-y-shadow"></div>
          <TableList :key="state.project?.name" />
        </v-card>
      </v-container>
    </div>

    <!-- Bottom Padding (optionnel, à conserver si utile pour l'espacement) -->
    <div class="bottom-padding"></div>

    <!-- Floating Button -->
    <v-btn
      @click="state.compareDialog = !state.compareDialog"
      color="secondary"
      :disabled="selectedSupersets.length === 0"
      class="floating-button"
      variant="flat"
      elevation="8"
    >
      <v-icon icon="mdi-select-compare" />
      <v-badge
        v-if="selectedSupersets.length > 0"
        :content="selectedSupersets.length"
        color="black"
        text-color="white"
        floating
        offset-x="-12"
        offset-y="-12"
      />
    </v-btn>

    <!-- Superset Dialog -->
    <v-dialog
      @click:outside="state.selectedSuperset = ''"
      :model-value="state.selectedSuperset.length > 0"
      max-width="480px"
    >
      <template #default>
        <SupersetCard
          v-if="state.selectedSuperset.length"
          :superset="JSON.parse(state.selectedSuperset)"
        />
      </template>
    </v-dialog>

    <!-- Comparison Section -->
    <v-expand-transition>
      <div
        class="compare-container elevation-3"
        v-show="state.compareDialog && selectedSupersets.length"
      >
        <v-card color="grey-lighten-4" flat>
          <div class="close-btn-container">
            <v-btn @click="state.compareDialog = false" size="x-small" icon color="secondary">
              <v-icon icon="mdi-close" />
            </v-btn>
          </div>
          <v-container class="supersets-container" fluid>
            <div
              class="card-compare"
              v-for="superset in selectedSupersets"
              :key="superset + state.mode"
            >
              <SupersetCard :compare="true" :cols="4" :superset="JSON.parse(superset)" />
            </div>
          </v-container>
        </v-card>
      </div>
    </v-expand-transition>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import TableList from "@/components/TableList/TableList.vue";
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
  components: {
    Header,
    TableList,
    SupersetCard
  },
  setup() {
    return {
      state,
      selectedSupersets,
      getFilteredItems: computed(() => getFilteredItems()),
      getAllItems: computed(() => getAllItems()),
      removeSupersetInSelection
    };
  }
});
</script>

<style scoped>
/* .view-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding-bottom: 120px; 
} */
.view-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - var(--v-layout-top, 0px));
  overflow: hidden;
  /* padding-bottom: 120px; pour le bouton flottant */
}

.header-section {
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 20;
  background: white;
}

.tablelist-section {
  flex: 1 1 auto;
  min-height: 0;
  margin: 0 0 0 0;
  overflow: hidden;
  height: 100%;
}

.tablelist-container {
  height: 100%;
  display: flex;
}

.tablelist-card {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.bottom-padding {
  height: 16px;
  flex-shrink: 0;
}

.floating-button {
  position: fixed;
  bottom: 16px;
  left: 16px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  z-index: 10;
}

.compare-container {
  position: fixed;
  bottom: 80px;
  left: 0;
  right: 0;
  z-index: 12;
}

.close-btn-container {
  position: fixed;
  left: 0;
  transform: translateY(-50%) translateX(-25%);
  z-index: 15;
}

.card-compare {
  margin-bottom: 16px;
}

@media (max-width: 600px) {
  .compare-container {
    padding: 8px;
  }

  .card-compare {
    margin-bottom: 12px;
  }
}
</style>
