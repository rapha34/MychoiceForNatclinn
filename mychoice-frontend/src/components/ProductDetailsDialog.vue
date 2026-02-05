<!--
Copyright INRAE
Contact contributor(s) : Rallou Thomopoulos / Julien Cufi (26/03/2020)
MyChoice is a web application supporting collective decision.
See more on https://ico.iate.inra.fr/MyChoice
This application is registered to the European organization for the
protection of authors and publishers of digital creations with
the following identifier: IDDN.FR.001.280002.000.R.P.2020.000.20900

This software is governed by the CeCILL-C license under French law and
abiding by the rules of distribution of free software.  You can  use,
modify and/ or redistribute the software under the terms of the CeCILL-C
license as circulated by CEA, CNRS and INRIA at the following URL
"http://www.cecill.info".
As a counterpart to the access to the source code and  rights to copy,
modify and redistribute granted by the license, users are provided only
with a limited warranty  and the software's author,  the holder of the
economic rights,  and the successive licensors  have only  limited
liability.
In this respect, the user's attention is drawn to the risks associated
with loading,  using,  modifying and/or developing or reproducing the
software by the user in light of its specific status of free software,
that may mean  that it is complicated to manipulate,  and  that  also
therefore means  that it is reserved for developers  and  experienced
professionals having in-depth computer knowledge. Users are therefore
encouraged to load and test the software's suitability as regards their
requirements in conditions enabling the security of their systems and/or
data to be ensured and,  more generally, to use and operate it in the
same conditions as regards security.
The fact that you are presently reading this means that you have had
knowledge of the CeCILL-C license and that you accept its terms.
-->
<template>
  <v-dialog v-model="isOpen" max-width="600px">
    <v-card v-if="alternative && relatedProducts.length > 0" class="superset-card">
      <!-- Header with background image -->
      <div class="d-flex" style="background: rgba(0,0,0,.7);position: relative;">
        <div
          class="card-background"
          :style="`background-image: url(${getImagePath(alternative.image)}); background-size: cover;`"
        ></div>

        <div class="mr-auto zi-front">
          <div class="subtitle-2 text-white text-uppercase">
            {{ alternative.name }}
          </div>
          <div class="font-weight-light text-white text-caption">
            Product Details
          </div>
        </div>

        <div class="mx-4 my-4 zi-front">
          <v-icon style="color: white;" v-if="alternative.icon">
            {{ alternative.icon }}
          </v-icon>
        </div>
      </div>

      <v-divider class="my-1" />

      <v-card-text>

        <!-- Products -->
        <div v-for="product in relatedProducts" :key="product.productUri" class="mb-5 no-mb-last">
          <div class="d-flex align-start mb-2">
            <div class="flex-grow-1">
              <div class="title text-primary">
                <b>{{ product.nameProduct }}</b>
              </div>
              <div class="text-caption text-grey-darken-1">
                {{ truncateUri(product.productUri) }}
              </div>
              <!-- Tags du produit -->
              <div v-if="product.tagProduct && product.tagProduct.length > 0" class="mt-2">
                <v-chip
                  v-for="tag in getDisplayedTags(product)"
                  :key="tag"
                  size="x-small"
                  variant="outlined"
                  color="primary"
                  class="mr-1 mb-1"
                >
                  {{ tag }}
                </v-chip>
                <v-chip
                  v-if="product.tagProduct.length > 5"
                  size="x-small"
                  variant="outlined"
                  :color="expandedProductTags[product.productUri] ? 'grey' : 'secondary'"
                  class="mr-1 mb-1"
                  @click="toggleProductTags(product.productUri)"
                  style="cursor: pointer;"
                >
                  <v-icon v-if="expandedProductTags[product.productUri]" icon="mdi-chevron-up" size="x-small" class="mr-1" />
                  <v-icon v-else icon="mdi-chevron-down" size="x-small" class="mr-1" />
                  {{ expandedProductTags[product.productUri] ? 'Show less' : `+${product.tagProduct.length - 5} more` }}
                </v-chip>
              </div>
            </div>
          </div>

            <!-- Filter Button -->
            <div class="mb-4 d-flex align-center">
            <v-btn
                size="small"
                variant="outlined"
                color="primary"
                @click="showAllComponents = !showAllComponents"
                :prepend-icon="showAllComponents ? 'mdi-eye' : 'mdi-eye-off'"
            >
                {{ showAllComponents ? 'All Components' : 'Tagged Only' }}
            </v-btn>
            </div>

          <!-- Composition for this product -->
          <CompositionTree
            :uri="product.productUri"
            :compositions="compositions"
            :showAll="showAllComponents"
            :level="0"
          />
        </div>
      </v-card-text>

      <v-divider />

      <template #actions>
        <v-btn
          class="ml-auto"
          @click="closeDialog"
          variant="text"
          icon="mdi-close"
        />
      </template>
    </v-card>

    <!-- No data card -->
    <v-card v-else-if="alternative" class="superset-card">
      <div class="d-flex" style="background: rgba(0,0,0,.7);position: relative;">
        <div
          class="card-background"
          :style="`background-image: url(${getImagePath(alternative.image)}); background-size: cover;`"
        ></div>

        <div class="mr-auto zi-front">
          <div class="subtitle-2 text-white text-uppercase">
            {{ alternative.name }}
          </div>
          <div class="font-weight-light text-white text-caption">
            Product Details
          </div>
        </div>

        <div class="mx-4 my-4 zi-front">
          <v-icon style="color: white;" v-if="alternative.icon">
            {{ alternative.icon }}
          </v-icon>
        </div>
      </div>

      <v-divider class="my-1" />

      <v-card-text>
        <v-alert type="info" variant="outlined">
          No product information available for this scenario.
        </v-alert>
      </v-card-text>

      <v-divider />

      <template #actions>
        <v-btn
          class="ml-auto"
          color="secondary"
          @click="closeDialog"
          variant="text"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import type { Alternative, Product, Composition } from "@/@types";
import { getImagePath } from "@/store";
import CompositionTree from "./CompositionTree.vue";

export default defineComponent({
  name: "ProductDetailsDialog",
  components: {
    CompositionTree,
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    alternative: {
      type: Object as PropType<Alternative | null>,
      default: null,
    },
    products: {
      type: Array as PropType<Product[]>,
      default: () => [],
    },
    compositions: {
      type: Array as PropType<Composition[]>,
      default: () => [],
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      showAllComponents: true,
      expandedProductTags: {} as Record<string, boolean>,
    };
  },
  setup() {
    return {
      getImagePath,
    };
  },
  computed: {
    isOpen: {
      get(): boolean {
        return this.modelValue;
      },
      set(value: boolean) {
        this.$emit("update:modelValue", value);
      },
    },
    relatedProducts(): Product[] {
      if (!this.alternative) return [];
      const products = this.products.filter(
        (p) => p.nameAlternative === this.alternative?.name
      );
      // Remove duplicates by productUri
      const uniqueProducts = Array.from(
        new Map(products.map((p) => [p.productUri, p])).values()
      ) as Product[];
      return uniqueProducts;
    },
  },
  methods: {
    getDisplayedTags(product: Product): string[] {
      if (this.expandedProductTags[product.productUri]) {
        return product.tagProduct;
      }
      return product.tagProduct.slice(0, 5);
    },
    toggleProductTags(productUri: string): void {
      this.expandedProductTags[productUri] = !this.expandedProductTags[productUri];
      // Force reactivity
      this.expandedProductTags = { ...this.expandedProductTags };
    },
    getCompositions(uri: string): Composition[] {
      return this.compositions
        .filter((c) => c.uriCompose === uri)
        .sort((a, b) => a.rang - b.rang);
    },
    getFilteredCompositions(uri: string): Composition[] {
      const allCompositions = this.getCompositions(uri);
      if (this.showAllComponents) {
        return allCompositions;
      }
      return allCompositions.filter((c) => c.tagComposant && c.tagComposant.length > 0);
    },
    truncateUri(uri: string): string {
      const maxLength = 50;
      if (uri.length > maxLength) {
        return uri.substring(0, maxLength - 3) + "...";
      }
      return uri;
    },
    closeDialog(): void {
      this.isOpen = false;
    },
  },
});
</script>

<style scoped>
.card-background {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center center;
  opacity: 0.3;
  z-index: 0;
}

.zi-front {
  z-index: 1;
  position: relative;
}

.no-mb-last > :last-child {
  margin-bottom: 0 !important;
}

.bg-grey-lighten-4 {
  background-color: #f5f5f5;
}

.rounded {
  border-radius: 4px;
}
</style>
