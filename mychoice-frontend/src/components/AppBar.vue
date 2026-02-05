<template>
  <v-app-bar elevation="0" color="secondary" theme="dark">
    <!-- Menu burger -->
    <v-app-bar-nav-icon @click.stop="state.drawer = !state.drawer" />

    <!-- Titre projet + bouton Google Sheet -->
    <v-toolbar-title v-if="state.project && isProjectRoute" class="d-flex align-center">
      <v-btn
        variant="text"
        class="text-white text-truncate"
        style="max-width: 200px; display: block;"
        :title="state.project.name"
        @click="switchToView('project')"
      >
        {{ state.project.name }}
      </v-btn>

      <v-tooltip v-if="state.spreadsheet" location="bottom">
        <template #activator="{ props }">
          <v-btn
            icon
            target="_blank"
            :href="getSpreadsheetLink(state.spreadsheet)"
            v-bind="props"
          >
            <v-icon>mdi-google-spreadsheet</v-icon>
          </v-btn>
        </template>
        <span>Open Spreadsheet</span>
      </v-tooltip>
    </v-toolbar-title>

    <!-- Spacer -->
    <v-spacer />

    <!-- Logo MyChoice centré absolument -->
    <div class="mychoice-logo-container">
      <router-link to="/" class="logo-mychoice">
        <img
          :src="state.baseUrl + 'logo-mychoice.svg'"
          alt="MyChoice Logo"
        />
      </router-link>
    </div>

    <!-- Logo INRAE à droite -->
    <div class="d-flex align-center mr-4">
      <img
        :src="state.baseUrl + 'logo-inrae-white-transparent.png'"
        alt="INRAE Logo"
        class="logo-inrae"
      />
    </div>
  </v-app-bar>
</template>





<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { state, switchToView, getSpreadsheetLink } from '@/store'

const route = useRoute()

const isProjectRoute = computed(() => route.path.includes('/project'))
</script>

<style scoped>
.mychoice-logo-container {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, calc(-50% + 14px)); /* <- ajout du décalage */
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none; /* Pour ne pas bloquer les clics */
}

.logo-mychoice img {
  height: 40px;
  pointer-events: auto; /* Pour rendre le lien actif malgré pointer-events: none sur le conteneur */
}

/* Logo INRAE taille adaptable */
.logo-inrae {
  height: 32px;
}

/* Responsive */
@media (max-width: 600px) {
  .logo-mychoice img {
    height: 30px;
  }

  .logo-inrae {
    height: 24px;
  }
}
</style>



