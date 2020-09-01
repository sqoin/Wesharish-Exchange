<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-sm-12 card">
        <div class="row">
          <div class="col-sm-3">
            <fg-input required label="Full name:" :error="getError('Full name')">
              <el-input
                name="Full name"
                clearable
                v-model="model.fullName"
                v-validate="modelValidations.fullName"
              ></el-input>
            </fg-input>
          </div>
          <div class="col-sm-3">
            <fg-input required label="Email:" :error="getError('Email')">
              <el-input
                name="Email"
                clearable
                v-model="model.email"
                v-validate="modelValidations.email"
              ></el-input>
            </fg-input>
          </div>
          <div class="col-sm-2"></div>

          <div class="col-sm-4">
            <fg-input label="Country:" required :error="getError('Country')">
              <el-select
                class="select-warning"
                name="Country"
                clearable
                v-model="model.country"
                v-validate="modelValidations.country"
              >
                <el-option
                  class="select-warning"
                  v-for="nation of countries"
                  :key="nation.code"
                  :value="nation.name"
                ></el-option>
              </el-select>
            </fg-input>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-6">
            <fg-input required label="Address:" :error="getError('Address')">
              <el-input
                name="Address"
                clearable
                v-model="model.address"
                v-validate="modelValidations.address"
              ></el-input>
            </fg-input>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-2">
            <fg-input required label="State:" :error="getError('State')">
              <el-input
                name="State"
                clearable
                v-model="model.state"
                v-validate="modelValidations.state"
              ></el-input>
            </fg-input>
          </div>
          <div class="col-sm-2">
            <fg-input required label="City:" :error="getError('City')">
              <el-input
                name="City"
                clearable
                v-model="model.city"
                v-validate="modelValidations.city"
              ></el-input>
            </fg-input>
          </div>
          <div class="col-sm-2">
            <fg-input required label="Postcode:" :error="getError('Post code')">
              <el-input
                name="Post code"
                clearable
                v-model="model.postCode"
                v-validate="modelValidations.postCode"
              ></el-input>
            </fg-input>
          </div>
          <div class="col-sm-2"></div>
          <div class="col-sm-2">
            <fg-input label="Amount:" v-model="model.amount"></fg-input>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-6">
            <fg-input label="Public Address:" v-model="model.pAddress" disabled></fg-input>
          </div>
          <div class="col-sm-4">
            <qrcode-vue :value="model.pAddress" :size="size" level="H"></qrcode-vue>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div id="card-element">
        <!-- Elements will create input elements here -->
      </div>

      <!-- We'll put the error messages in this element -->
      <div id="card-errors" role="alert"></div>

      <button
        @click="pay"
        style="position: absolute;
    bottom: 12px;
    right: 20px;
    width: 140px;
    height: 38px;
    background: #66615b;
    outline: unset;
    border: unset;
    border-radius: 2px;
    color: white;
    font-weight: 800;"
        id="submit"
      >Pay</button>
    </div>
  </div>
</template>
<script src="https://js.stripe.com/v3/"></script>
<script>
import QrcodeVue from "qrcode.vue";
import swal from "sweetalert2";
export default {
  name: "BuySecond",
  components: {
    QrcodeVue
  },
  props: ["model"],

  computed: {},
  data() {
    return {
      size: 80,
      modelValidations: {
        cardNumber: {
          required: true,
          credit_card: true
        },
        address: {
          required: true
        },
        city: {
          required: true,
          regex: /^[a-z\s]{0,255}$/i
        },
        state: {
          required: true,
          regex: /^[a-z\s]{0,255}$/i
        },
        country: {
          required: true
        },
        postCode: {
          required: true,
          numeric: true
        },
        cryptogram: {
          required: true,
          digits: 3
        },
        zipCode: {
          required: true,
          numeric: true
        },
        fullName: {
          required: true,
          regex: /^[a-z\s]{0,255}$/i
        },
        email: {
          required: true,
          email: true
        },
        expiryDate: {
          required: true
        }
      },

      countries: [
        // { code: "AF", name: "Afghanistan" },
        // { code: "AX", name: "Åland Islands" },
        // { code: "AL", name: "Albania" },
        // { code: "DZ", name: "Algeria" },
        // { code: "AS", name: "American Samoa" },
        // { code: "AD", name: "Andorra" },
        // { code: "AO", name: "Angola" },
        // { code: "AI", name: "Anguilla" },
        // { code: "AQ", name: "Antarctica" },
        // { code: "AG", name: "Antigua and Barbuda" },
        // { code: "AR", name: "Argentina" },
        // { code: "AM", name: "Armenia" },
        // { code: "AW", name: "Aruba" },
        { code: "AU", name: "Australia" },
        { code: "AT", name: "Austria" },
        // { code: "AZ", name: "Azerbaijan" },
        // { code: "BS", name: "Bahamas" },
        // { code: "BH", name: "Bahrain" },
        // { code: "BD", name: "Bangladesh" },
        // { code: "BB", name: "Barbados" },
        // { code: "BY", name: "Belarus" },
        { code: "BE", name: "Belgium" },
        // { code: "BZ", name: "Belize" },
        // { code: "BJ", name: "Benin" },
        // { code: "BM", name: "Bermuda" },
        // { code: "BT", name: "Bhutan" },
        // { code: "BO", name: "Bolivia, Plurinational State of" },
        // { code: "BQ", name: "Bonaire, Sint Eustatius and Saba" },
        // { code: "BA", name: "Bosnia and Herzegovina" },
        // { code: "BW", name: "Botswana" },
        // { code: "BV", name: "Bouvet Island" },
        { code: "BR", name: "Brazil" },
        // { code: "IO", name: "British Indian Ocean Territory" },
        // { code: "BN", name: "Brunei Darussalam" },
        // { code: "BG", name: "Bulgaria" },
        // { code: "BF", name: "Burkina Faso" },
        // { code: "BI", name: "Burundi" },
        // { code: "KH", name: "Cambodia" },
        // { code: "CM", name: "Cameroon" },
        { code: "CA", name: "Canada" },
        // { code: "CV", name: "Cape Verde" },
        // { code: "KY", name: "Cayman Islands" },
        // { code: "CF", name: "Central African Republic" },
        // { code: "TD", name: "Chad" },
        // { code: "CL", name: "Chile" },
        { code: "CN", name: "China" },
        // { code: "CX", name: "Christmas Island" },
        // { code: "CC", name: "Cocos (Keeling) Islands" },
        // { code: "CO", name: "Colombia" },
        // { code: "KM", name: "Comoros" },
        // { code: "CG", name: "Congo" },
        // { code: "CD", name: "Congo, the Democratic Republic of the" },
        // { code: "CK", name: "Cook Islands" },
        // { code: "CR", name: "Costa Rica" },
        // { code: "CI", name: "Côte d'Ivoire" },
        // { code: "HR", name: "Croatia" },
        // { code: "CU", name: "Cuba" },
        // { code: "CW", name: "Curaçao" },
        // { code: "CY", name: "Cyprus" },
        // { code: "CZ", name: "Czech Republic" },
        // { code: "DK", name: "Denmark" },
        // { code: "DJ", name: "Djibouti" },
        // { code: "DM", name: "Dominica" },
        // { code: "DO", name: "Dominican Republic" },
        // { code: "EC", name: "Ecuador" },
        // { code: "EG", name: "Egypt" },
        // { code: "SV", name: "El Salvador" },
        // { code: "GQ", name: "Equatorial Guinea" },
        // { code: "ER", name: "Eritrea" },
        // { code: "EE", name: "Estonia" },
        // { code: "ET", name: "Ethiopia" },
        // { code: "FK", name: "Falkland Islands (Malvinas)" },
        // { code: "FO", name: "Faroe Islands" },
        // { code: "FJ", name: "Fiji" },
        { code: "FI", name: "Finland" },
        { code: "FR", name: "France" },
        // { code: "GF", name: "French Guiana" },
        // { code: "PF", name: "French Polynesia" },
        // { code: "TF", name: "French Southern Territories" },
        // { code: "GA", name: "Gabon" },
        // { code: "GM", name: "Gambia" },
        // { code: "GE", name: "Georgia" },
        { code: "DE", name: "Germany" },
        // { code: "GH", name: "Ghana" },
        // { code: "GI", name: "Gibraltar" },
        // { code: "GR", name: "Greece" },
        // { code: "GL", name: "Greenland" },
        // { code: "GD", name: "Grenada" },
        // { code: "GP", name: "Guadeloupe" },
        // { code: "GU", name: "Guam" },
        // { code: "GT", name: "Guatemala" },
        // { code: "GG", name: "Guernsey" },
        // { code: "GN", name: "Guinea" },
        // { code: "GW", name: "Guinea-Bissau" },
        // { code: "GY", name: "Guyana" },
        // { code: "HT", name: "Haiti" },
        // { code: "HM", name: "Heard Island and McDonald Islands" },
        // { code: "VA", name: "Holy See (Vatican City State)" },
        // { code: "HN", name: "Honduras" },
        { code: "HK", name: "Hong Kong" },
        // { code: "HU", name: "Hungary" },
        // { code: "IS", name: "Iceland" },
        // { code: "IN", name: "India" },
        // { code: "ID", name: "Indonesia" },
        // { code: "IR", name: "Iran, Islamic Republic of" },
        // { code: "IQ", name: "Iraq" },
        { code: "IE", name: "Ireland" },
        // { code: "IM", name: "Isle of Man" },
        // { code: "IL", name: "Israel" },
        { code: "IT", name: "Italy" },
        // { code: "JM", name: "Jamaica" },
        { code: "JP", name: "Japan" },
        // { code: "JE", name: "Jersey" },
        // { code: "JO", name: "Jordan" },
        // { code: "KZ", name: "Kazakhstan" },
        // { code: "KE", name: "Kenya" },
        // { code: "KI", name: "Kiribati" },
        // { code: "KP", name: "Korea, Democratic People's Republic of" },
        // { code: "KR", name: "Korea, Republic of" },
        // { code: "KW", name: "Kuwait" },
        // { code: "KG", name: "Kyrgyzstan" },
        // { code: "LA", name: "Lao People's Democratic Republic" },
        // { code: "LV", name: "Latvia" },
        // { code: "LB", name: "Lebanon" },
        // { code: "LS", name: "Lesotho" },
        // { code: "LR", name: "Liberia" },
        // { code: "LY", name: "Libya" },
        // { code: "LI", name: "Liechtenstein" },
        // { code: "LT", name: "Lithuania" },
        { code: "LU", name: "Luxembourg" },
        // { code: "MO", name: "Macao" },
        // { code: "MK", name: "Macedonia, the Former Yugoslav Republic of" },
        // { code: "MG", name: "Madagascar" },
        // { code: "MW", name: "Malawi" },
        // { code: "MY", name: "Malaysia" },
        // { code: "MV", name: "Maldives" },
        // { code: "ML", name: "Mali" },
        // { code: "MT", name: "Malta" },
        // { code: "MH", name: "Marshall Islands" },
        // { code: "MQ", name: "Martinique" },
        // { code: "MR", name: "Mauritania" },
        // { code: "MU", name: "Mauritius" },
        // { code: "YT", name: "Mayotte" },
        { code: "MX", name: "Mexico" },
        // { code: "FM", name: "Micronesia, Federated States of" },
        // { code: "MD", name: "Moldova, Republic of" },
        // { code: "MC", name: "Monaco" },
        // { code: "MN", name: "Mongolia" },
        // { code: "ME", name: "Montenegro" },
        // { code: "MS", name: "Montserrat" },
        // { code: "MA", name: "Morocco" },
        // { code: "MZ", name: "Mozambique" },
        // { code: "MM", name: "Myanmar" },
        // { code: "NA", name: "Namibia" },
        // { code: "NR", name: "Nauru" },
        // { code: "NP", name: "Nepal" },
        { code: "NL", name: "Netherlands" },
        // { code: "NC", name: "New Caledonia" },
        { code: "NZ", name: "New Zealand" },
        // { code: "NI", name: "Nicaragua" },
        // { code: "NE", name: "Niger" },
        // { code: "NG", name: "Nigeria" },
        // { code: "NU", name: "Niue" },
        // { code: "NF", name: "Norfolk Island" },
        // { code: "MP", name: "Northern Mariana Islands" },
        { code: "NO", name: "Norway" },
        // { code: "OM", name: "Oman" },
        // { code: "PK", name: "Pakistan" },
        // { code: "PW", name: "Palau" },
        // { code: "PS", name: "Palestine, State of" },
        // { code: "PA", name: "Panama" },
        // { code: "PG", name: "Papua New Guinea" },
        // { code: "PY", name: "Paraguay" },
        // { code: "PE", name: "Peru" },
        // { code: "PH", name: "Philippines" },
        // { code: "PN", name: "Pitcairn" },
        // { code: "PL", name: "Poland" },
        { code: "PT", name: "Portugal" },
        // { code: "PR", name: "Puerto Rico" },
        // { code: "QA", name: "Qatar" },
        // { code: "RE", name: "Réunion" },
        // { code: "RO", name: "Romania" },
        // { code: "RU", name: "Russian Federation" },
        // { code: "RW", name: "Rwanda" },
        // { code: "BL", name: "Saint Barthélemy" },
        // { code: "SH", name: "Saint Helena, Ascension and Tristan da Cunha" },
        // { code: "KN", name: "Saint Kitts and Nevis" },
        // { code: "LC", name: "Saint Lucia" },
        // { code: "MF", name: "Saint Martin (French part)" },
        // { code: "PM", name: "Saint Pierre and Miquelon" },
        // { code: "VC", name: "Saint Vincent and the Grenadines" },
        // { code: "WS", name: "Samoa" },
        // { code: "SM", name: "San Marino" },
        // { code: "ST", name: "Sao Tome and Principe" },
        // { code: "SA", name: "Saudi Arabia" },
        // { code: "SN", name: "Senegal" },
        // { code: "RS", name: "Serbia" },
        // { code: "SC", name: "Seychelles" },
        // { code: "SL", name: "Sierra Leone" },
        { code: "SG", name: "Singapore" },
        // { code: "SX", name: "Sint Maarten (Dutch part)" },
        // { code: "SK", name: "Slovakia" },
        // { code: "SI", name: "Slovenia" },
        // { code: "SB", name: "Solomon Islands" },
        // { code: "SO", name: "Somalia" },
        // { code: "ZA", name: "South Africa" },
        // { code: "GS", name: "South Georgia and the South Sandwich Islands" },
        // { code: "SS", name: "South Sudan" },
        { code: "ES", name: "Spain" },
        // { code: "LK", name: "Sri Lanka" },
        // { code: "SD", name: "Sudan" },
        // { code: "SR", name: "Suriname" },
        // { code: "SJ", name: "Svalbard and Jan Mayen" },
        // { code: "SZ", name: "Swaziland" },
        { code: "SE", name: "Sweden" },
        { code: "CH", name: "Switzerland" },
        // { code: "SY", name: "Syrian Arab Republic" },
        // { code: "TW", name: "Taiwan, Province of China" },
        // { code: "TJ", name: "Tajikistan" },
        // { code: "TZ", name: "Tanzania, United Republic of" },
        // { code: "TH", name: "Thailand" },
        // { code: "TL", name: "Timor-Leste" },
        // { code: "TG", name: "Togo" },
        // { code: "TK", name: "Tokelau" },
        // { code: "TO", name: "Tonga" },
        // { code: "TT", name: "Trinidad and Tobago" },
        // { code: "TN", name: "Tunisia" },
        // { code: "TR", name: "Turkey" },
        // { code: "TM", name: "Turkmenistan" },
        // { code: "TC", name: "Turks and Caicos Islands" },
        // { code: "TV", name: "Tuvalu" },
        // { code: "UG", name: "Uganda" },
        // { code: "UA", name: "Ukraine" },
        // { code: "AE", name: "United Arab Emirates" },
        { code: "GB", name: "United Kingdom" }
        // { code: "US", name: "United States" },
        // { code: "UM", name: "United States Minor Outlying Islands" },
        // { code: "UY", name: "Uruguay" },
        // { code: "UZ", name: "Uzbekistan" },
        // { code: "VU", name: "Vanuatu" },
        // { code: "VE", name: "Venezuela, Bolivarian Republic of" },
        // { code: "VN", name: "Viet Nam" },
        // { code: "VG", name: "Virgin Islands, British" },
        // { code: "VI", name: "Virgin Islands, U.S." },
        // { code: "WF", name: "Wallis and Futuna" },
        // { code: "EH", name: "Western Sahara" },
        // { code: "YE", name: "Yemen" },
        // { code: "ZM", name: "Zambia" },
        // { code: "ZW", name: "Zimbabwe" }
      ],

      // stripe :"pk_test_tOSl2q9qkSGBZKVekWkYVFlW007SdTDmSx"  ,
      card: "",
      elements: "",
      stripe: "",
      coinId: ""
    };
  },
  methods: {
    confirmPay(stripe, card) {
      axios
        .get(this.$myUrl + "/api/getCoinIdByName?name=" + this.model.coin)
        .then(response => {
          console.log("kkkkkkkkk" + response.data);
          this.coinId = response.data;

          stripe
            .confirmCardPayment(localStorage.getItem("secret"), {
              payment_method: { card: card },
              shipping: {
                name: this.model.fullName,
                address: {
                  line1: this.coinId,
                  line2: this.model.pAddress,
                  city: this.model.city,
                  postal_code: this.model.postcode,
                  state: this.model.state,
                  country: this.model.country
                }
              }
            })
            .then(function(result) {
              if (result.error) {
                swal.fire({
                  type: "error",
                  title: "Oops..",
                  text: "Try Again!",
                  focusConfirm: false,
                  allowOutsideClick: false
                });
                console.log(result.error.message);
              } else {
                swal.fire({
                  type: "success",
                  title: "SUCCESS!",
                  text: "payment successfully ",
                  focusConfirm: false,
                  allowOutsideClick: false,
                  onClose: () => {
                    window.location.reload();
                  }
                });
              }
            });
        });
    },
    pay() {
      this.card.addEventListener("change", ({ error }) => {
        const displayError = document.getElementById("card-errors");
        if (error) {
          displayError.textContent = error.message;
        } else {
          displayError.textContent = "";
        }
      });

      this.stripe
        .createPaymentMethod({
          type: "card",
          card: this.card,
          billing_details: {
            name: "Jenny Rosen"
          }
        })
        .then(function(result) {
          // Handle result.error or result.paymentMethod
        });

      setTimeout(this.confirmPay(this.stripe, this.card), 4000);
    },
    validate() {
      return this.$validator.validateAll().then(res => {
        this.$emit("on-validated", res, this.model);
        return res;
      });
    },
    getError(fieldName) {
      return this.errors.first(fieldName);
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
    },

    sendMessageToParent() {
      this.$emit(
        "messageFromChild",
        this.model.cardNumber,
        this.model.amount,
        this.model.email
      );
    },

    afficheStripeComponent() {
      var style = {
        base: {
          color: "#32325d"
        }
      };

      // http://stripe.sqoin.exchange
      axios.get("https://sqoin.exchange/stripe/config").then(response => {
        this.stripe = Stripe(response.data.stripePublishableKey);
        this.elements = this.stripe.elements();
        this.card = this.elements.create("card", { style: style });
        this.card.mount("#card-element");
        this.card.style();
      });
    }
  },
  mounted: function() {
    this.afficheStripeComponent(),
      axios
        .get(this.$myUrl + "/api/getUserById?id=" + this.$currentUser, {
          timeout: 100000
        })
        .then(response => {
          this.user = response.data;
          this.model.address = this.user.address;
          this.model.email = this.user.email;
          this.model.city = this.user.city;
          this.model.fullName = this.user.last_name + "" + this.user.first_name;
          this.model.postCode = this.user.postcode;
        }),
        axios
        .get(
          this.$myUrl +
            "/api/getPublicAddressByUserId?coin=BASTOJI&userId=" +
            this.$currentUser,
          { timeout: 300000 }
        )
        .then(res => {this.model.pAddress=res.data.publickey})

    localStorage.setItem("amount", this.model.amount);
  }
};
</script>


<style scoped>
button {
  background: #157ed4 !important;
}
#card-element {
  padding: 12px;
  border: solid 1px #d8d8d8;
  width: 300px;
  border-radius: 4px;
  margin-bottom: 40px;
}
.row.justify-content-center > div {
  box-shadow: unset !important;
}
</style>
