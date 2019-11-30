<template>
  <v-dialog v-model="dialog" scrollable max-width="400px" persistent>
    <AlertSnackBar></AlertSnackBar>
    <v-card>
      <v-app-bar dark color="blue">
        <v-card-title>
          <span>{{ editname }}</span>
        </v-card-title>
        <v-spacer></v-spacer>
        <v-btn @click="modalClose()" icon dark>
          <v-icon size="30px">mdi-close</v-icon>
        </v-btn>
      </v-app-bar>

      <v-card-text class="pa-0">
        <div id="message"  class="video-backgroud"></div>

        <video
          id="video"
          controls="controls"
          class="videoheight"
          width="100%"
          height="auto"
          autoplay
          loop
        >
          <source
            :src="require(`../../../../upload/media/${video}`)"
            type="video/mp4"
          />
        </video>


        <v-divider></v-divider>
        <v-card>
          <v-list>
            <v-list-item>
              <v-row justify="center">
                <v-btn icon @click="mediaInfoEdit2()">
                  <v-icon color="indigo">mdi-square-edit-outline</v-icon>
                </v-btn>
                정보수정 &nbsp;
                <!-- html5에서 제공하는 download -->
                <!-- <a href="../test.mp4" download>
                  <v-btn icon>
                    <v-icon color="indigo">mdi-arrow-collapse-down</v-icon>
                  </v-btn>
                </a>
                다운로드 -->
              </v-row>
            </v-list-item>
          </v-list>
        </v-card>
        <v-list>
          <!-- 이름이 수정시에 변경하는란 생기게 readonly, outline  read값으로 변경가능 불가능 설정 -->
          <div v-if="isStatusOn">
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="indigo">mdi-account-check</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-subtitle>이름</v-list-item-subtitle>
                <v-text-field
                  dense
                  solo
                  v-model="editname"
                  label="이름*"
                  required
                  :readonly="read"
                  :outlined="editout"
                >
                </v-text-field>
              </v-list-item-content>
            </v-list-item>
          </div>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="indigo">mdi-alpha-s-circle</v-icon>
            </v-list-item-icon>
            <v-list-item-content class="allshow">
              <div class="allshow">
                <v-list-item-subtitle>사이즈</v-list-item-subtitle>
                <span>{{ Math.floor(editsize / (1024 * 1024)) / 10 + "MB" }}</span>
              </div>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="indigo">mdi-calendar</v-icon>
            </v-list-item-icon>
            <v-list-item-content class="allshow">
              <div class="allshow">
                <v-list-item-subtitle>작성일</v-list-item-subtitle>
                <span>{{ editadded | formatDateYMD }}</span>
              </div>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="indigo">mdi-play-circle</v-icon>
            </v-list-item-icon>
            <v-list-item-content class="allshow">
              <div class="allshow">
                <v-list-item-subtitle>재생시간</v-list-item-subtitle>
                <span>{{ editduration }}초</span>
              </div>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="indigo">mdi-view-grid</v-icon>
            </v-list-item-icon>
            <v-list-item-content class="allshow">
              <div class="allshow">
                <div v-if="isStatusOn">
                  <v-col cols="20">
                    <div class="colupload">
                      <!--카테고리  -->
                      <v-combobox
                        v-model="mediacategory"
                        :items="mediaselect"
                        :search-input.sync="search"
                        hide-selected
                        hint="최대 5개 선택가능"
                        label="태그 검색"
                        multiple
                        persistent-hint
                        chips
                      >
                        <template v-slot:no-data>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title>
                                "<strong>{{ search }}</strong
                                >"로 입력을 원하시면 <kbd>enter</kbd>d를
                                눌러주세요.
                              </v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </template>
                      </v-combobox>
                    </div>
                  </v-col>
                </div>
                <div v-else>
                  <v-list-item-subtitle>태그</v-list-item-subtitle>
                  <v-col>
                    <div v-if="editcategory!=''">
                    <v-chip
                      color="primary"
                      v-for="item in editcategory"
                      :key="item"
                    >
                      <span class="v-chip__content">
                        {{ item }}
                      </span>
                     
                      &nbsp;
                    </v-chip>
                    </div>
                    <div v-else>

                           </div>
                  </v-col>
                </div>
              </div>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="indigo">mdi-message-bulleted</v-icon>
            </v-list-item-icon>
            <v-list-item-content class="allshow">
              <div class="allshow">
                <v-list-item-subtitle>설명</v-list-item-subtitle>
                <!-- readonly, outline  read값으로 변경가능 불가능 설정          -->
                <v-textarea
                  no-resize
                  class="textheight"
                  v-model="editdetail"
                  dense
                  solo
                  required
                  :readonly="read"
                  :outlined="editout"
                ></v-textarea>
              </div>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <div v-if="isStatusOn">
          <v-btn color="primary" v-model="savebtn" @click="saveClick">
            저장
          </v-btn>
          <v-btn color="error" @click="mediaInfocancel()" v-model="closebtn">
            취소
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import AlertSnackBar from "../SnackBar/AlertSnackBar.vue";
import axios from "axios";
import EventBus from "../../eventBus";

export default {
  data() {
    return {
      e6: [],
      states: ["신발", "자동차", "의류", "인물", "마트"],
      a: ["http://techslides.com/demos/sample-videos/small.mp4"],
      video: "",
      a: "@/assets/videoex.mp4",
      editname: "",
      tag: [],
      mediaId: 0,
      editcategory: [],
      editsize: 0,
      editadded: "",
      editduration: 0,
      editdetail: "",
      formTitle: "",

      dialog: false,
      read: true,
      editout: false,
      editsolo: true,
      savebtn: false,
      isStatusOn: false,
      feelgood: "@/assets/movie.mp4",

      mediaselect: ["신발", "자동차", "의류", "인물", "게임", "코스윌", "모자"],
      mediacategory: [],
    };
  },

  components: {
    AlertSnackBar
  },
  methods: {
    saveClick() {
      axios
        .put("/api/media", {
          id: this.mediaId,
          name: this.editname,
          descript: this.editdetail,
          tags: this.mediacategory
        })
        .then(r => {
          EventBus.$emit("Alert", "mediaInfo_SaveItem","수정되었습니다");
          eventBus.$on("DetailModal_triggerDelPostOk", (r) => {
            location.href="/media"  
          })
        })
    },
    removechip(item) {
      this.chips.splice(this.chips.indexOf(item), 1);
      this.chips = [...this.chips];
    },
    remove(item) {
      this.selected.splice(this.selected.indexOf(item), 1);
    },

    modalClose() {
      (this.editname = ""), (this.editsize = 0), (this.editadded = "");
      this.editresolution = "";
      this.category = "";
      this.editDetail = "";
      this.mediacategory = [];
      this.read = true;
      this.editsolo = false;
      this.editout = false;
      this.dialog = false;
      this.isStatusOn = false;
      this.editcategory = [];
    },
    mediaInfoEdit2() {
      this.read = false;
      this.editsolo = true;
      this.editout = true;
      this.isStatusOn = true;
    },
    mediaInfocancel() {
      this.read = true;
      this.editsolo = false;
      this.editout = false;
      this.isStatusOn = false;
      this.editcategory = [];
    }
  },
  computed: {
    videoElement() {
      return this.$refs.video;
    }
  },
  mounted() {
    EventBus.$on("Media_info", item => {
      axios.post(`/api/media/info`, { id: item }).then(r => {
        if (!r.data.success) return console.error(r.data.msg);
        if (r.data.success) {

          this.mediaId = r.data.media.id;
          this.editsize = r.data.media.file.size;
          this.editname = r.data.media.name;
          this.editdetail = r.data.media.description;
          this.editadded = r.data.media.createdAt;
          this.editduration=r.data.media.playTime;
          for (item of r.data.media.tags) {
            this.editcategory.push(item.name);
          }

          for (item of r.data.media.tags) {
            this.mediacategory.push(item.name);
          }
          this.video = r.data.media.file.orgName;
          var video = document.getElementById("video");
          video.load();
          video.play();
        }
      });

      this.dialog = true;
    });

    //메뉴바에서 수정하기로 바로 오는 on 위 mdinfo랑 같아야함
    EventBus.$on("Media_edit", item => {
      axios.post(`/api/media/info`, { id: item }).then(r => {
        if (!r.data.success) return console.error(r.data.msg);
        if (r.data.success) {
          this.mediaId = r.data.media.id;
          this.editsize = r.data.media.file.size;
          this.editname = r.data.media.name;
          this.editdetail = r.data.media.description;
          this.editadded = r.data.media.createdAt;
          this.editduration=r.data.media.playTime;
          for (item of r.data.media.tags) {
            this.editcategory.push(item.name);
          }

          for (item of r.data.media.tags) {
            this.mediacategory.push(item.name);
          }
          this.video = r.data.media.file.orgName;
          var video = document.getElementById("video");
          video.load();
          video.play();
        }
      });

      this.read = false;
      this.editsolo = true;
      this.editout = true;
      this.isStatusOn = true;
      this.dialog = true;
    });
  },
  beforeDestroy() {
    EventBus.$off("mdinfo");
  },

  watch: {
    mediacategory(val) {
      if (val.length > 5) {
        this.$nextTick(() => this.mediacategory.pop());
      }
    }
  }
};
</script>
<style scoped>
.video-background {
    z-index: 99999;
}
.v-text-field.v-text-field--enclosed .v-text-field__details {
  margin-bottom: 0px;
}
.videoheight {
  max-height: 340px;
}
a:link {
  text-decoration: none;
  color: black;
}
.allshow {
  -webkit-box-flex: 1;
  -ms-flex: 1 1 100%;
  flex: 1 1 100%;

  text-overflow: clip;
  white-space: pre-wrap;
}
.v-list-item__title {
  -webkit-box-flex: 1;
  -ms-flex: 1 1 100%;
  flex: 1 1 100%;
  overflow: hidden;
  text-overflow: none;
  white-space: none;
}

.videoinput {
}
</style>
<style scoped>
.v-select.v-select--chips .v-select__selections {
  min-height: 42px;
  max-width: 3rem;
}
.v-select.v-select--chips .v-select__selections {
  min-height: 42px;
  max-width: 3rem;
}
.videoheight {
  max-height: 340px;
}
.textheight {
  max-height: 140px;
  resize: none;
}
.v-chip__content {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  height: 100%;
  max-width: 100%;
  margin-left: 4%;
  /* text-align: center; */
}
</style>
