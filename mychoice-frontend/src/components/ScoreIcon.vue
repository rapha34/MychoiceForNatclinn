<template>
  <span>
    <v-icon
      :title="title"
      v-if="!icon"
      x-small
      :color="getColorName(getAcceptabilityName(score))"
      >mdi-circle</v-icon
    >

    <v-chip
      :title="title"
      outlined
      dark
      small
      v-if="icon"
      style="padding: 0;"
      :color="getColorName(getAcceptabilityName(score))"
    >
      <v-avatar>
        <v-icon small v-if="state.data">{{
          state.data.alternatives[alternative].icon
        }}</v-icon>
      </v-avatar>
    </v-chip>
  </span>
</template>

<script>
import { getAcceptabilityName, state } from "@/store";
export default {
  props: ["score", "title", "alternative", "icon"],
  data: () => ({
    state
  }),
  mounted() {},

  methods: {
    getColorName: name => {
      if (name === "pro") {
        return "green";
      } else if (name === "con") {
        return "red";
      } else if (name === "mix") {
        return "orange";
      } else {
        return "rgba(0,0,0,.2)";
      }
    },
    getAcceptabilityName
  }
};
</script>

<style lang="scss">
.acceptability {
  &::before {
    content: "\200b";
    width: 1em;
    height: 1em;
    background: #000;
    display: inline-block;
    border-radius: 50%;
    vertical-align: middle;
    clear: both;
  }
  &::after {
    content: " "; /* 1 */
    display: table; /* 2 */
    clear: both;
  }

  margin: auto;
}
.pro::before {
  background-color: green;
}
.con::before {
  background-color: red;
}
.mix::before {
  background-color: orange;
}
</style>
