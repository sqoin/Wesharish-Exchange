<template>
  <div class="send">
    <div class="row d-flex justify-content-center">
      <div class="col-sm-6 mr-auto ml-auto">
        <card card-body-classes="text-center">
          <h4 slot="header" class="card-title">
            <i class="el-icon-s-promotion"></i>
            Send Coins
          </h4>
          <h6 v-if="model.coin">
            Balance:
            <span class="text-success">({{available}} Bastoji)</span>
          </h6>
          <h6 v-else>
            Balance:
            <span class="text-default">
              <i class="el-icon-loading"></i>
            </span>
          </h6>
          <div class="col-sm-8 mr-auto ml-auto">
            <fg-input required label="Amount:" :error="getError('Amount')">
              <el-input
                name="Amount"
                id="Amount"
                clearable
                v-model="model.amount"
                v-validate="{required: required,decimal:true,min_value:1}"
                :disabled="disableInput"
              ></el-input><!---The minimum value for sending coins is 100 FOR now, in order to keep the transactions clear-->
            </fg-input>
            <fg-input label="Recipient" required :error="getError('Recipient')">
              <el-select
                placeholder
                class="select-default"
                name="Recipient"
                id="userto"
                v-model="model.recipient"
                filterable
                clearable
                remote
                reserve-keyword
                :remote-method="remoteMethodUser"
                :loading="loadingUser"
                v-validate="{required: required}"
                :disabled="disableInput"
              >
                <el-option
                  class="select-default"
                  v-for="item in optionsUser"
                  :key="item.valueUser"
                  :label="item.labelUser"
                  :value="item.valueUser"
                ></el-option>
              </el-select>
            </fg-input>
          </div>
          <div class="col-sm-8 mr-auto ml-auto">
            <fg-input label="Note:">
              <el-input
                type="textarea"
                placeholder="optional message.."
                v-model="model.note"
                :autosize="{minRows: 6, maxRows: 12}"
                maxlength="240"
                show-word-limit
              ></el-input>
            </fg-input>
          </div>
          <p-button type="warning" :disabled="isDisabled" round outline @click="onSubmit">Send</p-button>
        </card>
      </div>
    </div>
  </div>
</template>

<script>
import swal from "sweetalert2";
import { constants } from "fs";
export default {
  name: "Send",
  components: {},

  data() {
    return {
      optionsCoin: [],
      valueCoin: [],
      listCoins: [],
      listBalances: [],
      loadingCoin: false,
      optionsUser: [],
      valueUser: [],
      listUsers: [],
      loadingUser: false,
      isDisabled: false,
      available: "",
      pdf: "",
      pin: "",
      userto: "",
      galleryTransactionId: "",
      projectTransactionId: "",
      amountProject: "",
      amountGallery: "",
      model: {
        coin: "BASTOJI",
        amount: "",
        recipient: "",
        note: ""
      }
    };
  },
  methods: {
    getUserToByProductId(productId) {
      let url = this.$myUrl;
      return new Promise(function(accept, reject) {
        axios
          .get(url + "/api/getUserIdByProductId?id=" + productId)
          .then(response => {
            accept(response.data);
          });
      });
    },

    getUserToByProjectId(projectId) {
      let url = this.$myUrl;
      return new Promise(function(accept, reject) {
        axios
          .get(url + "/api/getUserIdByProjectId?id=" + projectId)
          .then(response => {
            accept(response.data);
          });
      });
    },

    sendCoins(coinName) {
      let postBody = {};

      //we are working on gallery project
      if (
        window.location.href.indexOf("successUrl") > -1 &&
        window.location.href.indexOf("product") > -1
      ) {
        this.model.amount = this.amountGallery;

        postBody = {
          coin: coinName,
          native: "true",
          amount: this.amountGallery,
          from: this.$currentUser,
          to: this.userto,
          pin: this.pin,
          productId: this.$route.query.product
        };
      }

      //we are working on reward distribution project
      if (
        window.location.href.indexOf("successUrl") > -1 &&
        window.location.href.indexOf("project") > -1
      ) {
        this.model.amount = this.amountGallery;

        postBody = {
          coin: coinName,
          native: "true",
          amount: this.amountGallery,
          from: this.$currentUser,
          to: this.userto,
          pin: this.pin,
          productId: this.getParamsValuefromUrl("project")
        };
      } else {
        postBody = {
          coin: coinName,
          native: "true",
          amount: this.model.amount,
          from: this.$currentUser,
          to: this.model.recipient,
          pin: this.pin
        };
      }

      let url = this.$myUrl;
      return new Promise(function(accept, reject) {
        axios
          .post(url + "/api/send", postBody, { timeout: 10000 })
          .then(
            response => (
              accept({
                transactionId: response.data.transactionId,
                message: response.data.message
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
    remoteMethodCoin(query) {
      if (query !== "") {
        this.loadingCoin = true;
        setTimeout(() => {
          this.loadingCoin = false;
          this.optionsCoin = this.listCoins.filter(item => {
            return (
              item.labelCoin.toLowerCase().indexOf(query.toLowerCase()) > -1
            );
          });
        }, 200);
      } else {
        this.optionsCoin = [];
      }
    },
    remoteMethodUser(query) {
      if (query !== "") {
        this.loadingUser = true;
        setTimeout(() => {
          this.loadingUser = false;
          this.optionsUser = this.listUsers.filter(item => {
            //console.log("item = "+item);
            return (
              item.labelUser.toLowerCase().indexOf(query.toLowerCase()) > -1
            );
          });
        }, 200);
      } else {
        this.optionsUser = [];
      }
    },
    loadBalance(coin) {
      this.available = this.listBalances[coin];
      if (
        (window.location.href.indexOf("successUrl") > -1) &
        (window.location.href.indexOf("product") > -1)
      ) {
        axios
          .get(this.$myUrl + "/api/getCoinValueByDollar?coin=" + coin)
          .then(response => {
            this.amountGallery =
              response.data *
              this.$route.query.amount *
              this.$route.query.quantity;
            document.getElementById("Amount").value = this.amountGallery;
          });
      } else if (
        window.location.href.indexOf("successUrl") > -1 &&
        window.location.href.indexOf("project") > -1
      ) {
        axios
          .get(this.$myUrl + "/api/getCoinValueByDollar?coin=" + coin)
          .then(response => {
            this.amountGallery =
              response.data * this.getParamsValuefromUrl("amount");
            document.getElementById("Amount").value = this.amountGallery;
          });
      }
    },
    switchOnButton() {
      this.isDisabled = false;
    },
    switchOffButton() {
      this.isDisabled = true;
    },
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    onSubmit() {
      var coinParent;
      this.$validator.validateAll().then(res => {
        if (res) {
          this.switchOffButton();
          swal
            .mixin({
              confirmButtonText: "Next &rarr;",
              showCancelButton: true,
              focusConfirm: false,
              allowOutsideClick: false,
              onAfterClose: this.switchOnButton(),
              progressSteps: []
            })
            .queue([
              {
                input: "password",
                title: "Please Enter Your PIN:",
                focusConfirm: false,
                text: "",
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
             /* {
                html: '<div style="margin-left:17%;" id="captcha"/>',
                onOpen: this.renderCaptcha,
                preConfirm: () => {
                  if (grecaptcha.getResponse().length !== 0) return true;
                  else return false;
                },
                focusConfirm: false
              }*/
            ])
            .then(result => {
              if (result.value) {
                swal.fire({
                  title: "Processing Transaction..",
                  showConfirmButton: false,
                  showCancelButton: false,
                  allowOutsideClick: false,
                  onOpen: () => {
                    swal.showLoading();
                  },
                  onAfterClose: this.switchOnButton()
                });
                this.switchOffButton();

                this.sendCoins(this.model.coin).then(
                  data => {
                    if (data.message === "success") {
                      this.galleryTransactionId = data.transactionId;
                      var usergallery;
                      if (window.location.href.indexOf("successUrl") > -1) {
                        usergallery = this.userto;
                      } else {
                        usergallery = this.model.recipient;
                      }
                      if (
                        this.model.coin !== "SAGE" &&
                        this.model.coin !== "BASTOJI"
                      ) {
                        var url = this.$myUrl;
                        axios
                          .get(
                            url +
                              "/api/getParentNameByCoinName?name=" +
                              this.model.coin
                          )
                          .then(response => {
                            this.model.coin = response.data;
                            switch (this.model.coin) {
                              case "SAGE":
                                //console.log("sage");
                                this.getUserById(usergallery).then(userTo => {
                                  swal
                                    .fire({
                                      title: "SUCCESS!",
                                      text: "Transaction Processed!",
                                      footer:
                                        "You Have Sent&nbsp;" +
                                        "<b>" +
                                        this.model.amount +
                                        "&nbsp;" +
                                        this.model.coin +
                                        "</b>" +
                                        "&nbsp;To&nbsp;" +
                                        "<b>" +
                                        userTo +
                                        "</b>",
                                      type: "success",
                                      html:
                                        "Transaction ID: " +
                                        "<a href='https://explorer.sagecity.io/tx/" +
                                        data.transactionId +
                                        "'target='_blank'>" +
                                        data.transactionId +
                                        "</a>",
                                      confirmButtonText:
                                        '<i class="el-icon-printer"></i>',
                                      cancelButtonText: "OK",
                                      focusConfirm: false,
                                      allowOutsideClick: false,
                                      showCancelButton: true,
                                      showConfirmButton: true,
                                      onAfterClose: this.switchOnButton()
                                    })
                                    .then(result => {
                                      if (result.value) {
                                        this.getUserById(
                                          this.$currentUser
                                        ).then(userFrom => {
                                          this.generatePDF(
                                            userTo,
                                            userFrom,
                                            data.transactionId,
                                            this.model.amount,
                                            this.model.coin
                                          );
                                        });
                                      } else {
                                        if (
                                          window.location.href.indexOf(
                                            "successUrl"
                                          ) > -1 &&
                                          window.location.href.indexOf(
                                            "product"
                                          ) > -1
                                        ) {
                                          setTimeout(
                                            this.redirectToExternalSite(
                                              this.galleryTransactionId
                                            ),
                                            2000
                                          );
                                        } else if (
                                          window.location.href.indexOf(
                                            "successUrl"
                                          ) > -1 &&
                                          window.location.href.indexOf(
                                            "project"
                                          ) > -1
                                        ) {
                                          setTimeout(
                                            this.redirectToRewardDistrbibutionSite(
                                              this.galleryTransactionId
                                            ),
                                            2000
                                          );
                                        }
                                      }
                                    });
                                });
                                break;
                              case "BASTOJI":
                                // console.log("bastoji");
                                this.getUserById(usergallery).then(userTo => {
                                  swal
                                    .fire({
                                      title: "SUCCESS!",
                                      text: "Transaction Processed!",
                                      footer:
                                        "You Have Sent&nbsp;" +
                                        "<b>" +
                                        this.model.amount +
                                        "&nbsp;" +
                                        this.model.coin +
                                        "</b>" +
                                        "&nbsp;To&nbsp;" +
                                        "<b>" +
                                        userTo +
                                        "</b>",
                                      type: "success",
                                      html:
                                        "Transaction ID: " +
                                        "<a href='https://explorer.sqoin.us/#/tx/" +
                                        data.transactionId +
                                        "'target='_blank'>" +
                                        data.transactionId +
                                        "</a>",
                                      confirmButtonText:
                                        '<i class="el-icon-printer"></i>',
                                      cancelButtonText: "OK",
                                      focusConfirm: false,
                                      allowOutsideClick: false,
                                      showCancelButton: true,
                                      showConfirmButton: true,
                                      onAfterClose: this.switchOnButton()
                                    })
                                    .then(result => {
                                      if (result.value) {
                                        this.getUserById(
                                          this.$currentUser
                                        ).then(userFrom => {
                                          this.generatePDF(
                                            userTo,
                                            userFrom,
                                            data.transactionId,
                                            this.model.amount,
                                            this.model.coin
                                          );
                                        });
                                      } else {
                                        if (
                                          window.location.href.indexOf(
                                            "successUrl"
                                          ) > -1 &&
                                          window.location.href.indexOf(
                                            "product"
                                          ) > -1
                                        ) {
                                          setTimeout(
                                            this.redirectToExternalSite(
                                              this.galleryTransactionId
                                            ),
                                            2000
                                          );
                                        } else if (
                                          window.location.href.indexOf(
                                            "successUrl"
                                          ) > -1 &&
                                          window.location.href.indexOf(
                                            "project"
                                          ) > -1
                                        ) {
                                          setTimeout(
                                            this.redirectToRewardDistrbibutionSite(
                                              this.galleryTransactionId
                                            ),
                                            2000
                                          );
                                        }
                                      }
                                    });
                                });
                            }
                          });
                      } else {
                        //console.log("coin after = ",this.model.coin);
                        switch (this.model.coin) {
                          case "SAGE":
                            console.log("sage");
                            this.getUserById(usergallery).then(userTo => {
                              swal
                                .fire({
                                  title: "SUCCESS!",
                                  text: "Transaction Processed!",
                                  footer:
                                    "You Have Sent&nbsp;" +
                                    "<b>" +
                                    this.model.amount +
                                    "&nbsp;" +
                                    this.model.coin +
                                    "</b>" +
                                    "&nbsp;To&nbsp;" +
                                    "<b>" +
                                    userTo +
                                    "</b>",
                                  type: "success",
                                  html:
                                    "Transaction ID: " +
                                    "<a href='https://explorer.sagecity.io/tx/" +
                                    data.transactionId +
                                    "'target='_blank'>" +
                                    data.transactionId +
                                    "</a>",
                                  confirmButtonText:
                                    '<i class="el-icon-printer"></i>',
                                  cancelButtonText: "OK",
                                  focusConfirm: false,
                                  allowOutsideClick: false,
                                  showCancelButton: true,
                                  showConfirmButton: true,
                                  onAfterClose: this.switchOnButton()
                                })
                                .then(result => {
                                  if (result.value) {
                                    this.getUserById(this.$currentUser).then(
                                      userFrom => {
                                        this.generatePDF(
                                          userTo,
                                          userFrom,
                                          data.transactionId,
                                          this.model.amount,
                                          this.model.coin
                                        );
                                      }
                                    );
                                  } else {
                                    if (
                                      window.location.href.indexOf(
                                        "successUrl"
                                      ) > -1 &&
                                      window.location.href.indexOf("product") >
                                        -1
                                    ) {
                                      setTimeout(
                                        this.redirectToExternalSite(
                                          this.galleryTransactionId
                                        ),
                                        2000
                                      );
                                    } else if (
                                      window.location.href.indexOf(
                                        "successUrl"
                                      ) > -1 &&
                                      window.location.href.indexOf("project") >
                                        -1
                                    ) {
                                      setTimeout(
                                        this.redirectToRewardDistrbibutionSite(
                                          this.galleryTransactionId
                                        ),
                                        2000
                                      );
                                    }
                                  }
                                });
                            });
                            break;
                          case "BASTOJI":
                            console.log("bastoji");
                            this.getUserById(usergallery).then(userTo => {
                              swal
                                .fire({
                                  title: "SUCCESS!",
                                  text: "Transaction Processed!",
                                  footer:
                                    "You Have Sent&nbsp;" +
                                    "<b>" +
                                    this.model.amount +
                                    "&nbsp;" +
                                    this.model.coin +
                                    "</b>" +
                                    "&nbsp;To&nbsp;" +
                                    "<b>" +
                                    userTo +
                                    "</b>",
                                  type: "success",
                                  html:
                                    "Transaction ID: " +
                                    "<a href='https://explorer.sqoin.us/#/tx/" +
                                    data.transactionId +
                                    "'target='_blank'>" +
                                    data.transactionId +
                                    "</a>",
                                  confirmButtonText:
                                    '<i class="el-icon-printer"></i>',
                                  cancelButtonText: "OK",
                                  focusConfirm: false,
                                  allowOutsideClick: false,
                                  showCancelButton: true,
                                  showConfirmButton: true,
                                  onAfterClose: this.switchOnButton()
                                })
                                .then(result => {
                                  if (result.value) {
                                    this.getUserById(this.$currentUser).then(
                                      userFrom => {
                                        this.generatePDF(
                                          userTo,
                                          userFrom,
                                          data.transactionId,
                                          this.model.amount,
                                          this.model.coin
                                        );
                                      }
                                    );
                                  } else {
                                    if (
                                      window.location.href.indexOf(
                                        "successUrl"
                                      ) > -1 &&
                                      window.location.href.indexOf("product") >
                                        -1
                                    ) {
                                      setTimeout(
                                        this.redirectToExternalSite(
                                          this.galleryTransactionId
                                        ),
                                        2000
                                      );
                                    } else if (
                                      window.location.href.indexOf(
                                        "successUrl"
                                      ) > -1 &&
                                      window.location.href.indexOf("project") >
                                        -1
                                    ) {
                                      setTimeout(
                                        this.redirectToRewardDistrbibutionSite(
                                          this.galleryTransactionId
                                        ),
                                        2000
                                      );
                                    }
                                  }
                                });
                            });
                        }
                      }
                    }
                    if (data.message === "failed") {
                      swal.fire({
                        type: "error",
                        title: "Oops..",
                        text: "Please verify your PIN!",
                        focusConfirm: false,
                        allowOutsideClick: false,
                        onAfterClose: this.switchOnButton()
                      });
                    }
                  },
                  error => {
                    swal.fire({
                      type: "error",
                      title: "Sorry..",
                      text: "We Cannot Process The Transaction Right Now!",
                      focusConfirm: false,
                      allowOutsideClick: false,
                      onAfterClose: this.switchOnButton()
                    });
                  }
                );
              }
            });
        } else {
          return false;
        }
      });
    },
    getParentNameByCoinName(url, coin) {
      axios
        .get(url + "/api/getParentNameByCoinName?name=" + coin)
        .then(response => {
          console.log("555555555555555555 ");
          console.log("coiiiiin = " + response.data);
          this.model.coin = response.data;
          return "";
        });
    },
    renderCaptcha() {
      var captchaKey = "6LcvSr4UAAAAAOmIb6ZlkVDqxKNTWzjyVXUXOr4K";
      grecaptcha.render("captcha", {
        sitekey: captchaKey
      });
    },
    confirmTransaction() {
      if (window.location.href.indexOf("successUrl") > -1) {
        console.log(decodeURIComponent(this.$route.query.successUrl));
        setTimeout(this.redirectToExternalSite, 2000);
      }
    },
    generatePDF(userTo, userFrom, tId, amount, coin) {
      if (window.location.href.indexOf("successUrl") > -1) {
        window.location.href =
          "http://173.249.24.146:8080/creamFloats/rest/creamFloats/generateFacture?userTo=" +
          userTo +
          "&userFrom=" +
          userFrom +
          "&transactionId=" +
          tId +
          "&amountf=" +
          amount +
          "&currency=" +
          coin;
        setTimeout(this.redirectToExternalSite, 3000);
      } else {
        window.location.href =
          "http://173.249.24.146:8080/creamFloats/rest/creamFloats/generateFacture?userTo=" +
          userTo +
          "&userFrom=" +
          userFrom +
          "&transactionId=" +
          tId +
          "&amountf=" +
          amount +
          "&currency=" +
          coin;
      }
    },
    redirectToExternalSite(txid) {
      console.log(decodeURIComponent(this.$route.query.successUrl));

      location.href =
        decodeURIComponent(this.$route.query.successUrl) +
        "?txid=" +
        txid +
        "&productId=" +
        this.$route.query.product;
    },

    redirectToRewardDistrbibutionSite(txid) {
      console.log(decodeURIComponent(this.$route.query.successUrl));

      location.href =
        decodeURIComponent(this.$route.query.successUrl) +
        "?txid=" +
        txid +
        "&projectId=" +
        this.getParamsValuefromUrl("project");
    },
    getUserById(uId) {
      let url = this.$myUrl;
      return new Promise(function(accept, reject) {
        axios.get(url + "/api/getUserById?id=" + uId).then(response => {
          // console.log(response)
          if (window.location.href.indexOf("successUrl") > -1) {
            document.getElementById("userto").value =
              response.data.first_name + " " + response.data.last_name;
          }
          accept(response.data.first_name + " " + response.data.last_name);
        });
      });
    },

    getParamsValuefromUrl(param) {
      let url = decodeURIComponent(window.location.href);

      let newUrl = url.replace(/#/g, "");
      let params = new URL(newUrl).searchParams;
      return params.get(param);
    }

    /*ipnHandler(txid , coinName ) {


     
      
       this.model.amount=this.amountGallery;
         
        let postBody={
           
        coin: coinName,
        transactionId:txid,
        amount: this.amountGallery,
        userfrom: this.$currentUser,
        userto: this.userto,
        currency: this.model.coin,
        productId:this.$route.query.product
      };

      let url = this.$myUrl;
      return new Promise(function(accept, reject) {
        axios
          .post(
            //this.$route.query.IPNHandler
            "https://sqoin.exchange/api/handleTransaction", postBody)
          .then(
            response => (
              accept({
                msg: "success"
              }),
              reject({})
            )
          )
          .catch(error => {
            console.log(error);
          });
      });
    },*/
  },

  computed: {
    disableInput() {
      if (window.location.href.indexOf("successUrl") > -1) {
        return true;
      }
    },
    required() {
      if (window.location.href.indexOf("successUrl") > -1) {
        return false;
      } else {
        return true;
      }
    }
  },

  mounted() {
    if (this.$currentUser == undefined) {
      //window.location.href = "https://sqoin.exchange/account/sign-in";
    }
    var self = this;
   /* axios.get(this.$myUrl + "/api/getAllCoinName").then(response => {
      var json = response.data;
      json.map(el => {
        self.listCoins.push({ valueCoin: el.name, labelCoin: el.name });
      });
    });*/
    axios.get(this.$myUrl + "/api/getAllUsers").then(response => {
      var json = response.data;
      json.map(el => {
        self.listUsers.push({
          valueUser: el.id,
          labelUser:
            el.user_name + "( " + el.first_name + " " + el.last_name + " )"
        });
      });
    });
    if (this.$currentUser === undefined) {
      axios.get("https://sqoin.exchange/userWallet/api/users/current").then(
        response => (
          (this.$currentUser = response.data.id),
          axios
            .get(
              this.$myUrl + "/api/listAllBalance?userId=" + this.$currentUser,
              { timeout: 300000 }
            )
            .then(response => {
              this.wallet = response.data;
              json.map(el => {
                self.listBalances[el.coin] = el.balance;
              });
            })
        )
      );
    }
    if (this.$currentUser !== null && this.$currentUser !== undefined) {
      // axios
      //   .get(this.$myUrl + "/api/listAllBalance?userId=" + this.$currentUser)
      //   .then(response => {
      //     var json = response.data;
      //     json.map(el => {
      //       self.listBalances[el.coin] = el.balance;
      //     });
      //   });
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
                (this.available = response.data.balance)
              )
            );
        });
    }

    if (
      window.location.href.indexOf("successUrl") > -1 &&
      window.location.href.indexOf("product") > -1
    ) {
      var json;
      axios
        .get(
          this.$myUrl +
            "/api/getUserIdByProductId?id=" +
            this.$route.query.product
        )
        .then(response => {
          this.userto = response.data;
          setTimeout(this.getUserById(this.userto), 500);
        });

      document.getElementById("Amount").value = this.$route.query.amount;

      //alert("it's about gallery project");
    } else if (
      window.location.href.indexOf("successUrl") > -1 &&
      window.location.href.indexOf("project") > -1
    ) {
      axios
        .get(
          this.$myUrl +
            "/api/getUserIdByProjectId?id=" +
            this.getParamsValuefromUrl("project")
        )
        .then(response => {
          this.userto = response.data;
          setTimeout(this.getUserById(this.userto), 500);
        });

      document.getElementById("Amount").value = this.getParamsValuefromUrl(
        "amount"
      );

      //alert("it's about gallery project");
    }
  }
};
</script>

<style scoped>
</style>
