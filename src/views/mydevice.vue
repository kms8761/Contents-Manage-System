<!-- eslint-disable -->
<template>
<!-- eslint-disable -->
<!-- https://teunohooijer.com/2018/04/22/how-to-create-custom-markers-infowindows-with-vue2-google-maps/ -->
  <!-- npm i vue2-google-maps --save  vue2 지도 불러오기 -->
  <v-container class="grey lighten-5">
    <ConfirmSnackBar></ConfirmSnackBar>
    <v-card>
      <editDialog />
      <addDialog />
      <v-row no-gutters>
        <v-col cols="9">
          <v-card-title>
            나의 디바이스 관리
          </v-card-title>
        </v-col>
        <v-col cols="8">
          <v-card class="pa-2" tile>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="검색어입력"
              single-line
              hide-details
            ></v-text-field>
            <v-data-table
              :search="search"
              :headers="headers"
              :items="devices"
              hide-default-footer
              :items-per-page="8"
              class="font-weight-bold"
              :page.sync="page"
              @page-count="pageCount = $event"
            >
              <template v-slot:item.company="{ item }">
                <v-list-item style="text-align:left">
                  {{ item.branch_devices[0].branch.company.name }}<br />
                  {{ item.branch_devices[0].branch.name }}
                </v-list-item>
              </template>

              <template v-slot:item.isOn="{ item }">
                <v-btn @click="statusChange(item)" :color="getColor(item.isOn)">
                  <strong>{{ item.isOn }}</strong>
                </v-btn>
              </template>

              <template v-slot:item.location="{ item }">
                <v-list-item style="text-align:left">
                  {{ item.branch_devices[0].location }}
                </v-list-item>
              </template>

              <template v-slot:item.action="{ item }">
                <v-btn @click="DeviceEdit(item)" icon
                  ><v-icon>mdi-pencil</v-icon></v-btn
                >
              </template>
            </v-data-table>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="DeviceDetail(item)" color="info">통계보기 </v-btn>
              <v-btn @click="DeviceAdd(true)" color="info"
                >디바이스 등록
              </v-btn>
            </v-card-actions>

            <div class="text-center">
              <v-pagination v-model="page" :length="pageCount" circle>
              </v-pagination>
            </div>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card class="pa-2" tile>
            <template>
              <div id="app">
                <gmap-map
                  class="googleMap"
                  :center="center"
                  :zoom="7"
                  ref="mmm"
                  @click="addMarker"
                >
                

                  <div slot-scope="{ google, map }">
                    <gmap-marker
                      v-for="(marker, index) in markers"
                      :google="google"
                      :map="map"
                      :key="index"
                      :position="marker.position"
                      @click="toggleInfoWindow(marker,index)"
                      :clickable="true"
                      :draggable="true"
                    >
                    </gmap-marker>
                     <gmap-info-window 
                 @closeclick="window_open=false"
                 :options="infoOptions" 
                 :position="infoWindowPos" 
                 :opened="infoWinOpen" 
                 >
          <div v-html="infoContent"></div>
                </gmap-info-window>

                    <!-- <gmap-custom-control
                      :google="google"
                      :map="map"
                      position="BOTTOM_CENTER"
                    >
                      <input type="text" />
                    </gmap-custom-control> -->
                  </div>
                </gmap-map>
              </div>
            </template>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.0/vue.js"></script>
<script src="vue-google-maps.js"></script>

<script>
import GoogleMapsApiLoader from "google-maps-api-loader";
import Vue from "vue";
import moment from "moment";
import VueMomentJS from "vue-momentjs";
import axios from "axios";
import editDialog from "@/components/mydevice/editDialog.vue";
import addDialog from "@/components/mydevice/addDialog.vue";
import ConfirmSnackBar from "../components/SnackBar/ConfirmSnackBar.vue";
import EventBus from "../eventBus";

Vue.use(VueMomentJS, moment);

export default {
  components: {
    addDialog,
    editDialog,
    ConfirmSnackBar
  },
  name: "app",
  props: {
    mapConfig: Object,
    apiKey: String
  },

  data() {
    return {
      google: null,
      map: null,
         center: {
        lat: 35.9078,
        lng: 127.7669,
      },



      markers: [{
       
     
      }],
branch:'',
      //google
      to: {
        path: "/userManagement"
      },
      info: [],
      x: window.innerWidth,
      companyId: 0,
      branchId: 0,
      devices: [],
      search: "",
      lat: 0,
      page: 1,
      pageCount: 0,
      headers: [
        {
          text: "보유한 회사",
          align: "center",
          value: "company",
          sortable: false
        },
        { text: "디바이스명", align: "center", value: "name", sortable: false },
        {
          text: "펌웨어 버전",
          align: "center",
          value: "firmVersion",
          sortable: false
        },
        { text: "상태", align: "center", value: "isOn", sortable: false },
        { text: "위치", align: "center", value: "location", sortable: false },
        { text: "수정", align: "center", value: "action", sortable: false }
      ],
      devices: [],
      number: -1,

// info

      infoContent: '',
      infoWindowPos: null,
      infoWinOpen: false,
      currentMidx: null,
      //optional: offset infowindow so it visually sits nicely on top of our marker
      infoOptions: {
      pixelOffset: { width: 0, height: -35 }
      },

    };
  },

  mounted() {
    const token = localStorage.getItem("token");
    axios
      .get("/api/myDevice", { headers: { Authorization: token } })
      .then(r => {
        if (!r.data.success) return console.error(r.data.msg);
        this.devices = r.data.result;

        var geocoder = new google.maps.Geocoder();

        for (const item of this.devices) {
          if (!item.branch_devices[0]) {
            item.branch_devices[0] = {
              branch: {
                company: {
                  name: ""
                },
                name: ""
              }
            };
            //item.branch_devices[0].branch.name = `${item.branch_devices[0].branch.company.name}\n${item.branch_devices[0].branch.name}`;
          }
          if (item.isOn === "Y") item.isOn = "On";
          else item.isOn = "Off";

          if (item.branch_devices.length === 0) {
            item.branch_devices = [];
            item.branch_devices.push({
              location: "",
              branch: {
                name: ""
              }
            });
          }
          var address = item.branch_devices[0].location;
          const self = this;

          geocoder.geocode({ address: address }, function(results, status) {
            if (status === "OK") {
              self.markers.push({
                position: {
                  lat: results[0].geometry.location.lat(),
                  lng: results[0].geometry.location.lng()
                },
                  infoText: item.branch_devices[0].location
                 
              });
            }
          });
        }
      })
      .catch(e => {
        console.error(e.message);
      });
  },
  methods: {
    statusChange(item) {
      EventBus.$emit("Confirm", "mydevice_state", "정말 변경하시겠습니까?");

      EventBus.$on("mydevice_state", r => {
        this.number = this.devices.indexOf(item);
        if (this.devices[this.number].isOn === "On") {
          this.devices[this.number].isOn = "Off";
          axios
            .put("/api/myDevice/state", {
              id: item.id,
              state: "N"
            })
            .catch(e => {
              console.error(e.message);
            });
        } else if (this.devices[this.number].isOn === "Off") {
          this.devices[this.number].isOn = "On";
          axios
            .put("/api/myDevice/state", {
              id: item.id,
              state: "Y"
            })
            .catch(e => {
              console.error(e.message);
            });
        }
      });
    },
    addMarker(e) {
      const { lat, lng } = e.latLng.toJSON();

      this.markers.push({
        position: {
          lat,
          lng
        },

      

      });
    },
    panTo() {
      this.$refs.mmm.panTo({
        lat: 37,
        lng: 129
      });
    },

    DeviceDetail(item) {
      this.$router.push({ name: "statistics" });
    },
    DeviceEdit(item) {
      EventBus.$emit("mydevice_Edit", item);
    },
    DeviceAdd(item) {
      EventBus.$emit("mydevice_Add", item);
    },
    openWindow () {
            this.window_open = true
        },

   toggleInfoWindow: function(marker, index) {
            console.log(marker.position)
            console.log(marker.infoText)
            this.infoWindowPos = marker.position;
            this.infoContent = marker.infoText;

            //check if its the same marker that was selected if yes toggle
            if (this.currentMidx == index) {
              this.infoWinOpen = !this.infoWinOpen;
            }
            //if different marker set infowindow to open and reset current marker index
            else {
              this.infoWinOpen = true;
              this.currentMidx = index;

            }
          },




    getColor(item) {
      if (item === "On") return "green";
      else return "red";
    }
  }
};
</script>
<style scoped>
#map-instantsearch-container {
  height: 300px;
}
.v-application .pa-2 {
  padding: 8px !important;
  height: 40rem;
}
.googleMap {
  height: 500px;
}
</style>
