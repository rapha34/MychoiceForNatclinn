<template>
  <small class="text-caption text-grey">v{{ version }}</small>
</template>

<script>
export default {
  data: () => ({
    version: process.env.VUE_APP_VERSION,
  }),
};
</script>
