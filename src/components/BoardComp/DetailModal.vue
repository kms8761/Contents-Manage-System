<template>
  <v-dialog v-model="DModal" max-width="800px" persistent >
    <ConfirmSnackBar></ConfirmSnackBar>
    <!-- <ErrorSnackBar></ErrorSnackBar>  -->

    <v-card>
      <v-system-bar window dark>
        <span>작성일 : {{ form.createdAt | formatDateYMDHMS }}</span>
        <v-spacer></v-spacer>

        <v-icon
          v-if="user === form.writer"
          size="30px"
          class="mr-2"
          @click="openEditModal(form)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          v-if="user === form.writer"
          size="30px"
          @click="deletePost(form)"
        >
          mdi-delete
        </v-icon>
        <v-btn icon dark>
          <v-icon size="30px" @click="DModalClose">mdi-close</v-icon>
        </v-btn>
      </v-system-bar>
      <v-card-title style="color:white;background-color:#230871"
        >{{ form.title }}
      </v-card-title>

      <v-card-text class="pa-0">
        <v-container>
          <viewer
            :value="form.content"
            style="min-height: 300px"
            class="ma-4"
          ></viewer>
        </v-container>
        <div
          style="border:2px black solid;border-radius:20px;border-color:#751df1"
          v-if="form.file"
        >
          <v-chip
            class="ma-1"
            color="#751df1"
            dark
            small
            @click="fileDown(item)"
            v-for="item in form.file"
            :key="item.id"
          >
            <v-icon>mdi-paperclip</v-icon
            >{{
              item.orgName + " (" + Math.floor(item.size / 100) / 10 + "kB)"
            }}
          </v-chip>
        </div>
        <v-list three-line>
          <v-list-item
            v-for="item in comments"
            :key="item.id"
            style="border-bottom:1px grey dashed"
          >
            <v-list-item-avatar>
              <v-icon size="80"> mdi-account-circle</v-icon>
            </v-list-item-avatar>

            <v-list-item-title>
              <strong>{{ item.user.userNm }}</strong>
              {{ item.createdAt | formatDateYMDHMS
              }}<!--item.title-->
              <v-list-item-content>{{ item.content }} </v-list-item-content>
            </v-list-item-title>

            <v-icon
              v-if="user === item.user.userNm"
              @click="modCommentDialog(item)"
              size="30px"
              >mdi-pencil
            </v-icon>

            <v-icon
              v-if="user === item.user.userNm"
              size="30px"
              right
              @click="deleteComment(item)"
              >mdi-delete
            </v-icon>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-text-field
        v-model="commentAdd"
        label="댓글 작성"
        append-outer-icon="mdi-send"
        @click:append-outer="addComment"
      ></v-text-field>
    </v-card>
  </v-dialog>
</template>
<script>
import axios from "axios";
import ConfirmSnackBar from "../SnackBar/ConfirmSnackBar.vue";
import eventBus from "../../eventBus.js";

export default {
  mounted() {
    var self = this;
    const token = localStorage.getItem("token");
    axios
      .get(`/api/board/getInfo`, { headers: { Authorization: token } })
      .then(r => {
        if (!r.data.success) return console.error(r.data.msg);

        if (r.data.success) {
          this.user = r.data.user;
          this.id = r.data.id;
        }
      });

    eventBus.$on("board_triggerDModal", (boardId, hit, writer) => {
      axios
        .post("/api/board/comment", {
          boardId: boardId,
          hit: hit
        })
        .then(r => {
          this.boardId = boardId;
          this.comments = r.data.comments;
          this.form.id = r.data.post.id;
          this.form.title = r.data.post.title;
          this.form.content = r.data.post.content;
          this.form.writer = writer;
          this.form.createdAt = r.data.post.createdAt;
          this.form.file = r.data.post.files;
        })
        .catch(e => {
          console.error(e.message);
        });

      this.DModal = true;
    });
  },
  data() {
    return {
      id: 0,
      DModal: false,
      confirmComment: false,
      confirmCommentText: "",
      flag: "",
      list: [1, 2, 3, 4, 5],
      form: {},
      comments: [],
      commentAdd: "",
      user: "",
      commentId: 0,
      commentDialog: false, //두번째 수정하기창
      commentModify: "",
      commentSell: null,
      confirm: false,
      boardId: 0
    };
  },
  methods: {
    DModalClose() {
      this.form.title = "";
      this.form.content = "";
      this.form.file = "";
      this.DModal = false;
    },
    UModalClose() {
      this.form.title = "";
      this.form.content = "";
      this.UModal = false;
    },
    modCommentDialog(cmt) {
      this.commentDialog = true;
      this.commentId = cmt.id;
      this.commentModify = cmt.content; //현재의 컨텐츠 내용
      this.commentSell = cmt;
      eventBus.$emit("board_triggerAddCommentModal", cmt);
    },
    addComment() {
      axios
        .post("/api/board/comment/add", {
          boardId: this.boardId,
          userId: this.id,
          content: this.commentAdd
        })
        .then(r => {
          var temp = {
            id: 1,
            orgId: 1,
            userGroupId: 1,
            userNm: this.user,
            userPw: "",
            userYn: "",
            boardId: 1,
            content: "",
            createdAt: "",
            id: 0
          };
          const date = new Date();
          const comment = {
            content: this.commentAdd,
            boardId: this.boardId,
            id: r.data.comment.id,
            user: temp,
            createdAt: date
          };
          this.comments.push(comment);
          this.commentAdd = "";
        })
        .catch(e => {
          console.error(e.message);
        });
    },
    deleteComment(item) {

      eventBus.$emit("DetailModal_DelComment", "DetailModal_DelCommentOk", "정말 삭제하시겠습니까?");
      eventBus.$on("DetailModal_DelCommentOk", () => {
        axios
          .delete("/api/board/comment", {
            data: { id: item.id }
          })
          .then(r => {
            for(var i in this.comments){
              if (this.comments[i].id === item.id) {
                this.comments.splice(i, 1);
              }
            }
          })
          .catch(e => {
            console.error(e.message);
          });
      });
    },
    deletePost(item) {
      eventBus.$emit("Confirm", "DetailModal_triggerDelPostOk","정말 삭제하시겠습니까?");
      eventBus.$on("DetailModal_triggerDelPostOk", (r) => {
        axios
          .delete("/api/board", {
            data: { boardId: item.id }
          })
          .then(r => {
            location.href = "/board";
          })
          .catch(e => {
            console.error(e.message);
          });
      });
    },
    openEditModal(item) {
      this.DModal = false;
      eventBus.$emit("board_triggerEditModal", this.boardId);
    },
    fileDown(item) {
      let file = item;
      axios
        .post(
          "/api/board/fileDown",
          { file: file },
          {
            responseType: "blob"
          }
        )
        .then(response => {
          var fileURL = window.URL.createObjectURL(new Blob([response.data]));
          var fileLink = document.createElement("a");
          fileLink.href = fileURL;
          fileLink.setAttribute("download", file.orgName);
          document.body.appendChild(fileLink);

          fileLink.click();
        })
        .catch(e => {
          console.log(e);
        });
    }
  },
  components: {
    ConfirmSnackBar: ConfirmSnackBar
  }
};
</script>
