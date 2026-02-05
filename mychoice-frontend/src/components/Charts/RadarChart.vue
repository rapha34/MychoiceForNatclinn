<template>
  <div class="radar-chart">
    <svg ref="chartRef" :width="width" :height="height"></svg>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, PropType } from "vue";

export default defineComponent({
  name: "RadarChart",
  props: {
    data: {
      type: Object as PropType<Record<string, { favorable: number; unfavorable: number }>>,
      required: true,
    },
  },
  setup(props) {
    const chartRef = ref<SVGSVGElement | null>(null);
    const width = 600;
    const height = 600;

    const renderChart = () => {
      if (!chartRef.value) return;

      const svg = chartRef.value;
      svg.innerHTML = "";

      const entries = Object.entries(props.data);
      if (entries.length === 0) return;

      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 2 - 100;

      const maxValue = Math.max(
        ...entries.map(([, values]) => values.favorable + values.unfavorable)
      );

      const angleStep = (2 * Math.PI) / entries.length;

      // Draw background circles
      for (let i = 1; i <= 5; i++) {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", String(centerX));
        circle.setAttribute("cy", String(centerY));
        circle.setAttribute("r", String((radius / 5) * i));
        circle.setAttribute("fill", "none");
        circle.setAttribute("stroke", "#e0e0e0");
        circle.setAttribute("stroke-width", "1");
        svg.appendChild(circle);
      }

      // Draw axis lines
      entries.forEach((_, index) => {
        const angle = angleStep * index - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", String(centerX));
        line.setAttribute("y1", String(centerY));
        line.setAttribute("x2", String(x));
        line.setAttribute("y2", String(y));
        line.setAttribute("stroke", "#e0e0e0");
        line.setAttribute("stroke-width", "1");
        svg.appendChild(line);
      });

      // Draw data polygon
      const points: string[] = [];
      entries.forEach(([, values], index) => {
        const value = values.favorable + values.unfavorable;
        const normalizedValue = (value / maxValue) * radius;
        const angle = angleStep * index - Math.PI / 2;
        const x = centerX + normalizedValue * Math.cos(angle);
        const y = centerY + normalizedValue * Math.sin(angle);
        points.push(`${x},${y}`);
      });

      const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      polygon.setAttribute("points", points.join(" "));
      polygon.setAttribute("fill", "rgba(33, 150, 243, 0.3)");
      polygon.setAttribute("stroke", "#2196F3");
      polygon.setAttribute("stroke-width", "2");
      svg.appendChild(polygon);

      // Draw labels
      entries.forEach(([label], index) => {
        const angle = angleStep * index - Math.PI / 2;
        const labelRadius = radius + 30;
        const x = centerX + labelRadius * Math.cos(angle);
        const y = centerY + labelRadius * Math.sin(angle);

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", String(x));
        text.setAttribute("y", String(y));
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("font-size", "12");
        text.textContent = label.length > 12 ? label.substring(0, 12) + "..." : label;
        svg.appendChild(text);
      });
    };

    onMounted(() => {
      renderChart();
    });

    watch(() => props.data, () => {
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
.radar-chart {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
