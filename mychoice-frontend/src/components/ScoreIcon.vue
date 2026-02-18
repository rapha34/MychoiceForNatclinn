<template>
  <span>
    <v-icon
      :title="title"
      v-if="!icon"
      size="x-small"
      :color="getColorName(getAcceptabilityName(score))"
      >mdi-circle</v-icon
    >
    <v-chip
      variant="outlined"
      size="small"
      :title="title"
      v-if="icon"
      style="padding: 0;"
      :color="getColorName(getAcceptabilityName(score))"
    >
      <v-avatar>
        <v-icon size="medium" v-if="state.data && state.data.alternatives[alternative]" :color="getColorName(getAcceptabilityName(score))">
          {{ state.data.alternatives[alternative].icon }}
        </v-icon>
      </v-avatar>
    </v-chip>
  </span>
</template>

<script lang="ts">
import { getAcceptabilityName, state } from "@/store";
import { defineComponent, toRefs } from "vue";
export default defineComponent({


  props: {
    score: {
      type: Number as () => number | null,
      default: null
    },
    title: {
      type: String,
      default: ""
    },
    alternative: {
      type: Number as () => number,
      required: true
    },
    icon: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {

    

    return {
      
      state,

      getColorName: (name: string) => {
        if (name === "pro") {
          return "green";
        } else if (name === "con") {
          return "red";
        } else if (name === "mix") {
          return "orange";
        } else {
          // return "rgba(0,0,0,.2)";
          return "rgba(0,0,0,1)";  // Opacité pleine
        }
      },
      getAcceptabilityName
    }
  },
  

});
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
