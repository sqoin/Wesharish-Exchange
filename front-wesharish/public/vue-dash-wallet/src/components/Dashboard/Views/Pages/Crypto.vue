<template>
  <div class="crypto">
    <div class="row d-flex justify-content-center">
      <div class="col-sm-4 mr-auto ml-auto">
        <card card-body-classes="text-center" style="margin-top:10%;" v-loading="loading">
          <template slot="header">
            <router-link to="/checkout" style="text-decoration:none;">
              <el-button
                class="back-btn"
                icon="el-icon-arrow-left"
                style="float:left;"
                size="mini"
              >Back</el-button>
            </router-link>
            <br />
            <h5 slot="header" class="card-title text-center">e-Store</h5>
            <p class="text-muted text-center">Cart #6294817815003136 for customer@sqoin.com</p>
            <p class="text-muted text-center">$20.99 USD</p>
            <hr />
          </template>
          <template v-if="selector">
            <div
              class="row d-flex justify-content-center"
              v-for="(coin,index) in listCoins"
              :key="index"
            >
              <el-button class="cryptoMenu" @click="handler(coin.coin)">
                {{coin.coin}}
                <i class="el-icon-arrow-right"></i>
              </el-button>
            </div>
          </template>
          <template v-else>
            <p>To make a payment, send {{selected}} to the address below.</p>
            <fg-input label="Amount:">
              <el-input disabled></el-input>
            </fg-input>
            <fg-input label="Public Address:">
              <el-input disabled></el-input>
            </fg-input>
            <p class="text-muted">
              <i class="el-icon-loading"></i> Awaiting payment...
            </p>
            <el-popover placement="top" width="150">
              <qrcode-vue style="text-align:center;" :value="'azerty'" :size="size" level="H"></qrcode-vue>
              <el-button
                plain
                type="default"
                icon="fa fa-qrcode"
                slot="reference"
              >&nbsp;Show QR Code</el-button>
            </el-popover>
            <br />
            <el-button
              class="back-btn"
              icon="el-icon-back"
              style="float:left;"
              size="mini"
              @click="selector=true"
            >Change Coin</el-button>
          </template>
        </card>
      </div>
    </div>
  </div>
</template>
<script>
import QrcodeVue from "qrcode.vue";
export default {
  name: "Crypto",
  components: {
    QrcodeVue
  },
  data() {
    return {
      size: 100,
      listCoins: [],
      loading: true,
      selector: true,
      selected: "",
      dialogVisible: false
    };
  },
  mounted: function() {
    var self = this;
    /*axios.get(this.$myUrl + "/api/getAllCoinName").then(response => {
      var json = response.data;
      json.map(el => {
        self.listCoins.push({ coin: el.name });
      });
      this.loading = false;
    });*/
  },
  methods: {
    handler(coin) {
      this.selected = coin;
      this.selector = false;
    }
  }
};
</script>
<style scoped>
.back-btn {
  color: black;
  border: 0px;
  background-color: transparent;
}
.cryptoMenu {
  border: 0px;
  background-color: transparent;
}
</style>