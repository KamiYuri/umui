<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button style="float: right; margin-left: 10px;" class="filter-item float-right" @click="exportCSV($refs.elTable, 'host-list')">
        {{ $t('table.export-csv') }}
      </el-button>
      <el-button style="float: right;" class="filter-item float-right" @click="exportXLS($refs.elTable, 'host-list')">
        {{ $t('table.export-xls') }}
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      ref="elTable"
      fit
      stripe
      :data="
        tableData.filter(
          (data) =>
            !search ||
            data.hostname.toLowerCase().includes(search.toLowerCase()) ||
            data.ip.toLowerCase().includes(search.toLowerCase()) ||
            data.mac.toLowerCase().includes(search.toLowerCase())
        )
      "
      style="width: 100%"
    >
      <el-table-column label="ID" prop="id" width="80" sortable> </el-table-column>
      <el-table-column label="MAC" prop="mac" width="200" sortable> </el-table-column>
      <el-table-column label="IP" prop="ip" width="200" sortable> </el-table-column>
      <el-table-column label="Hostname" prop="hostname" width="240" sortable>
        <template slot-scope="scope">
          <router-link
            :to="{ name: 'HostDetail', params: { hostId: scope.row.id } }"
            ><el-link :underline="false" type="primary">{{
              scope.row.hostname
            }}</el-link></router-link
          >
        </template>
      </el-table-column>
      <el-table-column label="Description" prop="description">
      </el-table-column>
      <el-table-column align="right">
        <template slot="header">
          <el-input v-model="search" size="mini" placeholder="Type to search" />
        </template>
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)" icon="el-icon-edit" :title="$t('table.edit')">
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            :title="$t('table.delete')"
            icon="el-icon-delete">
            </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="params.page" :limit.sync="params.limit" @pagination="getList" />

    <el-dialog
      title="Edit Host"
      :visible.sync="openDialog"
      width="500"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        :label-position="'left'"
        :model="selectedHost"
        label-width="120px"
      >
        <el-form-item label="ID" prop="id">
          <el-input v-model="selectedHost.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="MAC" prop="mac">
          <el-input v-model="selectedHost.mac"></el-input>
        </el-form-item>
        <el-form-item label="IP" prop="ip">
          <el-input v-model="selectedHost.ip"></el-input>
        </el-form-item>
        <el-form-item label="Hostname" prop="hostname">
          <el-input v-model="selectedHost.hostname"></el-input>
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input
            v-model="selectedHost.description"
            type="textarea"
            :rows="2"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="openDialog = false">Cancel</el-button>
        <el-button type="primary" @click="editHost">Update</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import rf from 'requestfactory'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import RemoveErrorsMixin from 'common/RemoveErrorsMixin'
import Exporter from 'common/Exporter'

export default {
  name: "HostList",
  components: { Pagination },
  mixins: [RemoveErrorsMixin, Exporter],
  data() {
    return {
      listLoading: true,
      tableData: [],
      total: 0,
      params: {
        page: 1,
        limit: 20,
        key: undefined,
        status: undefined,
        sort: 'updated_at',
        order: 'desc'
      },
      search: "",
      openDialog: false,
      selectedHost: {
        id: "",
        mac: "",
        ip: "",
        hostname: "",
        description: "",
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      rf.getRequest('SystemHardeningRequest').getHostList(this.params)
      .then(async response => {
        this.tableData = response
        this.total = response.length
      })
      .catch(error => {
        this.errors.add({field: 'error', msg: error.response.data.message});
        this.$message.error(this.$t(this.errors.first('error')) || this.$t('auth.unknowError'));
      })
      .finally(() => this.listLoading = false)
    },
    deleteHost(id) {
      this.listLoading = true;
      rf.getRequest('SystemHardeningRequest').delete(id)
      .then(() => {
        this.tableData = this.tableData.filter((host) => host.id != id);
        this.$message({
          type: 'success',
          message: this.$t('notify.success.deleteSuccess')
        })
      })
      .finally(() => this.listLoading = false)
    },
    editHost() {
      this.listLoading = true;
      rf.getRequest('SystemHardeningRequest').update(this.selectedHost.id, this.selectedHost)
      .then(() => {
        this.tableData.forEach(function (part, index, theArray) {
          if (part.id == this.selectedHost.id)
            theArray[index] = { ...this.selectedHost };
        });
        this.openDialog = false;
        this.$notify({
          title: this.$t('notify.success.label'),
          message: this.$t('notify.success.updateSuccess'),
          type: 'success',
          duration: 1000,
          showClose: false
        })
      })
      .finally(() => this.listLoading = false)
    },
    handleEdit(index, row) {
      this.selectedHost = { ...row };
      this.openDialog = true;
    },
    handleDelete(index, row) {
      this.$confirm(this.$t('notify.text.delete'), 'Warning', {
        confirmButtonText: this.$t('action.ok'),
        cancelButtonText: this.$t('action.cancel'),
        type: 'warning',
        center: true
      }).then(() => {
        this.deleteHost(row.id);
      })
      .catch(() => {});
    },
  },
};
</script>
