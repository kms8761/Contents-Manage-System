<template>
  <div>
    <v-card>
      <v-card-title>
        캠페인 리스트
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="검색어입력"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-card-title>
        <v-row justify="end">
          <v-btn
            @click="openAddModal"
            color="purple darken-4"
            dark
            rounded
            class="ma-2"
            >캠페인 생성</v-btn
          >
          <v-btn
            @click="deleteAll"
            v-if="auth"
            dark
            color="red"
            rounded
            class="ma-2"
            >캠페인 삭제</v-btn
          >
        </v-row>
      </v-card-title>

      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="campaigns"
        :search="search"
        :page.sync="page"
        :items-per-page="12"
        hide-default-footer
        class="elevation-1"
        @page-count="pageCount = $event"
        style="border-top:1px black solid;border-bottom:1px black solid"
        :show-select="auth"
      >
        <!-- 날짜 포맷 변경 -->
        <template v-slot:item.createdAt="{ item }">{{
          item.createdAt | formatDateYMDHMS
        }}</template>
        <template v-slot:item.updatedAt="props">
          <v-chip :color="getColor(props.item.board_post.name)" dark>{{
            props.item.board_post.name
          }}</v-chip>
        </template>
        <template v-slot:item.title="props">
          <v-row>
            <!-- 제목클릭시 게시판열람가능 boarddetail메소드호출  -->
            <a
              @click="boardDetail(props.item)"
              style="color:black;text-align:left;display:block;"
              >{{ props.item.title }}</a
            >
            <v-icon v-if="props.item.board_files.length !== 0"
              >mdi-paperclip</v-icon
            >
          </v-row>
        </template>
      </v-data-table>

      <div class="text-center pt-2">
        <v-pagination v-model="page" :length="pageCount"></v-pagination>
      </div>

      <AddCampaignModal></AddCampaignModal>
    </v-card>
    <foot></foot>
  </div>
</template>

<script>
import axios from "axios";
import AddCampaignModal from "../components/Campaign/AddCampaignModal.vue";
import eventBus from "../components/eventBus";

export default {
  props: {
    source: String
  },
  data() {
    return {
      // 삭제 권한
      auth: true,
      selected: [],
      totalItem: 0,
      valid: true,
      alertText: "",
      confirmText: "",
      confirmCommentText: "",
      general: "",
      catagory: "",
      snackbar: false,
      timeout: 999,
      dialog: false,
      dialog2: false,
      flag: "post",
      alert: false,
      confirm_: false,
      confirmComment: false,
      page: 1,
      pageCount: 0,
      search: "",
      postCreateLink: [
        {
          to: { path: "/board/create" }
        }
      ],
      getMd: "",

      form: {},
      titleRules: [v => !!v || "제목을 입력해주세요"],

      copyPosts: [],
      // 조회된 캠페인 목록
      campaigns: [],
      headers: [
        { text: "제목", align: "name", sortable: false, value: "title" },
        { text: "상태", align: "center", sortable: false },
        { text: "기간", value: "period", align: "center", sortable: false },
        {
          text: "속한 디바이스",
          value: "hit",
          sortable: false,
          align: "center"
        },
        {
          text: "재생 시간",
          value: "playTime",
          sortable: false,
          align: "center"
        }
      ]
    };
  },
  mounted() {
    const token = localStorage.getItem("token");
    axios
      .get(`/api/campaign`, { headers: { Authorization: token } })
      .then(r => {
        if (!r.data.success) return console.error(r.data.msg);
        this.campaigns = r.data.campaign;
      })
      .catch(e => {
        console.error(e.message);
      });
  },
  methods: {
    openAddModal() {
      eventBus.$emit("triggerAddCampaign");
    },

    modalClose2() {
      this.form.title = "";
      this.form.content = "";
      this.comments = [];
      this.dialog2 = false;
    },
    getColor(item) {
      if (item === "공지") return "red";
      else return "grey";
    },
    boardDetail(item) {
      item.hit = item.hit + 1;
      this.boardId = item.id;
      this.form.id = item.id;
      this.form.title = item.title;
      this.form.writer = item.user.userNm;
      this.form.content = item.content;
      if (item.board_files.length !== 0) this.form.file = item.board_files;

      if (item.createdAt.length < 10) {
        var today = new Date();
        this.form.createdAt =
          today.getFullYear() +
          "-" +
          (today.getMonth() + 1) +
          "-" +
          today.getDate() +
          " " +
          item.createdAt;
      } else this.form.createdAt = item.createdAt;
      axios
        .post("/api/board/comment", {
          boardId: item.id,
          hit: item.hit
        })
        .then(r => {
          let j = 0;
          for (j = 0; j < r.data.comments.length; j++) {
            var y = r.data.comments[j].createdAt.substr(0, 4);
            var m = r.data.comments[j].createdAt.substr(5, 2);
            var d = r.data.comments[j].createdAt.substr(8, 2);
            var h = r.data.comments[j].createdAt.substr(11, 2);
            var min = r.data.comments[j].createdAt.substr(14, 2);
            var s = r.data.comments[j].createdAt.substr(17, 2);
            var temp = y + "-" + m + "-" + d + " " + h + ":" + min + ":" + s;
            r.data.comments[j].createdAt = temp;
          }
          this.comments = r.data.comments;
          eventBus.$emit(
            "triggerDModal",
            this.boardId,
            this.form,
            this.comments
          );
        })
        .catch(e => {
          console.error(e.message);
        });
    },
    deleteAll() {
      eventBus.$emit("triggerSelect", this.selected);
    }
  },
  components: {
    AddCampaignModal: AddCampaignModal
  }
};
</script>
<style scoped>
#board {
  color: white;
}
</style>
