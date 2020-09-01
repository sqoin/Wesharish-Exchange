<template>
  <div class="myprofilesettings">
    <div class="row d-flex justify-content-center">
      <div class="col-sm-6">
        <card id="userSettings">
          <h4 slot="header" class="card-title">
            <i class="el-icon-s-operation"></i> User Settings
          </h4>
          <card type="pricing" class="card-plain">
            <h6 slot="header" class="card-category" style="color:red;">Delete Account Permanently</h6>
            <div class="card-icon icon-danger">
              <i class="el-icon-delete"></i>
            </div>
            <h6 class="card-title">Remember!</h6>
            <ul>
              <li>This Action Cannot Be Undone</li>
            </ul>
            <p-button slot="footer" type="danger" round class="btn-neutral">Confirm</p-button>
          </card>
        </card>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {}
};
</script>
<style scoped>
/* #userSettings {
  background: #82a9d0;
}
#userSettings h4,
#userSettings .card-header h6,
#userSettings li {
  color: white !important;
}
#userSettings h6 {
  font-size: 16px;
  font-weight: 600;
}
#userSettings .card-body h6 {
  color: #9c0b0b;
} */
.card-pricing .card-icon i {
  border: 2px solid #9c0b0b !important;
  color: #9c0b0b;
}
#userSettings .card-header h6 {
  color: #9c0b0b !important;
  font-weight: 600;
}
</style>