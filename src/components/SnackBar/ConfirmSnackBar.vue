<template>
  <v-snackbar
    :timeout="10000"
    v-model="confirm"
    top
    multi-line
    persistent
    color="error"
    dark
    icon="mdi-alert-circle-outline"
    transition="scale-transition"
    >{{message}}
    <v-btn color="error" @click="confirmYes" min-width="80">네</v-btn>
    <v-btn color="error" @click="confirmNo" min-width="80">아니요</v-btn>
  </v-snackbar>
</template>
<script>
import axios from "axios";
import EventBus from "../../eventBus.js";

export default {
  data() {
    return {
      alertText: "",
      confirm: false,
      mediaId:0,
      mode:'',
      message:'',
      callback:'',
      item:[]
    };
  },
  mounted() {

    EventBus.$on("Confirm", (callback ,msg) => {
      this.message=msg
      this.callback=callback
      this.confirm = true;
    });
    
    
  },
  methods: {
    confirmYes() {
      EventBus.$emit(this.callback,true)
      this.confirm = false;
    },
    confirmNo() {
      this.confirm = false;
    },
    
  }
};
</script>
