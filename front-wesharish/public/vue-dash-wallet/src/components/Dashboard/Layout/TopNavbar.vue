<template>
  <navbar v-model="showNavbar" id="navbarAm">
    <div class="navbar-wrapper">
      <div class="navbar-minimize">
        <button id="minimizeSidebar" class="btn btn-icon btn-round" @click="minimizeSidebar">
          <i class="nc-icon nc-minimal-right text-center visible-on-sidebar-mini"></i>
          <i class="nc-icon nc-minimal-left text-center visible-on-sidebar-regular"></i>
        </button>
      </div>
      <div class="navbar-toggle">
        <navbar-toggle-button @click.native="toggleSidebar"></navbar-toggle-button>
      </div>
     <!-- <a class="navbar-brand">Wallet Pro</a>
      <el-link :underline="false">
        Standard Account
        <i class="el-icon-star-off"></i>
      </el-link>-->
    </div>
    <template slot="navbar-menu">
      <ul class="navbar-nav">
        <!--<drop-down tag="li" position="right" direction="none" class="nav-item btn-rotate dropdown">
          <a
            slot="title"
            slot-scope="{isOpen}"
            class="nav-link dropdown-toggle"
            data-toggle="dropdown"
            aria-haspopup="true"
            :aria-expanded="isOpen"
          >
            <img :src="flagImg">
          </a>
          <a @click="flagImg='static/img/flags/GB.png'" class="dropdown-item">
            <img src="static/img/flags/GB.png">&nbsp;English
          </a>
          <a @click="flagImg='static/img/flags/FR.png'" class="dropdown-item">
            <img src="static/img/flags/FR.png">&nbsp;Français
          </a>
          <a @click="flagImg='static/img/flags/SA.png'" class="dropdown-item">
            <img src="static/img/flags/SA.png">&nbsp;عربي
          </a>
        </drop-down>
        -->

        <!--<drop-down
          icon="nc-icon nc-bell-55"
          tag="li"
          position="right"
          direction="none"
          class="nav-item btn-rotate dropdown"
        >
          <a
            slot="title"
            slot-scope="{isOpen}"
            class="nav-link dropdown-toggle"
            data-toggle="dropdown"
            aria-haspopup="true"
            :aria-expanded="isOpen"
          >
            <el-badge :value="5" class="item">
              <i class="nc-icon nc-bell-55"></i>
            </el-badge>
          </a>

          <div v-for="(transaction,index) in transactionList" :key="index"> 
            <a
              class="dropdown-item"
              href="#"
            >{{transaction.userfromname}} {{transaction.usertoname}} {{transaction.amount}} {{transaction.state}}</a>
          </div>
        </drop-down>-->
        <div id="walletContent">
          <div
          ><img :src="'static/img/coin.jpg'" width="20px" height="20px">
          <p>{{this.wallet.balance}} </p>
          </div> 
        
        </div>
                
        <drop-down
          icon="nc-icon nc-single-02"
          tag="li"
          position="right"
          direction="none"
          class="nav-item btn-rotate dropdown"
        >
          <a
            slot="title"
            slot-scope="{isOpen}"
            class="nav-link dropdown-toggle"
            data-toggle="dropdown"
            aria-haspopup="true"
            :aria-expanded="isOpen"
          >
            <i class="nc-icon nc-single-02"></i>
          </a>

          <el-button class="dropdown-item" @click="removeToken">Sign Out</el-button>
        </drop-down>
      </ul>
    </template>
  </navbar>
</template>
<script>
import { Navbar, NavbarToggleButton } from "src/components/UIComponents";
export default {
  props:['wallet'],
  components: {
    Navbar,
    NavbarToggleButton
  },
  data() {
    return {
      flagImg: "static/img/flags/GB.png",
      activeNotifications: false,
      showNavbar: false,
      list: [],
      disabled: [],
      transactionList: [],
    };
  },
  methods: {
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    toggleNotificationDropDown() {
      this.activeNotifications = !this.activeNotifications;
    },
    closeDropDown() {
      this.activeNotifications = false;
    },
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    hideSidebar() {
      this.$sidebar.displaySidebar(false);
    },
    minimizeSidebar() {
      this.$sidebar.toggleMinimize();
    },
    toggleNavbar() {
      this.showNavbar = !this.showNavbar;
    },
    querySearch(queryString, cb) {
      var list = this.list;
      var results = queryString
        ? list.filter(this.createFilter(queryString))
        : list;
      cb(results);
    },

    removeToken() {
      localStorage.removeItem("token");
      // window.location.href="https://sqoin.exchange/account/logout" ;
    },
  },
  mounted() {
    var self = this;
    if (window.location.href.indexOf("successUrl") > -1) {
      document.getElementById("navbarAm").style.display = "none";
    }
    axios.get(this.$myUrl + "/api/getlistTransactions").then(response => {
      var json = response.data;
      var limit = 0;
      self.transactionList = response.data.slice(0, 5);
    });
  
  if (this.$currentUser === undefined) {
      axios
        .get(this.$myUrl + "/userWallet/api/users/current")
        .then(
          response => (
            (this.$currentUser = response.data.id),
            axios
              .get(
                this.$myUrl +
                  "/api/getPublicAddressByUserId?coin=BASTOJI&userId=" +
                  this.$currentUser,
                { timeout: 300000 }
              )
              .then(res =>
                axios
                  .get(
                    this.$myUrl +
                      "/api/getBalance?coin=BASTOJI&publickey=" +
                      res.publickey,
                    { timeout: 300000 }
                  )
                  .then(
                    response => (
                      (this.wallet = response.data), (this.loading = false)
                    )
                  )
              )
          )
        );
    } else {
      axios
        .get(this.$myUrl + "/api/getUserById?id=" + this.$currentUser, {
          timeout: 300000
        })
        .then(response => (this.user = response.data));
      axios
        .get(
          this.$myUrl +
            "/api/getPublicAddressByUserId?coin=BASTOJI&userId=" +
            this.$currentUser,
          { timeout: 300000 }
        )
        .then(res => {
          axios
            .get(
              this.$myUrl +
                "/api/getBalance?coin=BASTOJI&publickey=" +
                res.data.publickey,
              { timeout: 300000 }
            )
            .then(
              response => (
                (this.wallet = response.data),
                (this.loading = false),
                console.log(JSON.stringify(this.wallet)+"ddfsdfdfdsf")
              )
            );
        });
    }
  }
};
</script>
<style scoped>
#navbarAm #minimizeSidebar {
  background: #197cc5;
}
#navbarAm .navbar-brand,
#navbarAm a.el-link.el-link--default {
  color: #197cc5;
  font-weight: 600;
}
#navbarAm a.el-link.el-link--default {
  margin-top: 3px;
}
 li:hover > a,
 li:hover > a .nc-icon {
  color: #fbc658 !important;
}

/*TODAY*/
#walletContent {
  text-align: center;
  margin-top: 9px;
}
#walletContent div:hover {
	-webkit-transform: scale(1.3);
	transform: scale(1.3); 
}
#walletContent p {
  color: orange;
  font-size: 14px;
}
/*#walletContent p:last-of-type {
  margin: 0;
}*/
</style>
