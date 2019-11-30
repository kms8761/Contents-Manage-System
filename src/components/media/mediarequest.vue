<template>
  <v-form ref="form" v-model="valid">
    <v-dialog v-model="dialog" persistent scrollable max-width="600px">
      <AlertSnackBar></AlertSnackBar>
      <v-card>
        <v-app-bar dark color="blue-grey">
          <v-card-title>
            <span>미디어 요청</span>
          </v-card-title>
          <v-spacer></v-spacer>
          <v-btn icon dark>
            <v-icon @click="modalClose" size="30px">mdi-close</v-icon>
          </v-btn>
        </v-app-bar>
        <v-card-text>
          <v-divider></v-divider>

          <!-- text -->
          <!-- <v-btn-toggle
                      v-model="text"
                      v-if="this.auth"
                      color="pink"
                      style="background-color:white"
                    >
                    </v-btn-toggle> -->
          <!-- text -->

          <v-col cols="20">
            <div class="colupload">
              <v-text-field
                v-model="name"
                :counter="20"
                :rules="nameRules"
                label="미디어 목적*"
                prepend-inner-icon="mdi-arrow-right-drop-circle"
                required
              ></v-text-field>
            </div>
          </v-col>
          <v-col cols="12">
            <div class="colupload">
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
            </div>
          </v-col>
          <v-col cols="12">
            <div class="colupload">
              <v-textarea
                style="min-height: 10rem;"
                v-model="detail"
                outlined
                :counter="200"
                :rules="detailRules"
                label="요구사항*"
                prepend-inner-icon="mdi-message-bulleted"
                required
              ></v-textarea>
              ※애니메이션 3D 비디오에 대한 요구 사항 비디오 역학, 특수 효과 등을
              지정하십시오.
            </div>
          </v-col>

          <v-col cols="12">
            <div class="colupload">
              <v-file-input
                v-model="file"
                accept="image/*, video/*, audio/*,application/pdf"
                placeholder="참조프로젝트 추가"
                prepend-inner-icon="mdi-file"
                label="참조프로젝트"
                value="filevalue"
              >
                <template v-slot:selection="{ index, text }">
                  <!-- <v-chip
                      v-if="index < 3"
                      color="deep-purple accent-4"
                      dark
                      label
                      small
                    >  -->
                  {{ text }}
                  <!-- </v-chip> -->
                </template>
              </v-file-input>
              ※컨텐츠의 비전을 설명하는 이미지 또는 비디오를 제공하십시오
            </div>
          </v-col>

          <v-col cols="12">
            <div>
              <v-icon>mdi-view-grid</v-icon>

              <strong color="black">하이퍼비전 사용 갯수*</strong>

              <!-- information icon 클릭시 발생하는 menu 이벤트  -->

              <v-menu
                v-model="menus"
                :close-on-content-click="false"
                :nudge-width="200"
                offset-x
              >
                <template v-slot:activator="{ on }">
                  <v-btn color="indigo" dark icon v-on="on">
                    <v-icon color="#6c98c3">mdi-information</v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-list>
                    <v-list-item>
                      <img
                        width="100%"
                        height="200rem"
                        src="@/assets/mediaexample.jpg"
                      />
                    </v-list-item>
                  </v-list>
                </v-card>
                <!--  -->
              </v-menu>
            </div>
            <!-- information icon 클릭시 발생하는 menu 이벤트  -->
            <v-select
              v-model="width"
              label="가로"
              :rules="widthRules"
              :items="number"
              :readonly="readonly"
              prepend-inner-icon="mdi-table-column-width"
            >
            </v-select>
            &nbsp;
            <strong>x</strong>
            &nbsp;
            <v-select
              v-model="height"
              label="세로"
              numberOnly
              :items="number"
              :rules="heightRules"
              prepend-inner-icon="mdi-table-row-height"
            ></v-select>
            <!-- <div>
            
            </div> -->
            <!-- <v-select
         v-model="actselect"
        :items="actitems"
         prepend-inner-icon="mdi-view-grid"
         label="하이퍼비전 사용 갯수*"
         >
      </v-select> -->
          </v-col>
          <v-spacer></v-spacer>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="saveClick">
            요청
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
// 데이터 컴포넌트간 전달eventbus
import EventBus from "../../eventBus";
import axios from "axios";
import AlertSnackBar from "../SnackBar/AlertSnackBar.vue";
export default {
  components: {
    AlertSnackBar
  },
  data: () => ({
    date: new Date().toISOString().substr(0, 10),
    menu: false,
    menus: false,
    dialog: false,
    valid: true,
    select: null,
    actselect: null,
    readonly: false,
    file: [],
    date: "",
    name: "",
    width: "",
    height: "",
    nameRules: [
      v => !!v || "미디어 이름을 입력해주세요",
      v => (v && v.length <= 20) || "20글자 초과 하실 수 없습니다."
    ],

    detail: "",
    detailRules: [
      v => !!v || "요구사항을 입력해주세요",
      v => (v && v.length <= 200) || "200글자 초과 하실 수 없습니다."
    ],
    dateRules: [v => !!v || "만료일을 입력해주세요"],
    widthRules: [v => !!v || "가로 입력해주세요"],
    heightRules: [v => !!v || "세로 입력해주세요"],

    actitems: ["신발", "자동차", "의류", "인물", "마트"],
    number: ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
  }),
  mounted() {
    EventBus.$on("Media_request", item => {
      this.dialog = true;
    });
  },

  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        this.snackbar = true;
      }
    },

    modalClose() {
      this.dialog = false;
      this.$refs.form.reset();
      this.$refs.form.resetValidation();
    },
    saveClick() {
     
    }
  }
};
</script>
<style>
.colupload {
  color: black;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  height: auto;
  -webkit-box-flex: 1;
  -ms-flex-positive: 1;
  flex-grow: 1;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  max-width: 30rem;
  min-width: 30rem;
  width: 100%;
}

 .theme--light.v-select .v-select__selections {
    color: rgba(0, 0, 0, 0.87);
    min-width: 2rem;
    max-width: 7rem; 
}  
</style>
<style scoped>
.v-select {
  color: rgba(0, 0, 0, 0.87);
  min-width: 3rem;
  max-width: 12rem;
}
</style>
