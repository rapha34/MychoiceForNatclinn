<template>
  <v-app class="bg-grey-lighten-4">
    <AppBar />
    <Drawer />

    <!-- Input pour import local -->
    <input
      type="file"
      ref="dropFileInputRef"
      accept=".xlsx"
      style="display: none"
      @change="onFileChange"
    />
    <v-main> 
      <router-view />
    </v-main>


    <!-- Dialogue ouverture projet en ligne -->
    <v-dialog v-model="state.openDialog" max-width="600">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2">mdi-cloud-upload</v-icon>
          <span>Open online project</span>
        </v-card-title>
        <v-card-text>
          <OpenDialog />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Dialogue "About" -->
    <v-dialog v-model="state.aboutDialog" max-width="600">
      <About />
    </v-dialog>

    <!-- Overlay de chargement -->
    <v-overlay :model-value="state.overlay" class="d-flex justify-center align-center" z-index="3">
      <v-progress-circular indeterminate size="64" color="primary" />
    </v-overlay>

    <!-- Snackbar notifications -->
    <v-snackbar v-model="isNotification" color="info" location="top">
      <template #default>
        <v-icon class="mr-2">mdi-information</v-icon>
        <div>
          <div v-for="(notification, index) in notifications" :key="index">
            {{ notification.message }}
          </div>
        </div>
      </template>
      <template #actions>
        <v-btn variant="outlined" size="small" @click="refreshProject">Refresh</v-btn>
      </template>
    </v-snackbar>

    <!-- Snackbar erreurs -->
    <v-snackbar v-model="isError" color="error" timeout="0" multi-line>
      <template #default>
        <div v-for="(key, index) in getErrors" :key="index">
          {{ getErrorMessage(key) }}
        </div>
      </template>
      <template #actions>
        <v-btn variant="text" @click="clearErrors">Close</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import { onMounted, computed, defineComponent } from "vue";
import AppBar from "@/components/AppBar.vue";
import Drawer from "@/components/Drawer.vue";
import OpenDialog from "@/components/OpenDialog.vue";
import About from "@/views/About.vue";

import {
  state,
  clearErrors,
  getErrors,
  getErrorMessage,
  refreshProject,
  onFileChange,
  onFileDrop,
  onFileDragEnter,
  onFileDragLeave,
  onFileDragOver,
  initDropArea,
  notifications,
  dropFileInputRef
} from "@/store";

export default defineComponent({
  name: "App",
  components: {
    AppBar,
    Drawer,
    OpenDialog,
    About
  },
  setup() {
    onMounted(() => {
      initDropArea();
    });

    const isNotification = computed({
      get: () => state.notifications.length > 0,
      set: (val) => {
        if (!val) state.notifications = [];
      }
    });

    const isError = computed({
      get: () => Object.values(state.errors).some(error => error !== false),
      set: (val) => {
        if (!val) clearErrors();
      }
    });

    return {
      dropFileInputRef,
      onFileChange,
      onFileDrop,
      onFileDragEnter,
      onFileDragLeave,
      onFileDragOver,
      clearErrors,
      getErrorMessage,
      refreshProject,
      state,
      getErrors,
      notifications,
      isNotification,
      isError
    };
  }
});
</script>

<style lang="scss">
@import "@/styles/main.scss";
</style>
