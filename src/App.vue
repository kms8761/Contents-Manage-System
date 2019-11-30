<template>
  <v-app >
  <v-navigation-drawer 
   v-model="drawer"
    app
    clipped
    color="#2a3248">
    <v-list-item-group color="primary">
      <div >
        <div v-for="(item, i) in items" 
          :key="i"
        >
            <v-list-item
              v-if="i!==6"
              @click="sidebarClick(item)"
            >
              <v-list-item-icon>
                <v-icon class="white--text">{{item.icon}}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="white--text">{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
        </div>
      </div>
      <div v-if="$store.state.auth==='company'">
        <div v-for="(item, i) in items" 
          :key="i"
        >
          <v-list-item
            v-if="i!==5"
            @click="sidebarClick(item)"
          >
            <v-list-item-icon>
              <v-icon class="white--text">{{item.icon}}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="white--text">{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
      </div>
      <div v-if="$store.state.auth==='user'">
        <div v-for="(item, i) in items" 
          :key="i"
        >
            <v-list-item
              v-if="i!==6 && i!==5"
              :to="item.to"
            >
              <v-list-item-icon>
                <v-icon class="white--text">{{item.icon}}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="white--text">{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
        </div>
      </div>
    </v-list-item-group>
  </v-navigation-drawer>

  <v-app-bar 
    app
    clipped-left
    color="#1c065a"
    dark>
    <v-app-bar-nav-icon dark @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-btn img color="#1c065a">
        <v-img
          class="mx-0"
          src="./assets/logo.svg"
          max-height="30"
          max-width="50"
          contain
          @click="logoClick"
        ></v-img>
      </v-btn>
     
      <div class="flex-grow-1"></div>
      <v-btn img color="#1c065a">
        <v-img
          class="mx-0"
          src="./assets/korea.png"
          max-height="30"
          max-width="40"
          contain
        ></v-img>
      </v-btn>
      <v-btn 
        color="#1c065a"
        dark
        depressed
        @click='signOut'>Logout</v-btn>
  </v-app-bar>

  <!-- Sizes your content based upon application components -->
  <v-content>

    <!-- Provides the application the proper gutter -->
    <v-container fluid>

      <!-- If using vue-router -->
      <router-view></router-view>
    </v-container>
  </v-content>


  </v-app>
</template>
<script>
import axios from 'axios'

export default {
  name: 'App',
  data () {
    return {
      comapnyId:0,
      valid:true,
      user:'',
      login:false,
      auth:'',
      clipped: false,
      drawer: true,
      fixed: false,
      id:'',
      pw:'',
      items: [
        { title: '홈', icon: 'mdi-home', to: {path: '/'}},
        { title: '나의 계정', icon: 'mdi-account',to: {path: '/Profile'} },       
        { title: '미디어 공간', icon: 'mdi-image',to: {path: '/media'} },
        { title: '캠페인 관리', icon: 'mdi-book',to: {path: '/campaign'} },
        { title: '3D 스튜디오', icon: 'mdi-pencil',to: {path: '/3d'} },
        { title: '사용자 관리', icon: 'mdi-wrench',to: {path: '/company'} },
        { title: '사용자 관리', icon: 'mdi-wrench',to: {path: '/userManagement'} },
        { title: '나의 디바이스', icon: 'mdi-account',to: {path: '/mydevice'} },
        { title: '휴지통', icon: 'mdi-trash-can',to: {path: '/trashbin'} },
        { title: 'Q&A', icon: 'mdi-help-box',to: {path: '/board'} },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js',
      idRules: [
          v => !!v || 'ID를 입력해주세요',
      ],
      pwRules: [
          v => !!v || '패스워드를 입력해주세요',
      ],
    }
  },
  mounted(){
      const token = localStorage.getItem('token')
      if(token){
        axios.get(`/api/company/getInfo`, { headers: { Authorization: token } })
          .then((r) => {
              if (!r.data.success) return console.error(r.data.msg)
              if(r.data.success){
                this.login = true
                if(r.data.state ==='비활성화')
                  this.login = false                
                this.$store.state.auth = r.data.auth
                this.$store.state.branchId = r.data.branchId
                this.$store.state.userId = r.data.userId
                this.companyId = r.data.companyId
              }
          })
      }
  },
  methods: {
    logoClick(){
      location.href="/"
    },
    loginClick(){
      let user={};
      if (this.$refs.form.validate()) {
        axios.post('/api', {
          orgId:this.id,
          userPw:this.pw,
        })
        .then((r) => {
          if (r.data.success){
            localStorage.setItem('token', r.data.token)
            this.$store.commit('getToken', r.data.user)
          }
          const token = localStorage.getItem('token')
          axios.get(`/api/company/getInfo`, { headers: { Authorization: token } })
          .then((r) => {
              if (!r.data.success) return console.error(r.data.msg)
              if(r.data.success){
                this.login = true
                if(r.data.state==='비활성화')
                  this.login = false
                this.$store.state.auth = r.data.auth
                this.$store.state.branchId = r.data.branchId
                this.$store.state.userId = r.data.userId
                this.companyId = r.data.companyId
              }
          })
        })
        .catch((e) => {
          alert("에러가 발생하였습니다.")
          console.error(e.message)
        })
      }
    },
    signOut () {
      localStorage.removeItem('token')
      this.loginOk = false
      location.href = '/'
    },
    sidebarClick(item){
      const companyId = this.companyId
      if(item.to.path === '/userManagement'){
        this.$router.push({name:'userManagement', params:{companyId}})
      }
      else
        this.$router.push({path:item.to.path})
    }
  },
  components:{

  }
}
</script>