<template>
  <div>
    <ConfirmSnackBar></ConfirmSnackBar>
    <v-card>
      <v-card-title>
        Q&A
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
          <v-btn @click="openAddModal" color="purple darken-4" dark rounded
            >게시글 추가</v-btn
          >
          <v-btn @click="deleteAll" v-if="auth" dark color="red" rounded
            >게시글 삭제</v-btn
          >
        </v-row>
      </v-card-title>

      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="posts"
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
        <template v-slot:item.createdAt="{ item }">
          {{ item.createdAt | formatDateYMDHMS }}
        </template>
        <template v-slot:item.updatedAt="{item}">
          <v-chip :color="getColor(item.board_post.name)" dark>
            {{ item.board_post.name }}
          </v-chip>
        </template>

        <template v-slot:item.title="props">
          <v-row>
            <!-- 제목클릭시 게시판열람가능 boarddetail메소드호출  -->
            <a
              @click="boardDetail(props.item)"
              style="color:black;text-align:left;display:block;"
            >
              {{ props.item.title }}
            </a>
            <v-icon v-if="props.item.files.length !== 0">mdi-paperclip</v-icon>
          </v-row>
        </template>
      </v-data-table>

      <div class="text-center pt-2">
        <v-pagination v-model="page" :length="pageCount"></v-pagination>
      </div>

      <DetailModal></DetailModal>
      <WritePostModal></WritePostModal>
      <AddCommentModal></AddCommentModal>
    </v-card>
    <foot></foot>
  </div>
</template>

<script>
import axios from "axios";
import DetailModal from "../components/BoardComp/DetailModal.vue";
import AddCommentModal from "../components/BoardComp/AddCommentModal.vue";
import WritePostModal from "../components/BoardComp/WritePostModal.vue";
import ConfirmSnackBar from "../components/SnackBar/ConfirmSnackBar.vue";
import eventBus from "../eventBus.js";

export default {
  props: {
    source: String
  },
  data() {
    return {
      auth: true,
      selected: [],
      totalItem: 0,
      valid: true,
      alertText: "",
      confirmText: "",
      confirmCommentText: "",
      general: "",
      catagory: "",
      id: "",
      name: "",
      boardId: 0,
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
      posts: [],
      headers: [
        {
          width: "100px",
          text: "말머리",
          sortable: false,
          value: "updatedAt",
          align: "center"
        },
        { text: "번호", value: "id", align: "center", sortable: false },
        { text: "제목", align: "center", sortable: false, value: "title" },
        {
          text: "작성자",
          value: "user.userNm",
          align: "center",
          sortable: false
        },
        {
          text: "작성일",
          value: "createdAt",
          align: "center",
          sortable: false
        },
        { text: "조회수", value: "hit", sortable: false, align: "center" }
      ]
    };
  },
  mounted() {
    const token = localStorage.getItem("token");
    axios
      .get(`/api/board`, { headers: { Authorization: token } })
      .then(r => {
        if (!r.data.success) return console.error(r.data.msg);
        this.auth = r.data.auth;
        this.posts = r.data.posts;
      })
      .catch(e => {
        console.error(e.message);
      });
  },
  methods: {
    openAddModal() {
      eventBus.$emit("board_triggerAddModal", "add");
    },

    modalClose2() {
      this.form.title = "";
      this.form.content = "";
      this.comments = [];
      this.dialog2 = false;
    },

    isNew(item) {
      var diffDate_1 =
        item.createdAt instanceof Date
          ? item.createdAt
          : new Date(item.createdAt);
      var diffDate_2 = new Date();

      diffDate_1 = new Date(
        diffDate_1.getFullYear(),
        diffDate_1.getMonth() + 1,
        diffDate_1.getDate()
      );
      diffDate_2 = new Date(
        diffDate_2.getFullYear(),
        diffDate_2.getMonth() + 1,
        diffDate_2.getDate()
      );

      var diff = Math.abs(diffDate_2.getTime() - diffDate_1.getTime());
      diff = Math.ceil(diff / (1000 * 3600 * 24));

      if (diff < 3 || isNaN(diff)) {
        return true;
      } else {
        return false;
      }
    },
    getColor(item) {
      if (item === "공지") return "red";
      else return "grey";
    },
    boardDetail(item) {
      item.hit = item.hit + 1;
      this.boardId = item.id;
      eventBus.$emit(
        "board_triggerDModal",
        this.boardId,
        item.hit,
        item.user.userNm
      );
    },
    deleteAll() {
      eventBus.$emit(
        "Confirm",
        "Board_triggerSelectOk",
        "모두 삭제하시겠습니까?"
      );
      eventBus.$on("Board_triggerSelectOk", item => {
        axios
          .delete("/api/board/deleteAll", {
            data: { posts: this.selected }
          })
          .then(r => {
            location.href = "/board";
          })
          .catch(e => {
            console.error(e.message);
          });
      });
      this.selected;
    }
  },
  components: {
    DetailModal: DetailModal,
    AddCommentModal: AddCommentModal,
    WritePostModal: WritePostModal,
    ConfirmSnackBar: ConfirmSnackBar
  }
};
</script>
<style scoped>
#board {
  color: white;
}
</style>
