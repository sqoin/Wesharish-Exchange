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
                    <h3 class="card-title" style="color:white;">Register</h3>
                    <router-link to="./login" style="text-decoration:none;">
                      <el-button
                        class="back-btn"
                        icon="el-icon-arrow-left"
                        style="float:left;"
                        size="mini"
                      >Back</el-button>
                    </router-link>
                  </template>
                  <el-form :model="form" ref="form" label-width="120px" class="demo-dynamic">
                    <el-form-item prop="email" label="Email:">
                      <div class="col-sm-4">
                        <fg-input required :error="getError('Email')">
                          <el-input
                            name="Email"
                            size="small"
                            v-model="form.email"
                          ></el-input>
                        </fg-input>
                      </div>
                    </el-form-item>


                      <el-form-item prop="password" label="Password:">
                      <div class="col-sm-4">
                        <fg-input required :error="getError('password')">
                          <el-input
                            name="Email"
                            size="small"
                            v-model="form.password"
                          ></el-input>
                        </fg-input>
                      </div>
                    </el-form-item>


                  
                   <el-form-item prop="firstname" label="First Name:">
                      <div class="col-sm-4">
                        <fg-input required :error="getError('First Name')">
                          <el-input
                            name="First Name"
                            size="small"
                            v-model="form.firstname"
                          ></el-input>
                        </fg-input>
                      </div>
                    </el-form-item>

                     <el-form-item prop="lastname" label="Last Name:">
                      <div class="col-sm-4">
                        <fg-input required :error="getError('Last Name')">
                          <el-input
                            name="Last Name"
                            size="small"
                            v-model="form.lastname"
                          ></el-input>
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

                    <el-form-item prop="zipCode" label="Zip Code:">
                      <div class="col-sm-4">
                        <fg-input required :error="getError('Zip Code')">
                          <el-input
                            name="Zip Code"
                            size="small"
                            v-model="form.zip"
                           
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
        email: "",
        firstname:"",
        lastname:"",
        zip:"",
        mobile: "",
        password: "",
        acceptTerms: false
      }
    };
  },
  methods: {
    submitForm(formName) {
      let self = this;
      this.$validator.validateAll().then(res => {
        if (res && this.form.acceptTerms) {
          self.register()
       
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
    },

     updateUserInfromations(id){

    let url = this.$myUrlNode;

     let body = {

           "firstname":this.form.firstname ,
           "lastname": this.form.lastname,
            "phone": this.form.mobile,
             "zip": this.form.zip

         }

          return new Promise(function(accept, reject) {
          axios
          .put(url + "api/updateAdminDetails?id="+id, body)
          .then(
            response => {
                 alert("success!")
                window.location.href = "/#/login";
               
                
              /*accept({
              
              }),
              reject({})*/
            }
          )
          .catch(error => {
            console.log(error);
            reject(error);
          })

           })

  },

  register(){
      let self = this;
     let url = this.$myUrlOauth;
         let body = {

           "email":this.form.email ,

           "password": this.form.password

         }
         return new Promise(function(accept, reject) {
        axios
          .post(url + "app/register", body)
          .then(
            response => {
              

                let id =response.data.id
                return id;
               
                
              /*accept({
              
              }),
              reject({})*/
            }
          )
          .then(res=>{
            console.log("ress"+res)
              self.updateUserInfromations(res)
          })
          .catch(error => {
            console.log(error);
            reject(error);
          })

           })
  }
  },

 
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