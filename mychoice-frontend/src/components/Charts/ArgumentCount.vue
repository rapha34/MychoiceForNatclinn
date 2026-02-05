<template>
  <div class="argument-count">
    <!-- Mode merged: show single summary and chart -->
    <template v-if="selectedAlternative !== 'all-separated'">
      <div class="count-summary mb-6">
        <div class="summary-cards">
          <v-card variant="tonal" color="primary" class="summary-card">
            <v-card-text>
              <div class="text-h4">{{ totalCount }}</div>
              <div class="text-caption">Total Arguments</div>
            </v-card-text>
          </v-card>
          <v-card variant="tonal" color="success" class="summary-card">
            <v-card-text>
              <div class="text-h4">{{ favorableCount }}</div>
              <div class="text-caption">Favorable</div>
            </v-card-text>
          </v-card>
          <v-card variant="tonal" color="error" class="summary-card">
            <v-card-text>
              <div class="text-h4">{{ unfavorableCount }}</div>
              <div class="text-caption">Unfavorable</div>
            </v-card-text>
          </v-card>
        </div>
      </div>

      <div class="pie-chart-container">
        <div class="pie-chart-wrapper">
          <div class="pie-chart-legend">
            <div
              v-for="item in legendItems"
              :key="item.label"
              class="legend-item"
            >
              <span class="legend-swatch" :style="{ backgroundColor: item.color }" />
              <span class="legend-label">{{ item.label }}</span>
              <span class="legend-value">{{ item.count }}</span>
            </div>
          </div>
          <svg ref="chartRef" :width="width" :height="height"></svg>
        </div>
      </div>
    </template>

    <!-- Mode separated: show multiple charts, one per alternative -->
    <template v-else>
      <div class="separated-charts-container">
        <div
          v-for="(altData, altId) in separatedChartsData"
          :key="altId"
          class="alternative-chart-card"
        >
          <h3 class="alternative-title">{{ altData.name }}</h3>
          <div class="alternative-summary">
            <div class="summary-badge primary">
              <span class="badge-value">{{ altData.totalCount }}</span>
              <span class="badge-label">Total</span>
            </div>
            <div class="summary-badge success">
              <span class="badge-value">{{ altData.favorableCount }}</span>
              <span class="badge-label">Favorable</span>
            </div>
            <div class="summary-badge error">
              <span class="badge-value">{{ altData.unfavorableCount }}</span>
              <span class="badge-label">Unfavorable</span>
            </div>
          </div>
          <div class="pie-chart-wrapper">
            <div class="pie-chart-legend">
              <div
                v-for="item in altData.legendItems"
                :key="item.label"
                class="legend-item"
              >
                <span class="legend-swatch" :style="{ backgroundColor: item.color }" />
                <span class="legend-label">{{ item.label }}</span>
                <span class="legend-value">{{ item.count }}</span>
              </div>
            </div>
            <svg
              :ref="(el) => setSvgRef(altId, el)"
              :width="width"
              :height="height"
              class="chart-svg"
            ></svg>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType, ref, onMounted, watch, nextTick } from "vue";
import { NormalizedArgument, NormalizedObject } from "@/@types";

export default defineComponent({
  name: "ArgumentCount",
  props: {
    arguments: {
      type: Array as PropType<NormalizedArgument[]>,
      required: true,
    },
    alternativesMap: {
      type: Object as PropType<NormalizedObject | null>,
      default: null,
    },
    criterionsMap: {
      type: Object as PropType<NormalizedObject | null>,
      default: null,
    },
    stakeholdersMap: {
      type: Object as PropType<NormalizedObject | null>,
      default: null,
    },
    selectedAlternative: {
      type: String,
      default: 'all-merged',
    },
    analysisPer: {
      type: String,
      default: 'criteria',
    },
  },
  setup(props) {
    const chartRef = ref<SVGSVGElement | null>(null);
    const svgRefs = ref<Record<string, SVGSVGElement | null>>({});
    const width = 700;
    const height = 500;

    // Filtrer les arguments selon les filtres sélectionnés (pour le mode merged)
    const filteredArguments = computed(() => {
      let filtered = [...props.arguments];

      // Filtre Alternative (seulement si pas "all-separated")
      if (
        props.selectedAlternative &&
        props.selectedAlternative !== "all-merged" &&
        props.selectedAlternative !== "all-separated"
      ) {
        const alternatives = props.alternativesMap || {};
        const matchingAltId = Object.values(alternatives).find(
          (alt) => alt.name === props.selectedAlternative
        )?.id;

        if (matchingAltId !== undefined) {
          filtered = filtered.filter((arg) => arg.alternative === matchingAltId);
        }
      }

      return filtered;
    });

    const totalCount = computed(() => filteredArguments.value.length);
    const favorableCount = computed(() => 
      filteredArguments.value.filter(arg => arg.favorable).length
    );
    const unfavorableCount = computed(() => 
      filteredArguments.value.filter(arg => !arg.favorable).length
    );

    // Grouper les données selon "Analysis per" (pour le mode merged)
    const chartData = computed(() => {
      const grouped: Record<string, { favorable: number; unfavorable: number }> = {};
      
      filteredArguments.value.forEach((arg) => {
        let key: string;

        if (props.analysisPer === "stakeholder") {
          const stakeholderName = props.stakeholdersMap?.[arg.stakeholder]?.name;
          key = stakeholderName || `Stakeholder ${arg.stakeholder}`;
        } else {
          const criterionName = props.criterionsMap?.[arg.criterion]?.name;
          key = criterionName || `Criterion ${arg.criterion}`;
        }
        
        if (!grouped[key]) {
          grouped[key] = { favorable: 0, unfavorable: 0 };
        }
        
        if (arg.favorable) {
          grouped[key].favorable++;
        } else {
          grouped[key].unfavorable++;
        }
      });

      return grouped;
    });

    // Pour le mode séparé: créer un graphique par alternative
    const separatedChartsData = computed(() => {
      const result: Record<string, any> = {};
      const alternatives = props.alternativesMap || {};

      Object.entries(alternatives).forEach(([altId, altData]) => {
        // Filtrer les arguments pour cette alternative spécifique
        const altArguments = props.arguments.filter(
          (arg) => arg.alternative === altData.id
        );

        // Grouper selon "Analysis per"
        const grouped: Record<string, { favorable: number; unfavorable: number }> = {};
        altArguments.forEach((arg) => {
          let key: string;

          if (props.analysisPer === "stakeholder") {
            const stakeholderName = props.stakeholdersMap?.[arg.stakeholder]?.name;
            key = stakeholderName || `Stakeholder ${arg.stakeholder}`;
          } else {
            const criterionName = props.criterionsMap?.[arg.criterion]?.name;
            key = criterionName || `Criterion ${arg.criterion}`;
          }
          
          if (!grouped[key]) {
            grouped[key] = { favorable: 0, unfavorable: 0 };
          }
          
          if (arg.favorable) {
            grouped[key].favorable++;
          } else {
            grouped[key].unfavorable++;
          }
        });

        // Créer les legend items pour cette alternative
        const colors = [
          "#2196F3", "#4CAF50", "#FF9800", "#F44336", "#9C27B0",
          "#00BCD4", "#8BC34A", "#FFC107", "#E91E63", "#3F51B5",
          "#009688", "#CDDC39", "#FF5722", "#673AB7", "#795548"
        ];

        const entries = Object.entries(grouped);
        const legendItems = entries.map(([label, values], index) => {
          const value = values.favorable + values.unfavorable;
          return {
            label: label || "Unknown",
            count: value,
            color: colors[index % colors.length],
          };
        });

        const totalCount = altArguments.length;
        const favorableCount = altArguments.filter(arg => arg.favorable).length;
        const unfavorableCount = altArguments.filter(arg => !arg.favorable).length;

        result[altData.id] = {
          name: altData.name,
          totalCount,
          favorableCount,
          unfavorableCount,
          chartData: grouped,
          legendItems,
        };
      });

      return result;
    });

    const colors = [
      "#2196F3", "#4CAF50", "#FF9800", "#F44336", "#9C27B0",
      "#00BCD4", "#8BC34A", "#FFC107", "#E91E63", "#3F51B5",
      "#009688", "#CDDC39", "#FF5722", "#673AB7", "#795548"
    ];

    const legendItems = computed(() => {
      const entries = Object.entries(chartData.value);
      const total = entries.reduce(
        (sum, [, values]) => sum + values.favorable + values.unfavorable,
        0
      );

      return entries.map(([label, values], index) => {
        const value = values.favorable + values.unfavorable;
        return {
          label: label || "Unknown",
          count: value,
          color: colors[index % colors.length],
        };
      });
    });

    const setSvgRef = (altId: string | number, el: any) => {
      svgRefs.value[altId] = el;
    };

    const renderChart = () => {
      if (!chartRef.value) return;

      const svg = chartRef.value;
      svg.innerHTML = "";

      const entries = Object.entries(chartData.value);
      if (entries.length === 0) return;

      const total = entries.reduce(
        (sum, [, values]) => sum + values.favorable + values.unfavorable,
        0
      );

      if (total === 0) return;

      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 2 - 120;

      let currentAngle = -Math.PI / 2;

      entries.forEach(([label, values], index) => {
        const value = values.favorable + values.unfavorable;
        const sliceAngle = (value / total) * 2 * Math.PI;
        const endAngle = currentAngle + sliceAngle;

        const startX = centerX + radius * Math.cos(currentAngle);
        const startY = centerY + radius * Math.sin(currentAngle);
        const endX = centerX + radius * Math.cos(endAngle);
        const endY = centerY + radius * Math.sin(endAngle);

        const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;

        // Draw pie slice
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const d = [
          `M ${centerX} ${centerY}`,
          `L ${startX} ${startY}`,
          `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
          "Z",
        ].join(" ");
        
        path.setAttribute("d", d);
        path.setAttribute("fill", colors[index % colors.length]);
        path.setAttribute("stroke", "white");
        path.setAttribute("stroke-width", "2");
        svg.appendChild(path);

        currentAngle = endAngle;
      });
    };

    const renderSeparatedCharts = () => {
      Object.entries(separatedChartsData.value).forEach(([altId, altData]) => {
        const svg = svgRefs.value[altId];
        if (!svg) return;

        svg.innerHTML = "";

        const entries = Object.entries(altData.chartData);
        if (entries.length === 0) return;

        const total = entries.reduce(
          (sum: number, [, values]: any) => sum + values.favorable + values.unfavorable,
          0
        );

        if (total === 0) return;

        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 120;

        let currentAngle = -Math.PI / 2;

        entries.forEach(([label, values]: any, index: number) => {
          const value = values.favorable + values.unfavorable;
          const sliceAngle = (value / total) * 2 * Math.PI;
          const endAngle = currentAngle + sliceAngle;

          const startX = centerX + radius * Math.cos(currentAngle);
          const startY = centerY + radius * Math.sin(currentAngle);
          const endX = centerX + radius * Math.cos(endAngle);
          const endY = centerY + radius * Math.sin(endAngle);

          const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;

          const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
          const d = [
            `M ${centerX} ${centerY}`,
            `L ${startX} ${startY}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
            "Z",
          ].join(" ");
          
          path.setAttribute("d", d);
          path.setAttribute("fill", colors[index % colors.length]);
          path.setAttribute("stroke", "white");
          path.setAttribute("stroke-width", "2");
          svg.appendChild(path);

          currentAngle = endAngle;
        });
      });
    };

    onMounted(() => {
      if (props.selectedAlternative !== 'all-separated') {
        renderChart();
      } else {
        nextTick(() => {
          renderSeparatedCharts();
        });
      }
    });

    watch(() => props.selectedAlternative, async () => {
      // Quand on change le mode (merged/separated), re-trigger le rendu
      await nextTick();
      if (props.selectedAlternative !== 'all-separated') {
        renderChart();
      } else {
        renderSeparatedCharts();
      }
    });

    watch(() => [chartData.value, props.analysisPer], () => {
      if (props.selectedAlternative !== 'all-separated') {
        renderChart();
      }
    }, { deep: true });

    watch(() => [separatedChartsData.value, props.analysisPer], () => {
      if (props.selectedAlternative === 'all-separated') {
        renderSeparatedCharts();
      }
    }, { deep: true });

    return {
      chartRef,
      width,
      height,
      totalCount,
      favorableCount,
      unfavorableCount,
      legendItems,
      separatedChartsData,
      setSvgRef,
    };
  },
});
</script>

<style scoped>
.argument-count {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 400px;
}

.count-summary {
  width: 100%;
  max-width: 800px;
}

.summary-cards {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.summary-card {
  flex: 1;
  text-align: center;
}

.pie-chart-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
}

.pie-chart-wrapper {
  display: flex;
  align-items: center;
  gap: 24px;
}

.pie-chart-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 220px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #333;
}

.legend-swatch {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  display: inline-block;
  flex-shrink: 0;
}

.legend-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.legend-value {
  color: #666;
  font-variant-numeric: tabular-nums;
}

/* Mode séparé: styles pour afficher plusieurs cartes */
.separated-charts-container {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(900px, 1fr));
  gap: 24px;
  padding: 16px;
}

.alternative-chart-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  background-color: #fafafa;
}

.alternative-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #333;
}

.alternative-summary {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.summary-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 12px;
  border-radius: 6px;
  min-width: 80px;
}

.summary-badge.primary {
  background-color: rgba(33, 150, 243, 0.1);
  color: #2196F3;
}

.summary-badge.success {
  background-color: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

.summary-badge.error {
  background-color: rgba(244, 67, 54, 0.1);
  color: #F44336;
}

.badge-value {
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
  margin-bottom: 4px;
}

.badge-label {
  font-size: 11px;
  text-transform: uppercase;
  opacity: 0.8;
}

.chart-svg {
  display: block;
}
</style>
