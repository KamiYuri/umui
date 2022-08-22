<template>
  <div class="app-container statistics">
    <el-card shadow="always">
      <!-- <h3>Tổng hợp, thống kê dữ liệu xâm nhập mạng đã thu thập được từ hệ thống NetIPS</h3> -->
      <div class="kibanaframe">
        <iframe id="/threat/statistics" src="https://dashboard.udis.duckdns.org/goto/d78c9660e46694fec111213eaf26cd98?security_tenant=private" class="frame"></iframe>        
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Statistics'
}
</script>

<style lang="scss" scoped>
.statistics {
  .frame {
    display: block;
    width: 100vw;
    height: 2960px;//400vh;
    max-width: 100%;
    margin: 0;
    padding: 0;
    border: 0 none;
    box-sizing: border-box;
  }
}
</style>
