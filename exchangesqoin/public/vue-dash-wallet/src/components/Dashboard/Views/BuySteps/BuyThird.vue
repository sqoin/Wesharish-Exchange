<template>
  <div class="row justify-content-center">
    <div class="col-sm-12 card">
      <fieldset disabled>
        <div class="row">
          <div class="col-sm-3">
            <fg-input label="Full name:" v-model="model.fullName"></fg-input>
          </div>
          <div class="col-sm-3">
            <fg-input label="Email:" v-model="model.email"></fg-input>
          </div>
          <div class="col-sm-2"></div>
          <div class="col-sm-4">
            <fg-input label="Card number:">
              <el-input v-model="model.cardNumber" :suffix-icon="ccIcon()"></el-input>
            </fg-input>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-6">
            <fg-input label="Address:" v-model="model.address"></fg-input>
          </div>
          <div class="col-sm-2">
            <fg-input label="Country:" v-model="model.country"></fg-input>
          </div>
          <div class="col-sm-2">
            <fg-input label="Expiry date:">
              <el-date-picker
                type="month"
                v-model="model.expiryDate"
                prefix-icon="false"
                clear-icon="false"
              ></el-date-picker>
            </fg-input>
          </div>
          <div class="col-sm-2"></div>
        </div>
        <div class="row">
          <div class="col-sm-2">
            <fg-input label="State:" v-model="model.state"></fg-input>
          </div>
          <div class="col-sm-2">
            <fg-input label="City:" v-model="model.city"></fg-input>
          </div>
          <div class="col-sm-2">
            <fg-input label="Postcode:" v-model="model.postCode"></fg-input>
          </div>
          <div class="col-sm-2"></div>
          <div class="col-sm-2">
            <fg-input label="Cryptogram:" v-model="model.cryptogram"></fg-input>
          </div>
          <div class="col-sm-2">
            <fg-input label="Zip code:" v-model="model.zipCode"></fg-input>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-6">
            <fg-input label="Public Address:" v-model="model.pAddress" id="publicAddress" disabled></fg-input>
          </div>
          <div class="col-sm-2">
            <qrcode-vue :value="model.pAddress" :size="size" level="H"></qrcode-vue>
          </div>
          <div class="col-sm-2">
            <fg-input label="Coin:" v-model="model.coin"></fg-input>
          </div>
          <div class="col-sm-2">
            <fg-input label="Amount:" v-model="model.amount"></fg-input>
          </div>
        </div>
      </fieldset>
    </div>
  </div>
</template>
<script>
import QrcodeVue from "qrcode.vue";

export default {
  name: "BuyThird",
  components: {
    QrcodeVue
  },
  props: ["model"],

  data() {
    return { size: 80 };
  },
  methods: {
    validate() {
      return this.$validator.validateAll().then(res => {
        this.$emit("on-validated", res, this.model);
        return res;
      });
    },
    ccIcon() {
      // visa
      var re = new RegExp("^4");
      if (this.model.cardNumber.match(re) != null) return "fa fa-cc-visa";

      // Mastercard
      // Updated for Mastercard 2017 BINs expansion
      if (
        /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(
          this.model.cardNumber
        )
      )
        return "fa fa-cc-mastercard";

      // AMEX
      re = new RegExp("^3[47]");
      if (this.model.cardNumber.match(re) != null) return "fa fa-cc-amex";

      // Discover
      re = new RegExp(
        "^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)"
      );
      if (this.model.cardNumber.match(re) != null) return "fa fa-cc-discover";

      // Diners
      re = new RegExp("^36");
      if (this.model.cardNumber.match(re) != null)
        return "fa fa-cc-diners-club";

      // Diners - Carte Blanche
      re = new RegExp("^30[0-5]");
      if (this.model.cardNumber.match(re) != null)
        return "fa fa-cc-diners-club";

      // JCB
      re = new RegExp("^35(2[89]|[3-8][0-9])");
      if (this.model.cardNumber.match(re) != null) return "fa fa-cc-jcb";

      // Visa Electron
      re = new RegExp("^(4026|417500|4508|4844|491(3|7))");
      if (this.model.cardNumber.match(re) != null) return "fa fa-cc-visa";

      return "fa fa-credit-card";
    }
  },


 /*  mounted: function() {
    axios
      .get(
        this.$myUrl +
          "/api/getPublicAddressByUserId?userId=" +
          this.$currentUser +
          "&coin=" +
          this.model.coin
      )
      .then(response => (this.model.pAddress = response.data.publickey));
  }*/
};
</script>
<style>
</style>
