<template>
  <div class="circle-chart">
    <!-- Alternative title header (always shown) -->
    <div class="alternative-title-header">{{ alternativeTitle }}</div>

    <!-- Mode merged: single chart -->
    <template v-if="selectedAlternative !== 'all-separated'">
      <div class="table-container">
        <svg :width="tableWidth" :height="tableHeight" class="circle-svg">
          <!-- Grid lines -->
          <g class="grid">
            <!-- Horizontal lines -->
            <line :x1="labelWidth" :y1="0" :x2="tableWidth" :y2="0" stroke="#ddd" stroke-width="1" />
            <line :x1="labelWidth" :y1="headerHeight" :x2="tableWidth" :y2="headerHeight" stroke="#ddd" stroke-width="1" />
            <line :x1="labelWidth" :y1="headerHeight + rowHeight" :x2="tableWidth" :y2="headerHeight + rowHeight" stroke="#ddd" stroke-width="1" />
            <line :x1="labelWidth" :y1="headerHeight + rowHeight * 2" :x2="tableWidth" :y2="headerHeight + rowHeight * 2" stroke="#ddd" stroke-width="1" />
            
            <!-- Vertical lines -->
            <line :x1="labelWidth" :y1="0" :x2="labelWidth" :y2="headerHeight + rowHeight * 2" stroke="#ddd" stroke-width="1" />
            <line
              v-for="index in itemsData.length"
              :key="'vline-' + index"
              :x1="labelWidth + index * cellWidth"
              :y1="0"
              :x2="labelWidth + index * cellWidth"
              :y2="headerHeight + rowHeight * 2"
              stroke="#ddd"
              stroke-width="1"
            />
          </g>

          <!-- Header row with criterion names -->
          <g class="headers">
            <g v-for="(data, index) in itemsData" :key="'header-' + data.itemId">
              <text
                v-if="!getSplitText(data.itemName).line2"
                :x="getCellCenterX(index)"
                :y="headerHeight / 2 + 5"
                text-anchor="middle"
                font-size="13"
                font-weight="500"
                fill="#333"
              >
                {{ getSplitText(data.itemName).line1 }}
              </text>
              <template v-else>
                <text
                  :x="getCellCenterX(index)"
                  :y="headerHeight / 2 - 5"
                  text-anchor="middle"
                  font-size="13"
                  font-weight="500"
                  fill="#333"
                >
                  {{ getSplitText(data.itemName).line1 }}
                </text>
                <text
                  :x="getCellCenterX(index)"
                  :y="headerHeight / 2 + 10"
                  text-anchor="middle"
                  font-size="13"
                  font-weight="500"
                  fill="#333"
                >
                  {{ getSplitText(data.itemName).line2 }}
                </text>
              </template>
            </g>
          </g>

          <!-- Row labels -->
          <text
            :x="labelWidth / 2"
            :y="headerHeight + rowHeight / 2 + 5"
            text-anchor="middle"
            font-size="18"
            font-weight="500"
            fill="#333"
          >
            +
          </text>
          <text
            :x="labelWidth / 2"
            :y="headerHeight + rowHeight * 1.5 + 5"
            text-anchor="middle"
            font-size="18"
            font-weight="500"
            fill="#333"
          >
            -
          </text>

          <!-- Circles and connecting lines -->
          <g v-for="(data, index) in itemsData" :key="'circles-' + data.itemId">
            <!-- Connecting line -->
            <line
              v-if="data.favorable > 0 && data.unfavorable > 0"
              :x1="getCellCenterX(index)"
              :y1="getFavorableY() + getCircleRadius(data.favorable)"
              :x2="getCellCenterX(index)"
              :y2="getUnfavorableY() - getCircleRadius(data.unfavorable)"
              stroke="#999"
              stroke-width="1"
              stroke-dasharray="3,3"
            />
            
            <!-- Favorable circle (green) -->
            <circle
              v-if="data.favorable > 0"
              :cx="getCellCenterX(index)"
              :cy="getFavorableY()"
              :r="getCircleRadius(data.favorable)"
              fill="#4CAF50"
              stroke="white"
              stroke-width="2"
            />
            
            <!-- Unfavorable circle (red) -->
            <circle
              v-if="data.unfavorable > 0"
              :cx="getCellCenterX(index)"
              :cy="getUnfavorableY()"
              :r="getCircleRadius(data.unfavorable)"
              fill="#F44336"
              stroke="white"
              stroke-width="2"
            />
            
            <!-- Favorable count text -->
            <text
              v-if="data.favorable > 0"
              :x="getCellCenterX(index)"
              :y="getFavorableY() + 5"
              text-anchor="middle"
              font-size="14"
              font-weight="bold"
              fill="white"
            >
              {{ data.favorable }}
            </text>
            
            <!-- Unfavorable count text -->
            <text
              v-if="data.unfavorable > 0"
              :x="getCellCenterX(index)"
              :y="getUnfavorableY() + 5"
              text-anchor="middle"
              font-size="14"
              font-weight="bold"
              fill="white"
            >
              {{ data.unfavorable }}
            </text>
          </g>

          <!-- Criterion/Stakeholder label in header row -->
          <text
            :x="labelWidth / 2"
            :y="headerHeight / 2 + 5"
            text-anchor="middle"
            font-size="11"
            font-weight="500"
            fill="#666"
          >
            {{ analysisPer === "stakeholder" ? "Stakeholder" : "Criterion" }}
          </text>
        </svg>

        <!-- Footer with collective attitude -->
        <div class="footer-container">
          <div class="footer-label">
            <span>Collective attitude</span>
          </div>
          <div class="footer-values" :style="{ width: (tableWidth - labelWidth) + 'px' }">
            <div
              v-for="(data, index) in itemsData"
              :key="'footer-' + data.itemId"
              class="attitude-cell"
              :style="{ left: (index * cellWidth) + 'px', width: cellWidth + 'px' }"
            >
              {{ data.attitude.toFixed(2) }}
            </div>
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
          <div class="table-container">
            <svg :width="altData.tableWidth" :height="altData.tableHeight" class="circle-svg">
              <!-- Grid lines -->
              <g class="grid">
                <!-- Horizontal lines -->
                <line :x1="labelWidth" :y1="0" :x2="altData.tableWidth" :y2="0" stroke="#ddd" stroke-width="1" />
                <line :x1="labelWidth" :y1="headerHeight" :x2="altData.tableWidth" :y2="headerHeight" stroke="#ddd" stroke-width="1" />
                <line :x1="labelWidth" :y1="headerHeight + rowHeight" :x2="altData.tableWidth" :y2="headerHeight + rowHeight" stroke="#ddd" stroke-width="1" />
                <line :x1="labelWidth" :y1="headerHeight + rowHeight * 2" :x2="altData.tableWidth" :y2="headerHeight + rowHeight * 2" stroke="#ddd" stroke-width="1" />
                
                <!-- Vertical lines -->
                <line :x1="labelWidth" :y1="0" :x2="labelWidth" :y2="headerHeight + rowHeight * 2" stroke="#ddd" stroke-width="1" />
                <line
                  v-for="index in altData.itemsData.length"
                  :key="'vline-alt-' + altId + '-' + index"
                  :x1="labelWidth + index * altData.cellWidth"
                  :y1="0"
                  :x2="labelWidth + index * altData.cellWidth"
                  :y2="headerHeight + rowHeight * 2"
                  stroke="#ddd"
                  stroke-width="1"
                />
              </g>

              <!-- Header row with criterion names -->
              <g class="headers">
                <g v-for="(data, index) in altData.itemsData" :key="'header-alt-' + altId + '-' + data.itemId">
                  <text
                    v-if="!getSplitText(data.itemName).line2"
                    :x="labelWidth + index * altData.cellWidth + altData.cellWidth / 2"
                    :y="headerHeight / 2 + 5"
                    text-anchor="middle"
                    font-size="13"
                    font-weight="500"
                    fill="#333"
                  >
                    {{ getSplitText(data.itemName).line1 }}
                  </text>
                  <template v-else>
                    <text
                      :x="labelWidth + index * altData.cellWidth + altData.cellWidth / 2"
                      :y="headerHeight / 2 - 5"
                      text-anchor="middle"
                      font-size="13"
                      font-weight="500"
                      fill="#333"
                    >
                      {{ getSplitText(data.itemName).line1 }}
                    </text>
                    <text
                      :x="labelWidth + index * altData.cellWidth + altData.cellWidth / 2"
                      :y="headerHeight / 2 + 10"
                      text-anchor="middle"
                      font-size="13"
                      font-weight="500"
                      fill="#333"
                    >
                      {{ getSplitText(data.itemName).line2 }}
                    </text>
                  </template>
                </g>
              </g>

              <!-- Row labels -->
              <text
                :x="labelWidth / 2"
                :y="headerHeight + rowHeight / 2 + 5"
                text-anchor="middle"
                font-size="18"
                font-weight="500"
                fill="#333"
              >
                +
              </text>
              <text
                :x="labelWidth / 2"
                :y="headerHeight + rowHeight * 1.5 + 5"
                text-anchor="middle"
                font-size="18"
                font-weight="500"
                fill="#333"
              >
                -
              </text>

              <!-- Circles and connecting lines -->
              <g v-for="(data, index) in altData.itemsData" :key="'circles-alt-' + altId + '-' + data.itemId">
                <!-- Connecting line -->
                <line
                  v-if="data.favorable > 0 && data.unfavorable > 0"
                  :x1="labelWidth + index * altData.cellWidth + altData.cellWidth / 2"
                  :y1="headerHeight + rowHeight / 2 + getCircleRadiusSeparated(data.favorable, altData.itemsData)"
                  :x2="labelWidth + index * altData.cellWidth + altData.cellWidth / 2"
                  :y2="headerHeight + rowHeight * 1.5 - getCircleRadiusSeparated(data.unfavorable, altData.itemsData)"
                  stroke="#999"
                  stroke-width="1"
                  stroke-dasharray="3,3"
                />
                
                <!-- Favorable circle (green) -->
                <circle
                  v-if="data.favorable > 0"
                  :cx="labelWidth + index * altData.cellWidth + altData.cellWidth / 2"
                  :cy="headerHeight + rowHeight / 2"
                  :r="getCircleRadiusSeparated(data.favorable, altData.itemsData)"
                  fill="#4CAF50"
                  stroke="white"
                  stroke-width="2"
                />
                
                <!-- Unfavorable circle (red) -->
                <circle
                  v-if="data.unfavorable > 0"
                  :cx="labelWidth + index * altData.cellWidth + altData.cellWidth / 2"
                  :cy="headerHeight + rowHeight * 1.5"
                  :r="getCircleRadiusSeparated(data.unfavorable, altData.itemsData)"
                  fill="#F44336"
                  stroke="white"
                  stroke-width="2"
                />
                
                <!-- Favorable count text -->
                <text
                  v-if="data.favorable > 0"
                  :x="labelWidth + index * altData.cellWidth + altData.cellWidth / 2"
                  :y="headerHeight + rowHeight / 2 + 5"
                  text-anchor="middle"
                  font-size="14"
                  font-weight="bold"
                  fill="white"
                >
                  {{ data.favorable }}
                </text>
                
                <!-- Unfavorable count text -->
                <text
                  v-if="data.unfavorable > 0"
                  :x="labelWidth + index * altData.cellWidth + altData.cellWidth / 2"
                  :y="headerHeight + rowHeight * 1.5 + 5"
                  text-anchor="middle"
                  font-size="14"
                  font-weight="bold"
                  fill="white"
                >
                  {{ data.unfavorable }}
                </text>
              </g>

              <!-- Criterion/Stakeholder label in header row -->
              <text
                :x="labelWidth / 2"
                :y="headerHeight / 2 + 5"
                text-anchor="middle"
                font-size="11"
                font-weight="500"
                fill="#666"
              >
                {{ analysisPer === "stakeholder" ? "Stakeholder" : "Criterion" }}
              </text>
            </svg>

            <!-- Footer with collective attitude -->
            <div class="footer-container">
              <div class="footer-label">
                <span>Collective attitude</span>
              </div>
              <div class="footer-values" :style="{ width: (altData.tableWidth - labelWidth) + 'px' }">
                <div
                  v-for="(data, index) in altData.itemsData"
                  :key="'footer-alt-' + altId + '-' + data.itemId"
                  class="attitude-cell"
                  :style="{ left: (index * altData.cellWidth) + 'px', width: altData.cellWidth + 'px' }"
                >
                  {{ data.attitude.toFixed(2) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from "vue";
import { NormalizedArgument, NormalizedObject } from "@/@types";

export default defineComponent({
  name: "CircleChart",
  props: {
    arguments: {
      type: Array as PropType<NormalizedArgument[]>,
      required: true,
    },
    criterionsMap: {
      type: Object as PropType<NormalizedObject | null>,
      default: null,
    },
    selectedCriterion: {
      type: [String, Number],
      default: "",
    },
    analysisPer: {
      type: String,
      default: "criteria",
    },
    stakeholdersMap: {
      type: Object as PropType<NormalizedObject | null>,
      default: null,
    },
    selectedAlternative: {
      type: String,
      default: "all-merged",
    },
    alternativesMap: {
      type: Object as PropType<NormalizedObject | null>,
      default: null,
    },
  },
  setup(props) {
    const labelWidth = 60;
    const headerHeight = 60;
    const rowHeight = 250;
    const minRadius = 20;
    const maxRadius = 70;
    const minCellWidth = 140;
    const maxCellWidth = 260;

    // Filter arguments by selected criterion and alternative
    const filteredArguments = computed(() => {
      let filtered = [...props.arguments];

      // Filter by alternative if selected
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

      // Filter by criterion if selected (only applies in criteria mode)
      if (props.analysisPer === "criteria" && props.selectedCriterion !== "" && props.selectedCriterion !== null) {
        const criterionId = Number(props.selectedCriterion);
        if (!Number.isNaN(criterionId)) {
          filtered = filtered.filter((arg) => arg.criterion === criterionId);
        }
      }
      return filtered;
    });

    // Helper function to generate items data from arguments
    const generateItemsData = (args: NormalizedArgument[]) => {
      const grouped = new Map<number, { favorable: number; unfavorable: number }>();
      
      args.forEach(arg => {
        const groupKey = props.analysisPer === "stakeholder" ? arg.stakeholder : arg.criterion;
        if (!grouped.has(groupKey)) {
          grouped.set(groupKey, { favorable: 0, unfavorable: 0 });
        }
        const entry = grouped.get(groupKey)!;
        if (arg.favorable) {
          entry.favorable++;
        } else {
          entry.unfavorable++;
        }
      });

      const result = Array.from(grouped.entries()).map(([itemId, counts]) => {
        const total = counts.favorable + counts.unfavorable;
        const attitude = (counts.favorable + 1) / (total + 2);
        
        let itemName = `Item ${itemId}`;
        if (props.analysisPer === "stakeholder") {
          itemName = props.stakeholdersMap?.[itemId]?.name || `Stakeholder ${itemId}`;
        } else {
          itemName = props.criterionsMap?.[itemId]?.name || `Criterion ${itemId}`;
        }
        
        return {
          itemId,
          itemName,
          favorable: counts.favorable,
          unfavorable: counts.unfavorable,
          attitude,
        };
      });
      
      return result;
    };

    // Group arguments by criterion or stakeholder depending on analysisPer
    const itemsData = computed(() => {
      return generateItemsData(filteredArguments.value);
    });

    // Generate separated charts data (one per alternative)
    const separatedChartsData = computed(() => {
      const result: Record<string, any> = {};
      const alternatives = props.alternativesMap || {};

      Object.entries(alternatives).forEach(([altId, alt]) => {
        const filtered = props.arguments.filter((arg) => arg.alternative === alt.id);
        
        // Apply criterion filter if in criteria mode
        let finalFiltered = filtered;
        if (props.analysisPer === "criteria" && props.selectedCriterion !== "" && props.selectedCriterion !== null) {
          const criterionId = Number(props.selectedCriterion);
          if (!Number.isNaN(criterionId)) {
            finalFiltered = finalFiltered.filter((arg) => arg.criterion === criterionId);
          }
        }

        const itemsForAlt = generateItemsData(finalFiltered);
        
        // Calculate cell width and table width for this alternative
        const cellWidthForAlt = itemsForAlt.length === 0 
          ? minCellWidth 
          : Math.max(minCellWidth, Math.min(maxCellWidth, (Math.max(...itemsForAlt.map(d => d.itemName.length)) * 6 + 40)));
        
        const tableWidthForAlt = labelWidth + itemsForAlt.length * cellWidthForAlt;

        result[String(altId)] = {
          id: altId,
          name: alt.name,
          itemsData: itemsForAlt,
          cellWidth: cellWidthForAlt,
          tableWidth: tableWidthForAlt,
          tableHeight: headerHeight + rowHeight * 2,
        };
      });

      return result;
    });

    const cellWidth = computed(() => {
      if (itemsData.value.length === 0) return minCellWidth;
      
      const maxNameLength = Math.max(...itemsData.value.map(d => d.itemName.length));
      
      // Base width calculation: 6px per character, with min/max bounds
      let width = Math.max(minCellWidth, Math.min(maxCellWidth, maxNameLength * 6 + 40));
      
      return width;
    });

    const tableWidth = computed(() => {
      return labelWidth + itemsData.value.length * cellWidth.value;
    });

    function getSplitText(text: string): { line1: string; line2: string } {
      if (text.length <= 25) {
        return { line1: text, line2: "" };
      }
      
      // Find a good split point (around middle or at a space)
      const midPoint = Math.ceil(text.length / 2);
      let splitPoint = midPoint;
      
      // Try to find a space near the midpoint
      for (let i = midPoint; i >= Math.max(0, midPoint - 10); i--) {
        if (text[i] === ' ') {
          splitPoint = i;
          break;
        }
      }
      
      // If no space found before, search after
      if (splitPoint === midPoint && text[midPoint] !== ' ') {
        for (let i = midPoint + 1; i < Math.min(text.length, midPoint + 10); i++) {
          if (text[i] === ' ') {
            splitPoint = i;
            break;
          }
        }
      }
      
      const line1 = text.substring(0, splitPoint).trim();
      const line2 = text.substring(splitPoint).trim();
      
      return { line1, line2 };
    }

    const tableHeight = headerHeight + rowHeight * 2;

    function getCellCenterX(index: number): number {
      return labelWidth + index * cellWidth.value + cellWidth.value / 2;
    }

    function getFavorableY(): number {
      return headerHeight + rowHeight / 2;
    }

    function getUnfavorableY(): number {
      return headerHeight + rowHeight * 1.5;
    }

    function getCircleRadius(count: number): number {
      if (count === 0) return 0;
      const maxCount = Math.max(...itemsData.value.flatMap(d => [d.favorable, d.unfavorable]));
      if (maxCount === 0) return minRadius;
      const scale = Math.sqrt(count / maxCount);
      return minRadius + (maxRadius - minRadius) * scale;
    }

    function getCircleRadiusSeparated(count: number, itemsDataList: any[]): number {
      if (count === 0) return 0;
      const maxCount = Math.max(...itemsDataList.flatMap(d => [d.favorable, d.unfavorable]));
      if (maxCount === 0) return minRadius;
      const scale = Math.sqrt(count / maxCount);
      return minRadius + (maxRadius - minRadius) * scale;
    }

    const alternativeTitle = computed(() => {
      if (
        !props.selectedAlternative ||
        props.selectedAlternative === "all-merged" ||
        props.selectedAlternative === "all-separated"
      ) {
        return "All alternatives";
      }
      return props.selectedAlternative;
    });

    return {
      itemsData,
      separatedChartsData,
      tableWidth,
      tableHeight,
      labelWidth,
      headerHeight,
      rowHeight,
      cellWidth,
      getCellCenterX,
      getFavorableY,
      getUnfavorableY,
      getCircleRadius,
      getCircleRadiusSeparated,
      getSplitText,
      alternativeTitle,
    };
  },
});
</script>

<style scoped>
.circle-chart {
  width: 100%;
  overflow-x: auto;
  padding: 20px;
  background: white;
}

.table-container {
  display: inline-block;
  min-width: 100%;
}

.circle-svg {
  display: block;
}

.footer-container {
  display: flex;
  align-items: center;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  background: #fafafa;
  height: 60px;
}

.footer-label {
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  color: #333;
  font-weight: 500;
  border-right: 1px solid #ddd;
  height: 100%;
  padding: 0 4px;
}

.footer-label span {
  text-align: center;
  line-height: 1.2;
}

.footer-values {
  flex: 1;
  position: relative;
  height: 100%;
}

.attitude-cell {
  position: absolute;
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  border-right: 1px solid #ddd;
}

:deep(.v-btn) {
  min-width: 18px !important;
  width: 18px !important;
  height: 18px !important;
}

:deep(.v-btn .v-icon) {
  font-size: 12px !important;
}

.alternative-title-header {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  padding: 0 20px;
}

.separated-charts-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 0;
}

.alternative-chart-card {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 20px;
  background: white;
}

.alternative-title {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}
</style>
