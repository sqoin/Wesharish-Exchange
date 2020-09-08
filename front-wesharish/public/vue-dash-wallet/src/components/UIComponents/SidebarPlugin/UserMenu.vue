<template>
  <div class="user">
    <div class="photo">
      <img src="static/img/user-logo.png" alt="user avatar" />
    </div>
    <div class="info">
      <a data-toggle="collapse" :aria-expanded="!isClosed" @click="toggleMenu" href="#">
        <span>
          {{user.first_name}}&nbsp;{{user.last_name}}
          <b class="caret"></b>
        </span>
      </a>
      <div class="clearfix"></div>
      <div>
        <collapse-transition>
          <ul class="nav nav-menu" v-show="!isClosed">
            <li>
              <router-link to="/myprofile">
                <span class="sidebar-mini-icon">Mp</span>
                <span class="sidebar-normal">My Profile</span>
              </router-link>
            </li>
            <!--<li>
              <router-link to="/editmyprofile">
                <span class="sidebar-mini-icon">Ep</span>
                <span class="sidebar-normal">Edit Profile</span>
              </router-link>
            </li>
            <li>
              <router-link to="/myprofilesettings">
                <span class="sidebar-mini-icon">S</span>
                <span class="sidebar-normal">Settings</span>
              </router-link>
            </li>-->
          </ul>
        </collapse-transition>
      </div>
    </div>
  </div>
</template>
<script>
import { CollapseTransition } from "vue2-transitions";

export default {
  components: {
    CollapseTransition
  },
  data() {
    return {
      isClosed: true,
      user: ""
    };
  },
  methods: {
    toggleMenu() {
      this.isClosed = !this.isClosed;
    }
  },
  mounted: function() {
     axios
      .get(this.$myUrl + "/userWallet/api/users/current")
      .then(response =>(
          (this.$currentUser = response.data.id),
          axios
              .get(this.$myUrl + "/api/getUserById?id=" + this.$currentUser,{ timeout: 100000 })
              .then(response => (this.user = response.data))
      ));
  }
};
</script>
<style scoped>
.nav.nav-menu {
  margin-top: 0;
}
</style>
