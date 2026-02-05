<template>
  <div class="alternatives-comparison">
    <svg ref="chartRef" :width="width" :height="height"></svg>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, PropType, computed } from "vue";
import { NormalizedArgument } from "@/@types";

export default defineComponent({
  name: "AlternativesComparison",
  props: {
    arguments: {
      type: Array as PropType<NormalizedArgument[]>,
      required: true,
    },
  },
  setup(props) {
    const chartRef = ref<SVGSVGElement | null>(null);
    const width = 800;
    const height = 400;

    const chartData = computed(() => {
      const grouped: Record<string, { favorable: number; unfavorable: number }> = {};
      
      props.arguments.forEach((arg) => {
        const alt = arg.alternative || "Unknown";
        if (!grouped[alt]) {
          grouped[alt] = { favorable: 0, unfavorable: 0 };
        }
        if (arg.favorable) {
          grouped[alt].favorable++;
        } else {
          grouped[alt].unfavorable++;
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

      const margin = { top: 20, right: 20, bottom: 60, left: 60 };
      const chartWidth = width - margin.left - margin.right;
      const chartHeight = height - margin.top - margin.bottom;

      const maxValue = Math.max(
        ...entries.map(([, values]) => values.favorable + values.unfavorable)
      );

      const barWidth = chartWidth / entries.length / 2.5;
      const spacing = chartWidth / entries.length;

      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("transform", `translate(${margin.left},${margin.top})`);

      // Draw bars
      entries.forEach(([label, values], index) => {
        const x = index * spacing;
        const favorableHeight = (values.favorable / maxValue) * chartHeight;
        const unfavorableHeight = (values.unfavorable / maxValue) * chartHeight;

        // Favorable bar
        const favorableBar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        favorableBar.setAttribute("x", String(x));
        favorableBar.setAttribute("y", String(chartHeight - favorableHeight));
        favorableBar.setAttribute("width", String(barWidth));
        favorableBar.setAttribute("height", String(favorableHeight));
        favorableBar.setAttribute("fill", "#4CAF50");
        g.appendChild(favorableBar);

        // Unfavorable bar
        const unfavorableBar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        unfavorableBar.setAttribute("x", String(x + barWidth + 5));
        unfavorableBar.setAttribute("y", String(chartHeight - unfavorableHeight));
        unfavorableBar.setAttribute("width", String(barWidth));
        unfavorableBar.setAttribute("height", String(unfavorableHeight));
        unfavorableBar.setAttribute("fill", "#F44336");
        g.appendChild(unfavorableBar);

        // Label
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", String(x + barWidth));
        text.setAttribute("y", String(chartHeight + 20));
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("font-size", "12");
        text.setAttribute("transform", `rotate(45, ${x + barWidth}, ${chartHeight + 20})`);
        text.textContent = label.length > 12 ? label.substring(0, 12) + "..." : label;
        g.appendChild(text);
      });

      // Y-axis
      const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
      yAxis.setAttribute("x1", "0");
      yAxis.setAttribute("y1", "0");
      yAxis.setAttribute("x2", "0");
      yAxis.setAttribute("y2", String(chartHeight));
      yAxis.setAttribute("stroke", "#666");
      g.appendChild(yAxis);

      // X-axis
      const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
      xAxis.setAttribute("x1", "0");
      xAxis.setAttribute("y1", String(chartHeight));
      xAxis.setAttribute("x2", String(chartWidth));
      xAxis.setAttribute("y2", String(chartHeight));
      xAxis.setAttribute("stroke", "#666");
      g.appendChild(xAxis);

      svg.appendChild(g);
    };

    onMounted(() => {
      renderChart();
    });

    watch(() => props.arguments, () => {
      renderChart();
    }, { deep: true });

    return {
      chartRef,
      width,
      height,
    };
  },
});
</script>

<style scoped>
.alternatives-comparison {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
