<template>
  <div class="editmyprofile">
    <div class="row d-flex justify-content-center">
      <div class="col-sm-8 mr-auto ml-auto">
        <card card-body-classes="text-center" id="editProfile">
          <h4 slot="header" class="card-title">
            <i class="nc-icon nc-badge"></i> Edit Profile
          </h4>
          <div class="col-sm-10 mr-auto ml-auto">
            <div class="row">
              <div class="col-sm-12">
                <div class="picture-container">
                  <el-upload
                    class="avatar-uploader"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :show-file-list="false"
                    :before-upload="beforeUpload"
                    :on-success="handleSuccess"
                  >
                    <h6
                      v-if="model.imageUrl==='static/img/user-logo.png'"
                      class="description"
                    >Choose Avatar</h6>
                    <div slot="tip" class="el-upload__tip">
                      <small
                        v-if="model.imageUrl==='static/img/user-logo.png'"
                      >jpg/png files with a size less than 250kb</small>
                    </div>
                    <img v-if="model.imageUrl" :src="model.imageUrl" class="avatar">
                  </el-upload>
                  <br>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-6">
                <fg-input label="Username:" required :error="getError('Username')">
                  <el-input
                    clearable
                    name="Username"
                    v-model="model.username"
                    v-validate="modelValidations.username"
                  ></el-input>
                </fg-input>
              </div>
              <div class="col-sm-6">
                <fg-input label="Email:" required :error="getError('Email')">
                  <el-input
                    clearable
                    name="Email"
                    v-model="model.email"
                    v-validate="modelValidations.email"
                  ></el-input>
                </fg-input>
              </div>
              <div class="col-sm-12">
                <fg-input label="Address:" required :error="getError('Address')">
                  <el-input
                    clearable
                    name="Address"
                    v-model="model.address"
                    v-validate="modelValidations.address"
                  ></el-input>
                </fg-input>
              </div>
            </div>

            <div class="row">
              <div class="col-sm-3">
                <fg-input label="City:" required :error="getError('City')">
                  <el-input
                    clearable
                    name="City"
                    v-model="model.city"
                    v-validate="modelValidations.city"
                  ></el-input>
                </fg-input>
              </div>
              <div class="col-sm-3">
                <fg-input label="Postcode:" required :error="getError('Postcode')">
                  <el-input
                    clearable
                    name="Postcode"
                    v-model="model.postCode"
                    v-validate="modelValidations.postCode"
                  ></el-input>
                </fg-input>
              </div>
              <div class="col-sm-3">
                <fg-input label="Date of birth" required :error="getError('Date of birth')">
                  <el-date-picker
                    name="Date of birth"
                    prefix-icon="false"
                    v-model="model.date"
                    type="date"
                    v-validate="modelValidations.date"
                  ></el-date-picker>
                </fg-input>
              </div>
              <div class="col-sm-3">
                <fg-input label="Place of birth:" required :error="getError('Place of birth')">
                  <el-input
                    clearable
                    name="Place of birth"
                    v-model="model.place"
                    v-validate="modelValidations.place"
                  ></el-input>
                </fg-input>
              </div>
            </div>
          </div>
          <el-col :span="4" :offset="10">
            <p-button type="warning" outline block round @click="onSubmit">Update</p-button>
          </el-col>
        </card>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      user: "",
      model: {
        username: "",
        date: "",
        city: "",
        place: "",
        postCode: "",
        currency: "",
        address: "",
        email: "",
        imageUrl: "static/img/user-logo.png"
      },
      modelValidations: {
        address: {
          required: true
        },
        city: {
          required: true,
          regex: /^[a-z\s]{0,255}$/i
        },
        currency: {
          required: true
        },
        postCode: {
          required: true,
          numeric: true
        },
        username: {
          required: true,
          regex: /^(?=[a-z_\d]*[a-z])[a-z_\d]{6,}$/i
        },
        email: {
          required: true,
          email: true
        },
        place: {
          required: true,
          regex: /^[a-z\s]{0,255}$/i
        },
        date: {
          required: true
        }
      },
      currencies: [
        { symbol: "$", name: "USD" },
        { symbol: "£", name: "GBP" },
        { symbol: "€", name: "EURO" }
      ]
    };
  },
  methods: {
    validate() {
      return this.$validator.validateAll().then(res => {
        this.$emit("on-validated", res, this.model);
        return res;
      });
    },
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    onSubmit() {
      this.$validator.validateAll().then(res => {
        if (res) {
          let postBody = {
            user_name: this.model.username,
            email: this.model.email,
            birthDate: this.model.date,
            address: this.model.address,
            lang: "eng",
            birthPlace: this.model.place,
            city: this.model.city,
            postcode: this.model.postCode,
            custom: this.model.currency,
            id: this.$currentUser
          };
          if (this.$currentUser !== null && this.$currentUser !== undefined) {
            axios
              .post(
                this.$myUrl + "/api/updateUser?id=" + this.$currentUser,
                postBody
              )
              .then(response =>
                this.$toasted.success("Profile Updated!", {
                  position: "top-right",
                  duration: "3000",
                  iconPack: "fontawesome",
                  icon: { name: "fa-check-circle", after: false },
                  theme: "toasted-primary"
                })
              )
              .catch(error => {
                console.log(error);
              });
          }
        } else {
          return false;
        }
      });
    },

    handleSuccess(res, file) {
      if (res) {
        this.model.imageUrl = URL.createObjectURL(file.raw);
      }
    },
    beforeUpload(file) {
      let isIMG = file.type.match("jpeg|png");
      const isLt = file.size / 1024 / 1024 < 0.25;
      if (!isIMG) {
        this.$message.error("Avatar picture must be JPG or PNG format!");
      }
      if (!isLt) {
        this.$message.error("Avatar picture size can not exceed 250 KB!");
      }
      if (isIMG === undefined || isIMG === null) {
        isIMG = false;
      }
      return isIMG && isLt;
    }
  },
  mounted: function() {
    
        axios
          .get(this.$myUrl + "/api/getUserById?id=" + localStorage.getItem('id'), {
            timeout: 100000
          })
          .then(
            response =>
              (this.user = response.data)(
                (this.model.username = response.data.user_name)
              ),
            (this.model.date = response.data.date_of_birth),
            (this.model.city = response.data.city),
            (this.model.place = response.data.place_of_birth),
            (this.model.postCode = response.data.postcode),
            (this.model.address = response.data.address),
            (this.model.email = response.data.email),
            (this.model.currency = response.data.currency)
          );
      
  

    /* axios
      .get(this.$myUrl + "/api/getUserById?id=" + this.$currentUser)
      .then(
        response => (
          (this.model.username = response.data.user_name),
          (this.model.date = response.data.date_of_birth),
          (this.model.city = response.data.city),
          (this.model.place = response.data.place_of_birth),
          (this.model.postCode = response.data.postcode),
          (this.model.address = response.data.address),
          (this.model.email = response.data.email),
          (this.model.currency = response.data.currency)
        )
      );*/
  }
};
</script>
<style scoped>
.picture-container .avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>