<template>
  <v-dialog v-model="dialog" scrollable max-width="400px">
    <v-card>
      <v-app-bar dark color="#2a3248">
        <v-card-title>
          <span>{{ formTitle }} 회원정보</span>
        </v-card-title>
        <v-spacer></v-spacer>
        <v-btn @click="infoClose()" icon dark>
          <v-icon size="30px">mdi-close</v-icon>
        </v-btn>
      </v-app-bar>

      <v-card-text class="pa-0">
        <v-img
          :src="require(`../../../../upload/profile/${image}`)"
          height="150px"
          dark
        >
        </v-img>
        <v-list v-if="userAccess" two-line>
          <v-list-item v-for="(item, i) in lists1" :key="i">
            <v-list-item-icon>
              <v-icon color="indigo">{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.titleHead }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-dialog max-width="400px" scrollable v-model="dialogHv">
            <template v-slot:activator="{ on }">
              <v-list>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="indigo">mdi-help</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-on="on"
                      >보유중인 HYPERVSN 보기</v-list-item-title
                    >
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </template>
            <v-card>
              <v-app-bar dark color="#2a3248">
                <v-app-title>하이퍼비전 목록</v-app-title>
                <v-spacer></v-spacer>
                <v-btn @click="dialogHv = flase" icon
                  ><v-icon>mdi-close</v-icon></v-btn
                >
              </v-app-bar>
              <div style="align:center;">
                <v-chip
                  v-for="item in devices"
                  :key="item.deviceId"
                  color="purple"
                  outlined
                >
                  {{ item.device.name }}
                </v-chip>
              </div>
            </v-card>
          </v-dialog>
        </v-list>

        <v-list v-else two-line>
          <v-list-item v-for="(item, i) in lists2" :key="i">
            <v-list-item-icon>
              <v-icon color="indigo">{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.titleHead }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-dialog max-width="400px" scrollable v-model="dialogHv">
            <template v-slot:activator="{ on }">
              <v-list>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="indigo">mdi-help</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-on="on"
                      >보유중인 HYPERVSN 보기</v-list-item-title
                    >
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </template>
            <v-card>
              <v-app-bar dark color="#2a3248">
                <v-app-title>하이퍼비전 목록</v-app-title>
                <v-spacer></v-spacer>
                <v-btn @click="dialogHv = flase" icon
                  ><v-icon>mdi-close</v-icon></v-btn
                >
              </v-app-bar>
              <div>
                <v-chip
                  v-for="item in devices"
                  :key="item.deviceId"
                  color="purple"
                  outlined
                >
                  {{ item.device.name }}</v-chip
                >
              </div>
            </v-card>
          </v-dialog>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import EventBus from "../../eventBus";
import axios from "axios";
import moment from "moment";

export default {
  data() {
    return {
      dialogHv: false,
      devices: [],
      image: "",
      formTitle: "",
      userAccess: true,
      dialog: false,
      lists1: [
        { title: "", icon: "mdi-account-check", titleHead: "사용자" },
        { title: "", icon: "mdi-lock", titleHead: "활성화 상태" },
        { title: "", icon: "mdi-calendar", titleHead: "계약 만료일 " },
        { title: "", icon: "mdi-phone", titleHead: "연락처" },
        { title: "", icon: "mdi-email", titleHead: "이메일" },
        { title: "", icon: "mdi-map-marker", titleHead: "주소" }
      ],

      lists2: [
        { title: "", icon: "mdi-account-check", titleHead: "기업" },
        { title: "", icon: "mdi-lock", titleHead: "활성화 상태" },
        { title: "", icon: "mdi-calendar", titleHead: "계약 만료일" },
        { title: "", icon: "mdi-email", titleHead: "이메일" },
        { title: "", icon: "mdi-domain", titleHead: "사업자 번호" }
      ]
    };
  },
  methods: {
    infoClose() {
      this.dialog = false;
    }
  },
  mounted() {
    EventBus.$on("company_userDetail", branch => {
      if (branch.company.file) this.image = branch.company.file.orgName;
      else {
        this.image = "null.png";
      }
      this.devices = branch.branch_devices;
      this.lists1[0].title = branch.name;
      this.lists1[1].title = branch.user_groups[0].users[0].userYn;
      this.lists1[2].title = this.$moment(branch.expiredDate).format(
        "YYYY-MM-DD"
      );
      this.lists1[3].title = branch.tel;
      this.lists1[4].title = branch.user_groups[0].users[0].orgId;
      this.lists1[5].title = branch.address;
      this.dialog = true;
      this.userAccess = true;
    });
    EventBus.$on("company_Detail", item => {
      axios
        .get("/api/company/detail", { headers: { branchid: item.id } })
        .then(r => {
          if (r.data.branch.company.file)
            this.image = r.data.branch.company.file.orgName;
          else {
            this.image = "null.png";
          }
          this.lists2[0].title = r.data.branch.name;
          this.lists2[1].title = r.data.branch.user_groups[0].users[0].userYn;
          this.lists2[2].title = this.$moment(r.data.branch.expiredDate).format(
            "YYYY-MM-DD"
          );
          this.lists2[3].title = r.data.branch.user_groups[0].users[0].orgId;
          this.lists2[4].title = r.data.branch.busNumber;
          this.devices = r.data.branch.branch_devices;
          this.formTitle = item.name;
        })
        .catch(e => {
          console.error(e.message);
        });

      this.dialog = true;
      this.userAccess = false;
    });
  }
};
</script>
