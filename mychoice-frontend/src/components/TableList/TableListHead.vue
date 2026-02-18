<template>
  <tr class="text-uppercase">
    <th class="criterion table-head-cell">Criterion</th>
    <th class="aim table-head-cell">Aim</th>
    <th
      v-for="alternativeId in alternativesIds"
      :key="`alternative-${alternativeId}`"
      :colspan="subOptionsIds.length"
      class="alternative table-head-cell"
      @click="openProductDialog(alternativeId)"
      style="cursor: pointer;"
    >
      <span class="alternative-content">
        <v-icon v-if="state.data?.alternatives?.[alternativeId]?.icon" class="mr-2">
          {{ state.data.alternatives[alternativeId].icon }}
        </v-icon>
        <span class="alternative-name">{{ getAlternatives[alternativeId]?.name || 'Unnamed' }}</span>
        <v-icon v-if="hasProductInfo(alternativeId)"  size="x-small" class="ml-2 text-info"></v-icon>
      </span>
    </th>
  </tr>

  <!-- Product Details Dialog -->
  <ProductDetailsDialog
    v-model="showProductDialog"
    :alternative="selectedAlternative"
    :products="state.project?.products || []"
    :compositions="state.project?.compositions || []"
  />
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import {
  state,
  alternativesIds,
  subOptionsIds,
  getAlternatives
} from "@/store";
import ProductDetailsDialog from "@/components/ProductDetailsDialog.vue";

export default defineComponent({
  name: "TableListHead",
  components: {
    ProductDetailsDialog,
  },
  data() {
    return {
      showProductDialog: false,
      selectedAlternativeId: null as number | null,
    };
  },
  setup() {
    return {
      state,
      alternativesIds: computed(() => alternativesIds()),
      subOptionsIds: computed(() => subOptionsIds()),
      getAlternatives: computed(() => getAlternatives())
    };
  },
  computed: {
    selectedAlternative() {
      if (this.selectedAlternativeId === null) return null;
      return this.getAlternatives[this.selectedAlternativeId] || null;
    },
  },
  methods: {
    openProductDialog(alternativeId: number): void {
      this.selectedAlternativeId = alternativeId;
      this.showProductDialog = true;
    },
    hasProductInfo(alternativeId: number): boolean {
      const alternativeName = this.getAlternatives[alternativeId]?.name;
      if (!alternativeName || !this.state.project?.products) return false;
      return this.state.project.products.some(
        (p) => p.nameAlternative === alternativeName
      );
    },
  },
});
</script>

<style scoped>

/* Header sticky */
.table-head-cell {
  position: sticky;
  top: 0;
  background: white;
  z-index: 2;
  border-bottom: 2px solid #ccc;
  padding: 12px 8px;
  text-align: center;
  min-height: 40px;
  vertical-align: middle;
}

.criterion {
  max-width: 150px;
  width: 150px;
  font-size: 14px;
  font-weight: 600;
}

.aim {
  max-width: 200px;
  width: 200px;
  font-size: 14px;
  font-weight: 600;
}

.alternative {
  transition: background-color 0.2s ease;
  user-select: none;
  vertical-align: middle;
  white-space: nowrap;
}

.alternative:hover {
  background-color: #f5f5f5 !important;
}

.alternative-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  font-size: 14px;
  font-weight: 600;
}

.alternative-content {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
</style>


