<template>
  <v-col cols="12">
    <v-dialog v-model="dialog" scrollable max-width="400px">
      <template v-slot:activator="{ on }">
        <v-text-field
          v-model="hvText"
          label="하이퍼비전"
          prepend-inner-icon="mdi-plus"
          v-on="on"
        ></v-text-field>
      </template>

      <v-card>
        <div>
          <v-chip
            close
            @click:close="remove(item)"
            v-for="item in selected"
            :key="item.name"
          >
            {{ item.name }}
          </v-chip>
        </div>
        <v-card-title class="font-weight-bold">
          하이퍼비전 리스트
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="하이퍼비전 검색"
            single-line
            hide-details
          >
          </v-text-field>
        </v-card-title>
        <v-data-table
          :items-per-page="(perpage = 5)"
          v-model="selected"
          :search="search"
          :headers="headers"
          :items="items"
          show-select
          item-key="name"
          class="font-weight-bold"
        >
        </v-data-table>
        <v-btn @click="hvSelect" dark>선택완료</v-btn>
      </v-card>
    </v-dialog>
  </v-col>
</template>
<script>
import EventBus from "../../eventBus";
import axios from "axios";
export default {
  data() {
    return {
      dialog: false,
      hvText: "",
      companyId: 0,
      selected: [],
      search: "",
      pageCount: 0,
      page: 1,
      headers: [
        {
          text: "하이퍼 비전",
          align: "start",
          sortable: true,
          value: "name"
        }
      ],
      items: []
    };
  },
  beforeDestroy(){

  },
  created() {
    this.companyId = this.$store.state.companyId;
    this.$store.state.companyId = 0;
    
    axios
      .post("/api/company/userDevice", {
        companyId: this.companyId
      })
      .then(r => {
        this.items = r.data.device;
      });

    EventBus.$on("userHVList", item => {
      this.selected = item;
      this.hvSelect()
    });


    EventBus.$on("HyperVisonClean", what => {
      this.hvText = "";
      this.selected = [];
    });    
  },

  methods: {
    remove(item) {
      this.selected.splice(this.selected.indexOf(item), 1);
    },
    hvSelect() {
      this.dialog = false;
      EventBus.$emit("select", this.selected);
      
      if (this.selected.length >= 1)
        this.hvText = this.selected[0].name + "등(" + this.selected.length + ")개 선택됨";
      else this.hvText = "*선택된 하이퍼비전이 없습니다.*";
    }
  }
};
</script>
<style>
.btncolor:hover {
  background-color: pink;
}
</style>
