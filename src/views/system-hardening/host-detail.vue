<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="Choose Time">
        <el-date-picker
          v-model="time"
          type="month"
          placeholder="Pick a month"
          value-format="yyyy-MM"
        >
          >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loadingButton" @click="query"
          >Query</el-button
        >
      </el-form-item>
    </el-form>
    <el-form :label-position="'left'" label-width="120px" v-if="queryData">
      <el-form-item label="Result type">
        <el-radio-group v-model="resultType">
          <el-radio-button label="Chart"></el-radio-button>
          <el-radio-button label="Table"></el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <div class="chart-container" v-show="resultType == 'Chart'">
      <div id="chart" class="chart" style="width: 100%; height: 100%" />
    </div>
    <div class="table-container" v-show="resultType == 'Table'">
      <el-tabs type="border-card">
        <el-tab-pane
          v-for="(item, index) in dataTable"
          :key="index"
          :label="item.object"
        >
          <el-table
            :data="item.result"
            stripe
            row-key="id"
            style="width: 100%; margin-top: 20px"
          >
            <el-table-column prop="package" label="Package" width="200">
            </el-table-column>
            <el-table-column prop="package_detail" label="Title">
            </el-table-column>
            <el-table-column prop="pass" label="Result" width="100">
              <template slot-scope="scope">
                <el-tag
                  v-if="scope.row.pass !== undefined"
                  :type="scope.row.pass ? 'success' : 'warning'"
                  disable-transitions
                  >{{ scope.row.pass ? "Pass" : "Not pass" }}</el-tag
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import resize from "./mixins/resize";

export default {
  name: "HostDetail",
  mixins: [resize],
  data() {
    return {
      loadingButton: false,
      resultType: "Chart",
      time: "",
      hostId: null,
      dataTable: [],
      chart: null,
      queryData: false,
    };
  },
  mounted() {
    this.hostId = this.$route.params.hostId;
  },
  methods: {
    query() {
      const time = this.time;
      const host_id = this.hostId;
      if (time == "") return;
      this.loadingButton = true;
      const sel = this;
      // api
      this.$http
        .get("/GetResult", {
          params: {
            host_id,
            time,
          },
        })
        .then(function (response) {
          sel.loadingButton = false;
          if (response.length !== 0) {
            sel.queryData = true;
            const data = JSON.parse(response[0].fields.json_data);
            sel.dataTable = data;
            sel.initChart(data);
          } else {
            sel.$message({
              message: "No data.",
              type: "warning",
            });
          }
        })
        .catch(function (error) {
          console.log(error);
          sel.loadingButton = false;
        });
    },
    getChart(data) {
      var xAxis = [];
      var passSeries = [];
      var notPassSeries = [];

      data.forEach((obj) => {
        var object = obj.object;
        xAxis.push(object);

        var pass = 0;
        var notPass = 0;
        const result = obj.result;
        result.forEach((pkg) => {
          const children = pkg.children;
          if (children !== undefined) {
            children.forEach((detail) => {
              if (detail.pass) {
                pass++;
              } else {
                notPass++;
              }
            });
          }
        });

        passSeries.push(pass);
        notPassSeries.push(notPass);
      });

      return {
        xAxis,
        passSeries,
        notPassSeries,
      };
    },
    initChart(data) {
      const dataChart = this.getChart(data);

      this.chart = echarts.init(document.getElementById("chart"));
      this.chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          data: ["Pass", "Not pass"],
        },
        xAxis: [
          {
            type: "category",
            axisTick: { show: false },
            data: dataChart.xAxis,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "Pass",
            type: "bar",
            barGap: 0,
            emphasis: {
              focus: "series",
            },
            data: dataChart.passSeries,
          },
          {
            name: "Not pass",
            type: "bar",
            emphasis: {
              focus: "series",
            },
            data: dataChart.notPassSeries,
          },
        ],
      });
    },
  },
};
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 270px);
  margin-top: 20px;
}

.table-container {
  margin-top: 20px;
}
</style>