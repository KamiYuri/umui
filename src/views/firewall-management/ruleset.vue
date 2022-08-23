<template>
  <div class="app-container user-management">
    <div class="filter-container">
      <el-button style="float: right;margin-left: 10px;" class="filter-item float-right" type="primary" icon="el-icon-plus" @click="handleCreateSingle">
        {{ $t('table.add') }}
      </el-button>
      <el-button style="float: right; margin-left: 10px;" class="filter-item float-right" @click="exportCSV($refs.elTable, 'rulesets')">
        {{ $t('table.export-csv') }}
      </el-button>
      <el-button style="float: right;" class="filter-item float-right" @click="exportXLS($refs.elTable, 'rulesets')">
        {{ $t('table.export-xls') }}
      </el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      fit
      stripe
      style="width: 100%;"
      @sort-change="sortChange"
      ref="elTable"
    >
      <el-table-column :label="$t('table.id')" prop="idRulepackage" sortable align="center" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.idRulepackage }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.application')" sortable prop="application" align="center">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.application }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.version')" sortable prop="version" align="center">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.version }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" fixed="right" align="center" width="150px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(row)" :title="$t('table.delete')">
            </el-button>
        </template>
      </el-table-column> 
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="params.page" :limit.sync="params.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @close="resetError()">
      <el-form ref="dataFormSingle" :model="temp" label-position="left" label-width="100px" style="width: 100%">        
        <el-form-item v-if="!application || !application.length" 
            :label="$t('table.application')"  
            label-width="150px" prop="application">
          <el-select
                v-model="temp.application"
                class="filter-item"
                placeholder="Please select"
                name="application"
                @focus="resetError"
                :class="{ error: errors.has('application') }"
                style="width: 100%"
                data-vv-validate-on="none"
                v-validate="'required'">
            <el-option v-for="item in applicationOptions" :key="item.key" :label="item.label" :value="item.value" />
          </el-select>
          <div class="el-form-item__error" v-if="errors.has('application')">
            {{ errors.first('application') }}
          </div>
        </el-form-item>
        <el-form-item :label="$t('table.version')" label-width="150px" >
          <el-input v-model="temp.version"
                    tabindex="1"
                    @focus="resetError"
                    readonly
                    name="version"
                    :placeholder="$t('table.version')"
                    :class="{ error: errors.has('version') }"
                    data-vv-validate-on="none"
                    v-validate="'required|max:255'" />
          <div class="el-form-item__error" v-if="errors.has('version')">
            {{ errors.first('version') }}
          </div>
        </el-form-item>
        <el-form-item :label="$t('table.rule')" label-width="150px" >
          <el-upload ref="ruleUpload"
            :multiple='application==="idssystem"' :drag="!selectedFiles.length"
            style="width:100%"
            :placeholder="`Drop ${fileExt} files here`"
            action="#"
            :class="{'my-el-upload': true, 'hide-my-el-upload': selectedFiles.length}"
            :accept="getAccept(application || temp.application)"
            :on-change="onUploadFileChanged"
            :on-remove="onUploadFileRemoved"
            :auto-upload="false"
            :file-list="selectedFiles">
            <i v-if="!selectedFiles.length" class="el-icon-upload"></i>
            <div v-if="!selectedFiles.length" class="el-upload__text">{{$t(`upload.drop${fileExt}Here`)}} {{$t('upload.or')}}  <em>{{$t('upload.clickToUpload')}} </em></div>
          </el-upload>
          <div class="el-form-item__error" v-if="errors.has('rule')">
            {{ errors.first('rule') }}
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="danger" @click="resetFiles">{{$t('action.reset')}}</el-button>
        <el-button type="primary" @click="createData()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import rf from 'requestfactory'
import { Message } from 'element-ui'
import RemoveErrorsMixin from 'common/RemoveErrorsMixin'
import Exporter from 'common/Exporter';
import JSZip from 'jszip'
// import { map, cloneDeep } from 'lodash'

const component = {
  name: 'Ruleset',
  components: { Pagination },
  directives: { waves },
  mixins: [RemoveErrorsMixin, Exporter],
  props: [
    'application', 'fileExt'
  ],
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      selectedFiles: [],
      params: {
        page: 1,
        limit: 20,
        key: undefined,
        status: undefined,
        sort: 'updated_at',
        order: 'desc'
      },
      temp: {
        application: undefined,
        version: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: this.$t('table.edit'),
        create: this.$t('table.create'),
        upload: this.$t('upload.title')
      },
      fileList: [],
      isSubmitting: false,
      applicationOptions: [
        {
          key: 'modsec',
          value: 'modsec',
          label: 'Mod Security'
        },
        {
          key: 'suricata',
          value: 'suricata',
          label: 'Suricata'
        },
        {
          key: 'deepinspector',
          value: 'deepinspector',
          label: 'Prediction Models'
        },
        {
          key: 'anomalymodel',
          value: 'anomalymodel',
          label: 'Anomaly Models'
        },
        {
          key: 'blacklisting',
          value: 'blacklisting',
          label: 'Blacklisting'
        },
        {
          key: 'virtualpatching',
          value: 'virtualpatching',
          label: 'Virtual patching'
        },
        {
          key: 'malwarebehavior',
          value: 'malwarebehavior',
          label: 'Malware Behavior'
        }
      ]
    }
  },
  async mounted() {
    await this.getList()
  },
  methods: {
    resetFiles() {
      this.selectedFiles = [];
      this.$refs.ruleUpload.clearFiles();
    },    
    getList() {
      rf.getRequest('RulePackageRequest').getList(this.params)
      .then(async response => {
        let list = response.filter(item => {
          if (!this.application) return true;
          return item.application === this.application;
        });
        this.list = list;
        this.total = list.length;
      })
      .catch(error => {
        this.errors.add({field: 'error', msg: error.response.data.message});
        Message.error(this.$t(this.errors.first('error')) || this.$t('auth.unknowError'))
      })
      .finally(() => this.listLoading = false)
    },
    handleRefreshTable() {
      this.listLoading = true
      this.params.page = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
        this.sortBy(prop, order)
    },
    getSortClass: function() {
      const order = this.params.order
      return order === `asc`
      ? 'ascending'
      : order === `desc`
      ? 'descending'
      : ''
    },
    sortBy(col, order) {
      this.params.sort = col
      if (order === 'ascending') {
        this.params.order = 'asc'
      } else {
        this.params.order = 'desc'
      }
      this.handleFilter()
    },
    handleFilter() {
      this.params.page = 1
      this.getList()
    },
    handleError(error) {
      this.convertRemoteErrors(error);
      if (this.errors.has('error')) {
        this.errors.add({field: 'error', msg: error.response.data.message});
        Message.error(this.$t(this.errors.first('error')) || this.$t('auth.unknowError'))
      }
    },
    handleCreateSingle() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.temp.version = Date.now();
      this.$nextTick(() => {
        this.$refs['dataFormSingle'].clearValidate()
      })
    },
    onUploadFileChanged: function(file, fileList) {
      console.log(file);
      this.selectedFiles = fileList;
    },
    onUploadFileRemoved: function(file, fileList) {
      this.selectedFiles = fileList;
    },
    async createData() {
      console.log(this.selectedFiles)
      this.resetError();
      if (this.isSubmitting) {
        return;
      }      
      if (!this.application || !this.application.length)
        await this.$validator.validate('application');
      await this.$validator.validate('version');
      if (this.errors.any() || !this.selectedFiles || !this.selectedFiles.length) {
        return;
      }
      let file = null;
      if (this.application === 'idssystem') {
        const zipper = new JSZip()
        for (let f of this.selectedFiles) {
          zipper.file(f.name, f.raw);
        }
        let zip = await zipper.generateAsync({type:"blob", compression:"DEFLATE"});
        file = new File([zip], "name.zip");
      }
      else {
        console.log(this.selectedFiles);
        file = this.selectedFiles[0].raw;
      }

      let formData = new FormData();
      formData.append('datafile', file);
      formData.append('application', this.application || this.temp.application);
      formData.append('version', this.temp.version);
      formData.append('fileExt', this.fileExt)
      rf.getRequest('RulePackageRequest').create(formData).then(() => {
        this.dialogFormVisible = false
        this.$notify({
          title: this.$t('notify.success.label'),
          message: this.$t('notify.success.createSuccess'),
          type: 'success',
          duration: 1000,
          showClose: false
        })
        this.handleRefreshTable()
      }).catch(error => {
        this.handleError(error)
      });
    },
    resetTemp() {
      this.temp = {
        name: '',
        description: ''
      }
    },
    handleUpdate(row) {
      row = {
        ...row
      }
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    handleDelete(row) {
      this.$confirm(this.$t('notify.text.delete'), 'Warning', {
        confirmButtonText: this.$t('action.ok'),
        cancelButtonText: this.$t('action.cancel'),
        type: 'warning',
        center: true
      }).then(() => {
        rf.getRequest('RulePackageRequest').delete(row.idRulepackage)
          .then(() => {
            this.$message({
              type: 'success',
              message: this.$t('notify.success.deleteSuccess')
            })
            this.handleRefreshTable()
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('notify.info.cancel'),
        });
      });
    },
    getAccept(application) {
      switch(application) {
        case 'idssystem':
          return ".rules,.zip"
        case 'deepinspector':
        case 'modsec':
          return ".zip";
        case 'anomalymodel':
        case 'blacklisting':
        case 'virtualpatching':
        case 'malwarebehavior':
          return '.sql';
      }
      return "";
    }
  },
}
export default component;
</script>

<style lang="scss" scoped>
  .my-el-upload .el-upload {
    width: 100%;
  }
  .my-el-upload .el-upload-dragger {
    width: 100%;
  }
  .hide-my-el-upload .el-upload {
    display: none;
  }
  .hide-my-el-upload .el-upload-list {
    height: 150px;
    overflow-y: scroll;
  }
</style>
