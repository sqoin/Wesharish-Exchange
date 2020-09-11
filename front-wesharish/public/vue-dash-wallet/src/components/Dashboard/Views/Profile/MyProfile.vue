<template>
<div class="myprofile">
 <div class="card card-user " style="text-align:center;" >
                <p style=" margin-top: 20px;"><img class="avatar border-gray" src="static/img/user-logo.png" alt="..."></p> 
                <div class="card-body">
                  <h5 class="card-title">
                    <h5 class="title" >{{user.first_name}}&nbsp;{{user.last_name}}</h5>
                    <p class="card-text description" style="font-size:18px;" >{{user.email}}</p>
                  </h5>
                  <table>
                    <tr>
                      <th>First Name</th>
                      <td>{{user.first_name}}</td>
                    </tr>
                     <tr>
                      <th>Last Name</th>
                      <td>{{user.last_name}}</td>
                      
                    </tr>
                       <tr>
                      <th>Public Key</th>
                      <td>{{this.wallet.publickey}}</td>
                      
                    </tr>
                       <tr>
                      <th>Balance </th>
                      <td>{{this.wallet.balance}}</td>
                      
                    </tr>
                  </table>

            </div> 
        </div>
  </div>
   <!--<div class="myprofile">
      <div class="row d-flex justify-content-center">
        <div class="col-sm-12 mr-auto ml-auto">
          <div class="card card-user">-->
            <!--/////////////////////-->
            <!-- <router-link to="./register" style="text-align:center;">
              <el-button class="submit-btn" icon="el-icon-s-shop">Become a Merchant</el-button>
            </router-link>-->
            <!--/////////////////////-->
            
           <!-- <div class="image"></div>
            <div class="card-body">
              <div class="author">
                <img class="avatar border-gray" src="static/img/user-logo.png" alt="...">
                <h5 class="title" >{{user.first_name}}&nbsp;{{user.last_name}}</h5>-->
               <!-- <p class="description">@{{user.user_name}}</p>-->
             <!-- </div>-->
             <!-- <p class="description text-center">"Bio.."</p>-->
    
              <!-- <div id="walletContent">
                 <h3>Public Key:</h3>
                  <p>{{this.wallet.publickey}}</p>
                  <h3>Balance:</h3>
                  <p>{{this.wallet.balance}}</p>
                </div>
            </div>
            <div class="card-footer">
              <div class="button-container"></div>
            </div>
          </div>
        </div>
      </div>
  </div>-->
  
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
      usreId: "",
    };
  },
  methods: {
    balanceFormat: function(row, column, cellValue, index) {
      if (column.property === "balance") {
        var bal = row[column.property];
        return Math.round(bal * 100) / 100;
      }
    },
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
                console.log(JSON.stringify(this.wallet))
              )
            );
        });
    }
  }
};
</script>

<style scoped>

/*.submit-btn {
  border: 1px solid #b4bbbe;
}
.submit-btn:hover {
  background-color: transparent;
  color: #b4bbbe;
}*/

.myprofile{
  background-color: #007bff;
  padding: 20px 0 20px 0;
}
.card{
  margin: auto;
  width: 70%;
  background-color: #F0EEEE;
}
table{
  margin-top: 20px;
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}
th{
  font-style: italic;
}
td{
  font-weight: lighter;
}
td, th {
  border: 1px solid #dddddd;
  text-align: center;
  padding: 8px;
  font-size: 17px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}
td:hover{
  font-size: 18px;
  color: orangered;
  font-weight: bold;
}
#walletContent {
  text-align: center;
  padding-top:20px;
  padding-bottom: 30px;
  margin: auto;
  /*width: 100%;
  max-width: 400px;
  background: #f4f5e7;
  border-radius: 5px;
 */
}
#walletContent h3 {
  color: #9a9a9a;
  margin: 5px;
  font-weight: 600;
}
#walletContent p:hover {
  color: #fd7e14;
  font-size: 18px;
}
#walletContent p:last-of-type {
  margin: 0;
}
</style>