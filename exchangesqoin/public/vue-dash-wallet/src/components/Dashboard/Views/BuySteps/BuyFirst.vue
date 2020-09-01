<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-sm-8 card" style="margin-top:5%;">
        <div class="row">
          <div class="col-sm-3">
            <fg-input label="Coin" required :error="getError('Coin')">
              <el-select
                placeholder
                class="select-default"
                name="Coin"
                v-model="model.coin"
                filterable
                clearable
                remote
                reserve-keyword
                :remote-method="remoteMethod"
                :loading="loading"
                v-validate="modelValidations.coin"
                v-on:change="fillPublicKey"
              >

                <el-option
                  class="select-default"
                  v-for="item in options"
                  :key="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
            </fg-input>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-3">
            <fg-input required label="Amount:" :error="getError('Amount')">
              <el-input
                name="Amount"
                clearable
                v-model="model.amount"
                v-validate="modelValidations.amount"
                v-on:change="fillAmount"
              ></el-input>
            </fg-input>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "BuyFirst",
  components: {},
  props: 
    ["model"],
    
  data() {
    return {
      options: [],
      value: [],
      listCoins: [],
      loading: false,
      modelValidations: {
        coin: {
          required: true
        },
        amount: {
          required: true,
          decimal: true
        }
      }
    };
  },
  methods: {
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    validate() {
      return this.$validator.validateAll().then(res => {
        this.$emit("on-validated", res, this.model);
        return res;
      });
    },
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.options = this.listCoins.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.options = [];
      }
    },

     fillPublicKey: function fillPublicKey() {
       if((this.$currentUser!==null)&&(this.$currentUser!==undefined)){
       axios
      .get(
        this.$myUrl +
          "/api/getPublicAddressByUserId?userId=" +
          this.$currentUser +
          "&coin=" +
          this.model.coin
      )
      .then(response => {
        this.model.pAddress = response.data.publickey
        }
        );

   
    }
  },

     fillAmount: function fillAmount() {
          localStorage.setItem('amount', this.model.amount);
     }
  },
  mounted() {
   
    if(this.$currentUser === undefined){
        //window.location.href = 'https://sqoin.exchange/account/sign-in';
      }
   
    var self = this;
    if((this.$currentUser!==null)&&(this.$currentUser!==undefined)){
    axios.get(this.$myUrl + "/api/getAllCoinByUser?userId="+ this.$currentUser)
    .then(response => {
      var json = response.data;
      console.log(response.data)
      json.map(el => {
        self.listCoins.push({ value: el.name, label: el.name });
      });
    });
    }


   
  }

 
};
</script>
