<template>
  <div class="lock-page">
    <app-navbar></app-navbar>
    <div class="wrapper wrapper-full-page">
      <div class="full-page lock-page section-image" filter-color="black">
        <!--   you can change the color of the filter page using: data-color="blue | green | orange | red | purple" -->
        <div class="content">
          <div class="container">
            <div class="col-lg-4 col-md-6 ml-auto mr-auto">
              <card type="lock" class="text-center">
                <img slot="header" src="static/img/user-logo.png" alt="..." />
                <h4 class="card-title">{{user.first_name}}&nbsp;{{user.last_name}}</h4>
                <fg-input
                  name="Password"
                  type="password"
                  placeholder="Enter Password.."
                  v-model="password"
                  v-validate="modelValidations.password"
                  :error="getError('Password')"
                ></fg-input>
                <p-button slot="footer" type="default" round outline @click="onSubmit()">Unlock</p-button>
              </card>
            </div>
          </div>
        </div>
        <app-footer></app-footer>
        <div
          class="full-page-background"
          style="background-image: url(static/img/background/blockchain-lock-bg.jpg) "
        ></div>
      </div>
    </div>
  </div>
</template>
<script>
import AppNavbar from "./Layout/AppNavbar";
import AppFooter from "./Layout/AppFooter";

export default {
  components: {
    AppNavbar,
    AppFooter
  },
  data() {
    return {
      password: "",
      user: "",
      modelValidations: {
        password: {
          required: true
        }
      }
    };
  },
  methods: {
    onSubmit() {
      this.$validator.validateAll().then(res => {
        if (res) {
          window.location.href = "/#/";
        } else {
          return false;
        }
      });
    },
    getError(fieldName) {
      return this.errors.first(fieldName);
    }
  },
  mounted: function() {
  /* axios
      .get(this.$myUrl + "/userWallet/api/users/current")
    .then(response => 
      ((this.$currentUser = response.data.id),
          axios
              .get(this.$myUrl + "/api/getUserById?id=" + this.$currentUser,{ timeout: 100000 })
              .then(response => (this.user = response.data))
      ));*/
  }
};
</script>
<style>
</style>
