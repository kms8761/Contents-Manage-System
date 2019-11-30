<template>
  <!-- 다른버전 막대그래프버전 -->
  <v-container class="grey lighten-5">
    <v-row no-gutters>
      <v-col cols="9">
        
        <v-card-title>
          통계보기
        </v-card-title>
      </v-col>
      <v-col cols="7">
      <v-card class="pa-2" tile min-height="40rem" max-height="40rem">
          <v-row justify="center">
            <span>
              <br />
              <br />
              <v-btn @click="searches(item)" color="primary">
                1일
              </v-btn>
              &nbsp;
              <v-btn  color="primary">
                15일
              </v-btn>
              &nbsp;
              <v-btn color="primary">
                힌달
              </v-btn>
              &nbsp;
              <v-btn color="primary">
                반년
              </v-btn>
              <!-- &nbsp; -->
              <!-- <v-btn color="primary">
                1년
              </v-btn> -->
              <!-- &nbsp; -->
            </span>
            &nbsp; &nbsp; &nbsp; &nbsp;
            <!-- <v-col   style="white-space:nowrap;"  cols="12" class="colupload"> -->
            <span cols="12" class="colupload">
              <v-menu
                v-model="frommenu"
                :close-on-content-click="false"
                :nudge-right="10"
                transition="scale-transition"
                offset-y
                min-width="120px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="fromdate"
                    label="From"                
                    prepend-inner-icon="mdi-calendar"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  locale="ko"
                  v-model="fromdate"
                  @input="frommenu = false"
                ></v-date-picker>
              </v-menu>
              <v-menu
                v-model="tomenu"
                :close-on-content-click="false"
                :nudge-right="10"
                transition="scale-transition"
                offset-y
                min-width="120px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="todate"
                    label="to"
                    prepend-inner-icon="mdi-calendar"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  locale="ko"
                  v-model="todate"
                  @input="tomenu = false"
                ></v-date-picker>
              </v-menu>
            </span>
             <v-btn @click="datasearch(item)"
             style="margin-top:60px;"
             class="ml-3" large rounded color="primary">
              조회
            </v-btn>
          </v-row>
          &nbsp;
          <!-- LineChart를 불러주는 내용 -->
          인원수/시간
          <line-chart></line-chart>
          <!-- LineChart를 불러주는 내용 -->
        </v-card>
      </v-col>
      <v-col cols="5">
        <!--  -->
        <div>
          <v-card class="pa-2" tile min-height="40rem" max-height="40rem">
            
            <v-row>
                &nbsp;
            <v-select
           
           
              v-model="enabled"
              :items="slots"
              label="Slot"              
              prepend-inner-icon="mdi-sort"
              @change="changeslot2"
            ></v-select>
                 <v-select
            style="max-width:15rem;"
           
              v-model="search"
              :items="slots2"
              label="Slot"
              clearable
             prepend-inner-icon="mdi-sort"
            ></v-select>
           
            </v-row>
            &nbsp;
            <v-data-table
            @current-items="e => currentitem = e"
            v-model="datatable"
              :items-per-page="10"
              :headers="headers"
              :items="items"
              :search="search"
              hide-default-footer="hidefooter"              
              :show-select="showSelect"
              :loading="isLoading"              
              item-key="name"
              class="elevation-1"
            >
              <template v-if="isEnabled('top')" v-slot:top>
                <div>This is content above the actual table</div>
              </template>
              <template
                v-if="isEnabled('header.data-table-select')"
                v-slot:header.data-table-select="{ on, props }"
              >
                <v-simple-checkbox
                  color="purple"
                  v-bind="props"
                  v-on="on"
                ></v-simple-checkbox>
              </template>
              <template
                v-if="isEnabled('header')"
                v-slot:header="{ props: { headers } }"
              >
                <thead>
                  <tr>
                    <th :colspan="headers.length">
                      This is a header
                    </th>
                  </tr>
                </thead>
              </template>
              <template v-if="isEnabled('progress')" v-slot:progress>
                <v-progress-linear
                  color="purple"
                  :height="10"
                  indeterminate
                ></v-progress-linear>
              </template>
              <template
                v-if="isEnabled('item.data-table-select')"
                v-slot:item.data-table-select="{ isSelected, select }"
              >
                <v-simple-checkbox
                  color="green"
                  :value="isSelected"
                  @input="select($event)"
                ></v-simple-checkbox>
              </template>
              <template
                v-if="isEnabled('item.<name>')"
                v-slot:item.name="{ item }"
              >
                {{ item.name.toUpperCase() }}
              </template>
              <template
                v-if="isEnabled('body.prepend')"
                v-slot:body.prepend="{ headers }"
              >
                <tr>
                  <td :colspan="headers.length">
                    This is a prepended row
                  </td>
                </tr>
              </template>
              <template v-if="isEnabled('body')" v-slot:body="{ items }">
                <tbody>
                  <tr v-for="item in items" :key="item.name">
                    <td>{{ item.name }}</td>
                    <td>{{ item.age }}</td>
                    <td>{{ item.gender }}</td>
                   <td>{{ item.person }}</td>
                  
                  
                  </tr>
                </tbody>
              </template>
              <template v-if="isEnabled('no-data')" v-slot:no-data>
                NO DATA HERE!
              </template>
              <template v-if="isEnabled('no-results')" v-slot:no-results>
                NO RESULTS HERE!
              </template>
              <template
                v-if="isEnabled('body.append')"
                v-slot:body.append="{ headers }"
              >
                <tr>
                  <td :colspan="headers.length">
                    This is an appended row
                  </td>
                </tr>
              </template>
              <template v-if="isEnabled('footer')" v-slot:footer>
                <div>
                  This is a footer
                </div>
              </template>
            </v-data-table>
          </v-card>
        </div>
        <!--  -->
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import EventBus from "../eventBus";
import LineChart from "@/components/mydevice/LineChart";
// 차트시 선언 npm i pure-vue-chart https://github.com/djaxho/pure-vue-chart?ref=madewithvuejs.com 참고
//  sorting datatable
const currentitem = [{

}

];

const desserts = [
  {
    name: "QW-HM",
    age: '10대',
    gender: '남자',
    person: 20,
    protein: 4.0,
    iron: "1%"
  },
  {
    name: "QW-HM",
    age: '10대',
    gender: '남자',
    person: 37,
    protein: 4.3,
    iron: "1%"
  },
  {
    name: "QW-HM",
    age: '10대',
    gender: '남자',
    person: 23,
    protein: 6.0,
    iron: "7%"
  },
  {
    name: "QW-HM",
    age:'10대',
    gender: '남자',
    person: 67,
    protein: 4.3,
    iron: "8%"
  },
  {
    name: "QW-HM",
    age: '20대',
    gender: '남자',
    person: 49,
    protein: 3.9,
    iron: "16%"
  },
  {
    name: "QW-HM",
    age: '10대',
   gender: '남자',
    person: 94,
    protein: 0.0,
    iron: "0%"
  },
  {
    name: "QW-HM",
    age: '10대',
    gender: '남자',
    person: 98,
    protein: 0,
    iron: "2%"
  },
  {
    name: "QW-HM",
    age:'10대',
    gender: '여자',
    person: 87,
    protein: 6.5,
    iron: "45%"
  },
  {
    name: "QW-HM",
    age: 452,
    gender: '남자',
    person: 51,
    protein: 4.9,
    iron: "22%"
  },
  {
    name: "QW-HM",
    age: 452,
    gender: 25.0,
    person: 51,
    protein: 4.9,
    iron: "22%"
  },
  {
   name: "QW-HM",
    age: 452,
    gender: 25.0,
    person: 51,
    protein: 4.9,
    iron: "22%"
  },
  {
    name: "Donut",
    age: 452,
    gender: 25.0,
    person: 51,
    protein: 4.9,
    iron: "22%"
  },
  {
    name: "Donut",
    age: 452,
    gender: 25.0,
    person: 51,
    protein: 4.9,
    iron: "22%"
  },
  {
    name: "Dodut",
    age: 452,
    gender: 25.0,
    person: 51,
    protein: 4.9,
    iron: "22%"
  },
  {
    name: "Donut",
    age: 452,
    gender: 25.0,
    person: 51,
    protein: 4.9,
    iron: "22%"
  },
 
];
//
export default {
  name: "App",
  components: {
    LineChart
    // 차트시 선언 npm i pure-vue-chart
  },
  //
  name: "app",
  props: {},
  data() {
    return {
      datatable:"",
      frommenu: false,
      tomenu: false,
      fromdate: "",
      todate: "",
      //
      // currentitem:[],
      enabled: null,
      enabled2: null,
      items: desserts,
      search: null,
      slots: [
        "영상",
        "나이",
        "성별",
        
      ],
  slots2: [
       
      ],
  videolist:[
   
        "QW-HM",
        "QW-HM",
        "QW-HM",
        "QW-HM",
        "QW-HM",
        "no-data",
        "no-results",
        "top"
  ],
  
    age:[
   
       "10대",
       "20대",
       "30대",
       "40대",
       "50대",
       "60대",
       "70대",
       "80대",
       "90대",
       

  ], 
      gender:[
   
        "남자",
       "여자",
    

  ], 





      headers: [
        {
          text: "영상",
          align: "left",
          sortable: false,
          value: "name"
        },
        { text: "연령", value: "age" },
        { text: "성별", value: "gender" },
        { text: "인원", value: "person" },
        // { text: "Protein (g)", value: "protein" },
        // { text: "Iron (%)", value: "iron" }
      ]
    };
  },
  computed: {
    showSelect() {
      return (
        this.isEnabled("header.data-table-select") ||
        this.isEnabled("item.data-table-select")
      );
    },
    hideHeaders() {
      return !this.showSelect;
    },
    isLoading() {
      return this.isEnabled("progress");
    }
  },
  watch: {
    enabled(slot) {
      if (slot === "no-data") {
        this.items = [];
      } else if (slot === "no-results") {
        this.search = "...";
      } else {
        this.search = null;
        this.items = desserts;
      }
    }
  },
  methods: {
    isEnabled(slot) {
      return this.enabled === slot;
    },
    searches(item){
      console.log(desserts)
    EventBus.$emit("DeviceData",desserts)
    },
    // updated:function(item){
      
    //    EventBus.$emit("Data",item)
    // }
  changeslot2(){
    // console.log(this.enabled)

   if(this.enabled==="영상")
   {
     this.slots2=this.videolist
   }

    if(this.enabled==="나이")
   {
     this.slots2=this.age
   }

    if(this.enabled==="성별")
   {
     this.slots2=this.gender
   }
    
  },
  datasearch(item)
  {
    console.log(this.currentitem)
    console.log(this.currentitem.length)
    
    EventBus.$emit("tableData",this.currentitem)
  }
},
  // 

 
  
};
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
  max-width: 15rem;
  min-width: 15rem;
  width: 100%;
}
.wrap {
  white-space: nowrap;
}
ul {
  list-style-type: black;
  padding: 0;
}
li {
  display: black;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
