<template>
  <div class="buy">
    <h4>
      <i class="nc-icon nc-cart-simple"></i>
      Buy Coins
    </h4>
    <div class="row d-flex justify-content-center">
      <div class="col-md-10 mr-auto ml-auto">
        <wizard @complete="wizardComplete">
          <template slot="header">
            <h6 class="card-title"></h6>
          </template>
          <!-- <wizard-tab :before-change="() => validateStep('step1')">
            <template slot="label">
              <i class="nc-icon nc-money-coins"></i>
              Amount
            </template>
            <buy-first ref="step1" @on-validated="onStepValidated" :model="model"></buy-first>
          </wizard-tab>-->
          <wizard-tab :before-change="() => validateStep('step2')">
            <template slot="label">
              <i class="nc-icon nc-credit-card"></i>
              Shipping & Billing Informations
            </template>
            <buy-second ref="step2" @on-validated="onStepValidated" :model="model"></buy-second>
          </wizard-tab>
          <!-- <wizard-tab :before-change="() => validateStep('step3')">
            <template slot="label">
              <i class="el-icon-shopping-cart-full"></i>
               Shipping & Billing Informations
            </template>
            <buy-third ref="step3" :model="model"></buy-third>
          </wizard-tab>-->
        </wizard>
      </div>
    </div>
  </div>
</template>

<script>
import BuyFirst from "@/components/Dashboard/Views/BuySteps/BuyFirst.vue";
import BuySecond from "@/components/Dashboard/Views/BuySteps/BuySecond.vue";
import BuyThird from "@/components/Dashboard/Views/BuySteps/BuyThird.vue";
import swal from "sweetalert2";
import { Wizard, WizardTab } from "@/components/UIComponents";

export default {
  name: "Buy",
  components: {
    BuyFirst,
    BuySecond,
    // BuyThird,
    Wizard,
    WizardTab
  },
  data() {
    return {
      wizardModel: {},
      model: {
        fullName: "",
        email: "",
        address: "",
        country: "",
        state: "",
        city: "",
        cardNumber: "",
        cryptogram: "",
        zipCode: "",
        expiryDate: "",
        postCode: "",
        amount: "",
        coin: "BASTOJI",
        pAddress: ""
      }
    };
  },
  methods: {
    validateStep(ref) {
      return this.$refs[ref].validate();
    },
    onStepValidated(validated, model) {
      this.wizardModel = { ...this.wizardModel, ...model };
    },
    wizardComplete() {
      /* Stripe.setPublishableKey('pk_test_elDtRaysolKWkoA9HyPzKg1000aLSNbC5h');
          Stripe.card.createToken({
          number: this.model.cardNumber,
          cvc:this.model.cryptogram,
          exp_month: this.model.expiryDate,
          exp_year: this.model.expiryDate,
        }, stripeResponseHandler);*/

      // Access the token with result.token

      swal("SUCCESS!", "Payement Processed!", "success");
    },
    mounted() {
      if (this.$currentUser == undefined) {
        //window.location.href = "https://sqoin.exchange/account/sign-in";
      }
    }
  }
};
</script>
<style scoped>
.card .card-header:not([data-background-color]) {
  padding-top: 0 !important;
}
.card-wizard .nav-pills {
  background-color: #2a52c0 !important;
}
</style>
