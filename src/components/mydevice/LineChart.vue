



<script>
// https://chuckolet.tistory.com/8 사이트 참고  
// npm install chart.js chartkick hchs-vue-charts vue-chartjs vue-chartkick 해줘야함
 import EventBus from "../eventBus";
  import {Line} from 'vue-chartjs'
  //Exporting this so it can be used in other components
  export default { 
    extends: Line,
    data () {
      return {
        datacollection: {
          //Data to be represented on x-axis
          labels: ['0시', '2시', '4시', '6시', '8시', '10시', '12시', 
                    '14시', '16시', '18시', '20시', '22시'], 
          datasets: [
            {
                
              label: '인원수',
              backgroundColor: 'white',
              pointBackgroundColor: 'red',
              borderWidth: 5,
              bordercolor:'black',              
              pointBorderColor: 'red',
              //Data to be represented on y-axis
              
              data: [],
               labels: ['0시', '2시', '4시', '6시', '8시', '10시', '12시', 
                    '14시', '16시', '18시', '20시', '22시'], 
            }
          ]
        },
        //Chart.js options that controls the appearance of the chart
        options: {
               data: [40, 20, 30, 50, 90, 10, 20, 40, 50, 70, 90, 100],
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
              
              },
              gridLines: {
                display: true
              }
            }],
            xAxes: [ {
              gridLines: {
                display: false
              }
            }]
          },
          legend: {
            display: true
          },
          responsive: true,
          maintainAspectRatio: false
        }
      }
    },

    // methods:{
    //     created:function() {
    //      EventBus.$on("Data",(item) => { 
    //        console.log(this.item)
    //        console.log(item)
    //      this.data=item.data
    //      });
    //      }
    // },
    mounted () {
      //renderChart function renders the chart with the datacollection and options object.
      this.renderChart(this.datacollection, this.options)
      let a;
       EventBus.$on("DeviceData", (item) => {
         console.log(this.datacollection.datasets[0].data)
          // this.datacollection.datasets[0].data=20
          // this.datacollection.datasets.data=20
             console.log(item)
              console.log(item[0].person)
            
              console.log(item.length)
              console.log(this.datacollection.datasets[0].data)
              // 인원의 값을 가져오는부분 인원 person
              for(a=0;a<item.length;a++)
              {
                console.log('1')
              this.datacollection.datasets[0].data.push(item[a].person)
              console.log(item[a].person+'d')
              }
               this.renderChart(this.datacollection, this.options)
          //  this.datacollection.datasets[0].data.push(item[0].person)
          //  this.datacollection.datasets[0].data=20
            console.log(this.datacollection.datasets[0].data)
        //  this.datasets.data=desserts.carbs
        //   console.log(desserts.carbs)
        //  console.log(this.data)
    });


 EventBus.$on("tableData", (item) => {
     console.log('d')
              console.log(item)
              // 만약 데이터가 있다면 리셋
            if(this.datacollection.datasets[0].data !=[])
            {
                this.datacollection.datasets[0].data =[]
            }
            //   console.log(item.length)
            //   console.log(this.datacollection.datasets[0].data)
            //   // 인원의 값을 가져오는부분 인원 person
              for(a=0;a<item.length;a++)
              {
                console.log('1')
              this.datacollection.datasets[0].data.push(item[a].person)
              console.log(item[a].person+'d')
              }
               this.renderChart(this.datacollection, this.options)

            // console.log(this.datacollection.datasets[0].data)
        
    });



    },
  
updated:function() {
this.$nextTick(function () {
  
 console.log(this.datacollection.datasets[0].data)    
 console.log(this.datacollection.datasets.data)  
  this.datacollection.datasets[0].data.push(20)
   this.datacollection.datasets[0].data=20
      this.renderChart(this.datacollection, this.options)
  })



  
}

    
  }
</script>
