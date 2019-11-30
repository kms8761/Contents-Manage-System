<template>
  <v-form ref="form" v-model="valid">
    <v-dialog v-model="dialog" scrollable max-width="600px">
      <AlertSnackBar></AlertSnackBar>
      <v-card>
        <v-app-bar dark color="#2a3248">
          <v-card-title>
            <span>나의 디바이스 추가</span>
          </v-card-title>
          <v-spacer></v-spacer>
          <v-btn icon dark>
            <v-icon @click="modalClose" size="30px">mdi-close</v-icon>
          </v-btn>
        </v-app-bar>

        <v-card-text>
          <v-divider></v-divider>

          <v-row justify="center">
            <v-col cols="6">
              <v-select
                v-if="auth === 'admin'"
                hide-details
                :items="Companykeys"
                prepend-inner-icon="mdi-apps"
                label="회사선택"
                v-model="companyselect"
                @change="CompanyToggle"
              >
              </v-select>
            </v-col>
            <v-col cols="6">
              <v-select
                v-if="auth === 'admin'"
                hide-details
                :items="Branchkeys"
                prepend-inner-icon="mdi-apps"
                label="지점선택"
                v-model="branchselect"
                @change="BranchToggle"
              >
              </v-select>
            </v-col>
          </v-row>

          <v-col cols="12">
            <v-text-field
              v-model="serial"
              :counter="20"
              :rules="serialRules"
              label="시리얼 번호*"
              prepend-inner-icon="mdi-message-text-outline"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="device"
              :counter="20"
              :rules="deviceRules"
              label="디바이스명*"
              prepend-inner-icon="mdi-devices"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="firmVersion"
              :counter="20"
              :rules="firmVersionRules"
              label="펌웨어버전*"
              prepend-inner-icon="mdi-alpha-v-circle-outline"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-row rows class="left">
              <v-text-field
                v-model="location"
                prepend-inner-icon="mdi-map-marker"
                :rules="locationRules"
                placeholder="주소"
              />
              &nbsp; &nbsp;
              <v-btn color="#2a3248" class="mt-5" @click="getMarker()">
                <span style="color:white;">지도에 표시</span></v-btn
              >
            </v-row>
          </v-col>
         
          <!-- 구글맵 -->
          <div id="app">
            <google-map
              class="googleMap"
              :center="center"
              :zoom="7"
              ref="mmm"
              @click="addMarker"
            >
              <div slot-scope="{ google, map }">
                <google-map-marker
                  v-for="(marker, index) in markers"
                  :google="google"
                  :map="map"
                  :key="index"
                  :position="marker.position"
                  @click="panTo($event, map)"
                  :clickable="true"
                  :draggable="true"
                >
                </google-map-marker>
                <google-map-custom-control
                  :google="google"
                  :map="map"
                  position="BOTTOM_CENTER"
                >
                  <input type="text" />
                </google-map-custom-control>
              </div>
            </google-map>
          </div>
          <!-- 구글맵 -->

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
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.0/vue.js"></script>
<script src="vue-google-maps.js"></script>
<script>
import axios from "axios";
import EventBus from "../../eventBus";
import AlertSnackBar from "../SnackBar/AlertSnackBar.vue";

import GoogleMapsApiLoader from "google-maps-api-loader";
export default {
  components: {
    AlertSnackBar
  },
  data: () => ({
    Companykeys: [],
    center: "",
    Branchkeys: [],
    auth: "admin",
    location: "",
    extraAddress: "",
    branch: "",
    description: "",
    firmVersion: "",
    branchselect: "",
    companyselect: "",
    geocoder:null,
    serial: "",
    device: "",
    deviceId: 0,
    mode: "",
    dialog: false,
    valid: true,
    markers: [],
    searchWindow: {
      display: "none",
      height: "300px"
    },
    serialRules: [
      v => !!v || "시리얼 번호를 입력해주세요",
      v => (v && v.length <= 20) || "20글자 초과 하실 수 없습니다."
    ],

    deviceRules: [
      v => (v.length <= 20) || "20글자 초과 하실 수 없습니다."
    ],

    descriptionRules: [
      v => (v && v.length <= 20) || "50글자 초과 하실 수 없습니다."
    ],

    locationRules: [
      v => (v.length <= 30) || "30글자 초과 하실 수 없습니다."
    ],

    firmVersionRules: [
      v => !!v || "펌웨어 버전을 입력해주세요",
      v => (v && v.length <= 20) || "20글자 초과 하실 수 없습니다."
    ]
  }),
  // updated() {
  //   var geocoder = new google.maps.Geocoder();
  //   var address = this.location;

  //   const self = this;
  //   geocoder.geocode({ address: address }, function(results, status) {
  //     if (status === "OK") {
  //       self.markers.push({
  //         position: {
  //           lat: results[0].geometry.location.lat(),
  //           lng: results[0].geometry.location.lng()
  //         }
  //       });
  //     }
  //   });
  // },
  mounted() {
    EventBus.$on("mydevice_Add", r => {
      this.mode = "post";
      this.dialog = true;
      axios.get("/api/myDevice/addModal").then(r => {
        for (const item of r.data.result) {
          this.Companykeys.push(item.name);
        }
      });
    });

    for (const item of this.device) {
      if (item.isOn === "Y") item.isOn = "On";
      else item.isOn = "Off";
    }
  },
  methods: {
    CompanyToggle() {
      axios
        .post("/api/myDevice/branch", {
          name: this.companyselect
        })
        .then(r => {
          for (const item of r.data.result[0].branches) {
            this.Branchkeys.push(item.name);
          }
        });
    },
    BranchToggle() {
      this.branch = this.branchselect;
    },
      getMarker(){
        const geocoder = new google.maps.Geocoder();
      const address = this.location
      const self = this
        if(this.markers!="")
          {
           this.markers=""
          }
      geocoder.geocode({ address: address }, function(results, status) {
        
        if (status === "OK") {
          self.markers=[]
          self.markers = [{
            position: {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng()
            }
          }]
        
        }
      });
    },

    saveClick() {
      axios
        .post("/api/myDevice", {
          serial: this.serial,
          name: this.device,
          firmVersion: this.firmVersion,
          location: this.location,
          description: this.description,
          branch: this.branch,
          branchselect: this.branchselect
        })
        .then(r => {
          EventBus.$emit("Alert", "mydevice_addOk", "생성되었습니다");
          EventBus.$on("mydevice_addOk", r => {
            location.href = "/mydevice";
          });
        });
      
    },

    modalClose() {
      this.dialog = false;
      this.serial = "";
      this.device = "";
      this.location = "";
      this.markers = "";
    },
    addMarker(e) {
      const { lat, lng } = e.latLng.toJSON();
    }
  }
};
</script>

<style scoped>
.left {
  margin-left: 1px;
}
.googleMap {
  height: 300px;
}
</style>
