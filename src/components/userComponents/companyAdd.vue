<template>
  <v-form ref="form" v-model="valid">
    <v-dialog v-model="dialog" scrollable max-width="600px">
      <AlertSnackBar></AlertSnackBar>
      <v-card>
        <v-app-bar dark color="#2a3248">
          <v-card-title>
            <span>{{ formTitle }}</span>
          </v-card-title>
          <v-spacer></v-spacer>
          <v-btn icon dark>
            <v-icon @click="modalClose" size="30px">mdi-close</v-icon>
          </v-btn>
        </v-app-bar>
        <v-card-text>
          <v-divider></v-divider>

          <v-col cols="12">
            <v-text-field
              v-model="name"
              :counter="20"
              :rules="nameRules"
              label="기업명*"
              prepend-inner-icon="mdi-account-check"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-select
              v-model="state"
              :items="actitems"
              label="활성화 여부*"
              prepend-inner-icon="mdi-lock"
            >
            </v-select>
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="email"
              :counter="20"
              :rules="emailRules"
              label="이메일*"
              prepend-inner-icon="mdi-email"
              required
            ></v-text-field>
          </v-col>

          <companyHvSelect></companyHvSelect>

          <v-col cols="12">
            <v-text-field
              v-model="business"
              :counter="20"
              :rules="businessRules"
              label="사업자번호*"
              prepend-inner-icon="mdi-domain"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-menu
              v-model="menu"
              :close-on-content-click="false"
              :nudge-right="10"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="date"
                  label="만료일"
                  :rules="dateRules"
                  :readonly="readonly"
                  prepend-inner-icon="mdi-calendar"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                locale="ko"
                v-model="date"
                @input="menu = false"
              ></v-date-picker>
            </v-menu>
          </v-col>

          <v-col cols="12">
            <v-file-input
              v-model="picture"
              :rules="imgRules"
              accept="image/png, image/jpeg, image/bmp"
              placeholder="사진 추가"
              prepend-inner-icon="mdi-camera"
              prepend-icon=""
              label="사진"
            ></v-file-input>
          </v-col>
          <v-spacer></v-spacer>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :disabled="!valid" color="success" @click="saveClick">
            저장
          </v-btn>
          <v-btn color="error" @click="modalClose">
            닫기
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-form>
</template>

<script>
import axios from "axios";
import EventBus from "../../eventBus";
import AlertSnackBar from "../SnackBar/AlertSnackBar.vue";
import companyHvSelect from "./companyHvSelect";

export default {
  components: {
    AlertSnackBar,
    companyHvSelect
  },
  data: () => ({
    companyId: 0,
    mode: "",
    device: [],
    readonly: true,
    formTitle: "",
    select: [],
    menu: false,
    dialog: false,
    valid: true,
    state: "",
    picture: null,
    name: "",
    email: "",
    date: "",
    business: "",
    nameRules: [
      v => !!v || "기업명을 입력해주세요",
      v => (v && v.length <= 20) || "20글자 초과 하실 수 없습니다."
    ],

    emailRules: [
      v => !!v || "E-mail을 입력해주세요",
      v => /.+@.+\..+/.test(v) || "잘못된 형식의 이메일 입니다",
      v => (v && v.length <= 20) || "20글자 초과 하실 수 없습니다."
    ],
    imgRules: [
      value =>
        !value ||
        value.size < 2000000 ||
        "Avatar size should be less than 2 MB!"
    ],

    dateRules: [v => !!v || "만료일을 입력해주세요"],

    businessRules: [
      v => !!v || "사업자번호를 입력해주세요",
      v => (v && v.length <= 20) || "20글자 초과 하실 수 없습니다."
    ],

    actitems: ["활성화", "비활성화"]
  }),
  mounted() {
    EventBus.$on("company_Add", what => {
      this.mode = "post";
      if (what === "add") {
        this.formTitle = "기업 추가";
      }
      if (what === "edit") {
        this.formTitle = "기업 정보 수정";
      }
      this.dialog = true;
    });

    EventBus.$on("company_EditInfo", item => {
      this.mode = "put";

      axios.post("/api/company/edit", { branchId: item.id }).then(r => {
        this.name = r.data.branch.name;
        this.companyId = r.data.branch.companyId;
        this.date = this.$moment(r.data.branch.expiredDate).format(
          "YYYY-MM-DD"
        );
        this.state = r.data.branch.user_groups[0].users[0].userYn;
        this.email = r.data.branch.user_groups[0].users[0].orgId;
        this.business = r.data.branch.busNumber;
      });
      axios.post("/api/company/editDevice", { branchId: item.id }).then(r => {
        EventBus.$emit("comHVList", r.data.result);
      });
    });

    EventBus.$on("select", item => {
      this.select = item;
    });
  },
  methods: {
    saveClick() {
      if (this.mode === "post") {

        let device = []
        for(const item of this.select){
          device.push(item.id)
        }
        let fd = new FormData();
        fd.append("img", this.picture);
        fd.append("name", this.name)
        fd.append("busNumber", this.business)
        fd.append("address", this.address)
        fd.append("tel", this.tel)
        fd.append("expiredDate", this.date)
        fd.append("devices", device)
        fd.append("email", this.email)
        fd.append("state", this.state)

        axios
          .post("/api/company", fd)
          .catch(e => {
            console.error(e.message);
          });
        EventBus.$emit("Alert", "company_create","생성되었습니다");
        EventBus.$on("company_create",(r)=>{
          location.href="/company"
        })
      } else if (this.mode === "put") {
        let device = []
        for(const item of this.select){
          device.push(item.id)
        }
        console.log(this.select)
        let fd = new FormData();
        fd.append("img", this.picture);
        fd.append("companyId", this.companyId);
        fd.append("name", this.name)
        fd.append("busNumber", this.business) 
        fd.append("address", this.address) 
        fd.append("tel", this.tel) 
        fd.append("expiredDate", this.date) 

        fd.append("devices", device) 
        fd.append("email", this.email) 
        fd.append("state", this.state) 

        axios
          .put("/api/company", fd)
          .then(r => {
            EventBus.$emit("Alert", "company_Edit","수정되었습니다");
            EventBus.$on("company_Edit",(r)=>{
              location.href="/company"
            })
          })
          .catch(e => {
            console.error(e.message);
          });
      }
    },

    modalClose() {
      this.dialog = false;
      this.$refs.form.resetValidation();
      (this.state = ""), (this.picture = null), (this.name = "");
      this.email = "";
      this.date = "";
      this.business = "";
      EventBus.$emit("HyperVisonClean", true);
    }
  }
};
</script>
