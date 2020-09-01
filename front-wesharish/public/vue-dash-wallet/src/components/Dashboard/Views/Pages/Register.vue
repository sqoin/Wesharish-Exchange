<template>
  <div class="register-page">
    <app-navbar></app-navbar>
    <div class="wrapper wrapper-full-page">
      <div class="full-page register-page section-image" filter-color="black">
        <div class="content">
          <div class="container">
            <div class="row">
              <div class="col-sm-12 mr-auto ml-auto">
                <card type="signup" class="text-center" style="min-height:640px;">
                  <template slot="header">
                    <h3 class="card-title" style="color:white;">Register As A Merchant</h3>
                    <router-link to="./myprofile" style="text-decoration:none;">
                      <el-button
                        class="back-btn"
                        icon="el-icon-arrow-left"
                        style="float:left;"
                        size="mini"
                      >Back</el-button>
                    </router-link>
                  </template>
                  <el-form :model="form" ref="form" label-width="120px" class="demo-dynamic">
                    <el-form-item prop="merchantId" label="Merchant ID:">
                      <div class="col-sm-4">
                        <fg-input required :error="getError('Merchant ID')">
                          <el-input
                            name="Merchant ID"
                            size="small"
                            v-model="form.merchantId"
                            v-validate="modelValidations.merchantId"
                          ></el-input>
                        </fg-input>
                      </div>
                    </el-form-item>
                    <el-form-item
                      v-for="(domain, index) in form.domains"
                      :label="'Domain' +' '+ (index+1)"
                      :key="domain.key"
                      :prop="'domains.' + index + '.value'"
                    >
                      <div class="col-sm-4">
                        <fg-input required :error="getError('Domain')">
                          <el-input
                            name="Domain"
                            size="small"
                            v-model="domain.value"
                            v-validate="modelValidations.domain"
                          ></el-input>
                          <el-button
                            type="text"
                            class="rm-btn"
                            v-if="index!==0"
                            style="position:absolute;float:left;margin-top:2%;"
                            size="mini"
                            @click.prevent="removeDomain(domain)"
                            icon="el-icon-delete"
                            circle
                          ></el-button>
                          <el-button
                            type="text"
                            class="add-btn"
                            v-if="index===0"
                            style="position:absolute;float:left;margin-top:2%;"
                            size="mini"
                            @click="addDomain"
                            icon="el-icon-circle-plus-outline"
                            circle
                          ></el-button>
                        </fg-input>
                      </div>
                    </el-form-item>
                    <el-form-item prop="mobile" label="Mobile number:">
                      <div class="col-sm-4">
                        <fg-input required :error="getError('Mobile number')">
                          <el-input
                            name="Mobile number"
                            size="small"
                            v-model="form.mobile"
                            v-validate="modelValidations.mobile"
                          ></el-input>
                        </fg-input>
                      </div>
                    </el-form-item>
                    <el-form-item style="position:absolute;bottom:0px;">
                      <p-checkbox class="text-left" v-model="form.acceptTerms">
                        I agree to the
                        <a href="#something">terms and conditions</a>.
                      </p-checkbox>
                      <el-button
                        class="reset-btn"
                        size="mini"
                        icon="el-icon-refresh-left"
                        @click="resetForm('form')"
                      >Reset</el-button>
                      <el-button
                        class="register-btn"
                        type="primary"
                        size="mini"
                        @click="submitForm('form')"
                      >Register</el-button>
                    </el-form-item>
                  </el-form>
                </card>
              </div>
            </div>
          </div>
        </div>
        <app-footer></app-footer>
        <div
          class="full-page-background"
          style="background-image: url(static/img/background/eftakher-alam-unsplash.jpg) "
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
      modelValidations: {
        merchantId: {
          required: true,
          regex: /^(?=[a-z_\d]*[a-z])[a-z_\d]{6,}$/i
        },
        mobile: {
          required: true,
          numeric: true
        },
        domain: {
          required: true,
          url: true
        }
      },
      form: {
        domains: [
          {
            key: 1,
            value: ""
          }
        ],
        merchantId: "",
        mobile: "",
        acceptTerms: false
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$validator.validateAll().then(res => {
        if (res && this.form.acceptTerms) {
          alert("submit!");
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.form.acceptTerms = false;
      this.form.domains = [
        {
          key: 1,
          value: ""
        }
      ];
    },
    removeDomain(item) {
      var index = this.form.domains.indexOf(item);
      if (index !== -1 && index !== 0) {
        this.form.domains.splice(index, 1);
      }
    },
    addDomain() {
      if (this.form.domains.length !== 3) {
        this.form.domains.push({
          key: Date.now(),
          value: ""
        });
      }
    },
    getError(fieldName) {
      return this.errors.first(fieldName);
    }
  }
};
</script>
<style scoped>
.back-btn {
  color: white;
  border: 0px;
  background-color: transparent;
}
.back-btn:hover,
.back-btn:focus {
  background-color: transparent;
  color: #b4bbbe;
  outline: none;
}
.reset-btn {
  color: white;
  border: 0px;
  background-color: transparent;
}
.reset-btn:hover,
.reset-btn:focus {
  background-color: transparent;
  color: #b4bbbe;
  outline: none;
}
.register-btn {
  border: 1px solid;
}
.register-btn:hover,
.register-btn:focus {
  background-color: transparent;
  color: #409eff;
}
.rm-btn {
  color: white;
  background-color: transparent;
  outline: none;
}
.rm-btn:hover,
.rm-btn:focus {
  background-color: transparent;
  color: white;
}
.add-btn {
  color: white;
  background-color: transparent;
  outline: none;
}
.add-btn:hover,
.add-btn:focus {
  background-color: transparent;
  color: white;
}
.text-center {
  background-color: rgba(80, 79, 79, 0.4);
}
.demo-dynamic {
  margin-left: 30%;
}
.el-form-item__label {
  color: white !important;
}
</style>