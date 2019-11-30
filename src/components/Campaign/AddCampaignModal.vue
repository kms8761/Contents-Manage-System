<template>
  <v-dialog v-model="models.dialog" fullscreen>
    <v-card>
      <v-card-title class="blue">
        캠페인 설정
        <v-row justify="end">
          <v-btn @click="btnInit" dark class="pink">초기화</v-btn>
        </v-row>
      </v-card-title>
      <v-stepper v-model="models.stepperPage">
        <v-stepper-header>
          <v-stepper-step :complete="models.stepperPage > 1" step="1"
            >캠페인 시간대 설정</v-stepper-step
          >
          <v-divider></v-divider>
          <v-stepper-step :complete="models.stepperPage > 2" step="2"
            >미디어 선택</v-stepper-step
          >
          <v-divider></v-divider>
          <v-stepper-step :complete="models.stepperPage > 3" step="3"
            >미디어 반복 설정</v-stepper-step
          >
          <v-divider></v-divider>
          <v-stepper-step :complete="models.stepperPage > 4" step="4"
            >디바이스 선택</v-stepper-step
          >
          <v-divider></v-divider>
          <v-stepper-step :complete="models.stepperPage > 5" step="5"
            >결과</v-stepper-step
          >
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-form ref="form1" v-model="models.step2Valid">
              <!-- step-1 content start -->
              <v-card>
                <v-card-text>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="models.name"
                        :counter="20"
                        :rules="rules.campaign"
                        label="캠페인명*"
                        prepend-inner-icon="mdi-account-check"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6">
                      <v-menu
                        v-model="models.menuFromCalendar"
                        :close-on-content-click="false"
                        :nudge-right="10"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="models.fromDate"
                            label="시작일"
                            :rules="rules.calendar"
                            :readonly="models.readonly"
                            prepend-inner-icon="mdi-calendar"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          locale="ko"
                          v-model="models.fromDate"
                          @input="menu = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="6">
                      <v-menu
                        v-model="models.menuFromTime"
                        :close-on-content-click="false"
                        :nudge-right="10"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="models.fromTime"
                            label="시작시간"
                            :rules="rules.time"
                            :readonly="models.readonly"
                            prepend-inner-icon="mdi-clock-check-outline"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-time-picker
                          locale="ko"
                          v-model="models.fromTime"
                          format="24hr"
                          @input="menu = false"
                        ></v-time-picker>
                      </v-menu>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6">
                      <v-menu
                        v-model="models.menuToCalendar"
                        :close-on-content-click="false"
                        :nudge-right="10"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="models.toDate"
                            label="종료일"
                            :rules="rules.calendar"
                            :readonly="models.readonly"
                            prepend-inner-icon="mdi-calendar"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          locale="ko"
                          v-model="models.toDate"
                          @input="menu = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="6">
                      <v-menu
                        v-model="models.menuToTime"
                        :close-on-content-click="false"
                        :nudge-right="10"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="models.toTime"
                            label="종료시간"
                            :rules="rules.time"
                            :readonly="models.readonly"
                            prepend-inner-icon="mdi-clock-check-outline"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-time-picker
                          locale="ko"
                          v-model="models.toTime"
                          format="24hr"
                          @input="menu = false"
                        ></v-time-picker>
                      </v-menu>
                    </v-col>
                  </v-row>
                  <v-spacer></v-spacer>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-form>
            <!-- step-1 content end -->
            <v-card
              class="mb-12"
              color="grey lighten-1"
              height="200px"
            ></v-card>
            <!-- 나중에 지울 것. -->
            <v-btn
              color="primary"
              @click="btnValidate(1)"
              :disabled="!models.step1Valid"
            >
              Continue
            </v-btn>
            <v-btn text @click="close">취소</v-btn>
          </v-stepper-content>

          <!-- 미디어 선택 -->
          <v-stepper-content step="2">
            <v-form ref="form2" v-model="models.step2Valid">
              <!-- step-2 content start -->
              <v-container>
                <v-data-table
                  :headers="models.headers"
                  :items="items"
                  :show-select="models.showSelect"
                  item-key="items.orderId"
                  hide-default-footer
                  class="elevation-1"
                >
                  <!-- 날짜 포맷 변경 -->
                  <template v-slot:item.clicked>
                    <td class="handle">::</td>
                  </template>

                  <template v-slot:item.order="{ item }">
                    <!-- {{ items.map(function(x) {return x.orderId}).indexOf(item.orderId) }} -->
                    {{ item.order }}
                  </template>

                  <template v-slot:item.action="{ item }">
                    <v-icon small @click="deleteItem(item)">
                      mdi-delete
                    </v-icon>
                  </template>

                  <template v-slot:item.repeat="{ item }">
                    <v-text-field>
                      {{ item.repeat }}
                    </v-text-field>
                  </template>
                </v-data-table>

                <br />
                <v-card height="30" :elevation="0">
                  <v-btn
                    class="ma-2"
                    absolute
                    dark
                    bottom
                    right
                    color="pink"
                    @click="btnAddMedia"
                  >
                    <v-icon>mdi-plus</v-icon> 미디어 추가
                  </v-btn>
                </v-card>
              </v-container>
              <!-- step-2 content end -->

              <v-btn color="primary" @click="btnValidate(2)">
                Continue
              </v-btn>
              <v-btn text @click="models.stepperPage--">이전</v-btn>
              <v-btn text @click="close">취소</v-btn>
            </v-form>
          </v-stepper-content>
          <!-- 미디어 종료 -->

          <v-stepper-content step="3">
            <!-- step-3 content start -->

            <!-- step-3 content end -->
            <v-card
              class="mb-12"
              color="grey lighten-1"
              height="200px"
            ></v-card>
            <v-btn color="primary" @click="btnValidate(3)">
              Continue
            </v-btn>
            <v-btn text @click="models.stepperPage--">이전</v-btn>
            <v-btn text @click="close">Cancel</v-btn>
          </v-stepper-content>

          <v-stepper-content step="4">
            <!-- step-3 content start -->

            <!-- step-3 content end -->
            <v-card
              class="mb-12"
              color="grey lighten-1"
              height="200px"
            ></v-card>
            <v-btn color="primary" @click="btnValidate(4)">
              Continue
            </v-btn>
            <v-btn text @click="models.stepperPage--"> 이전 </v-btn>
            <v-btn text @click="close">Cancel</v-btn>
          </v-stepper-content>

          <v-stepper-content step="5">
            <!-- step-3 content start -->

            <!-- step-3 content end -->
            <v-card
              class="mb-12"
              color="grey lighten-1"
              height="200px"
            ></v-card>
            <v-btn text @click="models.stepperPage--"> 이전 </v-btn>
            <v-btn color="primary" @click="save"> Save </v-btn>
            <v-btn text @click="close">Cancel</v-btn>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-card>

    <!-- <v-snackbar :timeout="(time = 5000)" v-model="models.alert" top persistent multi-line color="red" dark icon="mdi-alert-circle-outline" transition="scale-transition"
      >{{ models.sbText }}
      <v-btn color="red" @click="models.alert = false">확인</v-btn>
    </v-snackbar> -->
    <AddCampaignMediaModal></AddCampaignMediaModal>
  </v-dialog>
</template>
<script>
import axios from "axios";
import eventBus from "../eventBus.js";
import moment from "moment";
import AddCampaignMediaModal from "./AddCampaignMediaModal";
import Sortable from "sortablejs";
import lodash from "lodash";

export default {
  data() {
    return {
      //-- 캘린더 관련 시작
      items: [],

      // v-model
      models: {
        item: "",
        cpy_items: "",
        readonly: true,
        menuFromCalendar: false,
        menuToCalendar: false,
        menuFromTime: false,
        menuToTime: false,
        name: "", // 캠페인 이름
        step1Valid: true,
        step2Valid: true,
        fromDate: "",
        toDate: "",
        fromTime: "",
        toTime: "",
        stepperPage: 3, // stepper
        alert: false, // 에러 스낵바
        sbText: "",
        dialog: false, // 팝업
        medias: [], // 조회한 미디어
        selected: [], // 체크박스
        init: true, // 처음 조회나, 초기화 버튼을 눌렀을 시
        showSelect: false,

        headers: [
          {
            text: "",
            align: "left",
            sortable: false,
            value: "clicked",
            width: "30"
          },
          { text: "Order", value: "order", sortable: false },
          // { text: "동영상"},
          { text: "Media", align: "left", sortable: false, value: "name" },
          { text: "시간", value: "playTime" },
          {
            text: "Actions",
            value: "action",
            sortable: false,
            width: "30",
            align: "center"
          },
          { text: "반복", value: "repeat", sortable: false }
          // { text: "총 시간", value: "carbs" },
        ]
      },
      //-- 캘린더 관련 끝

      // -- Rules 시작
      rules: {
        calendar: [v => !!v || "(시작일/종료일)을 선택해주세요"],
        campaign: [v => !!v || "캠페인 명을을 입력해주세요"],
        time: [v => !!v || "시간을 선택해 주세요"]
      }

      // -- Rules 끝
    };
  },
  created() {
    eventBus.$on("getAddCampaignModalResult", data => {
      let length = this.items.length;
      let item = lodash.cloneDeep(data);

      item.orderId = length + 1;
      item.order = length + 1;
      item.repeat = 1;
      this.items.push(item);
      console.log(this.items);

      this.createDraggable();
    });

    // Campaign.vue에서 triggerAddCampaign 를 실행하면 나온다.
    // 팝업창을 띄운다.
    eventBus.$on("triggerAddCampaign", () => {
      this.models.dialog = true;
      if (this.models.init) {
        this.getMedias();
        this.models.init = false;
      }
    });
  },
  mounted() {},

  computed: {
    numberOfPages() {
      return Math.ceil(this.models.medias.length / this.models.itemsPerPage);
    }
  },
  beforeDestroy() {
    // eventBus On 한 녀석들 죽이기
    eventBus.$off("getAddCampaignModalResult");
    eventBus.$off("triggerAddCampaign");
  },

  methods: {
    // 메소드
    close() {
      this.models.stepperPage = 3;
      this.models.dialog = false;
    },

    // 버튼을 누르면 다음페이지를 이동하기전 벨리데이션 체크를 위한 분기
    btnValidate(currentPage) {
      switch (currentPage) {
        case 1:
          this.page1Validate();
          break;
        case 2:
          this.page2Validate();
          break;
        case 3:
          this.page3Validate();
          break;
        default:
          break;
      }
    },

    // 첫번째 페이지 벨리데이션
    // 시작일시 보다 종료 일시가 적으면 에러를 뱉는다.
    page1Validate(pageNumber) {
      if (this.$refs.form1.validate()) {
        // from 날짜가 to 날짜보다 클경우 에러
        const fromDate = moment(
          `${this.models.fromDate} ${this.models.fromTime}`,
          `YYYY-MM-DD HH:mm`
        );
        const toDate = moment(
          `${this.models.toDate} ${this.models.toTime}`,
          `YYYY-MM-DD HH:mm`
        );

        const min = moment.duration(toDate.diff(fromDate)).asMinutes();

        if (min <= 0) {
          this.alert("시작 시간이 종료시간보다 작을 수 없습니다.");
          this.models.alert = true;
          return;
        }

        this.models.stepperPage++;
      }
    },

    // 두번째 페이지 벨리데이션
    // 체크한 값이 하나라도 없으면 에러를 뱉는다.
    page2Validate(pageNumber) {
      console.log(`선택된 미디어 수 :: ${this.models.selected.length}`);
      if (0 >= this.models.selected.length) {
        this.alert("최소 하나의 미디어를 선택해야 합니다.");
      }
      this.models.stepperPage++;
    },

    // 미디어 리스트를 가져온다.
    getMedias() {
      const token = localStorage.getItem("token");
      axios.get(`/api/media`, { headers: { token: token } }).then(r => {
        if (!r.data.success) return console.error(r.data.msg);

        console.log(r.data.medias);
        this.models.medias = r.data.medias;
      });
    },

    mediainfo() {},

    page3Validate() {
      if (this.$refs.form1.validate()) this.models.stepperPage = pageNumber;
    },
    // 스텝 페이지 이전 버튼
    previous() {
      this.models.stepperPage--;
    },
    btnInit() {
      this.models.init = true;
      this.models.stepperPage = 1;
      this.$refs.form1.reset();
      this.$refs.form2.reset();
      // this.$refs.form2.reset()
    },

    // 3번재 탭 미디어 선택 화면에서 미디어 목록 중 이전
    formerPage() {
      if (this.models.itemPage - 1 >= 1) this.models.itemPage -= 1;
    },

    // 3번재 탭 미디어 선택 화면에서 미디어 목록 중 다음
    nextPage() {
      if (this.models.itemPage + 1 <= this.models.numberOfPages)
        this.models.itemPage += 1;
    },
    // 미디어 추가화면을 연다.
    btnAddMedia() {
      eventBus.$emit("triggerAddCampaignMedia", "getAddCampaignModalResult");
    },
    save() {
      this.close();
    },
    alert(message) {
      this.models.sbText = message;
      this.models.alert = true;
    },
    createDraggable() {
      let table = document.querySelector(".v-data-table__wrapper tbody");

      const _self = this;
      _self.cpy_items = lodash.cloneDeep(_self.items);    
      
      new Sortable(table, {
        handle: ".handle",
        selectedClass: "selected",
        animation: 200,
        onEnd({ oldIndex, newIndex }) {
          
          const movedItem = _self.cpy_items.splice(oldIndex, 1)[0];
          _self.cpy_items.splice(newIndex, 0, movedItem);
          
          _self.cpy_items.forEach(function(item, index) {
            item.order = index + 1;
          });
          
          console.log('``````````` COPY `````````````````````');
          _self.cpy_items.forEach(function(item, index){
            console.log(`id::${item.orderId}, order :: ${item.order}, name:: ${item.name}`);
          });
          console.log('``````````` ORIGINAL `````````````````````');
          _self.items.forEach(function(item, index){
            console.log(`id::${item.orderId}, order :: ${item.order}, name:: ${item.name}`);
          })
        }
      });
    },

    // row의 휴지통 버튼을 눌렀을때 나오는 삭제
    // 해당 row를 지운다.
    deleteItem(item) {
      const index = this.items.indexOf(item);
      this.items.splice(index, 1);
    }
  }, // method
  components: {
    AddCampaignMediaModal: AddCampaignMediaModal
  }
};
</script>

<style scope>
.videoslist {
  height: 40%;
  text-align: -webkit-center;
  flex-wrap: wrap;
  justify-content: space-between;
  padding-left: 0;
  margin-top: 0;
  margin-bottom: 0;
  list-style: none;
}
.rounded {
  border-radius: 25rem !important;
}
.playbtn {
  position: absolute;
  margin: 0.5rem;
  bottom: 0;
  right: 0;
  margin-bottom: 0;
  margin-right: 0;
}
.handle {
  cursor: move !important;
  cursor: -webkit-grabbing !important;
}
</style>
