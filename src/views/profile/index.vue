<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="10">

        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane :label="$t('user.changePassword')" name="policy">
                <policy />
              </el-tab-pane>
              <el-tab-pane :label="$t('user.information')" name="account">
                <account :user="user" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Policy from './components/Policy'
import Account from './components/Account'
export default {
  name: 'Profile',
  components: { UserCard, Policy, Account },
  data() {
    return {
      activeTab: 'account'
    }
  },
  computed: {
    ...mapGetters([
      'user',
    ])
  },
  created() {
  },
  methods: {
  }
}
</script>
