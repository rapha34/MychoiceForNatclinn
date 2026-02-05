<template>
  <div class="bar-chart-container">
    <!-- Mode merged: single chart -->
    <template v-if="selectedAlternative !== 'all-separated'">
      <div class="chart-wrapper">
        <div class="chart-area">
          <svg ref="chartRef" :width="width" :height="height" class="horizontal-bars"></svg>
        </div>
        <div class="attitude-column">
          <div class="attitude-header">Attitude</div>
          <div v-for="row in tableRows" :key="row.key" class="attitude-item">
            <div class="attitude-value">{{ row.attitude }}</div>
          </div>
        </div>
      </div>
    </template>

    <!-- Mode separated: multiple charts, one per alternative -->
    <template v-else>
      <div class="separated-charts-container">
        <div
          v-for="(altData, altId) in separatedChartsData"
          :key="altId"
          class="alternative-chart-card"
        >
          <h3 class="alternative-title">{{ altData.name }}</h3>
          <div class="chart-wrapper">
            <div class="chart-area">
              <svg
                :ref="(el) => setSvgRef(String(altId), el)"
                :width="width"
                :height="altData.chartHeight"
                class="horizontal-bars"
              ></svg>
            </div>
            <div class="attitude-column">
              <div class="attitude-header">Attitude</div>
              <div v-for="row in altData.tableRows" :key="row.key" class="attitude-item">
                <div class="attitude-value">{{ row.attitude }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref, onMounted, watch, nextTick } from "vue";
import { NormalizedArgument, NormalizedObject } from "@/@types";

export default defineComponent({
  name: "BarChart",
  props: {
    arguments: {
      type: Array as PropType<NormalizedArgument[]>,
      required: true,
    },
    selectedAlternative: {
      type: String,
      default: "all-merged",
    },
    analysisPer: {
      type: String,
      default: "criteria",
    },
    selectedCriterion: {
      type: [String, Number],
      default: "",
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
  },
  setup(props) {
    const chartRef = ref<SVGSVGElement | null>(null);
    const separatedChartRefs = ref<Map<string, SVGSVGElement | null>>(new Map());
    const width = 600;
    const height = computed(() => Math.max(300, tableRows.value.length * 40));

    const groupByLabel = computed(() =>
      props.analysisPer === "stakeholder" ? "Stakeholders" : "Criteria"
    );

    const alternativeLabel = computed(() => {
      if (
        !props.selectedAlternative ||
        props.selectedAlternative === "all-merged" ||
        props.selectedAlternative === "all-separated"
      ) {
        return "All alternatives";
      }
      return props.selectedAlternative;
    });

    const filteredArguments = computed(() => {
      let filtered = [...props.arguments];

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

      if (props.selectedCriterion !== "" && props.selectedCriterion !== null) {
        const criterionId = Number(props.selectedCriterion);
        if (!Number.isNaN(criterionId)) {
          filtered = filtered.filter((arg) => arg.criterion === criterionId);
        }
      }

      return filtered;
    });

    const separatedChartsData = computed(() => {
      const alternativesMap = props.alternativesMap || {};
      const result: Record<string, any> = {};

      const altIds = Array.from(new Set(props.arguments.map((arg) => arg.alternative)));

      altIds.forEach((altId) => {
        const altName = (alternativesMap[altId]?.name || `Alternative ${altId}`) as string;
        const altArguments = props.arguments.filter((arg) => arg.alternative === altId);

        let filtered = [...altArguments];
        if (props.selectedCriterion !== "" && props.selectedCriterion !== null) {
          const criterionId = Number(props.selectedCriterion);
          if (!Number.isNaN(criterionId)) {
            filtered = filtered.filter((arg) => arg.criterion === criterionId);
          }
        }

        const grouped = new Map<number, { favorable: number; unfavorable: number }>();

        filtered.forEach((arg) => {
          const key =
            props.analysisPer === "stakeholder" ? arg.stakeholder : arg.criterion;
          if (!grouped.has(key)) {
            grouped.set(key, { favorable: 0, unfavorable: 0 });
          }
          const entry = grouped.get(key)!;
          if (arg.favorable) {
            entry.favorable += 1;
          } else {
            entry.unfavorable += 1;
          }
        });

        const rows = Array.from(grouped.entries())
          .map(([key, values]) => {
            const total = values.favorable + values.unfavorable;
            const attitude = total === 0 ? 0 : values.favorable / total;
            return {
              key,
              label: resolveLabel(key),
              favorable: values.favorable,
              unfavorable: values.unfavorable,
              attitude: attitude.toFixed(2),
            };
          })
          .sort((a, b) => a.label.localeCompare(b.label));

        const chartHeight = Math.max(300, rows.length * 40);
        
        result[String(altId)] = {
          id: altId,
          name: altName,
          tableRows: rows,
          chartHeight,
        };
      });

      return result;
    });

    const resolveLabel = (key: number) => {
      if (props.analysisPer === "stakeholder") {
        return props.stakeholdersMap?.[key]?.name || `Stakeholder ${key}`;
      }
      return props.criterionsMap?.[key]?.name || `Criterion ${key}`;
    };

    const setSvgRef = (altId: string, el: any) => {
      if (el) {
        separatedChartRefs.value.set(altId, el);
      }
    };

    const tableRows = computed(() => {
      const grouped = new Map<number, { favorable: number; unfavorable: number }>();

      filteredArguments.value.forEach((arg) => {
        const key =
          props.analysisPer === "stakeholder" ? arg.stakeholder : arg.criterion;
        if (!grouped.has(key)) {
          grouped.set(key, { favorable: 0, unfavorable: 0 });
        }
        const entry = grouped.get(key)!;
        if (arg.favorable) {
          entry.favorable += 1;
        } else {
          entry.unfavorable += 1;
        }
      });

      return Array.from(grouped.entries())
        .map(([key, values]) => {
          const total = values.favorable + values.unfavorable;
          const attitude = total === 0 ? 0 : values.favorable / total;
          return {
            key,
            label: resolveLabel(key),
            favorable: values.favorable,
            unfavorable: values.unfavorable,
            attitude: attitude.toFixed(2),
          };
        })
        .sort((a, b) => a.label.localeCompare(b.label));
    });

    const renderChartContent = (svg: SVGSVGElement, rows: any[], chartHeight: number) => {
      svg.innerHTML = "";

      if (rows.length === 0) return;

      const margin = { left: 150, right: 20, top: 20, bottom: 20 };
      const chartWidth = width - margin.left - margin.right;
      const contentHeight = chartHeight - margin.top - margin.bottom;
      const pairHeight = contentHeight / rows.length;
      const barHeight = Math.max(12, pairHeight * 0.35);
      const barGap = 4;

      const maxValue = Math.max(
        ...rows.map((r: any) => r.favorable + r.unfavorable)
      );

      // Create main group
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("transform", `translate(${margin.left},${margin.top})`);

      // Colors
      const favorableColor = "#4CAF50";
      const unfavorableColor = "#F44336";

      rows.forEach((row: any, index: number) => {
        const pairTop = index * pairHeight;
        const pairCenter = pairTop + pairHeight / 2;
        
        // Position favorable bar above center
        const favorableYPos = pairCenter - barHeight - barGap / 2;
        // Position unfavorable bar below center
        const unfavorableYPos = pairCenter + barGap / 2;

        const favorableWidth = (row.favorable / maxValue) * chartWidth;
        const unfavorableWidth = (row.unfavorable / maxValue) * chartWidth;

        // Favorable bar
        const favorableBar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        favorableBar.setAttribute("x", "0");
        favorableBar.setAttribute("y", String(favorableYPos));
        favorableBar.setAttribute("width", String(favorableWidth));
        favorableBar.setAttribute("height", String(barHeight));
        favorableBar.setAttribute("fill", favorableColor);
        g.appendChild(favorableBar);

        // Favorable count text
        const favorableText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        favorableText.setAttribute("x", String(favorableWidth / 2));
        favorableText.setAttribute("y", String(favorableYPos + barHeight / 2 + 4));
        favorableText.setAttribute("text-anchor", "middle");
        favorableText.setAttribute("font-size", "11");
        favorableText.setAttribute("font-weight", "bold");
        favorableText.setAttribute("fill", "white");
        favorableText.textContent = String(row.favorable);
        g.appendChild(favorableText);

        // Unfavorable bar
        const unfavorableBar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        unfavorableBar.setAttribute("x", "0");
        unfavorableBar.setAttribute("y", String(unfavorableYPos));
        unfavorableBar.setAttribute("width", String(unfavorableWidth));
        unfavorableBar.setAttribute("height", String(barHeight));
        unfavorableBar.setAttribute("fill", unfavorableColor);
        g.appendChild(unfavorableBar);

        // Unfavorable count text
        const unfavorableText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        unfavorableText.setAttribute("x", String(unfavorableWidth / 2));
        unfavorableText.setAttribute("y", String(unfavorableYPos + barHeight / 2 + 4));
        unfavorableText.setAttribute("text-anchor", "middle");
        unfavorableText.setAttribute("font-size", "11");
        unfavorableText.setAttribute("font-weight", "bold");
        unfavorableText.setAttribute("fill", "white");
        unfavorableText.textContent = String(row.unfavorable);
        g.appendChild(unfavorableText);

        // Label (on the left)
        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", "-10");
        label.setAttribute("y", String(pairCenter + 4));
        label.setAttribute("text-anchor", "end");
        label.setAttribute("font-size", "12");
        label.setAttribute("color", "#333");
        label.textContent = row.label.length > 20 ? row.label.substring(0, 20) + "..." : row.label;
        g.appendChild(label);
      });

      // Legend
      const legendG = document.createElementNS("http://www.w3.org/2000/svg", "g");
      legendG.setAttribute("transform", `translate(0, -15)`);

      const favorableRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      favorableRect.setAttribute("x", "0");
      favorableRect.setAttribute("y", "0");
      favorableRect.setAttribute("width", "12");
      favorableRect.setAttribute("height", "12");
      favorableRect.setAttribute("fill", favorableColor);
      legendG.appendChild(favorableRect);

      const favorableTextLegend = document.createElementNS("http://www.w3.org/2000/svg", "text");
      favorableTextLegend.setAttribute("x", "18");
      favorableTextLegend.setAttribute("y", "10");
      favorableTextLegend.setAttribute("font-size", "12");
      favorableTextLegend.textContent = "Favorable";
      legendG.appendChild(favorableTextLegend);

      const unfavorableRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      unfavorableRect.setAttribute("x", "120");
      unfavorableRect.setAttribute("y", "0");
      unfavorableRect.setAttribute("width", "12");
      unfavorableRect.setAttribute("height", "12");
      unfavorableRect.setAttribute("fill", unfavorableColor);
      legendG.appendChild(unfavorableRect);

      const unfavorableTextLegend = document.createElementNS("http://www.w3.org/2000/svg", "text");
      unfavorableTextLegend.setAttribute("x", "136");
      unfavorableTextLegend.setAttribute("y", "10");
      unfavorableTextLegend.setAttribute("font-size", "12");
      unfavorableTextLegend.textContent = "Unfavorable";
      legendG.appendChild(unfavorableTextLegend);

      g.appendChild(legendG);
      svg.appendChild(g);
    };

    const renderChart = () => {
      if (!chartRef.value) return;
      renderChartContent(chartRef.value, tableRows.value, height.value);
    };

    const renderSeparatedCharts = () => {
      Object.entries(separatedChartsData.value).forEach(([altId, altData]) => {
        const svg = separatedChartRefs.value.get(altId);
        if (svg) {
          renderChartContent(svg, altData.tableRows, altData.chartHeight);
        }
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
      await nextTick();
      if (props.selectedAlternative !== 'all-separated') {
        renderChart();
      } else {
        renderSeparatedCharts();
      }
    });

    watch(
      () => [tableRows.value, props.analysisPer, props.selectedCriterion],
      () => {
        if (props.selectedAlternative !== 'all-separated') {
          renderChart();
        }
      },
      { deep: true }
    );

    watch(
      () => [separatedChartsData.value, props.analysisPer, props.selectedCriterion],
      () => {
        if (props.selectedAlternative === 'all-separated') {
          renderSeparatedCharts();
        }
      },
      { deep: true }
    );

    return {
      chartRef,
      width,
      height,
      groupByLabel,
      alternativeLabel,
      tableRows,
      separatedChartsData,
      setSvgRef,
      renderChart,
      renderSeparatedCharts,
    };
  },
});
</script>

<style scoped>
.bar-chart-container {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.chart-wrapper {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.chart-area {
  flex: 1;
  overflow-x: auto;
}

.horizontal-bars {
  display: block;
}

.attitude-column {
  display: flex;
  flex-direction: column;
  min-width: 80px;
  text-align: center;
  gap: 0;
}

.attitude-header {
  font-weight: 600;
  font-size: 12px;
  padding: 20px 8px;
  background-color: #f5f5f5;
  margin-bottom: 0;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.attitude-item {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  border-bottom: 1px solid #eee;
  padding: 0 8px;
}

.attitude-value {
  font-size: 13px;
  font-weight: 500;
  color: #333;
}

.separated-charts-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;
}

.alternative-chart-card {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 20px;
  background-color: #fafafa;
}

.alternative-title {
  margin: 0 0 15px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}
</style>
