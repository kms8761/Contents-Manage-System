<template>
  <v-dialog v-model="WModal" max-width="800px" persistent scrollable>
    <v-card>
      <v-card-title
        v-model="form.title"
        style="color:white;background-color:#230871"
        class="font-weight-white"
        id="board"
        >{{ mode }}
        <v-spacer></v-spacer>
        <v-btn-toggle
          v-model="text"
          v-if="this.auth"
          color="pink"
          style="background-color:white"
        >
          <v-btn tile outlined value="left" @click="setNormal">
            일반
          </v-btn>
          <v-btn tile outlined value="center" @click="setNotice">
            공지
          </v-btn>
        </v-btn-toggle>
      </v-card-title>

      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          class="ma-2"
          placeholder="제목을 입력해주세요"
          v-model="form.title"
          :rules="titleRules"
        ></v-text-field>
      </v-form>

      <v-card-text class="pa-0">
        <editor v-model="form.content" />
        <div
          style="border:2px black solid;border-radius:20px;border-color:#751df1"
          wrap
          row
          v-if="file_cpy[0]"
        >
          <v-chip
            class="ma-1"
            color="#751df1"
            dark
            small
            v-for="item in file_cpy"
            :key="item.id"
          >
            <v-icon>mdi-paperclip</v-icon>{{ item.orgName }}
            <v-icon style="color:white;" @click="delFile(item)"
              >mdi-close</v-icon
            >
          </v-chip>
        </div>
        <v-file-input
          v-model="files"
          color="deep-purple accent-4"
          counter
          label="File input"
          multiple
          placeholder="Select your files"
          prepend-icon="mdi-paperclip"
          outlined
          id="bin"
          :show-size="1000"
          enctype="multipart/form-data"
          class="mt-2"
        >
          <template v-slot:selection="{ index, text }">
            <v-chip
              v-if="index < 3"
              color="deep-purple accent-4"
              dark
              label
              small
            >
              {{ text }}
            </v-chip>

            <span
              v-else-if="index === 3"
              class="overline grey--text text--darken-3 mx-2"
            >
              +{{ files.length - 3 }} File(s)
            </span>
          </template>
        </v-file-input>
        <v-card-actions>
          <v-row justify="end" class="mr-4">
            <v-btn color="success" @click="saveClick()">저장</v-btn>
            <v-btn color="error" @click="modalClose">취소</v-btn>
          </v-row>
        </v-card-actions>
      </v-card-text>
    </v-card>
    <AlertSnackBar></AlertSnackBar>
    <!-- <ErrorSnackBar></ErrorSnackBar> -->
  </v-dialog>
</template>
<script>
import axios from "axios";
import eventBus from "../../eventBus.js";
import AlertSnackBar from "../SnackBar/AlertSnackBar.vue";

export default {
  data() {
    return {
      file_cpy: [],
      boardId: 0,
      user: "",
      test: "",
      file_cpy_save: [],
      del_files: [],
      files: [],
      id: 0,
      fileList: false,
      fileId: 0,
      WModal: false,
      mode: "",
      form: {},
      catagory: "일반",
      titleRules: [v => !!v || "제목을 입력해주세요"]
    };
  },
  mounted() {
    const token = localStorage.getItem("token");
    axios
      .get(`/api/board/getInfo`, { headers: { Authorization: token } })
      .then(r => {
        if (!r.data.success) return console.error(r.data.msg);

        if (r.data.success) {
          this.auth = r.data.auth;
          this.user = r.data.user;
          this.id = r.data.id;
        }
      });
    eventBus.$on("board_triggerAddModal", item => {
      this.WModal = true;
      this.mode = "게시글 생성";
    });
    eventBus.$on("board_triggerEditModal", boardId => {
      this.boardId = boardId;
      axios
        .get(`/api/board/detail`, { headers: { boardId: boardId } })
        .then(r => {
          console.log(r.data)
          this.form.title = r.data.post.title;
          this.form.content = r.data.post.content;
          if (r.data.post.files) {
            this.file_cpy = JSON.parse(JSON.stringify(r.data.post.files));
            this.file_cpy_save = JSON.parse(JSON.stringify(r.data.post.files));
          }
        })
        .catch(e => {
          console.error(e);
        });

      this.WModal = true;

      this.mode = "게시글 수정";
      this.fileList = true;
    });
  },
  methods: {
    saveClick() {
      this.form.title = this.form.title.trim();
      this.form.content = this.form.content.trim();

      if (!this.form.title || !this.form.content) return;

      if (this.catagory !== "") {
        if (this.catagory === "공지") var cata = 1;
        if (this.catagory === "일반") var cata = 2;

        let fd = new FormData();

        let i = 0;
        this.files.forEach(file => {
          fd.append(`${i}`, file);
          i++;
        });

        fd.append("userId", this.id);
        fd.append("title", this.form.title);
        fd.append("boardPostId", cata);
        fd.append("content", this.form.content);
        fd.append("hit", 0);
        fd.append("id", this.boardId);

        if (this.mode === "게시글 생성") {
          axios
            .post("/api/board", fd)
            .then(r => {
              eventBus.$emit(
                "Alert",
                "WritePostModal_Create",
                "게시글이 생성되었습니다"
              );
              eventBus.$on("WritePostModal_Create", r => {
                location.href = "/board";
              });
            })
            .catch(e => {
              console.error(e.message);
            });
        } else if (this.mode === "게시글 수정") {
          fd.append("file", this.file_cpy);

          axios
            .delete("/api/board/fileDel", {
              data: { files: this.del_files }
            })
            .then(r => {
              axios
                .put("/api/board", fd)
                .then(r => {
                  throw new Error("Do not use the svg extension");
                  eventBus.$emit(
                    "Alert",
                    "WritePostModal_Update",
                    "게시글이 수정되었습니다"
                  );
                  eventBus.$on("WritePostModal_Update", r => {
                    location.href = "/board";
                  });
                })
                .catch(e => {
                  console.error(e.message);
                });
            })
            .catch(e => {
              console.log("에러발생");
              console.error(e.message);
            });
        }
      }
    },
    setNormal() {
      this.catagory = "일반";
    },
    setNotice() {
      this.catagory = "공지";
    },
    modalClose() {
      this.form.title = "";
      this.form.content = "";
      this.form.file = [];
      this.del_files = [];
      this.text = "";
      this.files = [];
      this.WModal = false;
      function copy(mainObject) {
        let newObject = {};

        for (let key in mainObject) {
          newObject[key] = mainObject[key];
        }
        return newObject;
      }

      this.file_cpy = copy(this.file_cpy_save);
    },
    upload() {
      axios
        .post("/api/board", fd)
        .then(r => {
          this.pop(r.data.success);
        })
        .catch(e => {
          this.pop(e.message);
        });
    },
    delFile(item) {
      let i = 0;

      this.file_cpy.forEach(temp => {
        if (temp.orgName === item.orgName) {
          this.del_files.push(this.file_cpy[i]);
          this.file_cpy.splice(i, 1);
        }
        i++;
      });
    }
  },
  components: {
    AlertSnackBar: AlertSnackBar
  }
};
</script>
