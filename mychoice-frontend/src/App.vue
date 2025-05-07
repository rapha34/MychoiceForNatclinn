<template>
  <v-app style="background-color: #fafafa;">
    <AppBar></AppBar>

    <Drawer></Drawer>

      <input style="display:none;" ref="dropFileInputRef" accept=".xlsx" type="file" @change="onFileChange"/>
      <v-main>

        <router-view />

      </v-main>
      

    <v-dialog v-model="state.openDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class>
            <v-icon class="mr-2">mdi-cloud-upload</v-icon>Open online project
          </span>
        </v-card-title>

        <v-card-text>
          <OpenDialog />
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="state.aboutDialog" max-width="600px">
      <About />
    </v-dialog>

    <v-overlay z-index="3" :value="state.overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <v-snackbar top color="info" v-model="isNotification">
      <v-icon align-center>mdi-information</v-icon>&nbsp;
      <div>
      <div v-for="(notification, index) in notifications" :key="index">
      
        {{ notification.message }}.

        
      </div>
      </div>
      <v-btn class="ml-3" color="white" small outlined
          @click="refreshProject"
        >
          Refresh 
        </v-btn>
      
    </v-snackbar>

    <v-snackbar color="red" v-model="isError" :timeout="0">
      
      <div>
      <div v-for="(key, index) in getErrors" :key="index">
        <span v-html="getErrorMessage(key)"></span>.
      </div>
      </div>
      <v-btn text @click="clearErrors()">Close</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
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
  notifications
} from "@/store";

import { ref, onMounted, computed, defineComponent } from "vue";
import { dropFileInputRef } from "@/store";

export default defineComponent({
  name: 'App',
  components: {
    Drawer,
    OpenDialog,
    AppBar,
    About
  },
  setup() {

    onMounted(() => { 
      initDropArea();
    });

    const isNotification = computed({
      get() {
        return state.notifications && state.notifications.length > 0;
      },
      set(value) {
        if (!value) state.notifications = [];
      }
    });

    const isError = computed({
      get() {
        return Object.values(state.errors).some(error => error !== false);
      },
      set(value) {
        if (!value) clearErrors();
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
