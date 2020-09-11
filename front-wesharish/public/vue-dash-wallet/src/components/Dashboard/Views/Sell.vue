<template>
  <div class="sell">
    <div class="row d-flex justify-content-center">
      <div class="col-sm-6 mr-auto ml-auto">
        <card card-body-classes="text-center">
          <h4 slot="header" class="card-title">
            <i class="el-icon-sell"></i>
           Redeem Coins
          </h4>
          <h6 v-if="model.coin">
            Balance:
            <span class="text-success">({{available}} {{model.coin}})</span>
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
                clearable
                v-model="model.amount"
                v-validate="{required:true,decimal:true,min_value:1}"
                 
              ></el-input><!---The minimum value of a redeem transaction is 100 FOR now, in order to keep the transactions clear-->
            </fg-input>
          </div>
          <div class="col-sm-8 mr-auto ml-auto">
            <fg-input label="Note:">
              <el-input
                type="textarea"
                placeholder="optional message.."
                v-model="model.note"
                :autosize="{ minRows: 6, maxRows: 12}"
                maxlength="240"
                show-word-limit
              ></el-input>
            </fg-input>
            
          </div>
          <p-button type="warning" :disabled="isDisabled" round outline @click="onSubmit">Redeem</p-button>
        </card>
      </div>
    </div>
  </div>
</template>

<script>
import swal from "sweetalert2";
export default {
  name: "Sell",
  components: {},
  data() {
    return {
      optionsCoin: [],
      valueCoin: [],
      listCoins: [],
      listBalances: [],
      loadingCoin: false,
      isDisabled: false,
      available: "",
      pdf: "",
      pin: "",
      model: {
        coin: "BASTOJI",
        amount: "",
        note: ""
      }
    };
  },
  methods: {
    sellCoins(coinName) {
      let postBody = {
        coin: coinName,
        native: "true",
        amount: this.model.amount,
        from: this.$currentUser,
        pin: this.pin,
        to: 9
      };
      let url = this.$myUrl;

      return new Promise(function(accept, reject) {
        axios
          .post(url + "/api/sell", postBody, { timeout: 10000 })
          .then(
            response => (
              accept({
                email: response.data.email,
                transactionId: response.data.transactionId,
                msg: response.data.msg
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
    loadBalance(coin) {
      this.available = this.listBalances[coin];
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
             /* {
                html: '<div style="margin-left:17%;" id="captcha"/>',
                onOpen: this.renderCaptcha,
                preConfirm: function() {
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
                this.sellCoins(this.model.coin).then(
                  data => {
                    if (data.email === "message sent") {
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
                                          ) > -1
                                        ) {
                                          setTimeout(
                                            this.redirectToExternalSite(
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
                                this.getUserById(this.$currentUser).then(userTo => {
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
                                          ) > -1
                                        ) {
                                          setTimeout(
                                            this.redirectToExternalSite(
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
                        switch (this.model.coin) {
                          case "SAGE":
                            swal
                              .fire({
                                title: "SUCCESS!",
                                text: "Transaction Processed!",
                                footer:
                                  "You Have Sold&nbsp;" +
                                  "<b>" +
                                  this.model.amount +
                                  "&nbsp;" +
                                  this.model.coin +
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
                                        27,
                                        userFrom,
                                        data.transactionId,
                                        this.model.amount,
                                        this.model.coin
                                      );
                                    }
                                  );
                                }
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
                                      ) > -1
                                    ) {
                                      setTimeout(
                                        this.redirectToExternalSite(
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
                    if (data.msg === "failed") {
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
    renderCaptcha() {
      var captchaKey = "6LcvSr4UAAAAAOmIb6ZlkVDqxKNTWzjyVXUXOr4K";
      grecaptcha.render("captcha", {
        sitekey: captchaKey
      });
    },
    generatePDF(userTo, userFrom, tId, amount, coin) {
      axios
        .get(
          "http://173.249.24.146:8080/creamFloats/rest/creamFloats/generateFacture?userTo=" +
            userTo +
            "&userFrom=" +
            userFrom +
            "&transactionId=" +
            tId +
            "&amountf=" +
            amount +
            "&currency=" +
            coin
        )
        .then(response => (this.pdf = response));
    },
    getUserById(uId) {
      let url = this.$myUrl;
      return new Promise(function(accept, reject) {
        if (this.$currentUser !== null && this.$currentUser !== undefined) {
          axios.get(url + "/api/getUserById?id=" + uId).then(response => {
            accept(response.data.first_name + " " + response.data.last_name);
          });
        }
      });
    }
  },
  mounted() {
    if (this.$currentUser == undefined) {
      //window.location.href = "https://sqoin.exchange/account/sign-in";
    }
    var self = this;
    axios.get(this.$myUrl + "/api/getAllCoinName").then(response => {
      var json = response.data;
      json.map(el => {
        self.listCoins.push({ valueCoin: el.name, labelCoin: el.name });
      });
    });
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
            .then(response => (this.available = response.data.balance));
        });
    }
  }
};
</script>

<style scoped>
</style>