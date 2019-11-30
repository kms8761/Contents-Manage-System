<template>
  <v-snackbar
    :timeout="false"
    v-model="confirm"
    top
    persistent
    multi-line
    color="error"
    dark
    icon="mdi-alert-circle-outline"
    transition="scale-transition"
    >{{message}}
   <v-btn color="error" @click="confirmYes(index)" min-width="80">네</v-btn>
    <v-btn color="error" @click="confirmNo" min-width="80">아니요</v-btn>
  </v-snackbar>
</template>
<script>
import axios from "axios";
import eventBus from "./eventBus.js";

export default {
  data() {
    return {
      confirm: false,
      callback:'',
      BinORPost: "",
        comments: [],
      selected: [],
      message:"정말 삭제하시겠습니까?",
      originalmessage:"정말 삭제하시겠습니까?",
    };
  },
  mounted() {
      eventBus.$on("TrashBin_restoremedia",(items,callback,message) => {
        this.message = message
        this.callback = callback
       this.confirm = true;
    });


  },
  methods: {
    confirmYes() {
      eventBus.$emit(callback,true)
    },
    confirmNo() {
      this.confirm = false;
    }
    }
  
};
</script>
