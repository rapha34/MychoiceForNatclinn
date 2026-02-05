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
  <div v-if="filteredCompositions.length > 0" :class="['composition-level', `level-${level}`]">
    <div
      v-for="composition in filteredCompositions"
      :key="composition.uriComposant"
      class="composition-item mb-2"
    >
      <div class="d-flex align-start pl-3 py-2 bg-grey-lighten-4 rounded">
        <div class="mr-2 text-caption text-grey">{{ composition.rang }}.</div>
        <div class="flex-grow-1">
          <div class="d-flex align-center">
            <v-icon
              :icon="composition.typeComposant === 'Product' ? 'mdi-package-variant' : 'mdi-food-variant'"
              size="x-small"
              :color="composition.typeComposant === 'Product' ? 'orange' : 'green'"
              class="mr-1"
            />
            <span class="text-body-2">{{ composition.nameComposant }}</span>
          </div>
          
          <!-- Tags -->
          <div v-if="composition.tagComposant && composition.tagComposant.length > 0" class="mt-1">
            <v-chip
              v-for="tag in composition.tagComposant.slice(0, 3)"
              :key="tag"
              size="x-small"
              variant="outlined"
              color="primary"
              class="mr-1 mb-1"
            >
              {{ tag }}
            </v-chip>
            <v-chip
              v-if="composition.tagComposant.length > 3"
              size="x-small"
              variant="outlined"
              color="grey"
              class="mr-1 mb-1"
            >
              +{{ composition.tagComposant.length - 3 }}
            </v-chip>
          </div>
        </div>
      </div>

      <!-- Récursion pour les sous-composants -->
      <div v-if="hasSubComponents(composition.uriComposant)" class="ml-4 mt-1">
        <CompositionTree
          :uri="composition.uriComposant"
          :compositions="compositions"
          :showAll="showAll"
          :level="level + 1"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import type { Composition } from "@/@types";

export default defineComponent({
  name: "CompositionTree",
  props: {
    uri: {
      type: String,
      required: true,
    },
    compositions: {
      type: Array as PropType<Composition[]>,
      required: true,
    },
    showAll: {
      type: Boolean,
      default: true,
    },
    level: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    filteredCompositions(): Composition[] {
      const comps = this.compositions
        .filter((c) => c.uriCompose === this.uri)
        .sort((a, b) => a.rang - b.rang);
      
      if (this.showAll) {
        return comps;
      }
      // En mode "Tagged Only", afficher les composants qui ont des tags
      // OU qui ont des sous-composants tagués (récursivement)
      return comps.filter((c) => this.hasTagsInBranch(c.uriComposant) || (c.tagComposant && c.tagComposant.length > 0));
    },
  },
  methods: {
    hasSubComponents(uri: string): boolean {
      return this.compositions.some((c) => c.uriCompose === uri);
    },
    hasTagsInBranch(uri: string): boolean {
      // Vérifie récursivement si cette branche contient des éléments tagués
      const subComps = this.compositions.filter((c) => c.uriCompose === uri);
      
      for (const comp of subComps) {
        // Si ce composant a des tags, retourner true
        if (comp.tagComposant && comp.tagComposant.length > 0) {
          return true;
        }
        // Sinon vérifier récursivement ses sous-composants
        if (this.hasTagsInBranch(comp.uriComposant)) {
          return true;
        }
      }
      
      return false;
    },
  },
});
</script>

<style scoped>
.composition-level {
  margin-top: 8px;
}

.level-0 {
  margin-left: 16px;
}

.composition-item {
  position: relative;
}

.bg-grey-lighten-4 {
  background-color: #f5f5f5;
}

.rounded {
  border-radius: 4px;
}
</style>
