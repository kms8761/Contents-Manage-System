<template>
  <v-snackbar
    :timeout="0"
    v-model="alert"
    top
    persistent
    multi-line
    color="blue lighten-2"
    dark
    icon="mdi-alert-circle-outline"
    transition="scale-transition"
    >{{message}}
    <v-btn flat color="blue lighten-2" @click="alertConfirm">확인</v-btn>
  </v-snackbar>
</template>
<script>
//import axios from 'axios'
import EventBus from "../../eventBus.js";
export default {
  data() {
    return {
      alert: false,
      access: false,
      message: ""
    };
  },
  mounted() {
    EventBus.$on("Alert", (callback ,msg) => {
      this.message=msg
      this.callback=callback
      this.alert = true;
    });
  },

  methods: {
    alertConfirm() {
      EventBus.$emit(this.callback,true)
      this.alert = false;
    }
  }
};
</script>
