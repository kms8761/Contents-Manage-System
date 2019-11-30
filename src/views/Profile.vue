<template>
<div>
  <v-card
    max-width="475"
    class="mx-auto"
  >
  <!-- 이미지 에서 에러 -->
    <v-img dark height="20rem" :src="require(`../../../upload/profile/${image}`)">
    </v-img>
    <v-card-text>
      <v-row v-for="(item, content) in items"
          :key="content"> 

      <v-col cols="3">
        <div class="font-weight-bold ml-3 mt-3" style="text-align:left">
        <v-icon color="teal darken-1">{{item.icon}}</v-icon>
         {{item.title}}</div>
      </v-col>

      <v-col cols="9" v-if="editStatus===false">
          <div class="font-weight-bold mt-3">
            <p>{{item.content}}</p>
          </div>
            <v-divider style="width:90%"></v-divider>
      </v-col>

      <v-text-field       
      v-if="editStatus===true"
      v-model="item.content"
      autofocus
      ></v-text-field>

      </v-row> 
    </v-card-text>

    <v-row justify="end">
        <v-card-title>
          <v-btn v-if="editStatus" @click="editSave(items)" icon class="mr-4">
            <v-icon color="indigo">mdi-file-check</v-icon>
            저장
          </v-btn>
          <v-btn v-if="editStatus" @click="editCancle" icon class="mr-4">
            <v-icon color="indigo">mdi-pencil-off</v-icon>
            취소
          </v-btn>
          <v-btn v-else @click="editBtn"  icon class="mr-4">
            <v-icon color="indigo">mdi-pencil</v-icon>
            편집
          </v-btn>
        </v-card-title>
    </v-row >
    <AlertSnackBar></AlertSnackBar>
  </v-card>
  <foot></foot>
  </div>
</template>
<script>
import AlertSnackBar from "../components/SnackBar/AlertSnackBar.vue";
import EventBus from '../eventBus'
import axios from 'axios'
export default {
  components:{
    AlertSnackBar
  },

  mounted(){
    const token = localStorage.getItem('token')
      axios.get(`/api/profile`, { headers: { Authorization: token } })
        .then((r) => {
          
          this.image = r.data.img.split(`\\`)[2];
          this.items[0].content = r.data.user.name
          this.items[1].content = r.data.user.address
          this.items[2].content = r.data.email
          this.items[3].content = r.data.user.tel
        })
      .catch((e) => {
          console.error(e.message)
      })
  },
  methods:{

    editBtn(){
      this.editStatus=true
    },
    editSave(items){
      axios.put('/api/profile',{
          name : this.items[0].content,
          address : this.items[1].content,
          email : this.items[2].content,
          tel : this.items[3].content,
          branchId : this.$store.state.branchId,
          userId : this.$store.state.userId
        })
        .catch((e) => {
          console.error(e.message)
        })
      
      EventBus.$emit(
      "Alert",
      "profile",
      "수정되었습니다"
      );
      EventBus.$on("profile",(r)=>{
        location.href="/profile"
      })
    },
    editCancle(){
      this.editStatus=false
    }
  },
 
  data(){
    return{
      editStatus:false,
      image:'',
      temp:'nike.png',
       items: [
        { title: '이름:',content:'', icon: 'mdi-account',},
        { title: '주소:',content:'', icon: 'mdi-map-marker'},
        { title: '이메일:',content:'', icon: 'mdi-email'},
        { title: '연락처:',content:'', icon: 'mdi-phone'}
      ],
    }
  }
}
</script>
