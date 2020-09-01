<template>
  <div class="wallet">
    <div class="row d-flex justify-content-center">
      <div class="col-sm-4 mr-auto ml-auto">
        <card card-body-classes="text-center" style="margin-top:10%;">
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
            <h5 slot="header" class="card-title text-center">sQoin Wallet</h5>
            <p class="text-muted text-center">Cart #6294817815003136 for customer@sqoin.com</p>
            <p class="text-muted text-center">$20.99 USD</p>
            <hr />
          </template>
          <template></template>
        </card>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Wallet",
  components: {},
  data() {
    return {};
  },
  mounted: function() {},
  methods: {}
};
</script>
<style scoped>
.back-btn {
  color: black;
  border: 0px;
  background-color: transparent;
}
</style>