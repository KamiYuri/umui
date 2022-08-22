<template>
  <div class="dashboard-editor-container">
    <Panel></Panel>
    <h1>
        Hệ thống trung tâm quản lý các hệ thống thiết bị tường lửa hợp nhất - UTM Manager.
      </h1>
      <h4>
        được nghiên cứu xây dựng trong khuôn khổ đề tài độc lập cấp nhà nước.
      </h4>      

      <hr class="my-4" />
      <p>
        Đơn vị chủ trì: Trường Đại học kỹ thuật hậu cần - Bộ Công an
      </p>
      <p>
        Các đơn vị phối hợp:
        <br />&emsp;&emsp; 1. Cục H05
        <br />&emsp;&emsp; 2. Viện Công nghệ thông tin và Truyền thông, Trường Đại học Bách khoa Hà Nội
      </p>
  </div>
</template>

<script>
import Panel from '../panel'
export default {
  name: 'DashboardAdmin',
  data() {
    return {
      summary: {}
    }
  },
  components: {
    Panel
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>


