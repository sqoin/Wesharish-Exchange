import Vue from "vue";
import "./plugins/axios";
import "./pollyfills";
import VueRouter from "vue-router";
import VueRouterPrefetch from "vue-router-prefetch";
import VeeValidate from "vee-validate";
import App from "./App.vue";
import Axios from "axios";
import ElementUI from "element-ui";
import locale from "element-ui/lib/locale/lang/en";
// Plugins
import GlobalComponents from "./globalComponents";
import GlobalDirectives from "./globalDirectives";
import SideBar from "./components/UIComponents/SidebarPlugin";
import initProgress from "./progressbar";
import Toasted from "vue-toasted";
import VueClipboard from "vue-clipboard2";
import JsonCSV from "vue-json-csv";

// router setup
import routes from "./routes/routes";
// library imports
import "./assets/sass/paper-dashboard.scss";
import "./assets/sass/demo.scss";
import sidebarLinks from "./sidebarLinks";
import "./registerServiceWorker";
import VueStripeCheckout from 'vue-stripe-checkout';
// plugin setup
Vue.component("downloadCsv", JsonCSV);
Vue.use(VueClipboard);
Vue.use(ElementUI, { locale });
Vue.use(VueRouter);
Vue.use(VueRouterPrefetch);
Vue.use(GlobalDirectives);
Vue.use(GlobalComponents);
Vue.use(Toasted);
Vue.use(SideBar, { sidebarLinks: sidebarLinks });
Vue.use(VeeValidate, {
  fieldsBagName: "veeFields"
});



Vue.prototype.$currentUser = 41, 

// Global Variables
Vue.prototype.$http = Axios;

//Vue.prototype.$myUrl = "https://sqoin.exchange";

Vue.prototype.$myUrl = "http://18.218.152.243";
//Vue.prototype.$myUrll="http://localhost:8082/vue-dash-wallet/dist/";
//"https://sqoin.exchange";
//Vue.prototype.$currentUser ;

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkActiveClass: "active",
  scrollBehavior: to => {
    if (to.hash) {
      return { selector: to.hash };
    } else {
      return { x: 0, y: 0 };
    }}
});
initProgress(router);
/* eslint-disable no-new */
new Vue({
  mounted: function() {
   /*
    axios
    .get(this.$myUrl + "/userWallet/api/users/current")
    .then(response =>{ 
      Vue.prototype.$currentUser = response.data.id ;
      if(this.$currentUser == undefined){
        console.log("here !!");
       // window.location.href = 'https://sqoin.exchange/account/sign-in';
       //window.location.href = 'www.google.com';
      }
    },
    error => {
      alert(error);
    }
    ),
      
    axios.get("https://sqoin.exchange/stripe/config").then(response => {
      var json = response.data;
      Vue.prototype.$stripe = Stripe(response.data.stripePublishableKey);
       Vue.use(VueStripeCheckout, {
        publishableKey: response.data.stripePublishableKey,
        //'pk_test_elDtRaysolKWkoA9HyPzKg1000aLSNbC5h',
      });
       
     
      });
 
*/
    },
  el: "#app",
  render: h => h(App),
  router
 
 
});
