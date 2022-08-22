/* eslint-disable */
<template>
  <div class="tab-container">
    <div class="buttons">
      <el-button type="primary" @click="getCheckedNodes">{{ $t('table.download') }}</el-button>
    </div>
    <el-input placeholder="Filter keyword" v-model="filterText"> </el-input>
    <el-tree
      class="filter-tree"
      :data="data"
      show-checkbox
      node-key="id"
      ref="tree"
      highlight-current
      v-loading="listLoading"
      :props="defaultProps"
      :filter-node-method="filterNode"
    >
    </el-tree>
  </div>
</template>

<script>
import rf from 'requestfactory'

export default {
  name: "CheckList",
  data() {
    return {
      filterText: "",
      listLoading: true,
      data: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  created() {
    this.getList();
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    getList() {
      this.listLoading = true;
      rf.getRequest('SystemHardeningRequest').getChecklist()
      .then(response => {
        this.data = response
      })
      .catch(error => {
        this.errors.add({field: 'error', msg: error.response.data.message});
        this.$message.error(this.$t(this.errors.first('error')) || this.$t('auth.unknowError'));
      })
      .finally(() => this.listLoading = false)
    },
    getCheckedNodes() {
      const checklist = this.$refs.tree
        .getCheckedNodes()
        .filter((node) => node.children == undefined);
      if (checklist.length == 0) {
        this.$message({
          message: "Please, choose checklist",
          type: "warning",
        });
        return;
      }

      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });

      rf.getRequest('SystemHardeningRequest').downloadChecklist({ checklist })
      .then((response) => {
        var blob = new Blob([response], { type: "application/zip" });
        var link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "source_utm.zip";
        link.click();
        this.$notify({
          title: this.$t('notify.success.label'),
            message: this.$t('notify.success.updateSuccess'),
            type: 'success',
            duration: 1000,
            showClose: false
        })
      })
      .finally(() => loading.close())
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
  },
};
</script>

<style scoped>
.tab-container {
  margin: 30px;
}

.buttons {
  margin-bottom: 20px;
}

.filter-tree {
  margin-top: 20px;
}
</style>
