<template>
  <div class="wrapper">
    <side-bar type="sidebar" :sidebar-links="$sidebar.sidebarLinks">
      <user-menu></user-menu>
    </side-bar>

    <div class="main-panel" id="mainAm">
      <top-navbar></top-navbar>

      <dashboard-content @click.native="toggleSidebar"></dashboard-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>
<style lang="scss">
</style>
<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import UserMenu from "src/components/UIComponents/SidebarPlugin/UserMenu.vue";

export default {
  components: {
    TopNavbar,
    ContentFooter,
    DashboardContent,
    UserMenu
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    }
  },
  mounted() {
    if (window.location.href.indexOf("successUrl") > -1) {
      document.getElementById("mainAm").style.width = "100%";
    }
  }
};
</script>
<style scoped>
#mainAm {
  background: #f2f9ff96;
}
</style>
