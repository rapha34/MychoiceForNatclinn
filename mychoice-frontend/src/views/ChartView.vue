<!--
Copyright INRAE
Contact contributor(s) : Rallou Thomopoulos / Julien Cufi (26/03/2020)
MyChoice is a web application supporting collective decision.
See more on https://ico.iate.inra.fr/MyChoice
This application is registered to the European organization for the
protection of authors and publishers of digital creations with
the following identifier: IDDN.FR.001.280002.000.R.P.2020.000.20900

This software is governed by the CeCILL-C license under French law and
abiding by the rules of distribution of free software.  You can  use,
modify and/ or redistribute the software under the terms of the CeCILL-C
license as circulated by CEA, CNRS and INRIA at the following URL
"http://www.cecill.info".
As a counterpart to the access to the source code and  rights to copy,
modify and redistribute granted by the license, users are provided only
with a limited warranty  and the software's author,  the holder of the
economic rights,  and the successive licensors  have only  limited
liability.
In this respect, the user's attention is drawn to the risks associated
with loading,  using,  modifying and/or developing or reproducing the
software by the user in light of its specific status of free software,
that may mean  that it is complicated to manipulate,  and  that  also
therefore means  that it is reserved for developers  and  experienced
professionals having in-depth computer knowledge. Users are therefore
encouraged to load and test the software's suitability as regards their
requirements in conditions enabling the security of their systems and/or
data to be ensured and,  more generally, to use and operate it in the
same conditions as regards security.
The fact that you are presently reading this means that you have had
knowledge of the CeCILL-C license and that you accept its terms.
-->
<template>
  <div class="view-container" v-if="state.project && state.data">
    <!-- Header -->
    <div class="header-section">
      <v-container style="max-width: 1600px;">
        <Header />
      </v-container>
    </div>

    <!-- Main Chart Section -->
    <div class="chart-main">
      <v-container fluid class="fill-height chart-layout">
        <v-row class="fill-height chart-row" no-gutters>
          <!-- Sidebar Menu -->
          <v-col cols="12" sm="3" md="2" class="sidebar">
            <v-card class="sidebar-card" elevation="2">
              <v-card-title class="text-h6 d-flex align-center pa-4">
                <v-icon icon="mdi-chart-bar" class="mr-2" color="primary" />
                Charts
              </v-card-title>
              <v-divider />
              <v-list class="chart-menu" density="compact">
                <v-list-item
                  v-for="chart in charts"
                  :key="chart.id"
                  :active="selectedChart === chart.id"
                  @click="selectedChart = chart.id"
                  class="chart-menu-item"
                >
                  <template #prepend>
                    <v-icon :icon="chart.icon" size="small" class="mr-2" />
                  </template>
                  <v-list-item-title class="text-caption">
                    {{ chart.label }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>

          <!-- Main Content Area -->
          <v-col cols="12" sm="9" md="10" class="content-area">
            <v-card class="content-card" elevation="2">
              <!-- 1. Argument Count -->
              <div v-show="selectedChart === 'argument-count'" class="chart-container">
                <v-card-title class="text-h5 d-flex align-center pa-6 pb-0">
                  <v-icon icon="mdi-counter" class="mr-2" color="primary" />
                  Argument Count
                </v-card-title>
                <v-card-text class="pa-6">
                  <ArgumentCount
                    :arguments="filteredItems"
                    :selectedAlternative="state.chartFilters?.selectedAlternative"
                    :analysisPer="state.chartFilters?.analysisPer"
                    :alternativesMap="state.data?.alternatives || null"
                    :criterionsMap="state.data?.criterions || null"
                    :stakeholdersMap="state.data?.stakeholders || null"
                  />
                </v-card-text>
              </div>

              <!-- 2. Bar Chart of Argument Repartition -->
              <div v-show="selectedChart === 'bar-chart'" class="chart-container">
                <v-card-title class="text-h5 d-flex align-center pa-6 pb-0">
                  <v-icon icon="mdi-chart-bar" class="mr-2" color="primary" />
                  Bar Chart of Argument Repartition
                </v-card-title>
                <v-card-text class="pa-6">
                  <BarChart
                    :arguments="filteredItems"
                    :selectedAlternative="state.chartFilters?.selectedAlternative"
                    :analysisPer="state.chartFilters?.analysisPer"
                    :selectedCriterion="state.chartFilters?.selectedCriterion"
                    :alternativesMap="state.data?.alternatives || null"
                    :criterionsMap="state.data?.criterions || null"
                    :stakeholdersMap="state.data?.stakeholders || null"
                  />
                </v-card-text>
              </div>

              <!-- 3. Circle Chart of Argument Repartition -->
              <div v-show="selectedChart === 'pie-chart'" class="chart-container">
                <v-card-title class="text-h5 d-flex align-center pa-6 pb-0">
                  <v-icon icon="mdi-chart-pie" class="mr-2" color="primary" />
                  Circle Chart of Argument Repartition
                </v-card-title>
                <v-card-text class="pa-6">
                  <PieChart
                    :arguments="filteredItems"
                    :selectedAlternative="state.chartFilters?.selectedAlternative"
                    :analysisPer="state.chartFilters?.analysisPer"
                    :selectedCriterion="state.chartFilters?.selectedCriterion"
                    :alternativesMap="state.data?.alternatives || null"
                    :criterionsMap="state.data?.criterions || null"
                    :stakeholdersMap="state.data?.stakeholders || null"
                  />
                </v-card-text>
              </div>

              <!-- 4. Comparison of Alternatives -->
              <div v-show="selectedChart === 'alternatives-comparison'" class="chart-container">
                <v-card-title class="text-h5 d-flex align-center pa-6 pb-0">
                  <v-icon icon="mdi-compare" class="mr-2" color="primary" />
                  Comparison of Alternatives
                </v-card-title>
                <v-card-text class="pa-6">
                  <AlternativesComparison :arguments="filteredItems" />
                </v-card-text>
              </div>

              <!-- 5. Cross-tab: Criteria x Stakeholders -->
              <div v-show="selectedChart === 'crosstab'" class="chart-container">
                <v-card-title class="text-h5 d-flex align-center pa-6 pb-0">
                  <v-icon icon="mdi-table" class="mr-2" color="primary" />
                  Cross-tab: Criteria x Stakeholders
                </v-card-title>
                <v-card-text class="pa-6">
                  <CrosstabChart :arguments="filteredItems" />
                </v-card-text>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import Header from "@/components/Header.vue";
import ArgumentCount from "@/components/Charts/ArgumentCount.vue";
import BarChart from "@/components/Charts/BarChart.vue";
import PieChart from "@/components/Charts/PieChart.vue";
import AlternativesComparison from "@/components/Charts/AlternativesComparison.vue";
import CrosstabChart from "@/components/Charts/CrosstabChart.vue";
import {
  state,
  getFilteredItems,
} from "@/store";

interface ChartOption {
  id: string;
  label: string;
  icon: string;
}

export default defineComponent({
  name: "ChartView",
  components: {
    Header,
    ArgumentCount,
    BarChart,
    PieChart,
    AlternativesComparison,
    CrosstabChart,
  },
  setup() {
    const selectedChart = ref<string>("argument-count");

    const charts: ChartOption[] = [
      { id: "argument-count", label: "Argument Count", icon: "mdi-counter" },
      { id: "bar-chart", label: "Bar Chart", icon: "mdi-chart-bar" },
      { id: "pie-chart", label: "Circle Chart", icon: "mdi-chart-pie" },
      { id: "alternatives-comparison", label: "Alternatives Comparison", icon: "mdi-compare" },
      { id: "crosstab", label: "Criteria x Stakeholders", icon: "mdi-table" },
    ];

    const filteredItems = computed(() => getFilteredItems());

    return {
      state,
      selectedChart,
      charts,
      filteredItems,
    };
  },
});
</script>

<style scoped>
.view-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header-section {
  flex-shrink: 0;
  background-color: white;
}

.chart-main {
  flex-grow: 1;
  background-color: #f5f5f5;
  overflow: auto;
  display: flex;
}

.chart-layout {
  height: 100%;
  max-width: 100%;
}

.chart-row {
  height: 100%;
}

.sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sidebar-card {
  height: 100%;
  overflow-y: auto;
}

.chart-menu {
  display: flex;
  flex-direction: column;
}

.chart-menu-item {
  border-radius: 8px;
  margin: 4px 8px;
  transition: all 0.3s ease;
}

.chart-menu-item:hover {
  background-color: rgba(33, 150, 243, 0.08);
}

.content-area {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.content-card {
  background-color: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.chart-container {
  padding-bottom: 24px;
}

:deep(.v-list-item--active) {
  background-color: rgba(33, 150, 243, 0.12);
  color: #2196F3;
}

:deep(.v-list-item--active .v-icon) {
  color: #2196F3 !important;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .sidebar {
    margin-bottom: 16px;
  }

  .sidebar-card {
    max-height: auto;
  }
}
</style>
