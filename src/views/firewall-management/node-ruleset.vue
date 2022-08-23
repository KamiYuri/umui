<template>
  <div class="app-container">
    <div class="filter-container">
      <h3 style="float:left">Rule packages ({{(ipsNode || {}).name}})</h3>
      <el-button style="float: right; margin-left: 10px;" class="filter-item float-right" icon="el-icon-plus" @click="exportCSV($refs.elTable, 'node-rulesets')">
        {{ $t('table.export-csv') }}
      </el-button>
      <el-button style="float: right;" class="filter-item float-right" icon="el-icon-plus" @click="exportXLS($refs.elTable, 'node-rulesets')">
        {{ $t('table.export-xls') }}
      </el-button>
      <div style="clear: both"></div>
    </div>
    <el-table fit stripe
      :data="appVersions" ref='elTable'>
      <el-table-column :label="$t('table.application')" prop="application" sortable align="center" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.application }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.currentVersion')" sortable prop="currentVersion" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.appliedMaxVersion || 'N/A'}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.availableVersion')" prop="availableVersion" sortable align="center" width="240px">
        <template slot-scope="scope">
          <span>{{ scope.row.version || 'N/A'}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.status')" prop="status" sortable align="center" width="240px">
        <template slot-scope="scope">
          <span v-if="scope.row.errored" 
            class="el-button el-button--mini el-button--danger is-plain">Error</span>
          <span v-if="scope.row.synced && scope.row.appliedMaxVersion === scope.row.version"
            class="el-button el-button--mini el-button--success is-plain">Up-to-date</span>
          <span v-if="!scope.row.synced && !scope.row.errored && scope.row.appliedMaxVersion === scope.row.version && scope.row.version"
            class="el-button el-button--mini el-button--warning is-plain">Pending</span>
          <span v-if="scope.row.synced && scope.row.appliedMaxVersion < scope.row.version"
            class="el-button el-button--mini el-button--warning is-plain">Outdated</span>
          <span v-if="!scope.row.appliedMaxVersion && scope.row.version"
            class="el-button el-button--mini el-button--info is-plain">Unknown</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')"  width="240px">
        <template slot-scope="scope">
          <el-button v-if="(scope.row.version||0) > (scope.row.appliedMaxVersion||0)"
            size="mini" 
            type="primary" @click="doUpdate(scope.row)" :title="$t('table.update')">
              {{$t('table.update')}}
          </el-button>
          <el-button v-if="scope.row.errored"
            size="mini" 
            type="primary" @click="doClearError(scope.row)" :title="$t('table.clearError')">
              {{$t('table.clearError')}}
          </el-button>
          <el-button v-if="scope.row.synced && scope.row.appliedMaxVersion === scope.row.version"
            size="mini"
            type="primary" @click="doClearError(scope.row)" :title="$t('table.resetVersion')">
              {{$t('table.resetVersion')}}
          </el-button>
          <span ></span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import rf from 'requestfactory'
import { Message } from 'element-ui'
import Exporter from 'common/Exporter'
export default {
  name: 'NodeRuleset',
  props: ['idObject'],
  mixins: [ Exporter ],
  data: function() {
    return {
      rulePackages: [],
      appVersions: [],
      ipsNode: null
    }
  },
  created: function() {
    console.log(this.$route.params.idObject);
  },
  mounted: async function() {
    this.doInit();
  },
  methods: {
    async doInit() {
      await this.getObject();
      await this.getRulePackages();
      await this.queryHost()
    },
    queryHost() {
      return rf.getRequest('ContainmentRelRequest').queryHost(this.idObject)
      .then((res) => {
        console.log(res);
        this.appVersions = res.data;
      }).catch(error => {
        console.error(error)
        this.errors.add({field: 'error', msg: error.response.data.message});
        Message.error(this.$t(this.errors.first('error')) || this.$t('auth.unknowError'))
      });
    },
    getRulePackages() {
      return rf.getRequest('RulePackageRequest').getList().then(response => {
        this.rulePackages = response;
      }).catch(error => {
        console.error(error)
        this.errors.add({field: 'error', msg: error.response.data.message});
        Message.error(this.$t(this.errors.first('error')) || this.$t('auth.unknowError'))
      });
    },
    getObject() {
      return rf.getRequest('ContainmentRelRequest').nodeDetails(this.idObject).then(response => {
        this.ipsNode = response;
      }).catch(error => {
        console.error(error)
        this.errors.add({field: 'error', msg: error.response.data.message});
        Message.error(this.$t(this.errors.first('error')) || this.$t('auth.unknowError'))
      });
    },    
    doAdd() {
      console.log('Add a new');
    },
    doUpdate(rulePackageObj) {
      console.log(rulePackageObj);
      rf.getRequest('RulePackageObjectRelRequest').create({
        idObject: this.idObject, 
        idRulepackage:rulePackageObj.idRulepackage
      }).then(res => {
        console.log(res);
        this.doInit();
      }).catch(error => {
        console.error(error)
        this.errors.add({field: 'error', msg: error.response.data.message});
        Message.error(this.$t(this.errors.first('error')) || this.$t('auth.unknowError'))
      });
    },
    doClearError(rulePackageObj) {
      console.log(rulePackageObj);
      rf.getRequest('RulePackageObjectRelRequest').delete(rulePackageObj.idRulepackageobjectrel).then(res => {
        console.log(res);
        this.doInit();
      }).catch(error => {
        console.error(error)
        this.errors.add({field: 'error', msg: error.response.data.message});
        Message.error(this.$t(this.errors.first('error')) || this.$t('auth.unknowError'))
      });
    }
  }
}
</script>
<style lang='css' scoped>
</style>
