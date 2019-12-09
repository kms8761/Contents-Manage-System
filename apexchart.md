# apexchart이용법

# apexchart vue에서이용하기

Installing via npm

    npm install apexcharts --save

**Usage`import** ApexCharts **from** 'apexcharts'`

OR

**Direct <script> include**Another way is to directly include it in your html`[<**script** src="https://cdn.jsdelivr.net/npm/apexcharts"></**script**>](https://cdn.jsdelivr.net/npm/apexcharts)`

## 1.막대그래프

![apexchart/Untitled.png](apexchart/Untitled.png)

template

    <apexcharts
                    height="600"
                    width="800"
                    type="bar"
                    :options="chartOptions"
                    :series="series"
                    
                  ></apexcharts>

<script>

    <script>
    
    import VueApexCharts from "vue-apexcharts";
    Vue.use(VueApexCharts);
    
    export default {
      name: "App",
      components: {
        // LineChart
        apexcharts: VueApexCharts
      },
    
      //
      name: "app",
      props: {},
    
      data() {
        return {
    
    chartOptions: {
            chart: {
              id: "vuechart-example",
              stacked: true,
              toolbar: {
                show: true
                
              },
              zoom: {
                enabled: true
              },
          
            },
       dataLabels: {
            enabled: true,
            enabledOnSeries: undefined,
            formatter: function (val, opts) {
                return val
            },
            textAnchor: 'middle',
            offsetX: 0,
            offsetY: 0,
            style: {
                fontSize: '14px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                colors: ['#212121'],
            },
            dataLabels: {
              enabled: true,
              enabledOnSeries: undefined,
              formatter: function(val, opts) {
                return val;
              },
              textAnchor: "middle",
              offsetX: 0,
              offsetY: 0,
              style: {
                fontSize: "14px",
                fontFamily: "Helvetica, Arial, sans-serif",
                colors: ["#212121"]
              },
              dropShadow: {
                enabled: false,
                top: 1,
                left: 1,
                blur: 1,
                opacity: 0.45
              }
            },
    
            responsive: [
              {
                breakpoint: 480,
                options: {
                  legend: {
                    show: false,
                    position: "bottom",
                    offsetX: -10,
                    offsetY: 0
                  }
                }
              }
            ],
            plotOptions: {
              bar: {
                horizontal: false
              }
            },
    
            xaxis: {
              type: "datetime",
              categories: [
                "11/02/2019",
                "11/03/2019",
                "11/04/2019",
                "11/05/2019 ",
                "11/06/2019"
              ]
            },
            legend: {
              position: "right",
              offsetY: 40,
              markers: {
                fillColors: [
                  "#1A73E8",
                  "#B32824",
                  "#FF5700",
                  "#66DA26",
                  "#546E7A",
                  "#E91E63",
                  "#FF9800",
                  "#7E36AF",
                  "#D9534F"
                ]
              }
            },
    
            tooltip:{
    style: {
            fontSize: '12px',
            fontFamily: undefined
          },
      marker: {
        fillColors:['#1A73E8', '#B32824','#FF5700', '#66DA26', '#546E7A', '#E91E63', '#FF9800','#7E36AF','#D9534F'],
        
              show: true,
          },
            },
            fill: {
              colors: [
                "#1A73E8",
                "#B32824",
                "#FF5700",
                "#66DA26",
                "#546E7A",
                "#E91E63",
                "#FF9800",
                "#7E36AF",
                "#D9534F"
              ],
              opacity: 1
            }
          },
    
    },
          series: [
            {
              name: '10대 이하',
               data: [10,10,10,10,10,10],
    
            },
             {
              name: 'PRODUCT B',
              data: [13, 23, 20, 8, 13, 27]
            },
            
          ],
        }
      }
    }
    </script>

## 2.실시간 그래프

![apexchart/Untitled%201.png](apexchart/Untitled%201.png)

움직이는 그래프

    <template>
    <!-- https://github.com/artiely/antd-admin/blob/fd6a7c91ff19e5fdc73d0889be71571ac977f5e2/src/views/dashboard/apex-charts/line2.vue
    예제 참고 -->
           <div>
        <div id="chart-line2"></div>
      </div>
    </template>
    
    <script>
    import ApexCharts from 'apexcharts'
    export default {
      mounted() {
        this.$nextTick(() => {
          this.render()
        })
      },
      methods: {
        render() {
          var lastDate = 0
          var data = []
          function getDayWiseTimeSeries(baseval, count, yrange) {
            var i = 0
            while (i < count) {
              var x = baseval
              // 축 날짜 데이터 받아주기
              var y =
    					//임시로 y값 랜덤설정해줌
                Math.floor(Math.random() * (yrange.max - yrange.min + 1)) +
                yrange.min
              data.push({
                x,
                y,
              })
              lastDate = baseval
              // 하루= 86400000
              baseval += 86400000
              i++
            }
          }
          getDayWiseTimeSeries(new Date().getTime(), 10, {
            min: 10,
            max: 90,
          })
          function getNewSeries(baseval, yrange) {
            var newDate = baseval + 86400000
            lastDate = newDate
            data.push({
              x: newDate,
              y:
                Math.floor(Math.random() * (yrange.max - yrange.min + 1)) +
                yrange.min,
            })
          }
          function resetData() {
            data = data.slice(data.length - 10, data.length)
          }
          var options = {
            chart: {
              height: 350,
              type: 'line',
              animations: {
                enabled: true,
                easing: 'linear',
                dynamicAnimation: {
                  speed: 2000,
                },
              },
              toolbar: {
                show: false,
              },
              zoom: {
                enabled: false,
              },
            },
            dataLabels: {
              enabled: false,
            },
            stroke: {
              curve: 'smooth',
            },
            series: [
              {
                data: data,
              },
            ],
            title: {
              text: 'Dynamic Updating Chart',
              align: 'left',
            },
            markers: {
              size: 0,
            },
            xaxis: {
              type: 'datetime',
              range: 777600000,
            },
            yaxis: {
            
            },
            legend: {
              show: false,
            },
          }
          var chart = new ApexCharts(
            document.querySelector('#chart-line2'),
            options
          )
          chart.render()
          window.setInterval(function() {
            getNewSeries(lastDate, {
              min: 10,
              max: 90,
            })
            chart.updateSeries([
              {
                data: data,
              },
            ])
          }, 2000)
          // every 60 seconds, we reset the data
          window.setInterval(function() {
            resetData()
            chart.updateSeries(
              [
                {
                  data,
                },
              ],
              false,
              true
            )
          }, 60000)
        },
      },
    }
    </script>
    
    <style scoped>
    </style>