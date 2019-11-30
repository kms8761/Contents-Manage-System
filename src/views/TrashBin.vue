<template>
  <v-card>
    <mediainfo> </mediainfo>
    <!-- 컴포넌트 -->
    <ConfirmSnackBar />

    <v-card-title>
      휴지통
    </v-card-title>
    <v-row justify="end">
      <center>
        <button
          _ngcontent-mmy-c10
          class="btn btn-default"
          @click="selectdeleteAll(item)"
        >
          전체 영구 삭제
        </button>

        &nbsp;
        <button
          _ngcontent-mmy-c10
          class="btn btn-default"
          @click="selectdelete(item)"
        >
          선택 영구 삭제
        </button>

        &nbsp; &nbsp;
        <button
          _ngcontent-mmy-c10
          class="btn btn-default"
          @click="restoremediaAll(item)"
        >
          복원
        </button>

        &nbsp; &nbsp; &nbsp; &nbsp;
      </center>
    </v-row>
    <!-- 각각의 데이터 부분 -->
    <v-container>
      <v-data-iterator
        :items="items"
        :items-per-page.sync="itemsPerPage"
        :search="search"
        :sort-desc="sortDesc"
        hide-default-footer
        :page.sync="page"
        @page-count="pageCount = $event"
      >
        <!-- 검색어 기능 -->
        <template v-slot:header>
          <div>
            <template>
              <v-select
                v-if="auth === 'admin'"
                flat
                hide-details
                :items="keys"
                prepend-inner-icon="mdi-magnify"
                label="회사별 조회"
                v-model="companyselect"
                @change="toggles"
              >
              </v-select>

              <v-text-field
                flat
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                label="검색어입력"
                single-line
                hide-details
              ></v-text-field>
              <v-switch
                v-model="isAll"
                :label="`모든 지점 미디어 보기`"
                color="info"
                inset
                v-if="auth === 'company'"
                v-on:change="changeSwitch()"
              ></v-switch>
            </template>
          </div>
        </template>

        <template v-slot:default="props">
          <div id="app">
            <br />
            <br />
            <div class="text-uppercase text-bold">
              <v-divider />
              <v-row align="center" justify="start">
                <v-chip
                  class="shrink"
                  color="primary"
                  v-for="(select, index) in selected"
                  :key="select"
                  close
                  @click:close="removeTask(index)"
                >
                  {{ select.name }}
                </v-chip>
              </v-row>
            </div>

            <v-row>
              <v-col
                v-for="item in props.items"
                :key="item.name"
                cols="12"
                sm="6"
                md="4"
                lg="3"
              >
                <v-card>
                  <div id="app">
                    <div class="videoslist">
                      <v-btn
                        icon
                        rounded
                        width="6rem"
                        height="6rem"
                        @click="mediainfo(item)"
                      >
                        <div>
                          <!-- 고정이미지 -->
                          <v-img
                            src="@/assets/mediabg.png"
                            width="7rem"
                            height="7rem"
                          >
                            <!-- 고정이미지 -->
                            <!-- 바뀌는 컨텐츠이미지-->
                            <v-img
                              class="rounded"
                              :src="
                                require(`../../../upload/media/${item.file.orgName}.png`)
                              "
                              width="7rem"
                              height="7rem"
                            >
                              <!-- 바뀌는 컨텐츠이미지 -->
                            </v-img>
                            <!-- 고정아이콘 -->
                            <v-icon style="color: white;" class="playbtn" large
                              >mdi-play-circle-outline
                            </v-icon>
                          </v-img>
                        </div>
                      </v-btn>
                    </div>
                  </div>
                  <!-- 카드 데이터 내용 -->
                  <v-card-title
                    style="max-height: 5rem;"
                    id="titlecenter"
                    class="subheading font-weight-bold"
                  >
                    <v-checkbox
                      id="cb1"
                      :value="item"
                      v-model="selected"
                      color="primary"
                    >
                      <template v-slot:label>
                        <div color="black" class="titlecheckbox">
                          {{ item.name }}
                        </div>
                      </template>
                    </v-checkbox>
                    <v-row class="dots-horizontal">
                      <div>
                        <v-menu bottom left close-on-click min-width="7rem">
                          <template v-slot:activator="{ on }">
                            <!-- 두개가 클릭되면 메뉴를 클릭못하게 막아줌  -->
                            <v-btn dark icon v-on="on" @click="menubtn(item)">
                              <v-icon style="color:black;" dark fixed>
                                mdi-dots-horizontal</v-icon
                              >
                            </v-btn>
                          </template>
                          <div class="text-center">
                            <v-list>
                              <v-list-item
                                style="place-content: center; color:black;"
                              >
                                <v-btn icon>
                                  <v-list-item-title style="color:black;">
                                    <!-- disable속성으로 두개이상클릭시 이버튼 사용불가 -->
                                    <v-btn
                                      @click="mediadelete(item)"
                                      :disabled="btndisable"
                                      >영구삭제</v-btn
                                    >
                                    <!-- 임시 함수 수정으로가는 -->
                                  </v-list-item-title>
                                </v-btn>
                              </v-list-item>
                              <v-divider></v-divider>
                              <v-list-item
                                style="place-content: center; color:black;"
                              >
                                <v-btn icon>
                                  <v-list-item-title style="color:black;">
                                    <v-btn @click="restoremedia(item)"
                                      >복원하기</v-btn
                                    >
                                  </v-list-item-title>
                                </v-btn>
                              </v-list-item>
                            </v-list>
                          </div>
                        </v-menu>
                      </div>
                    </v-row>
                  </v-card-title>
                  <!-- check박스 와 타이틀 부분 -->
                  <v-divider></v-divider>

                  <v-list dense>
                    <v-list-item>
                      <v-list-item-content>사이즈:</v-list-item-content>

                      <v-list-item-content class="align-end">{{
                        Math.floor(item.file.size / (1024 * 1024)) / 10 + "MB"
                      }}</v-list-item-content>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-content>작성일:</v-list-item-content>
                      <v-list-item-content class="align-end">{{
                        item.createdAt | formatDateYMD
                      }}</v-list-item-content>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-content>해상도:</v-list-item-content>
                      <v-list-item-content class="align-end"
                        >{{ item.resolution1 }} X
                        {{ item.resolution2 }}</v-list-item-content
                      >
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>재생시간:</v-list-item-content>
                      <v-list-item-content class="align-end"
                        >{{ item.playTime }}초</v-list-item-content
                      >
                    </v-list-item>
                    <div class="cardtag">
                      <v-list-item>
                        태그: &nbsp;

                        <v-row align="center" justify="start">
                          <v-col>
                            <div v-if="item.tags2 != ''">
                              <v-chip
                                color="primary"
                                v-for="tag in item.tags2"
                                :key="tag"
                              >
                                <span class="v-chip__content">
                                  {{ tag }}
                                </span>
                                &nbsp;
                              </v-chip>
                            </div>
                            <div v-else></div>
                          </v-col>
                        </v-row>
                      </v-list-item>
                    </div>
                  </v-list>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </template>

        <template v-slot:footer>
          <v-row class="mt-2" align="center" justify="center">
            <span class="grey--text">Items per page</span>
            <v-menu offset-y>
              <template v-slot:activator="{ on }">
                <v-btn dark text color="primary" class="ml-2" v-on="on">
                  {{ itemsPerPage }}
                  <v-icon>mdi-chevron-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(number, index) in itemsPerPageArray"
                  :key="index"
                  @click="updateItemsPerPage(number)"
                >
                  <v-list-item-title>{{ number }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <div class="flex-grow-1"></div>
            <span
              class="mr-4
            grey--text"
            >
              Page {{ page }} of {{ numberOfPages }}
            </span>
          </v-row>
        </template>
      </v-data-iterator>

      <div class="text-center">
        <v-pagination
          v-model="page"
          :length="pageCount"
          total-visible="10"
          circle
        >
        </v-pagination>
      </div>
    </v-container>
  </v-card>
</template>

<script>
import axios from "axios";
import mediainfo from "@/components/media/mediainfo.vue";
import ConfirmSnackBar from "../components/SnackBar/ConfirmSnackBar.vue";
import EventBus from "../eventBus.js";

export default {
  data() {
    return {
      selected: [], //checkbox
      btndisable: false,
      auth: "",
      itemsPerPageArray: [5, 10, 15, 20, 25],
      search: "",
      filter: {},
      isAll: true,
      branchId: 0,
      selectId: 0,
      companyId: 0,
      sortDesc: false,
      deleteMedia: "",
      page: 1,
      pageCount: 0,
      flag: true,
      itemsPerPage: 10,
      sortBy: "name",
      sortcategory: "category",
      mediacategory: ["신발", "의류매장안돼"],

      keys: ["전체보기"],
      tags: ["Work", "Home", "신발"],
      menus: [
        {
          edit: "수정하기",
          trash: "휴지통"
        }
      ],

      items: [],
      itemsAll: [],
      itemsMain: []
    };
  },
  mounted() {
    var token = localStorage.getItem("token");
    axios.get(`/api`, { headers: { token: token } }).then(r => {
      if (!r.data.success) return console.error(r.data.msg);
      if (r.data.success) {
        this.auth = r.data.auth;
        this.branchId = r.data.branchId;
        this.companyId = r.data.companyId;
        axios
          .get(`/api/trashBin`, {
            headers: {
              branchId: this.branchId,
              auth: this.auth,
              companyId: this.companyId
            }
          })
          .then(r => {
            if (!r.data.success) return console.error(r.data.msg);
            if (r.data.success) {
              this.items = r.data.medias;
              this.itemsAll = JSON.parse(JSON.stringify(r.data.medias));

              for (const item of this.items) {
                var temp = [];

                for (const t of item.tags) {
                  temp.push(t.name);
                }
                item.tags2 = temp;
              }
              for (const item of this.itemsAll) {
                var temp = [];

                for (const t of item.tags) {
                  temp.push(t.name);
                }
                item.tags2 = temp;
              }
              if (r.data.branchs) {
                this.branchs = r.data.branchs;
                for (const result of r.data.branchs) {
                  this.keys.push(result.name);
                }
              }
              for (var i = 0; this.items.length; i++) {
                if (this.items[i].branchId === this.branchId)
                  this.itemsMain.push(this.items[i]);
              }
            }
          });
      }
    });

    this.pageCount = Math.ceil(this.items.length / this.itemsPerPage);

    EventBus.$on("category", () => {
      this.tags = mediacategory;
    });
  },

  computed: {
    numberOfPages() {
      return Math.ceil(this.items.length / this.itemsPerPage);
    },
    videoElement() {
      return this.$refs.video;
    },

    // 카테고리 여려개 보여줄때 쓰는함수
    caselections() {
      const caselections = [];

      for (const caselection of this.caselected) {
        caselections.push(this.items[caselection]);
      }

      return selections;
    }
  },

  components: {
    ConfirmSnackBar,
    mediainfo
  },
  methods: {
    toggles() {
      if (this.companyselect === "전체보기") {
        axios
          .get(`/api/trashBin`, {
            headers: {
              branchId: this.branchId,
              auth: this.auth,
              companyId: this.companyId
            }
          })
          .then(r => {
            if (!r.data.success) return console.error(r.data.msg);
            if (r.data.success) {
              this.items = r.data.medias;
              this.itemsAll = JSON.parse(JSON.stringify(r.data.medias));

              for (const item of this.items) {
                var temp = [];

                for (const t of item.tags) {
                  temp.push(t.name);
                }
                item.tags2 = temp;
              }
            }
          });
      } else {
        for (const branch of this.branchs) {
          if (branch.name === this.companyselect) {
            this.selectId = branch.companyId;
            axios
              .post("api/trashBin/selectCompany", {
                id: this.selectId
              })
              .then(r => {
                this.items = [];
                for (const item of r.data.medias) {
                  for (const a of item.media) {
                    this.items.push(a);
                  }
                }

                for (const item of this.items) {
                  var temp = [];
                  for (const t of item.tags) {
                    temp.push(t.name);
                  }
                  item.tags2 = temp;
                }
              });
            break;
          }
        }
      }
    },
    mediainfo(item) {
      EventBus.$emit("mediainfo", item.id);
    },
    menubtn(item) {
      if (this.selected.length >= 2) {
        this.btndisable = true;
      }
      if (this.selected.length < 2) {
        this.btndisable = false;
      }
    },

    selectdelete(item) {
      if (this.selected.length === 0) {
        this.flag = false;
      }else{
        this.flag = true;
      }
      if (this.flag) {
        EventBus.$emit(
          "TrashBin_selectdeletebin",
          "TrashBin_selectdeletebinOk",
          "모두 삭제하시겠습니까?"
        );
        EventBus.$on("TrashBin_selectdeletebinOk", r => {
          axios
            .delete("/api/trashBin", {
              data: { medias: this.selected }
            })
            .then(r => {
              location.href = "/trashBin";
            })
            .catch(e => {
              console.error(e.message);
            });
        });
      }
    },

    selectdeleteAll(item) {
      if (this.medias.length === 0) {
        this.flag = false;
      }else{
        this.flag = true;
      }

      if (this.flag) {
        EventBus.$emit(
          "TrashBin_selectdeletebin",
          "TrashBin_selectdeletebinOk",
          "모두 삭제하시겠습니까?"
        );
        EventBus.$on("TrashBin_selectdeletebinOk", r => {
          axios
            .delete("/api/trashBin", {
              data: { medias: this.selected }
            })
            .then(r => {
              location.href = "/trashBin";
            })
            .catch(e => {
              console.error(e.message);
            });
        });
      }
    },

    restoremedia(item) {
      axios
        .put("/api/trashBin", {
          mediaId: item.id
        })
        .then(r => {
          location.href = "/trashBin";
        });
    },

    restoremediaAll(item) {
      EventBus.$emit(
        "TrashBin_restoremediaAll",
        "TrashBin_restoremediaAllOk",
        "모두 복원하시겠습니까?"
      );

      EventBus.$on("TrashBin_restoremediaAllOk", r => {
        axios
          .put("/api/trashBin/all", {
            data: { medias: this.selected }
          })
          .then(r => {
            location.href = "/trashBin";
          })
          .catch(e => {
            console.error(e.message);
          });
      });
    },

    // 선택된 체크박스 닫는 함수
    removeTask: function(index) {
      this.selected.splice(index, 1);
    },

    /// 선택된 체크박스 닫는 버튼
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number;
      this.pageCount = Math.ceil(this.items.length / this.itemsPerPage);
    },
    changeSwitch() {
      if (this.isAll) {
        this.items = this.itemsAll;
      } else {
        this.items = this.itemsMain;
      }
    },
    trashAll() {
      EventBus.$emit("mediaTrash", this.selected, "all");
    }
  }
};
</script>

<style scoped>
.col-lg-3 {
  -webkit-box-flex: 0;
  -ms-flex: 0 0 25%;
  flex: 0 0 20%;
  max-width: 20%;
}
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

.video__item {
  width: 40%;
}

.headline {
  text-align: center;
  font-size: 2rem;
}
.btncenter {
  justify-content: center;
  max-width: 20rem;
}
#rem {
  font-size: 3rem;
}
#titlecenter {
  margin-right: 1rem;
  justify-content: center;
}
#piccenter {
  text-align-last: center;
}
#cb1 {
  background: #5755d9;
  border-color: #5755d9;
}
.form-checkbox input:checked + .form-icon,
.form-radio input:checked + .form-icon,
.form-switch input:checked + .form-icon {
  background: #5755d9;
  border-color: #5755d9;
}
.form-checkbox {
  color: #5755d9;
}
.form-icon {
  background: #fff;
  height: 0.5rem;
  left: 0;
  top: 0.3rem;
  width: 0.5rem;
  background: black;
}
.dots-horizontal {
  float: right;
  margin-right: 0.5rem;
  position: absolute;
  right: 0;
  border-top-color: 0;
}
.titlecheckbox {
  font-weight: 700 !important;
  color: black;
  font-size: 0.95vw;
  width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.colex {
  flex-basis: 0;

  max-width: 100%;
}
.__cov-contrl-content {
  position: inherit;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  left: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.41);
  height: 2rem;
  width: 100%;
  z-index: 0;
}

.btnstyle {
  color: white !important;
}
.topbtn {
  font-weight: 1000 !important;
  color: #230871;
  place-content: center;
}
.topbtn:hover {
  font-weight: 1000 !important;
  color: white;
  place-content: center;
}
.btnstyle:hover {
  color: white !important;
}
.theme--light.v-btn:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
  width: 7rem;
}

.btn-default {
  color: #230871;
  background-color: #fff;
  border-color: #fff;
}
.btn {
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.24), 0 0 2px rgba(0, 0, 0, 0.12);
  display: inline-block;
  font-weight: 600;
  color: #230871;
  text-align: center;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-color: transparent;
  border: 1px solid transparent;
  padding: 0.625rem 2.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 1.5rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
.btn-default:hover {
  color: #fff;
  background-color: #230871;
  border-color: #230871;
}
.v-input {
  -webkit-box-align: start;
  -ms-flex-align: start;

  display: inline-block;

  font-size: 16px;
  letter-spacing: normal;
  max-width: 100%;
  text-align: left;
}
.v-list-item--dense,
.v-list--dense .v-list-item {
  height: 4em;
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
.v-btn.v-btn--icon {
  color: black;
}
</style>
<style scoped>
.theme--dark.v-text-field--solo-inverted.v-text-field--solo
  > .v-input__control
  > .v-input__slot {
  background: rgba(255, 255, 255, 0.16);
  max-width: 12rem;
}
.searchbar {
  background-color: #230871;
  display: inline-block;
  font-weight: 600;
  background: #fff;
  text-align: center;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-color: transparent;
  border: 1px solid transparent;
  padding: 0.625rem 2.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 1.5rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.cardtag {
  overflow: auto;
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
