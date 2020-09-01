<template>
  <div class="support">
    <div class="row d-flex justify-content-center">
      <div class="col-sm-6 mr-auto ml-auto">
        <card>
          <h4 slot="header" class="card-title">
            <i class="nc-icon nc-email-85"></i> Submit A Support Ticket
          </h4>
          <div class="col-sm-8 mr-auto ml-auto">
            <fg-input label="Choose a request type:" required :error="getError('Request type')">
              <el-select
                name="Request type"
                clearable
                class="select-warning"
                size="large"
                v-model="model.type"
                v-validate="modelValidations.type"
              >
                <el-option
                  v-for="option in selects.requests"
                  class="select-warning"
                  :value="option.value"
                  :label="option.label"
                  :key="option.label"
                ></el-option>
              </el-select>
            </fg-input>
          </div>
          <div class="col-sm-8 mr-auto ml-auto">
            <fg-input label="Your email address:" required :error="getError('Email')">
              <el-input
                name="Email"
                clearable
                v-model="model.email"
                v-validate="modelValidations.email"
              ></el-input>
            </fg-input>
            <fg-input label="Subject:" required :error="getError('Subject')">
              <el-input
                name="Subject"
                clearable
                v-model="model.subject"
                v-validate="modelValidations.subject"
              ></el-input>
            </fg-input>
          </div>
          <div class="col-sm-8 mr-auto ml-auto">
            <fg-input label="Description:" required :error="getError('Description')">
              <el-input
                name="Description"
                type="textarea"
                v-model="model.description"
                :autosize="{ minRows: 8, maxRows: 24}"
                maxlength="520"
                show-word-limit
                v-validate="modelValidations.description"
              ></el-input>
            </fg-input>
          </div>
          <div class="col-sm-4 mr-auto ml-auto">
            <p-button type="warning" round outline @click="onSubmit">Submit</p-button>
          </div>
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
      model: {
        type: "",
        email: "",
        subject: "",
        description: ""
      },
      modelValidations: {
        type: {
          required: true
        },
        subject: {
          required: true
        },
        email: {
          required: true,
          email: true
        },
        description: {
          required: true
        }
      },
      selects: {
        simple: "",
        requests: [
          { value: "Bug", label: "Bug" },
          { value: "Feature Request", label: "Feature Request" },
          { value: "How To", label: "How To" },
          { value: "Sales Question", label: "Sales Question" },
          { value: "Technical Issue", label: "Technical Issue" }
        ],
        multiple: "ARS"
      }
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
          this.$toasted.success("Submission Successful!", {
            position: "top-right",
            duration: "1500",
            iconPack: "fontawesome",
            icon: { name: "fa-check-circle", after: false },
            theme: "outline"
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.card .card-body > div:last-child {
  text-align: center;
}
</style>