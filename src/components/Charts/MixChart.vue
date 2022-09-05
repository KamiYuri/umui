<template>
  <div :id="id" :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    },
    xData: {
      type: Array,
      required: true
    },
    yData: {
      type: Object,
      required: true
    }
  },
  data() {
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))

      const lineChart = {
        title: {
          text: 'line chart',
          x: '2%',
          top: 40,
          textStyle: {
            color: '#fff',
            fontSize: '22'
          },
          subtextStyle: {
            color: '#90979c',
            fontSize: '16'
          }
        },
        legend: {
          top: 80,
          textStyle: {
            color: '#2aff00'
          },
          data: this.yData.name,
          icon: 'line'
        },
        grid: {
          left: '5%',
          right: '5%',
          borderWidth: 0,
          top: 80,
          bottom: '55%',
          textStyle: {
            color: '#fff'
          }
        },
        xAxis: {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisLabel: {
            interval: 0
          },
          data: this.xData,
          gridIndex: 0
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0
          },
          splitArea: {
            show: false
          },
          gridIndex: 0
        },
        series: [
          {
            name: 'Fail',
            type: 'line',
            // hien thi gia tri cua cot
            label: {
              show: true,
              position: 'top',
              fontSize: 16,
              //TODO chi hien thi neu gia tri cua cot > 0 ???
              formatter(column) {
                return column.value > 0 ? column.value : ''
              }
            },
            barMaxWidth: 35,
            itemStyle: {
              color: 'rgb(206,24,24)',
            },
            data: this.yData.failed
          },
          {
            name: 'Success',
            type: 'line',
            barMaxWidth: 35,
            label: {
              show: true,
              position: 'top',
              formatter(column) {
                return column.value > 0 ? column.value : ''
              }
            },
            itemStyle: {
              color: 'rgb(40,208,50)',
            },
            data: this.yData.success
          },
        ]
      }

      const barChart = {
        title:               {
          text: 'barchart',
          x: '2%',
          top: '50%',
          textStyle: {
            color: '#fff',
            fontSize: '22'
          },
          subtextStyle: {
            color: '#90979c',
            fontSize: '16'
          }
        },
        legend: {
          top: '55%',
          textStyle: {
            color: '#0094ff'
          },
          data: this.yData.name
        },
        grid: {
          left: '5%',
          right: '5%',
          borderWidth: 0,
          top: '55%',
          bottom: 80,
          textStyle: {
            color: '#fff'
          }
        },
        xAxis: {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisLabel: {
            interval: 0
          },
          data: this.xData,
          gridIndex: 1
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0
          },
          splitArea: {
            show: false
          },
          gridIndex: 1
        },
        series: [
          {
            name: 'Fail',
            type: 'bar',
            // hien thi gia tri cua cot
            label: {
              show: true,
              position: 'top',
              fontSize: 16,
              //TODO chi hien thi neu gia tri cua cot > 0 ???
              formatter(column) {
                return column.value > 0 ? column.value : ''
              }
            },
            barMaxWidth: 35,
            itemStyle: {
              color: 'rgb(206,24,24)',
            },
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: this.yData.failed
          },
          {
            name: 'Success',
            type: 'bar',
            barMaxWidth: 35,
            label: {
              show: true,
              position: 'top',
              formatter(column) {
                return column.value > 0 ? column.value : ''
              }
            },
            itemStyle: {
              color: 'rgb(40,208,50)',
            },
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: this.yData.success
          },
        ]
      }

      this.chart.setOption({
            backgroundColor: '#ffffff',
            title: [
              lineChart.title,
              barChart.title
            ],
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                textStyle: {
                  color: '#fff'
                }
              }
            },
            grid: [
              lineChart.grid,
              barChart.grid
            ],
            legend: [
              lineChart.legend,
              barChart.legend
            ],
            calculable: true,
            xAxis: [
              lineChart.xAxis,
              barChart.xAxis
            ],
            yAxis: [
              lineChart.yAxis,
              barChart.yAxis
            ],
            series: [
              ...lineChart.series,
              ...barChart.series
            ],
            dataZoom: [
              {
                show: true,
                height: 25,
                xAxisIndex: [
                  0, 1
                ],
                bottom: 20,
                start: 20,
                end: 80,
                handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
                handleSize: '110%',
                handleStyle: {
                  color: '#d3dee5'
                },
                textStyle: {
                  color: '#fff'
                },
                borderColor: '#90979c'
              },
              {
                type: 'inside',
                show: true,
                height: 15,
                start: 1,
                end: 35
              }
            ],
          }
      )
    },
    getChartInstance(){
      return this.chart
    },
  }
}


</script>
