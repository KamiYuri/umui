<template>
  <div class="app-container documentation-container">
    <el-row style="background: #4dbd74; padding:16px 16px 0; margin-bottom:32px; color: #ffffff">
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
    </el-row>
  </div>
</template>

<script>
// import DropdownMenu from '@/components/Share/DropdownMenu'

export default {
  name: 'Documentation',
  // components: { DropdownMenu },
  data() {
  }
}
</script>

<style lang="scss" scoped>
.documentation-container {
  margin: 12px;
  display: flex;
  flex-wrap: wrap;
  .document-btn {
    margin-left: 50px;
    display: block;
    cursor: pointer;
    background: black;
    color: white;
    height: 60px;
    width: 200px;
    margin-bottom: 16px;
    line-height: 60px;
    font-size: 20px;
    text-align: center;
  }
}
</style>
