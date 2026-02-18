<template>
  <div class="crosstab-chart">
    <v-table>
      <thead>
        <tr>
          <th class="text-left">Criteria / Stakeholders</th>
          <th v-for="stakeholder in stakeholders" :key="stakeholder.id" class="text-center">
            {{ stakeholder.name }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="criterion in criterions" :key="criterion.id">
          <td class="font-weight-medium">{{ criterion.name }}</td>
          <td 
            v-for="stakeholder in stakeholders" 
            :key="`${criterion.id}-${stakeholder.id}`" 
            class="text-center count-cell"
            :style="{ backgroundColor: getCountColor(getCellCount(criterion.id, stakeholder.id)) }"
          >
            <div class="cell-content">
              <div class="count">{{ getCellCount(criterion.id, stakeholder.id) }}</div>
              <div class="attitude" v-if="getCellCount(criterion.id, stakeholder.id) > 0">
                {{ getAttitude(criterion.id, stakeholder.id).toFixed(2) }}
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from "vue";
import { NormalizedArgument, NormalizedObject } from "@/@types";

export default defineComponent({
  name: "CrosstabChart",
  props: {
    arguments: {
      type: Array as PropType<NormalizedArgument[]>,
      required: true,
    },
    stakeholdersMap: {
      type: Object as PropType<NormalizedObject | null>,
      default: null,
    },
    criterionsMap: {
      type: Object as PropType<NormalizedObject | null>,
      default: null,
    },
  },
  setup(props) {
    const stakeholders = computed(() => {
      if (!props.stakeholdersMap) return [];
      return Object.values(props.stakeholdersMap).sort((a, b) => a.name.localeCompare(b.name));
    });

    const criterions = computed(() => {
      if (!props.criterionsMap) return [];
      return Object.values(props.criterionsMap).sort((a, b) => a.name.localeCompare(b.name));
    });

    const getAttitude = (criterionId: number, stakeholderId: number) => {
      const filtered = props.arguments.filter(
        arg => arg.criterion === criterionId && arg.stakeholder === stakeholderId
      );
      if (filtered.length === 0) return 0.5;
      const favorable = filtered.filter(arg => arg.favorable).length;
      return (favorable + 1) / (filtered.length + 2);
    };

    const getCellCount = (criterionId: number, stakeholderId: number) => {
      return props.arguments.filter(
        arg => arg.criterion === criterionId && arg.stakeholder === stakeholderId
      ).length;
    };

    const getCountColor = (count: number) => {
      if (count === 0) return "#ffffff";
      if (count <= 2) return "#ffc107";
      if (count <= 5) return "#ff9800";
      return "#f44336";
    };

    return {
      stakeholders,
      criterions,
      getCellCount,
      getCountColor,
      getAttitude,
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

.count-cell {
  padding: 4px 8px !important;
}

.cell-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.count {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.attitude {
  font-size: 11px;
  font-weight: 500;
  color: #666;
}
</style>
