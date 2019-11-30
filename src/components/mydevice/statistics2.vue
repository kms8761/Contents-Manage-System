<template>
  <v-container class="grey lighten-5">
 
      <v-row no-gutters>
      <v-col cols="9">
         <v-card-title>
         통계보기
         </v-card-title>
      </v-col>
      <v-col  cols="7">
         
        <v-card
          class="pa-2"          
          tile
        >
        <v-row justify="center">
           
         <span>   
              
         <br>
            <br>
        <v-btn color="primary">
            1일
        </v-btn>
        &nbsp;
        <v-btn color="primary">
            7일
        </v-btn>
        &nbsp;
        <v-btn color="primary">
            한달
        </v-btn>
        &nbsp;
        <v-btn color="primary">
            세달
        </v-btn>
        &nbsp;
        <v-btn color="primary">
            반년
        </v-btn>
        &nbsp; 
         <v-btn color="primary">
            1년
        </v-btn>
         </span>
         &nbsp;
           &nbsp;
            &nbsp;
           &nbsp;
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
                    :rules="dateRules"
                    :readonly="readonly"
                    prepend-inner-icon="mdi-calendar"
                    v-on="on"
                  ></v-text-field>
                </template>
              <v-date-picker
                  locale="ko"
                  v-model="fromdate"
                  @input="menu = false"
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
                    :rules="dateRules"
                    :readonly="readonly"
                    prepend-inner-icon="mdi-calendar"
                    v-on="on"
                  ></v-text-field>
                </template>
              <v-date-picker
                  locale="ko"
                  v-model="todate"
                  @input="menu = false"
                ></v-date-picker>
        </v-menu>
        
            </span>
        </v-row>
        &nbsp;
        &nbsp;
        &nbsp;
        &nbsp;
        <div id="app">
        <pure-vue-chart
        style="color: #727779;"
  class="rect"
  :width="500"
  :height="300"
 
:show-y-axis="true"
:show-x-axis="true"

:show-values="true"
:use-month-labels="true"
:months="['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']"



 :show-trend-bar="true"
 :trend-bar-width="2"
trend-bar-color="black"


:points="dataPoints"

/>
        </div>
        <!-- </v-col> -->
    </v-card>
      </v-col>

  <v-col cols="5">
        <v-card
          class="pa-2"
          tile
        >
        </v-card>
  </v-col>
      </v-row>
  </v-container>
  
</template>
 
<script>
import PureVueChart from 'pure-vue-chart';
// 차트시 선언 npm i pure-vue-chart https://github.com/djaxho/pure-vue-chart?ref=madewithvuejs.com 참고
  export default {
      name: 'App',
    components:{
     PureVueChart,
   // 차트시 선언 npm i pure-vue-chart
     
    },
// 
  name: 'app',
 props: {

  },
    data () {
      return {
       dataPoints: [41.1, 1, 15, 16, 23, 41.1, 4, 8, 15, 22, 1, 12],
          frommenu: false,
          tomenu:false,
            fromdate:"",
            todate:"",
      }
    },
  }
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
.wrap{
    white-space: nowrap;
}
.pure-vue-bar-chart rect[data-v-50e4aa60]{
    fill: #727779;
    color: #727779;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color:black;
  margin-top: 60px;
}
  </style>