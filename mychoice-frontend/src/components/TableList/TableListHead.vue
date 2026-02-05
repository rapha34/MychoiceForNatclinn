<template>
  <tr class="text-uppercase">
    <th class="criterion">Criterion</th>
    <th class="aim">Aim</th>
    <th
      v-for="alternativeId in alternativesIds"
      :key="`alternative-${alternativeId}`"
      :colspan="subOptionsIds.length"
      class="alternative"
      @click="openProductDialog(alternativeId)"
      style="cursor: pointer; position: relative;"
      :style="{ backgroundColor: selectedAlternativeId === alternativeId ? '#e3f2fd' : 'transparent' }"
    >
      <v-icon v-if="state.data?.alternatives?.[alternativeId]?.icon" class="mr-2">
        {{ state.data.alternatives[alternativeId].icon }}
      </v-icon>
      <span class="alternative-name">{{ getAlternatives[alternativeId]?.name || 'Unnamed' }}</span>
      <v-icon v-if="hasProductInfo(alternativeId)"  size="x-small" class="ml-2 text-info"></v-icon>
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
.custom-table thead th {
  position: sticky;
  top: 0;
  background: white;
  z-index: 2;
  border-bottom: 2px solid #ccc;
  padding: 8px;
  text-align: left;
}

.alternative {
  transition: background-color 0.2s ease;
  user-select: none;
}

.alternative:hover {
  background-color: #f5f5f5 !important;
}

.alternative-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  max-width: 200px;
  vertical-align: middle;
}
</style>


