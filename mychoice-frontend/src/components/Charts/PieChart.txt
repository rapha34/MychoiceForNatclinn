<template>
  <div class="pie-chart">
    <svg ref="chartRef" :width="width" :height="height"></svg>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, PropType, computed } from "vue";
import { NormalizedArgument, NormalizedObject } from "@/@types";

export default defineComponent({
  name: "PieChart",
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
    const width = 600;
    const height = 400;

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
      const radius = Math.min(width, height) / 2 - 80;

      const colors = [
        "#2196F3", "#4CAF50", "#FF9800", "#F44336", "#9C27B0",
        "#00BCD4", "#8BC34A", "#FFC107", "#E91E63", "#3F51B5"
      ];

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

        // Label
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelRadius = radius + 40;
        const labelX = centerX + labelRadius * Math.cos(labelAngle);
        const labelY = centerY + labelRadius * Math.sin(labelAngle);

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", String(labelX));
        text.setAttribute("y", String(labelY));
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("font-size", "12");
        text.textContent = `${label.substring(0, 12)}... (${Math.round((value / total) * 100)}%)`;
        svg.appendChild(text);

        currentAngle = endAngle;
      });
    };

    onMounted(() => {
      renderChart();
    });

    watch(
      () => [chartData.value, props.analysisPer, props.selectedAlternative, props.selectedCriterion],
      () => {
        renderChart();
      },
      { deep: true }
    );

    return {
      chartRef,
      width,
      height,
    };
  },
});
</script>

<style scoped>
.pie-chart {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
