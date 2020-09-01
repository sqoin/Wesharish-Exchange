<template>
  <div
    :class="{'nav-open': $sidebar.showSidebar}"
    @mouseleave="startTimer()"
    @mouseenter="resetTimer()"
  >
    <router-view name="header"></router-view>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
    <router-view name="footer"></router-view>
  <!--  <el-drawer :visible.sync="drawer" :direction="direction" :before-close="handleClose" size="18%">
      <div style="float:right;margin-right:10%;" size="mini">
        <el-button size="mini" type="info" @click="drawer=false">Accept</el-button>
        <el-button size="mini" @click="drawer=false">Decline</el-button>
      </div>
      <p class="text-muted" style="margin-left:10%;margin-right:10%;color:white !important;">
        This site uses cookies to store information on your computer. See our
        <a
          href="#"
        >cookie policy</a> for further details on how to block cookies.
      </p>
    </el-drawer>-->
  </div>
</template>

<script>
// Loading some plugin css asynchronously
import "sweetalert2/dist/sweetalert2.css";
import swal from "sweetalert2";
export default {
  data() {
    return {
      timer: 600000,
      locker: "",
      drawer: true,
      direction: "btt"
    };
  },
  methods: {
    lock() {
      window.location.href = "/#/lock";
    },
    startTimer() {
      this.locker = setInterval(() => this.lock(), this.timer);
    },
    resetTimer() {
      clearInterval(this.locker);
    },
    handleClose(done) {
      done();
    }
  },
  mounted: function() {
    const Toast = swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000
    });

    Toast.fire({
      type: "success",
      title: "Signed in"
    });

  }


};
</script>


<style>
.el-drawer {
  background-color: #212120 !important;
}
</style>
