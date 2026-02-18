<template>
  <div class="alternatives-comparison">
    <div class="table-wrapper">
      <v-table class="heatmap-table">
        <thead>
          <tr>
            <th class="criteria-header">{{ rowLabel }}</th>
            <th
              v-for="alt in alternatives"
              :key="alt.id"
              class="alternative-header"
            >
              {{ alt.name }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td class="criterion-name">{{ row.name }}</td>
            <td
              v-for="alt in alternatives"
              :key="alt.id"
              class="attitude-cell"
              :style="{ backgroundColor: getCellColor(getAttitude(row.id, alt.id)) }"
            >
              {{ getAttitude(row.id, alt.id).toFixed(2) }}
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>
    <!-- <div class="export-section">
      <v-btn
        variant="outlined"
        color="primary"
        @click="exportToPDF"
      >
        EXPORT TO PDF
      </v-btn>
    </div> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from "vue";
import { NormalizedArgument, NormalizedObject } from "@/@types";
import { calculateSimpleAttitude } from "@/store/attitude";

export default defineComponent({
  name: "AlternativesComparison",
  props: {
    arguments: {
      type: Array as PropType<NormalizedArgument[]>,
      required: true,
    },
    criterionsMap: {
      type: Object as PropType<NormalizedObject | null>,
      default: null,
    },
    alternativesMap: {
      type: Object as PropType<NormalizedObject | null>,
      default: null,
    },
    stakeholdersMap: {
      type: Object as PropType<NormalizedObject | null>,
      default: null,
    },
    analysisPer: {
      type: String,
      default: "criteria",
    },
  },
  setup(props) {
    // Determine row and column headers based on analysisPer
    const rowLabel = computed(() => {
      return props.analysisPer === "stakeholder" ? "Stakeholders" : "Criteria";
    });

    // Get sorted list of alternatives (always columns)
    const alternatives = computed(() => {
      if (!props.alternativesMap) return [];
      return Object.values(props.alternativesMap).sort((a, b) => a.id - b.id);
    });

    // Get sorted list of rows (criteria or stakeholders depending on analysisPer)
    const rows = computed(() => {
      if (props.analysisPer === "stakeholder") {
        if (!props.stakeholdersMap) return [];
        return Object.values(props.stakeholdersMap).sort((a, b) => a.id - b.id);
      } else {
        if (!props.criterionsMap) return [];
        return Object.values(props.criterionsMap).sort((a, b) => a.id - b.id);
      }
    });

    // Calculate collective attitude
    const getAttitude = (rowId: number, alternativeId: number): number => {
      let filtered = props.arguments;
      
      if (props.analysisPer === "stakeholder") {
        // rows = stakeholders, columns = alternatives
        filtered = filtered.filter(
          arg => arg.stakeholder === rowId && arg.alternative === alternativeId
        );
      } else {
        // rows = criteria, columns = alternatives
        filtered = filtered.filter(
          arg => arg.criterion === rowId && arg.alternative === alternativeId
        );
      }
      
      if (filtered.length === 0) return 0.5;
      
      // Use the formula-based attitude: (favorable + 1) / (total + 2)
      const favorable = filtered.filter(arg => arg.favorable).length;
      const total = filtered.length;
      
      return (favorable + 1) / (total + 2);
    };

    // Get cell background color based on attitude value
    const getCellColor = (attitude: number): string => {
      if (attitude === 0) return "#ffffff";
      if (attitude < 0.35) return "#f44336"; // Red
      if (attitude < 0.50) return "#ff9800"; // Orange
      if (attitude < 0.60) return "#ffc107"; // Amber
      return "#4caf50"; // Green
    };

    const exportToPDF = () => {
      // TODO: Implement PDF export
      console.log("Export to PDF");
    };

    return {
      alternatives,
      rows,
      rowLabel,
      getAttitude,
      getCellColor,
      exportToPDF,
    };
  },
});
</script>

<style scoped>
.alternatives-comparison {
  width: 100%;
}

.table-wrapper {
  overflow-x: auto;
  margin-bottom: 20px;
}

.heatmap-table {
  width: 100%;
  border-collapse: collapse;
}

.heatmap-table th,
.heatmap-table td {
  border: 1px solid #ddd;
  padding: 12px 16px;
  text-align: center;
}

.criteria-header {
  background-color: #f5f5f5;
  font-weight: 600;
  text-align: left !important;
  width: 300px;
}

.alternative-header {
  background-color: #f5f5f5;
  font-weight: 600;
  min-width: 200px;
}

.criterion-name {
  font-weight: 500;
  text-align: left !important;
  background-color: #fafafa;
}

.attitude-cell {
  font-weight: 600;
  font-size: 16px;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.export-section {
  display: flex;
  justify-content: flex-start;
  padding: 10px 0;
}
</style>
