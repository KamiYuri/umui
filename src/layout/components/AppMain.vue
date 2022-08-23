<template>
  <section class="app-main" id="content-body">
    <transition name="fade-transform" mode="out-in">
      <div>
        <keep-alive :include="cachedViews">
          <router-view :key="key" />
        </keep-alive>
        <!-- <Monitoring v-show="checkShow(1)" />
        <Statistics v-show="checkShow(2)" />         -->
      </div>
    </transition>
  </section>
</template>

<script>
// import Monitoring from "../../views/intrusion/monitoring";
// import Statistics from "../../views/intrusion/statistics";

export default {
  name: "AppMain",
  // components: {
  //   Monitoring,
  //   Statistics
  // },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews;
    },
    key() {
      return this.$route.path;
    },
  },
  // methods: {
  //   checkShow(type) {
  //     switch (type) {
  //       case 1:
  //         return this.$route.path === "/intrusion/monitoring";
  //       case 2:
  //         return this.$route.path === "/intrusion/statistics";
  //       default:
  //         return true;
  //     }
  //   },
  // },
};
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
