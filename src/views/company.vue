<!-- eslint-disable -->

<template>
<!-- eslint-disable -->
<div>
  <v-card> 
    <companyAdd></companyAdd>
    <userDetail></userDetail>
    <ConfirmSnackBar></ConfirmSnackBar>
    <v-card-title>
      기업 관리
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
        <v-btn @click="btnClick('add')" dark>기업 추가</v-btn>
      </v-row>
    </v-card-title>
  
    <v-data-table
      :search="search"
      :headers="headers"
      :items="companies"
      hide-default-footer
      :items-per-page="3"
      class="font-weight-bold"
      :page.sync="page"
      @page-count="pageCount = $event"  
    >
      <template v-slot:item.img="{ item }">
        <v-avatar v-if="x>600"
          class="ma-3"
          size="100"        
        >
          <v-img :src="require(`../../../upload/profile/${item.company.file.location}`)"></v-img>
        </v-avatar>
        <v-avatar v-else
          size="40"        
        >
          <v-img :src="require(`../../../upload/profile/${item.company.file.location}`)"></v-img>
        </v-avatar>
      </template>

       <template v-slot:item.name="{item}">
        <v-list-item style="text-align:left" @click="companyDetail(item)" >{{item.name}}</v-list-item>
      </template>

      <template v-slot:item.state="{ item }">
        <v-btn @click="statusChange(item)" :color="getColor(item.state)"><strong>{{item.state}}</strong> </v-btn>
      </template>

      <template v-slot:item.action="{ item }">
    <v-btn @click="userDetail(item)" icon ><v-icon>mdi-information-outline</v-icon></v-btn>
    <v-btn @click="btnClick('edit'), editTable(item)" icon ><v-icon>mdi-square-edit-outline</v-icon></v-btn>
    <v-btn @click="deleteCompany(item)" icon ><v-icon>mdi-trash-can-outline</v-icon></v-btn>
      </template>
    </v-data-table>
    
    <div class="text-center">
      <v-pagination
        v-model="page"
        :length="pageCount"
        circle
      >
      </v-pagination>
    </div>
  </v-card>
    <foot></foot>
</div>
  
</template>
 
<script>
  import Vue from "vue"
  import moment from "moment"
  import VueMomentJS from "vue-momentjs"
  import axios from 'axios'
  import companyAdd from '@/components/userComponents/companyAdd.vue'
  import userDetail from '@/components/userComponents/userDetail.vue'
  import ConfirmSnackBar from "../components/SnackBar/ConfirmSnackBar.vue";
  import EventBus from "../eventBus";

  Vue.use(VueMomentJS, moment)

  export default {
    components:{
      companyAdd,
      userDetail,
      ConfirmSnackBar
    },
    data () {
      return {
        to:{
          path:'/userManagement'
        },
        info:[],
        x:window.innerWidth,
        companyId:0,
        branchId:0,
        devices:[],
        search:'',
        page: 1,
        pageCount: 0,
        headers: [
          { text: '프로필사진', align: 'center', value: 'img', sortable: false},
           { text: '회사', value: 'name', align:'center' },
          { text: '상태', value: 'state',align:'center',  },
          { text: '유저수', value: 'userNum', align:'center'},
          { text: 'HYPER VSN', value: 'hvNum', align:'center'  },
          { text: '계약 만료일', value: 'expiredDate' , align:'center' },
          { text: '정보보기/수정/삭제', value: 'action',sortable: false, align:'center'},
        ],
        companies: [

        ],
            number:-1
      }
    },
    
    mounted(){

      const token = localStorage.getItem('token')
      axios.get('/api/company', { headers: { Authorization: token } })
      .then((r) => {
        if (!r.data.success) return console.error(r.data.msg)
          r.data.companies.forEach((company) => {
            if(company.company.file){
              var temp = company.company.file.location.split('\\')
              company.company.file.location = temp[2]
            }
            else{
              company.company.file={}
              company.company.file.location = 'null.png'
            }
            company.expiredDate = this.$moment(company.expiredDate).format('YYYY-MM-DD')
        });
        this.companies = r.data.companies
       
        let i =0;
        this.companies.forEach((item)=>{
          if(item.user_groups[0].groupAuth === 'admin'){
            delete this.companies[i]
          }
          i++
        })
      }).catch((e) => {
          console.error(e.message)
      });
    },
    methods:{
      companyDetail(item){
        let companyId = item.companyId
        this.$router.push({name:'userManagement', params:{companyId}});
      },
 
      getColor(status)
      {
        if(status ==='활성화')
          return 'green'
        else return 'red'
      },

      btnClick(what){
        EventBus.$emit("company_Add", what)
      },

      statusChange(item){
        this.number=this.companies.indexOf(item)
        if(this.companies[this.number].state ==='활성화'){
          this.companies[this.number].state ='비활성화'
          axios.put('/api/company/state', {
            id : item.id,
            state : '비활성화',
            isCompany:true
          })
          .catch((e) => {
              console.error(e.message)
          })
        }
        else if(this.companies[this.number].state ==='비활성화'){
          this.companies[this.number].sstatusChangetate ='활성화'
          axios.put('/api/company/state', {
            id : item.id,
            state : '활성화',
            isCompany:true
          })
          .catch((e) => {
              console.error(e.message)
          })
        }
      },

      editTable(item){
        EventBus.$emit("company_EditInfo", item)
      },

      userDetail(item){
        EventBus.$emit("company_Detail", item)
      },

      deleteCompany(item){
        this.companyId = item.companyId
        this.branchId = item.branchId
        EventBus.$emit("Confirm","company_DelOk","정말 삭제하시겠습니까?")
        EventBus.$on("company_DelOk", (r) => {
        this.info = [
          {
            companyId: this.companyId,
          }
        ]
        axios.delete('/api/company', {data: { info : this.info} })
        .then((r) => {
          location.href = '/company'
        });
      });
      },
   }
  }
</script>
 