

<template>
  <v-form ref="form" v-model="valid">
<v-row justify="center">
    <v-btn
      color="primary"
      dark
      @click.stop="dialog = true"
    >
      Open Dialog
    </v-btn>

    <v-dialog
  v-model="dialog" persistent scrollable max-width="600px"
    >
      <v-card>
        <v-app-bar dark color="blue-grey">
     <v-card-title>
            <span>영상업로드</span>
          </v-card-title>
          <v-spacer></v-spacer>
 <v-btn icon dark>
            <v-icon @click="modalClose" size="30px">mdi-close </v-icon>
          </v-btn>

</v-app-bar>
        <v-card-text>
       


 <v-col cols="12">
            <!--  -->
            <div style="border: solid 1px #ccc; padding: 10px; text-align: center;">
                <video  id="video" width="320" controls autoplay loop>
                    <!-- <source src="@/assets/movie.mp4"> -->
                </video><br/>
                
                <button @click="shoot" style="width: 64px;border: solid 2px #ccc;">Capture</button><br/>
                <!-- <div id="output" style="display: inline-block; top: 4px; position: relative ;border: dotted 1px #ccc; padding: 2px;"></div> -->
                <img id="myImage">
            </div>
            <!--  -->
            <div class="colupload">
              <!-- 비디오 부분 비디오 파일만 허용(accept) -->
              <div id="message"></div>
              <v-file-input
                accept="video/*"
                v-model="file"
                type="file"
                placeholder="동영상 추가"
                prepend-inner-icon="mdi-video"
                label="동영상"
              ></v-file-input>
              ※파일형식:mov,mkv,mp4<br />
              파일길이는 10분을 초과하지 않아야합니다
            </div>
          </v-col>




<!-- 동영상 -->


   <v-col cols="20">
            <div class="colupload">
              <v-text-field
                v-model="name"
                :counter="20"
                :rules="nameRules"
                label="미디어이름*"
                prepend-inner-icon="mdi-arrow-right-drop-circle"
                required
              >
              </v-text-field>
            </div>
          </v-col>

  <v-col cols="20">
            <div class="colupload">
              <!--카테고리  -->
              <v-combobox
                v-model="mediacategory"
                :items="mediaselect"
                :search-input.sync="search"
                hide-selected
                hint="최대 2개 선택가능"
                label="카테고리 검색"
                multiple
                persistent-hint
                small-chips
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>
                        "<strong>{{ search }}</strong
                        >"로 입력을 원하시면 <kbd>enter</kbd>를 눌러주세요.
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-combobox>

              <!-- 카테골;ㅣ -->
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
                label="설명*"
                prepend-inner-icon="mdi-message-bulleted"
                required
              ></v-textarea>
            </div>
          </v-col>







        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

         <v-btn :disabled="!valid" color="success" @click="saveClick">
            저장
          </v-btn>
          <v-btn color="error" @click="modalClose">
            닫기
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>

  </v-form>
<!--  -->
</template>

<script>

export default{
   updated : function() {
(function localFileVideoPlayer() {
   'use strict'
  var URL = window.URL || window.webkitURL
  var displayMessage = function (message, isError) {
    var element = document.querySelector('#message')
    element.innerHTML = message
    element.className = isError ? 'error' : 'info'
  }
  var playSelectedFile = function (event) {
    var file = this.files[0]
    var type = file.type
    var videoNode = document.querySelector('video')
    var canPlay = videoNode.canPlayType(type)
    if (canPlay === '') canPlay = 'no'
    var message = 'Can play type "' + type + '": ' + canPlay
    var isError = canPlay === 'no'
    displayMessage(message, isError)

    if (isError) {
      return
    }

    var fileURL = URL.createObjectURL(file)
    videoNode.src = fileURL
  }
  var inputNode = document.querySelector('input')
  inputNode.addEventListener('change', playSelectedFile, false)
})()
},


data(){
  
return{
    date: new Date().toISOString().substr(0, 10),
    file: [],
    menu: false,
    dialog: false,
    valid: true,
    select: null,
    category: null,
    controls:true,
    selected: [],
    video: null,
    name: "",
    userId: 0,
    branchId: 0,
}
},

  mounted() {

// 

    axios
      .get(`/api/media/getInfo`, {
        headers: { Authorization: this.$store.state.token }
      })
      .then(r => {
        if (!r.data.success) return console.error(r.data.msg);
        if (r.data.success) {
          this.userId = r.data.userId;
          this.branchId = r.data.branchId;
        }
      });
    EventBus.$on("mdupload", item => {
      this.dialog = true;
    });


    
  },

  
methods: {
    removechip(item) {
      this.chips.splice(this.chips.indexOf(item), 1);
      this.chips = [...this.chips];
    },
    remove(item) {
      this.selected.splice(this.selected.indexOf(item), 1);
    },

    validate() {
      if (this.$refs.form.validate()) {
      }
    },

    saveClick() {

      let fd = new FormData();

      fd.append(`video`, this.file);
      fd.append("name", this.name);
      fd.append("detail", this.detail);
      fd.append("userId", this.userId);
      fd.append("branchId", this.branchId);
      fd.append("tag", this.mediacategory);

      axios
        .post("/api/media", fd)
        .then(r => {
          this.snackbar = true;
        })
        .catch(e => {
          console.error(e.message);
        });
      EventBus.$emit("SaveItem", "Media");
    },

    modalClose() {
      this.dialog = false;
      this.$refs.form.reset();
      this.$refs.form.resetValidation();
    },
    shoot(){
      var videoId = 'video';
      var scaleFactor = 0.25;
      var snapshots = [];

      function capture(video, scaleFactor) {
        if(scaleFactor == null){
          scaleFactor = 1;
        }
        var w = video.videoWidth * scaleFactor;
        var h = video.videoHeight * scaleFactor;
        var canvas = document.createElement('canvas');
          canvas.width  = w;
            canvas.height = h;
        
        var ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, w, h);
          return canvas;
      } 
      
      var video  = document.getElementById(videoId);
      console.log(video)
      var canvas = capture(video, scaleFactor);
        canvas.onclick = function(){
          window.open(this.toDataURL());
        };
      snapshots.unshift(canvas);

      var myImage = document.getElementById('myImage');
      console.log(myImage)
      myImage.src = canvas.toDataURL();
    }
  }






}

// ddddd

/* eslint-disable */





</script>
<style scoped>
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
</style>
<style scoped>

.theme--light.v-select .v-select__selections {
  color: rgba(0, 0, 0, 0.87);
  min-width: 23rem;
  max-width: 7rem;
}
video::-webkit-media-controls-start-playback-button {
    display: none;
}
video, input {
    display: block;
}

input {
    width: 100%;       
}

.info {
    background-color: aqua;            
}

.error {
    background-color: red;
    color: white;
}
</style>