<template>
  <small class="text--small grey--text">v{{ version }}</small>
</template>

<script>
export default {
  data: () => ({
    version: process.env.VUE_APP_VERSION,
  }),
};
</script>
