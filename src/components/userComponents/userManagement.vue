<template>
  <div>
    <v-card>
      <userAdd></userAdd>
      <userDetail></userDetail>
      <ConfirmSnackBar></ConfirmSnackBar>

      <v-card-title>
        사용자 관리
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="검색어입력"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-card-title>
        <v-row justify="end">
          <v-btn @click="btnClick('userAdd', companyId)" dark
            >사용자 추가</v-btn
          >
        </v-row>
      </v-card-title>

      <v-data-table
        :search="search"
        :headers="headers"
        :items="users"
        hide-default-footer
        :items-per-page="3"
        class="font-weight-bold"
        :page.sync="page"
        @page-count="pageCount = $event"
      >


        <template v-slot:item.expiredDate="{ item }">
          <!-- {{item.expiredDate | changeDayFormat}} -->
          {{ item.expiredDate | formatDateYMD }}
        </template>
        <template v-slot:item.name="{ item }">
          <v-list-item style="text-align:left">{{ item.name }}</v-list-item>
        </template>

        <template v-slot:item.state="{ item }">
          <v-btn @click="statusChange(item)" :color="getColor(item.state)">{{
            item.state
          }}</v-btn>
        </template>

        <template v-slot:item.action="{ item }">
          <v-btn @click="userDetail(item)" icon
            ><v-icon>mdi-information-outline</v-icon></v-btn
          >
          <v-btn @click="editTable(item)" icon
            ><v-icon>mdi-square-edit-outline</v-icon></v-btn
          >
          <v-btn @click="deleteUser(item)" icon
            ><v-icon>mdi-trash-can-outline</v-icon></v-btn
          >
        </template>
      </v-data-table>

      <div class="text-center">
        <v-pagination v-model="page" :length="pageCount" circle> </v-pagination>
      </div>
      <router-view :key="$route.fullPath"></router-view>
    </v-card>
    <foot></foot>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import userDetail from "@/components/userComponents/userDetail.vue";
import userAdd from "@/components/userComponents/userAdd.vue";
import EventBus from "../../eventBus";
import ConfirmSnackBar from "../SnackBar/ConfirmSnackBar.vue";

export default {
  components: {
    userAdd,
    userDetail,
    ConfirmSnackBar
  },
  data() {
    return {
      companyId: 0,
      mode: "",
      x: window.innerWidth,
      devices: [],
      search: "",
      state: "",
      page: 1,
      pageCount: 0,
      tempUser: [],
      headers: [

        { text: "사용자", value: "name", align: "center" },
        { text: "상태", value: "state", align: "center" },
        { text: "HYPER VSN", value: "hvNum", align: "center" },
        { text: "계약 만료일", value: "expiredDate" },
        { text: "정보보기/수정/삭제", value: "action", sortable: false }
      ],

      users: [],
      number: -1
    };
  },

  mounted() {
    const token = localStorage.getItem("token");
    this.companyId = this.$route.params.companyId;
    axios
      .post("/api/company/user", {
        companyId: this.$route.params.companyId
      })
      .then(r => {
        let j = 0;
        this.users = r.data.users;
      })
      .catch(e => {
        console.error(e.message);
      });

    EventBus.$on('userAdd_to_company',(r)=>{
        axios.post('/api/company/user',{
          companyId : this.$route.params.companyId
        })
        .then((r)=>{
          this.users = r.data.users
        })
        .catch((e)=>{
          console.error(e.message)
        })
      })

      EventBus.$on('userAdd_to_user',(r)=>{
        axios.post('/api/company/user',{
          companyId : this.$route.params.companyId
        })
        .then((r)=>{
          this.users = r.data.users
        })
        .catch((e)=>{
          console.error(e.message)
        })
      })
  },
  methods: {
    
    getColor(status) {
      if (status == "활성화") return "green";
      else return "red";
    },

    btnClick(what, companyId) {
      EventBus.$emit("company_userAdd", what, companyId);
      this.$store.state.companyId = this.companyId;
    },

    statusChange(item) {
      this.number = this.users.indexOf(item);

      if (this.users[this.number].state == "활성화") {
        this.users[this.number].state = "비활성화";
        axios
          .put("/api/company/state", {
            id: item.id,
            state: "비활성화"
          })
          .catch(e => {
            console.error(e.message);
          });
      } else if (this.users[this.number].state == "비활성화") {
        this.users[this.number].state = "활성화";
        axios
          .put("/api/company/state", {
            id: item.id,
            state: "활성화"
          })
          .catch(e => {
            console.error(e.message);
          });
      }
    },

    editTable(item) {
      this.$store.state.companyId = this.companyId;
      EventBus.$emit("company_userEditInfo", item, this.companyId);
    },

    userDetail(item) {
      axios
        .post("/api/company/detail", { id: item.id })
        .then(r => {
          EventBus.$emit("company_userDetail", r.data.branch);
        })
        .catch(e => {
          console.error(e.message);
        });
    },

    deleteUser(item) {
      EventBus.$emit("Confirm", "company_DelUser","정말 삭제하시겠습니까?");
      EventBus.$on("company_DelUser", r => {
      this.info = [
        {
          id: item.id
        }
      ];
      axios
        .delete("/api/company/user", { data: { info: this.info } })
        .then(r => {
          axios
            .post("/api/company/user", {
              companyId: this.$route.params.companyId
            })
            .then(r => {
              this.users = r.data.users;
            })
            .catch(e => {
              console.error(e.message);
            });
        });
    });
    }
  }
};
</script>
