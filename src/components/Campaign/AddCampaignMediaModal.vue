<template>
  <v-dialog v-model="models.dialog">
    <v-card>
      <v-card-title class="red">
        <v-row>
          <v-col>
            미디어 추가
          </v-col>
          <v-col align="right">
            <v-btn @click="models.dialog = false">취소</v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <!-- 미디어 선택 -->
      <v-form ref="form1" v-model="models.step2Valid">
        <!-- step-2 content start -->
        <v-container>
          <v-data-iterator :items="items" :items-per-page.sync="itemsPerPage" :search="models.search" :page="itemPage" hide-default-footer>
            <template v-slot:header>
              <div>
                <template>
                  <!-- <v-select v-if="auth === 'admin'" flat hide-details :items="keys" prepend-inner-icon="mdi-magnify" label="회사별 조회" v-model="companyselect" @change="toggles"> </v-select> -->

                  <v-text-field flat v-model="models.search" prepend-inner-icon="mdi-magnify" label="검색어입력" single-line hide-details></v-text-field>
                  <!-- <v-switch v-model="isAll" :label="`모든 지점 미디어 보기`" color="info" inset v-if="auth === 'company'" v-on:change="changeSwitch()"></v-switch> -->
                </template>
              </div>
            </template>
            <template v-slot:default="props">
              <v-row>
                <v-col v-for="media in props.items" :key="media.id" cols="12">
                  <v-card outlined class="mx-auto" max-width="1000">
                    <v-list-item three-line>
                      <v-btn id="cb1" color="primary" @click="btnAdd(media)"> </v-btn>
                      <div class="videoslist">
                        <v-btn icon rounded width="6rem" height="6rem" @click="mediainfo(media)">
                          <div>
                            <v-img src="@/assets/mediabg.png" width="5rem" height="5rem">
                              <!-- 고정이미지 -->
                              <!-- 바뀌는 컨텐츠이미지               -->
                              <v-img class="rounded" :src="require(`../../../../upload/media/${media.file.orgName}.png`)" width="5rem" height="5rem">
                                <!-- 바뀌는 컨텐츠이미지              -->
                              </v-img>
                              <!-- 고정아이콘 -->
                              <v-icon style="color: white;" class="playbtn" large>mdi-play-circle-outline </v-icon>
                            </v-img>
                          </div>
                        </v-btn>
                      </div>
                      <v-list-item-content>
                        <v-list-item-title class="headline mb-1">{{ media.name }}</v-list-item-title>
                        <v-list-item-subtitle>Size : {{ media.file.size }}초</v-list-item-subtitle>
                        <v-list-item-subtitle>생성 날짜 : {{ media.createdAt | formatDateYMDHMS }}</v-list-item-subtitle>
                        <v-list-item-subtitle>해상도 : {{ media.resolution1 }} x {{ media.resolution2 }}</v-list-item-subtitle>
                        <v-list-item-subtitle>재생시간 : {{ media.playTime }}초</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-card>
                </v-col>
              </v-row>
            </template>
            <!-- page footer -->
            <template v-slot:footer>
              <v-row>
                <v-col align="right">
                  <span class="mr-4 grey--text"> Page {{ itemPage }} of {{ numberOfPages }} </span>
                  <v-btn fab dark color="blue darken-3" class="mr-1" @click="formerPage">
                    <v-icon>mdi-chevron-left</v-icon>
                  </v-btn>
                  <v-btn fab dark color="blue darken-3" class="ml-1" @click="nextPage">
                    <v-icon>mdi-chevron-right</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col align="center" dark>
                  <v-btn class="red" @click="btnClose">
                    닫기
                  </v-btn>
                </v-col>
              </v-row>
            </template>
            <!-- page footer end -->
          </v-data-iterator>
        </v-container>
      </v-form>
      <!-- 미디어 종료 -->
    </v-card>

    <v-snackbar :timeout="(time = 5000)" v-model="models.alert" top persistent multi-line color="red" dark icon="mdi-alert-circle-outline" transition="scale-transition"
      >{{ models.sbText }}
      <v-btn color="red" @click="models.alert = false">확인</v-btn>
    </v-snackbar>
  </v-dialog>
</template>
<script>
import axios from "axios"
import eventBus from "../eventBus.js"
import moment from "moment"

export default {
  data() {
    return {
      //-- 캘린더 관련 시작
      items: [],
      inputItems:[],
      itemsPerPage: 10,
      itemPage: 1,
      // v-model
      models: {
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
        search: "", // 조회
        callback: "",
      },
      //-- 캘린더 관련 끝

      // -- Rules 시작
      rules: {
        calendar: [v => !!v || "(시작일/종료일)을 선택해주세요"],
        campaign: [v => !!v || "캠페인 명을을 입력해주세요"],
        time: [v => !!v || "시간을 선택해 주세요"]
      }

      // -- Rules 끝
    }
  },
  created() {},
  mounted() {
    // Campaign.vue에서 triggerAddCampaign 를 실행하면 나온다.
    // 팝업창(자신)을 띄운다.
    eventBus.$on("triggerAddCampaignMedia", (callback) => {
      this.callback = callback;
      this.models.dialog = true

      this.getMedias();
      this.models.init = false;
      this.inputItems = [];
    });
  },

  beforeDestroy() {
    // 이벤트 버스 죽이기
    eventBus.$off("triggerAddCampaignMedia");
  },

  computed: {
    numberOfPages() {
      return Math.ceil(this.items.length / this.itemsPerPage)
    }
  },

  methods: {
    // 메소드
    close() {
      this.models.stepperPage = 3
      this.models.dialog = false
    },

    // 버튼을 누르면 다음페이지를 이동하기전 벨리데이션 체크를 위한 분기
    btnValidate(currentPage) {
      switch (currentPage) {
        case 1:
          this.page1Validate()
          break
        case 2:
          this.page2Validate()
          break
        case 3:
          this.page3Validate()
          break
        default:
          break
      }
    },

    // 미디어 리스트를 가져온다.
    getMedias() {
      const token = localStorage.getItem("token")
      axios.get(`/api/media`, { headers: { token: token } }).then(r => {
        if (!r.data.success) return console.error(r.data.msg)

        this.items = r.data.medias
      })
    },

    mediainfo() {},
    // 3번재 탭 미디어 선택 화면에서 미디어 목록 중 이전
    formerPage() {
      if (this.itemPage - 1 >= 1) this.itemPage -= 1
    },

    // 추가 버튼을 눌러서, 메인화면으로 데이터를 넘김
    btnClose() {
      this.models.dialog=false;
    },
    alert(message) {
      this.models.sbText = message
      this.models.alert = true
    },
    // 임시 변수에 데이터를 담음..
    btnAdd(item) {
      this.inputItems.push(item);
      eventBus.$emit(this.callback, item);
    },

    nextPage() {
      if (this.models.itemPage + 1 <= this.models.numberOfPages)
        this.models.itemPage += 1;
    },
  } // method
}
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
</style>
