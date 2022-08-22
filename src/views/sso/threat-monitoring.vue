<template>
  <div class="app-container threat-monitoring">
    <el-card shadow="always">
      <!-- <h3>Tổng quan các sự kiện xâm nhập được phát hiện từ hệ thống phát hiện/phòng chống xâm nhập mạng NetIPS</h3> -->
      <iframe id="/threat/monitoring" src="https://dashboard.udis.duckdns.org/goto/1c43b5784095f1b9805bebe7611945fb?security_tenant=private" class="frame"></iframe>   
    </el-card>
  </div>
</template>

<script>

export default {
  name: 'ThreatMonitoring',
}
</script>

<style lang="scss" scoped>
.threat-monitoring {
  .frame {
    display: block;
    width: 100vw;
    height: 1180px; //200vh;
    max-width: 100%;
    margin: 0;
    padding: 0;
    border: 0 none;
    box-sizing: border-box;
  }
}
</style>
