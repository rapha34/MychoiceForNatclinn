<template>
  <v-row class="table-filters">
    <v-col class="flex-grow-0" style="align-self: center;">
      <v-toolbar color="transparent" density="comfortable" class="pr-2 toolbar-filters">
        <div class="me-2 d-flex align-center">

          <!-- Global View Toggle with Menu -->
          <v-tooltip text="Global view" location="top">
            <template #activator="{ props: tooltipProps }">
              <v-menu location="bottom">
                <template #activator="{ props: menuProps }">
                  <v-btn
                    icon
                    class="toolbar-icon-btn"
                    v-bind="{ ...tooltipProps, ...menuProps }"
                    :variant="isActiveRoute('global-view') ? 'flat' : 'text'"
                    @click="switchToView('global-view')"
                  >
                    <v-icon :icon="'mdi-table'" :color="isActiveRoute('global-view') ? 'primary' : 'grey'" />
                    <v-icon :icon="'mdi-chevron-down'" :color="isActiveRoute('global-view') ? 'primary' : 'grey'" />
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-if="!is1stLevelStakeholdersMode"
                    @click="state.globalCardType = 'stakeholder'"
                  >
                    <v-list-item-title>By Stakeholder</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    v-else
                    @click="state.globalCardType = 'label'"
                  >
                    <v-list-item-title>By Label</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </v-tooltip>

          <!-- Stakeholder View -->
          <v-tooltip text="Stakeholder view" location="top">
            <template #activator="{ props }">
              <v-btn
                icon
                class="toolbar-icon-btn"
                v-bind="props"
                :variant="isActiveRoute('stakeholder-view') ? 'flat' : 'text'"
                @click="switchToView('stakeholder-view')"
              >
                <v-icon :icon="'mdi-account-multiple'" :color="isActiveRoute('stakeholder-view') ? 'primary' : 'grey'" />
              </v-btn>
            </template>
          </v-tooltip>

          <!-- Property View -->
          <v-tooltip text="Property view" location="top">
            <template #activator="{ props }">
              <v-btn
                icon
                class="toolbar-icon-btn"
                v-bind="props"
                :variant="isActiveRoute('property-view') ? 'flat' : 'text'"
                @click="switchToView('property-view')"
              >
                <v-icon :icon="'mdi-format-list-bulleted'" :color="isActiveRoute('property-view') ? 'primary' : 'grey'" />
              </v-btn>
            </template>
          </v-tooltip>

          <!-- Chart View -->
          <v-tooltip text="Chart view" location="top">
            <template #activator="{ props }">
              <v-btn
                icon
                class="toolbar-icon-btn"
                v-bind="props"
                :variant="isActiveRoute('chart-view') ? 'flat' : 'text'"
                @click="switchToView('chart-view')"
              >
                <v-icon :icon="'mdi-chart-bar'" :color="isActiveRoute('chart-view') ? 'primary' : 'grey'" />
              </v-btn>
            </template>
          </v-tooltip>
        </div>

        <!-- Mode Selector -->
        <v-select
          :items="getSelectModesComputed"
          item-title="text"
          item-value="value"
          v-model="state.mode"
          label="Select mode"
          hide-details
          class="ml-6 flex-grow-1 toolbar-select"
          color="secondary"
          variant="outlined"
          density="comfortable"
          style="min-width: 200px;"
        />
      </v-toolbar>
    </v-col>

    <!-- Autocomplete Filters (Default Views) -->
    <v-col class="px-6" v-if="!isActiveRoute('chart-view')">
      <v-row>
        <v-col>
          <v-autocomplete
            clearable
            item-color="secondary"
            color="secondary"
            label="Stakeholders"
            v-model="state.selectedStakeholders"
            :items="orderedStakeholders"
            item-title="text"
            multiple
            :hint="`${state.selectedStakeholders.length}/${getSelectStakeholders.length}`"
            persistent-hint
            autocomplete="off"
            id="selected-stakeholders"
            density="comfortable"
          />
        </v-col>
        <v-col>
          <v-autocomplete
            clearable
            item-color="secondary"
            color="secondary"
            label="Criteria"
            v-model="state.selectedCriterions"
            :items="orderedCriterions"
            item-title="text"
            multiple
            :hint="`${state.selectedCriterions.length}/${getSelectCriterions.length}`"
            persistent-hint
            autocomplete="off"
            id="selected-criteria"
            density="comfortable"
          />
        </v-col>
        <v-col>
          <v-autocomplete
            clearable
            item-color="secondary"
            color="secondary"
            label="Aims"
            v-model="state.selectedAims"
            :items="orderedAims"
            item-title="text"
            multiple
            :hint="`${state.selectedAims.length}/${getSelectAims.length}`"
            persistent-hint
            autocomplete="off"
            id="selected-aims"
            density="comfortable"
          />
        </v-col>
      </v-row>
    </v-col>

    <!-- Chart View Filters -->
    <v-col class="px-6" v-if="isActiveRoute('chart-view')">
      <v-row>
        <v-col cols="12" md="4">
          <v-select
            item-color="secondary"
            color="secondary"
            label="Alternative"
            v-model="chartSelectedAlternative"
            :items="alternativeOptions"
            density="comfortable"
            variant="outlined"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            item-color="secondary"
            color="secondary"
            label="Analysis per"
            v-model="chartAnalysisPer"
            :items="analysisPerOptions"
            density="comfortable"
            variant="outlined"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            item-color="secondary"
            color="secondary"
            label="All criteria"
            v-model="chartSelectedCriterion"
            :items="orderedCriterions"
            item-title="text"
            item-value="value"
            clearable
            density="comfortable"
            variant="outlined"
          />
        </v-col>
      </v-row>
    </v-col>

      <!-- Search Field (Default Views only) -->
      <v-col class="flex-grow-0" style="min-width: 200px;" v-if="!isActiveRoute('chart-view')">
        <v-text-field
          color="secondary"
          label="Search"
          :model-value="state.searchInput"
          @update:modelValue="debounceInput"
          clearable
          density="comfortable"
        >
          <template #append-inner>
            <v-icon
              icon="mdi-magnify"
              class="cursor-pointer"
              @click="clearSearch"
            />
          </template>
        </v-text-field>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { computed, watch, ref } from 'vue'
import { useRouter } from 'vue-router'
import { debounce } from 'lodash'

import {
  getSelectStakeholders,
  getSelectAims,
  getSelectCriterions,
  state,
  getSelectModes,
  loadAll,
  switchToView,
  is1stLevelStakeholdersMode,
  orderByPropName,
} from '@/store'

const router = useRouter()

const isActiveRoute = (name: string) => router.currentRoute.value.name === name

// Chart View filters - expose globally in state
if (!state.chartFilters) {
  state.chartFilters = {
    selectedAlternative: 'all-merged',
    analysisPer: 'criteria',
    selectedCriterion: '',
  }
}

const chartSelectedAlternative = computed({
  get: () => state.chartFilters?.selectedAlternative || 'all-merged',
  set: (value) => {
    if (state.chartFilters) {
      state.chartFilters.selectedAlternative = value
    }
  }
})

const chartAnalysisPer = computed({
  get: () => state.chartFilters?.analysisPer || 'criteria',
  set: (value) => {
    if (state.chartFilters) {
      state.chartFilters.analysisPer = value
    }
  }
})

const chartSelectedCriterion = computed({
  get: () => state.chartFilters?.selectedCriterion || '',
  set: (value) => {
    if (state.chartFilters) {
      state.chartFilters.selectedCriterion = value
    }
  }
})

const alternativeOptions = computed(() => {
  const alternatives = state.project?.alternatives?.map(alt => ({
    title: alt.name,
    value: alt.name,
  })) || []
  return [
    ...alternatives,
    { title: 'All alternatives (merged)', value: 'all-merged' },
    { title: 'All alternatives (separated)', value: 'all-separated' },
  ]
})

const analysisPerOptions = [
  { title: 'Criteria', value: 'criteria' },
  { title: 'Stakeholder', value: 'stakeholder' },
]

const clearSearch = () => {
  state.searchInput = ''
}

const debounceInput = debounce((value: string) => {
  state.searchInput = value
}, 200)

const getSelectModesComputed = computed(() => getSelectModes())

const orderedStakeholders = computed(() =>
  orderByPropName(getSelectStakeholders(), 'text')
)
const orderedCriterions = computed(() =>
  orderByPropName(getSelectCriterions(), 'text')
)
const orderedAims = computed(() =>
  orderByPropName(getSelectAims(), 'text')
)

watch(
  () => state.mode,
  async () => {
    await loadAll(router.currentRoute.value, false)
  }
)
</script>

<style scoped>
.toolbar-filters :deep(.toolbar-icon-btn) {
  border: 1px solid rgba(var(--v-theme-secondary), 0.35);
  border-radius: 6px;
  height: 40px;
  width: 40px;
}

.toolbar-filters :deep(.toolbar-icon-btn:hover) {
  background-color: rgba(var(--v-theme-secondary), 0.08);
}

.toolbar-filters :deep(.toolbar-icon-btn.v-btn--variant-flat) {
  background-color: rgba(var(--v-theme-secondary), 0.12);
}

.toolbar-select {
  max-width: 320px;
}
</style>
