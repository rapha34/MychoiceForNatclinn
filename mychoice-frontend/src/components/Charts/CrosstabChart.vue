<template>
  <div class="crosstab-chart">
    <v-table>
      <thead>
        <tr>
          <th class="text-left">Criteria / Stakeholders</th>
          <th v-for="stakeholder in stakeholders" :key="stakeholder" class="text-center">
            {{ stakeholder }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="criterion in criterions" :key="criterion">
          <td class="font-weight-medium">{{ criterion }}</td>
          <td v-for="stakeholder in stakeholders" :key="`${criterion}-${stakeholder}`" class="text-center">
            <v-chip
              :color="getColor(getCellCount(criterion, stakeholder))"
              text-color="white"
              size="small"
            >
              {{ getCellCount(criterion, stakeholder) }}
            </v-chip>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from "vue";
import { NormalizedArgument } from "@/@types";

export default defineComponent({
  name: "CrosstabChart",
  props: {
    arguments: {
      type: Array as PropType<NormalizedArgument[]>,
      required: true,
    },
  },
  setup(props) {
    const stakeholders = computed(() => {
      const unique = new Set(props.arguments.map(arg => arg.stakeholder).filter(Boolean));
      return Array.from(unique).sort((a, b) => a - b);
    });

    const criterions = computed(() => {
      const unique = new Set(props.arguments.map(arg => arg.criterion).filter(Boolean));
      return Array.from(unique).sort((a, b) => a - b);
    });

    const getCellCount = (criterion: number, stakeholder: number) => {
      return props.arguments.filter(
        arg => arg.criterion === criterion && arg.stakeholder === stakeholder
      ).length;
    };

    const getColor = (count: number) => {
      if (count === 0) return "#E0E0E0";
      if (count <= 2) return "#FFEB3B";
      if (count <= 5) return "#FF9800";
      return "#F44336";
    };

    return {
      stakeholders,
      criterions,
      getCellCount,
      getColor,
    };
  },
});
</script>

<style scoped>
.crosstab-chart {
  overflow-x: auto;
  max-height: 500px;
  overflow-y: auto;
}

:deep(.v-table) {
  font-size: 12px;
}

:deep(.v-table th) {
  background-color: #f5f5f5;
  font-weight: 600;
  padding: 12px 8px;
}

:deep(.v-table td) {
  padding: 8px;
  min-width: 80px;
}
</style>
