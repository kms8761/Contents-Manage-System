<template>
  <v-form ref="form" v-model="valid">
    <!-- <v-dialog v-model="dialog" persistent scrollable max-width="600px"  > -->
    <v-dialog v-model="dialog" scrollable max-width="600px">
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
              label="사용자명*"
              required
              prepend-inner-icon="mdi-account-check"
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

          <userHvSelect></userHvSelect>

          <v-col cols="12">
            <v-text-field
              v-model="address"
              :counter="50"
              :rules="addressRules"
              label="주소*"
              prepend-inner-icon="mdi-map-marker"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="tel"
              :counter="20"
              :rules="telRules"
              label="연락처*"
              prepend-inner-icon="mdi-phone"
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
                  v-model="endDay"
                  :rules="endDayRules"
                  label="만료일"
                  :readonly="readonly"
                  prepend-inner-icon="mdi-calendar"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                locale="ko"
                v-model="endDay"
                @input="menu = false"
              ></v-date-picker>
            </v-menu>
          </v-col>

          <v-spacer></v-spacer>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :disabled="!valid" color="success" @click="saveClick()">
            저장
          </v-btn>
          <v-btn color="error" @click="modalClose">
            닫기
          </v-btn>
        </v-card-actions>
      </v-card>
      <AlertSnackBar></AlertSnackBar>
    </v-dialog>
  </v-form>
</template>

<script>
import EventBus from "../../eventBus";
import axios from "axios";
import AlertSnackBar from "../SnackBar/AlertSnackBar.vue";
import userHvSelect from "./userHvSelect";

export default {
  components: {
    AlertSnackBar,
    userHvSelect
  },
  data: () => ({
    mode: "",
    select: [],
    branchId: 0,
    formTitle: "",
    menu: false,
    dialog: false,
    valid: true,
    readonly: true,
    picture: null,
    state: "",
    name: "",
    email: "",
    endDay: "",
    address: "",
    tel: "",

    nameRules: [
      v => !!v || "사용자명을 입력해주세요",
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

    endDayRules: [v => !!v || "만료일을 입력해주세요"],

    address: "",
    addressRules: [
      v => !!v || "주소를 입력해주세요",
      v => (v && v.length <= 50) || "50글자 초과 하실 수 없습니다."
    ],

    telRules: [
      v => !!v || "연락처 입력해주세요",
      v => (v && v.length <= 20) || "20글자 초과 하실 수 없습니다."
    ],

    actitems: ["활성화", "비활성화"]
  }),
  mounted() {
    EventBus.$on("company_userAdd", (what, companyId) => {
      this.companyId = companyId;
      if (what === "userAdd") {
        this.mode = "post";
        this.formTitle = "사용자 추가";
      }
      this.state = "";
      this.select = [];
      this.name = "";
      this.email = "";
      this.endDay = "";
      this.address = "";
      this.tel = "";
      this.dialog = true;
    });

    EventBus.$on("company_userEditInfo", (item,companyId) => {
      this.companyId = companyId;
      this.mode = "put";
      this.name = item.name;
      this.branchId = item.id;
      this.endDay = this.$moment(item.expiredDate).format("YYYY-MM-DD");
      this.address = item.address;
      this.tel = item.tel;
      this.email = item.email;
      this.state = item.state;
      this.dialog = true;
      this.formTitle = "정보 수정";
      axios.post("/api/company/editDevice", { branchId: item.id }).then(r => {
        EventBus.$emit("userHVList", r.data.result);
      });
    });

    EventBus.$on("select", item => {
      this.select = item;
    });
  },
  methods: {
    modalClose() {
      this.dialog = false;
      this.$refs.form.resetValidation();
      this.state = "";
      this.name = "";
      this.email = "";
      this.endDay = "";
      this.address = "";
      this.tel = "";
      EventBus.$emit("HyperVisonClean", true);
    },
    saveClick() {
      if (this.mode === "post") {
        axios
          .post("/api/company/userAdd", {
            name: this.name,
            selectDevices: this.select,
            companyId: this.companyId,
            address: this.address,
            tel: this.tel,
            expiredDate: this.endDay,
            state: this.state,
            email: this.email
          })
          .then(r => {
            EventBus.$emit("Alert", "userAdd_to_company", "생성되었습니다");
            EventBus.$on("userAdd_to_company", r => {
              this.dialog = false;
            });
          })
          .catch(e => {
            console.error(e.message);
          });
      } else if (this.mode === "put") {
        axios
          .put("/api/company/user", {
            branchId: this.branchId,
            name: this.name,
            busNumber: this.business,
            address: this.address,
            tel: this.tel,
            expiredDate: this.date,
            devices: this.select,
            email: this.email,
            state: this.state
          })
          .then(r => {
            EventBus.$emit("Alert", "userAdd_to_user", "수정되었습니다");
            EventBus.$on("userAdd_to_user", r => {
              this.dialog = false;
            });
          })
          .catch(e => {
            console.error(e.message);
          });
      }
    }
  }
};
</script>
