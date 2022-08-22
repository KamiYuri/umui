<template>
  <div class="app-container settings-management">
    <div style="text-align: right" class="filter-container">
      <el-button class="filter-item" type="primary" @click="reload">
        Reload
      </el-button>
    </div>
    <el-collapse accordion>
      <el-collapse-item v-for="(s, idx) in sections" :key="'section-'+idx" :title="s.name" >
        <el-form :inline="true" label-width="180px" v-for="p in s.params" :key="p.idSetting">
          <el-form-item :label="p.param">
            <el-input style="width: 35em;" v-model="p.value"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :disabled="!isModified(p)" @click="update(p)">Apply</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="reset(p)">Reset</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import rf from 'requestfactory';
export default {
  name: 'Settings',
  data() {
    return {
      sections: [{
        name: "General",
        params: [{
          param: "Name",
          value: "Tit Hoang",
        }, {
          param: "Age",
          value: "3"
        }]
      },{
        name: "Systems",
        params: [{
          param: "WiFI",
          value: "Tit Hoang",
        }, {
          param: "Channel",
          value: "3"
        }]
      }],
      settins: null
    }
  },
  mounted() {
    this.reload();
  },
  methods: {
    reload() {
      rf.getRequest('IPSSettingRequest').getParams().then(response => {
        console.log(response);
        this.settings = response;
        this.sections = this.buildSections(response);
      })
    },
    buildSections(settings) {
      let sectionArray = []
      let sections = {};
      for (let s of settings) {
        let section = sections[s.category];
        if (!section) {
          section = [];
          sections[s.category] = section;
        }
        section.push({...s});
      }
      for (let s of Object.keys(sections)) {
        sectionArray.push({
          name: s,
          params: sections[s]
        });
      }
      return sectionArray;
    },
    isModified(param) {
      console.log("params:", param);
      if (!param || !param.idSetting) return false;
      let save = this.settings.find(item => item.idSetting === param.idSetting);
      return param.value !== save.value;
    },
    reset(param) {
      let save = this.settings.find(item => item.idSetting === param.idSetting);
      console.log(save, param);
      param.value = save.value;
    },
    update(param) {
      rf.getRequest('IPSSettingRequest').update(param.idSetting, param.value).then(() => {
        let save = this.settings.find(item => item.idSetting === param.idSetting);
        save.value = param.value;
        this.sections = this.buildSections(this.settings);
      });
    }
  }
}
</script>

