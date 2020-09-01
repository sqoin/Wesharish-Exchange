<template>
  <div class="checkoutpage">
    <div class="row d-flex justify-content-center">
      <div class="col-sm-8 mr-auto ml-auto">
        <card card-body-classes="text-center" style="margin-top:10%;">
          <h5 slot="header" class="card-title text-center">
            Checkout with sQoin Exchange
            <img
              src="/img/icons/sqoin-exchange-72x72.png"
              style="float:right;"
            />
          </h5>
          <el-container>
            <el-aside width="400px">
              <card card-body-classes="text-center" type="plain" class="tableFed">
                <h6 class="card-subtitle mb-2 text-muted">Your Order Summary</h6>
                <hr />
                <el-table style="width: 100%" :data="table" show-summary sum-text="Total">
                  <el-table-column label="Descriptions" prop="description"></el-table-column>
                  <el-table-column label="Amount" prop="amount"></el-table-column>
                  <el-table-column label="Currency" prop="currency"></el-table-column>
                  <el-table-column label="quantity" prop="quantity"></el-table-column>
                </el-table>
                <div class="card-footer"></div>
              </card>
            </el-aside>
            <el-container>
              <!-- <el-header></el-header> -->
              <el-main>
                <card type="plain">
                  <h6 class="card-subtitle mb-2 text-muted">Review Your Information</h6>
                  <hr />
                  <div class="row">
                    <p style="float:left;">
                      shipping address&nbsp;&nbsp;
                     <!-- <i class="el-icon-edit"></i>
                      <el-link type="info">
                        <small>change</small>
                      </el-link>-->
                    </p>
                     <el-input
                        name="address"
                        id="address"
                        style="color:black;"
                        :disabled="true"
                      ></el-input> 
                  </div>
                
                  <hr />
                  <div class="row">
                    <p style="float:left;">Contact Information</p>
                    <el-input
                        name="contact"
                        id="contact"
                        :disabled="true"
                      ></el-input> 
                    
                  </div>
                  <hr />
                
                 
                  <el-button plain type="warning" @click="wallet">Pay With sQoin Wallet</el-button>
                   <el-button plain type="warning"  @click="crypto">&nbsp;Crypto</el-button>
                  
                  <!--<router-link to="./checkout/crypto" style="text-decoration:none;">
                    <el-button
                      plain
                      type="primary"
                      icon="fa fa-bitcoin"
                      @click="crypto"
                    >&nbsp;Crypto</el-button>
                  </router-link>-->
                </card>
              </el-main>
              <!-- <el-footer></el-footer> -->
            </el-container>
          </el-container>
        </card>
      </div>
    </div>
  </div>
</template>
<script>
import QrcodeVue from "qrcode.vue";
import swal from "sweetalert2";
export default {
  components: {
    QrcodeVue
  },
  data() {
    return {
      table: [],

      description:"",
      amount:"",
      currency:"",
      shippingAddress:"",
      contactInformations:"",
      
    };
  },
  methods: {
    crypto() {

      swal.fire({
                  type: "error",
                  title: "Sorry..",
                  text: "This feature is not yet available !!",
                  focusConfirm: false,
                  allowOutsideClick: false
                });
    },

    getParamsValuefromUrl(param){

      let url = (decodeURIComponent(window.location.href));

      let newUrl = url.replace(/#/g,'');
      let params = new URL(newUrl).searchParams;
      return params.get(param);


    },


    
      wallet(){

      if (window.location.href.indexOf("product") > -1){
        //location.href = 'https://sqoin.exchange/walletd/#/send?successUrl='+this.$route.query.successUrl+'&amount='+this.$route.query.amount+'&product='+this.$route.query.product+'&quantity='+this.$route.query.quantity

      }
      else if (window.location.href.indexOf("project") > -1){
        //location.href = 'https://sqoin.exchange/walletd/#/send?successUrl='+this.$route.query.successUrl+'&amount='+this.getParamsValuefromUrl('amount')+'&project='+this.getParamsValuefromUrl('project')

      }
        

    },

    getQueryVariable(variable)
    {
      var query = window.location.search.substring(1);

      var vars = query.split("&");

      for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");

        if(pair[0] == variable){return pair[1];}
      }
      return(false);
    },

    completeUserInformation(){
       document.getElementById("address").value = this.shippingAddress;
        document.getElementById("contact").value = this.contactInformations;

        console.log(this.shippingAddress + " 000000")
    }

    
  },
    mounted() {

    var self = this;
    axios
      .get(this.$myUrl + "/userWallet/api/users/current")
      .then(
      response => 
      {
       this.$currentUser = response.data.id;
      console.log("this.$currentUser == "+this.$currentUser);
      if(this.$currentUser == undefined || this.$currentUser== null){


        if (window.location.href.indexOf("product") > -1){

          window.location.href =('/account/sign-in?redirect='+
            encodeURIComponent('/walletd/#/checkout?successUrl=http://demo.sqoin.exchange/&amount='+this.$route.query.amount+'&product='+this.$route.query.product+'&quantity='+this.$route.query.quantity+'&IPNHandler=https://sqoin.exchange/api/handleTransaction'));

        }
        else if (window.location.href.indexOf("project") > -1){


          window.location.href =('/account/sign-in?redirect='+
            encodeURIComponent('/walletd/#/checkout?successUrl='+this.$route.query.successUrl+'&amount='+this.getParamsValuefromUrl('amount')+'&project='+this.getParamsValuefromUrl('project')+'&IPNHandler=https://sqoin.exchange/api/handleTransaction'));

        }


   }else{


    axios
      .get(this.$myUrl +"/api/getUserById?id=" + this.$currentUser)
      .then(response => {
        this.user = response.data;
        this.shippingAddress = this.user.address;
        this.contactInformations= this.user.email; 
      });


     if (window.location.href.indexOf("product") > -1) {

       axios.get(this.$myUrl + "/api/getProductById?id=" + this.$route.query.product).then(response => {
         var json = response.data;
         var productDescription = response.data[0].name;
         var productAmount = response.data[0].price + " $";
         var productCurrency = response.data[0].currency;

         // var price = price+" $";
         json.map(el => {
           console.log("price 1=" + productAmount);
           self.table.push({
             description: productDescription,
             //amount: productAmount,
             amount: el.price,
             currency: productCurrency,
             quantity: this.$route.query.quantity
           });
           console.log("price 2=" + productAmount);
         });


       });

     }

     else if (window.location.href.indexOf("project") > -1) {




       axios.get(this.$myUrl + "/api/getProjectById?id=" + this.getParamsValuefromUrl('project')).then(response => {
         var json = response.data;
         var projectDescription = response.data[0].name;
         var projectAmount = response.data[0].amount + " $";
         var projectCurrency = response.data[0].currency;

         // var price = price+" $";
         json.map(el => {
           console.log("price 1=" + projectAmount);
           self.table.push({
             description: projectDescription,
             //amount: productAmount,
             amount: el.amount,
             currency: projectCurrency,

           });

         });


       });

     }
   

    
     setTimeout(this.completeUserInformation, 700)
      }
      })
  
      
       
    
    }
};
</script>
<style scoped>
.body {
  background-color: #f4f3ef;
}
.tableFed .el-table .cell, .el-table th div, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell {
    padding-left: unset !important;
}
.tableFed .el-table .cell, .el-table th div {
    padding-right: unset !important;
}
</style>
