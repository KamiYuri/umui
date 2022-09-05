<template>
  <div class="app-container statistics">
    <el-card shadow="always">
      <el-button style="float: right; margin-left: 10px;" class="filter-item float-right" @click.prevent="exportData">
        Export PNG
      </el-button>
      <h3>Bieu do thong ke Benchmark</h3>

      <div class="chart-container">
        <chart height="100%" v-bind:x-data="xData" v-bind:y-data="yData" width="100%" ref="chart"/>
      </div>
    </el-card>
  </div>
</template>

<script>
import Chart from '@/components/Charts/MixChart'
import waves from '@/directive/waves' // waves directive
import RemoveErrorsMixin from 'common/RemoveErrorsMixin'

export default {
  name: 'detail',
  components: {Chart},
  directives: waves,
  mixins: [RemoveErrorsMixin],
  data() {
    return {
      linkList: [],
      api: [],
      xData: this.api.map(obj => obj.date),
      yData: {
        failed: this.api.map(obj => obj.failed),
        success: this.api.map(obj => obj.success)
      }
    }
  },
  methods: {
    exportData() {
      const fileURL = window.URL.createObjectURL(new Blob([this.$refs.chart.getChartInstance().getDataURL()]));
      const fileLink = document.createElement('a');
      fileLink.href = fileURL

      fileLink.setAttribute('download', 'chart.png')
      document.body.appendChild(fileLink)

      fileLink.click()
    }
  },
  beforeCreate() {
    this.api = [
      {
        date: "2022-01-01",
        success: 28,
        failed: 22
      },
      {
        date: "2019-07-05",
        success: 12,
        failed: 38
      },
      {
        date: "2020-06-25",
        success: 45,
        failed: 5
      },
      {
        date: "2020-07-05",
        success: 38,
        failed: 12
      },
      {
        date: "2018-02-09",
        success: 49,
        failed: 1
      },
      {
        date: "2021-12-11",
        success: 50,
        failed: 0
      },
      {
        date: "2022-02-19",
        success: 7,
        failed: 43
      }
    ].sort((obj1, obj2) => {
      return new Date(obj1.date) - new Date(obj2.date)
    })
  }
}
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}
</style>