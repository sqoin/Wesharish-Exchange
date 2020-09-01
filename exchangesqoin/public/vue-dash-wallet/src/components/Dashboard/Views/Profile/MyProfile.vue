<template>
  <div class="myprofile">
    <div class="row d-flex justify-content-center">
      <div class="col-sm-12 mr-auto ml-auto">
        <div class="card card-user">
          <!-- <router-link to="./register" style="text-align:center;">
            <el-button class="submit-btn" icon="el-icon-s-shop">Become a Merchant</el-button>
          </router-link>-->
          <div class="image"></div>
          <div class="card-body">
            <div class="author">
              <img class="avatar border-gray" src="static/img/user-logo.png" alt="...">
              <h5 class="title">{{user.first_name}}&nbsp;{{user.last_name}}</h5>
              <p class="description">@{{user.user_name}}</p>
            </div>
            <p class="description text-center">"Bio.."</p>
          </div>

          <div id="walletContent">
            <h3>Public Key:</h3>
            <p>{{this.wallet.publickey}}</p>
            <h3>Balance:</h3>
            <p>{{this.wallet.balance}}</p>
          </div>

          <div class="card-footer">
            <div class="button-container"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import QrcodeVue from "qrcode.vue";
export default {
  components: {
    QrcodeVue
  },
  data() {
    return {
      size: 100,
      user: "",
      wallet: [],
      loading: true,
      search: "",
      usreId: ""
    };
  },
  methods: {
    balanceFormat: function(row, column, cellValue, index) {
      if (column.property === "balance") {
        var bal = row[column.property];
        return Math.round(bal * 100) / 100;
      }
    }
  },
  mounted: function() {
    // console.log("current =="+this.$currentUser);
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
      // axios
      //   .get(this.$myUrl + "/api/getUserById?id=" + this.$currentUser, {
      //     timeout: 300000
      //   })
      //   .then(response => (this.user = response.data));
      // axios
      //   .get(this.$myUrl + "/api/listAllBalance?userId=" + this.$currentUser, {
      //     timeout: 300000
      //   })
      //   .then(
      //     response => ((this.wallet = response.data), (this.loading = false))
      //   );
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
                console.log(this.wallet)
              )
            );
        });
    }
  }
};
</script>
<style scoped>
.submit-btn {
  border: 1px solid #b4bbbe;
}
.submit-btn:hover {
  background-color: transparent;
  color: #b4bbbe;
}
#walletContent {
  text-align: center;
  width: 100%;
  max-width: 400px;
  margin: auto;
  background: #f4f5e7;
  border-radius: 5px;
  padding-top: 30px;
  padding-bottom: 30px;
}
#walletContent h3 {
  font-size: 17px;
  color: #9a9a9a;
  margin: 5px;
  font-weight: 600;
}
#walletContent p {
  color: orange;
  font-size: 14px;
}
#walletContent p:last-of-type {
  margin: 0;
}
</style>