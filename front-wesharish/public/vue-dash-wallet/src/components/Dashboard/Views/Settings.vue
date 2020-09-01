<template>
  <div class="settings" id="personal_settings">
    <div class="row">
      <div class="col-md-8 ml-auto mr-auto">
        <card type="plain" class="card-subcategories">
          <template slot="header">
            <h4 class="card-title text-center">
              <i class="nc-icon nc-bag-16"></i> Wallet
            </h4>
          </template>
          <tabs pills type="primary" icons centered tab-content-classes="tab-space">
            <tab-pane id="settings" key="settings">
              <card card-body-classes="text-center">
                <button class="btn" id="createWallet" @click="submit();visible=false">+</button>

                <el-table
                  size="mini"
                  stripe
                  fit
                  v-loading="loadingWallets"
                  :data="wallets.filter(data => !search||data.coin.toLowerCase().includes(search.toLowerCase())||data.balance.toString().includes(search.toString())||data.publickey.toLowerCase().includes(search.toLowerCase()))"
                  :default-sort="{prop: 'coin', order: 'ascending'}"
                  style="width: 100%"
                >
                  <el-table-column label="Public Keys" property="publickey" sortable>
                    <template slot-scope="props">
                      {{props.row.publickey}}&nbsp;
                      <el-popover placement="top" width="150">
                        <qrcode-vue
                          style="text-align:center;"
                          :value="props.row.publickey"
                          :size="size"
                          level="H"
                        ></qrcode-vue>
                        <el-button
                          plain
                          size="mini"
                          type="default"
                          icon="fa fa-qrcode"
                          slot="reference"
                        >&nbsp;QR Code</el-button>
                      </el-popover>
                    </template>
                  </el-table-column>
                </el-table>
              </card>
            </tab-pane>
          </tabs>
        </card>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Collapse,
  CollapseItem,
  Tabs,
  TabPane,
  Modal
} from "src/components/UIComponents";
import swal from "sweetalert2";
import QrcodeVue from "qrcode.vue";
export default {
  name: "Settings",
  components: {
    TabPane,
    Tabs,
    CollapseItem,
    Collapse,
    Modal,
    QrcodeVue
  },

  data() {
    return {
      selectedCoin: "test",
      loadingWallets: true,
      size: 100,
      wallets: [],
      coins: [],
      pin: "",
      name: "",
      supply: "",
      coinNames: [],
      parents: [],
      parent: "",
      search: "",
      coin: "",
      visible: false,
      owned: [],
      disabled: [],
      options: "",
      isInactive: true
    };
  },
  methods: {
    isDisabled(coin) {
      if (this.disabled.includes(coin)) {
        return false;
      } else return true;
    },

    querySearch(queryString, cb) {
      var coins = this.coins;
      var results = queryString
        ? coins.filter(this.createFilter(queryString))
        : coins;
      cb(results);
    },
    querySearchParent(queryString, cb) {
      var parents = this.parents;
      var results = queryString
        ? parents.filter(this.createFilter(queryString))
        : parents;
      cb(results);
    },
    createFilter(queryString) {
      return coin => {
        return (
          coin.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    createToken() {
      console.log("aaaaaaaaaaaa " + this.parent);
      let postBody = {
        userId: this.$currentUser,
        totalSupply: this.supply,
        name: this.name,
        parent: this.parent
      };
      let url = this.$myUrl;
      console.log("posst == " + JSON.stringify(postBody));

      return new Promise(function(accept, reject) {
        axios
          .post(url + "/api/createContract", postBody, { timeout: 1000000000 })
          .then(
            response => (
              accept({
                address: response.data
              }),
              reject({})
            )
          )
          .catch(error => {
            console.log(error);
            reject(error);
          });
      });
    },
    renderCaptcha() {
      var captchaKey = "6LcvSr4UAAAAAOmIb6ZlkVDqxKNTWzjyVXUXOr4K";
      grecaptcha.render("captcha", {
        sitekey: captchaKey
      });
    },
    createPK(selected_pin) {
      let postBody = {
        userId: 84,
        coin: "BASTOJI",
        pin: selected_pin
      };
      let url = this.$myUrl;
      return new Promise(function(accept, reject) {
        axios
          .post(url + "/api/generatePrivateKey", postBody)
          .then(
            response => (
              //console.log("ff "+response.data),
              accept({
                res: response.data
              }),
              reject({})
            )
          )
          .catch(error => {
            console.log(error);
            reject(error);
          });
      });
    },
    submit() {
      swal
        .mixin({
          confirmButtonText: "Next &rarr;",
          showCancelButton: true,
          focusConfirm: false,
          allowOutsideClick: false,
          progressSteps: ["1", "2"]
        })
        .queue([
          {
            input: "password",
            title: "Please Enter Your PIN:",
            text: "",
            focusConfirm: false,
            inputValidator: value => {
              if (!value) {
                return "PIN is required!";
              } else {
                this.pin = value;
              }
              if (isNaN(value)) {
                return "PIN must contain numbers only!";
              }
            }
          },
          {
            html: '<div style="margin-left:17%;" id="captcha"/>',
            onOpen: this.renderCaptcha,
            preConfirm: function() {
              if (grecaptcha.getResponse().length !== 0) return true;
              else return false;
            },
            focusConfirm: false
          }
        ])
        .then(result => {
          if (result.value) {
            this.createPK(this.pin).then(
              data => {
                // console.log("data == "+JSON.stringify(data));
                swal.fire({
                  title: "SUCCESS!",
                  text: "Public Key Created!",
                  type: "success",
                  html: "Public Key: " + data.res,
                  cancelButtonText: "Cancel",
                  focusConfirm: false,
                  allowOutsideClick: false,
                  showCancelButton: true,
                  showConfirmButton: true
                });
                window.location.reload();
              },
              error => {
                swal.fire({
                  type: "error",
                  title: "Oops..",
                  text: "Private Key Already Exist!",
                  focusConfirm: false,
                  allowOutsideClick: false
                });
              }
            );
          }
        });
    },

    fillCoinParents() {
      var selectList = document.getElementById("parentCoin");
      //Create and append the options
      //console.log("parent == "+parents);
      //selectList.innerHTML = '';
      for (var i = 0; i < this.parents.length; i++) {
        var option = document.createElement("option");
        option.value = this.parents[i];
        option.text = this.parents[i];

        //console.log("111111")

        //selectList.appendChild(option);
      }
    }
  },

  mounted: function() {
    if (this.$currentUser == undefined) {
      //window.location.href = "https://sqoin.exchange/account/sign-in";
    }
    var self = this;
    // console.log("self == "+this.$currentUser);
    if (this.$currentUser !== null && this.$currentUser !== undefined) {
      axios
        .get(this.$myUrl + "/api/listPublicKeys?id=" + this.$currentUser)
        .then(
          response => (self.wallets = response.data),
          self.wallets.map(el => {
            self.owned.push(el.coin);
          }),
          axios.get(this.$myUrl + "/api/getAllCoinName").then(response => {
            var json = response.data;
            json.map(el => {
              if (!self.owned.includes(el.name)) {
                self.coins.push({ value: el.name, label: el.name });
              }
            });
            self.coins.map(el => {
              self.disabled.push(el.value);
            });
          }),
          (this.loadingWallets = false)
        );
    }
    axios.get(this.$myUrl + "/api/getNativeCoin").then(response => {
      var json = response.data;
      //console.log("rep json ="+JSON.stringify(json));
      json.map(el => {
        self.parents.push({ value: el.name, label: el.name });
      });

      self.parents.map(el => {
        self.disabled.push(el.value);
      });
      this.isInactive = false;
    });

    // setTimeout( this.fillCoinParents,4000);
  }
};
</script>
<style scoped>
#createWallet {
  color: #67c23a;
  background: #f0f9eb;
  font-size: 25px;
  border-color: #c2e7b0;
  padding-top: 1px;
  padding-bottom: 1px;
  margin: 0;
  float: right;
}
</style>
