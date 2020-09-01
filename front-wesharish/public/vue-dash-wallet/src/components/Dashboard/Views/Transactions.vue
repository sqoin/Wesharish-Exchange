<template>
  <div class="transactions">
    <div class="row">
      <div class="col-sm-12">
        <h4 class="title">
          <i class="el-icon-finished"></i> Transactions
        </h4>
      </div>
      <div class="col-sm-12 card">
        <div class="card-header row">
          <div class="col-sm-1">
            <el-select class="select-warning" v-model="pagination.perPage" placeholder="Per page">
              <el-option
                class="select-warning"
                v-for="item in pagination.perPageOptions"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </div>
          <div class="col-sm-3"></div>
          <div class="col-sm-2">
            <fg-input label="From">
              <el-date-picker
                prefix-icon="false"
                v-model="dateTimePicker1"
                type="datetime"
                clearable
                time-arrow-control
                editable
                placeholder="Select date and time"
                format="dd-MM-yyyy | HH:mm:ss"
              ></el-date-picker>
            </fg-input>
          </div>
          <div class="col-sm-2">
            <fg-input label="To">
              <el-date-picker
                prefix-icon="false"
                v-model="dateTimePicker2"
                type="datetime"
                clearable
                time-arrow-control
                editable
                placeholder="Select date and time"
                format="dd-MM-yyyy | HH:mm:ss"
              ></el-date-picker>
            </fg-input>
          </div>
          <div class="col-sm-4">
            <div class="pull-right search">
              <fg-input
                class="input-sm"
                placeholder="Type to search"
                v-model="searchQuery"
                addon-right-icon="nc-icon nc-zoom-split"
              ></fg-input>
            </div>
          </div>
        </div>
        <div>
          <download-csv :data="queriedData" name="Transactions.csv">
            <small>
              <el-link icon="el-icon-link" :underline="false" type="success">Export As .CSV</el-link>
            </small>
          </download-csv>
        </div>
        <div class="card-body row">
          <div class="col-sm-12 mt-2">
            <el-table
              border
              size="mini"
              v-loading="loading"
              class="table-striped"
              :data="queriedData"
              :default-sort="{prop: 'time', order: 'descending'}"
              style="width: 100%"
              :cell-class-name="cellStyle"
            >
              <el-table-column type="expand">
                <template slot-scope="props">
                  <small style="line-height:0%">
                    <p style="font-weight:bold;float: left;">Transaction ID: &nbsp;</p>
                    <p>{{(props.row.transactionid === null || props.row.transactionid === undefined) ? "N/A" :props.row.transactionid}}</p>
                    <p style="font-weight:bold;float: left;">Recipient Username: &nbsp;</p>
                    <p>{{(props.row.usertoname === null || props.row.usertoname === undefined) ? "N/A" :props.row.usertoname}}</p>
                    <p style="font-weight:bold;float: left;">Sender Username: &nbsp;</p>
                    <p>{{(props.row.userfromname === null || props.row.userfromname === undefined) ? "N/A" :props.row.userfromname}}</p>
                    <p style="font-weight:bold;float: left;">Sender Address: &nbsp;</p>
                    <p>{{(props.row.publickeysender === null || props.row.publickeysender === undefined) ? "N/A" :props.row.publickeysender}}</p>
                    <p style="font-weight:bold;float: left;">Status: &nbsp;</p>
                    <p>{{(props.row.state === null || props.row.state === undefined) ? "N/A" :props.row.state}}</p>
                  </small>
                  <el-tooltip content="Copy to clipboard" placement="top" effect="light">
                    <el-button
                      plain
                      size="mini"
                      icon="el-icon-document-copy"
                      @click="copied"
                      v-clipboard:copy="'Transaction ID: '+((props.row.transactionid === null || props.row.transactionid === undefined) ? 'N/A' :props.row.transactionid)+'\n'+'Recipient Username: '+((props.row.usertoname === null || props.row.usertoname === undefined) ? 'N/A' :props.row.usertoname)+'\n'+'Sender Username: '+((props.row.userfromname === null || props.row.userfromname === undefined) ? 'N/A' :props.row.userfromname)+'\n'+'Sender Address: '+((props.row.publickeysender === null || props.row.publickeysender === undefined) ? 'N/A' :props.row.publickeysender)+'\n'+'Status: '+((props.row.state === null || props.row.state === undefined) ? 'N/A' :props.row.state)"
                    >Copy</el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column
                key="Date & Time"
                prop="time"
                label="Date & time"
                :formatter="dateFormat"
              ></el-table-column>
              <el-table-column key="Sender" prop="userfromname" label="Sender"></el-table-column>
              <el-table-column key="Recipient" prop="usertoname" label="Recipient"></el-table-column>
              <el-table-column key="Status" prop="state" label="Status"></el-table-column>
              <el-table-column key="Amount" prop="amount" label="Amount">
                <template slot-scope="scope">
                  <!-- <el-tag style="float:right;" size="mini">{{scope.row.coinname}}</el-tag>
                  &nbsp;-->
                  {{scope.row.amount}}
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="col-sm-6 pagination-info">
            <p class="category">Showing {{from + 1}} to {{to}} of {{total}} entries</p>
          </div>
          <div class="col-sm-6">
            <p-pagination
              class="pull-right"
              v-model="pagination.currentPage"
              :per-page="pagination.perPage"
              :total="pagination.total"
            ></p-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PPagination from "@/components/UIComponents/Pagination.vue";
import moment from "moment";
export default {
  name: "Transactions",
  components: {
    PPagination
  },
  computed: {
    pagedData() {
      return this.transactions.slice(this.from, this.to);
    },
    /***
     * Searches through table data and returns a paginated array.
     * Note that this should not be used for table with a lot of data as it might be slow!
     * Do the search and the pagination on the server and display the data retrieved from server instead.
     * @returns {computed.pagedData}
     */
    queriedData() {
      let self = this;
      let result = this.transactions.filter(row => {
        let isIncluded = false;
        if (
          row["userfromname"] !== this.currentUsername &&
          row["usertoname"] !== this.currentUsername
        ) {
          return false;
        }
        if (
          this.dateTimePicker1 !== null &&
          this.dateTimePicker1.length === undefined
        ) {
          if (new Date(row["time"]) <= this.dateTimePicker1) return false;
        }
        if (
          this.dateTimePicker2 !== null &&
          this.dateTimePicker2.length === undefined
        ) {
          if (new Date(row["time"]) >= this.dateTimePicker2) return false;
        }
        for (let key of self.propsToSearch) {
          if (row[key] === null || row[key] === undefined) {
            continue;
          }
          let rowValue = row[key].toString().toLowerCase();
          if (
            rowValue.includes &&
            rowValue.includes(this.searchQuery.toLowerCase())
          ) {
            isIncluded = true;
          }
        }
        return isIncluded;
      });
      this.pagination.total = result.length;
      return result.slice(this.from, this.to);
    },
    to() {
      let highBound = this.from + this.pagination.perPage;
      if (this.total < highBound) {
        highBound = this.total;
      }
      return highBound;
    },
    from() {
      return this.pagination.perPage * (this.pagination.currentPage - 1);
    },
    total() {
      this.pagination.total = this.count;
      return this.count;
    }
  },
  data() {
    return {
      loading: true,
      transactions: [],
      currentUsername: "",
      count: 0,
      dateTimePicker1: "",
      dateTimePicker2: "",
      pagination: {
        perPage: 5,
        currentPage: 1,
        perPageOptions: [5, 10, 25, 50],
        total: 0
      },
      coinNames: [],
      searchQuery: "",
      propsToSearch: [
        "time",
        "userfromname",
        "usertoname",
        "state",
        "amount",
        "coin"
      ]
    };
  },
  methods: {
    copied() {
      this.$toasted.show("Copied", {
        position: "top-center",
        duration: "3000",
        iconPack: "fontawesome",
        theme: "toasted-primary"
      });
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (row.state === "Sent" && columnIndex === 4) {
        return "table-success";
      } else if (row.state === "Decline" && columnIndex === 4) {
        return "table-danger";
      } else if (row.state === "Recived" && columnIndex === 4) {
        return "table-primary";
      } else if (row.state === "Pending" && columnIndex === 4) {
        return "table-warning";
      }
    },
    dateFormat: function(row, column, cellValue, index) {
      if (column.property === "time") {
        var date = row[column.property];
        if (date === undefined || date === null) {
          return "";
        } else return moment(date).format("DD-MM-YYYY | HH:mm:ss");
      } else return cellValue;
    }
  },
  mounted: function() {
    /*if(this.$currentUser == undefined){
        window.location.href = 'https://sqoin.exchange/account/sign-in';
    }*/
    axios
      .get(this.$myUrl + "/api/getlistTransactions")
      .then(
        response => (
          (this.transactions = response.data),
          (this.count = this.transactions.length),
          (this.loading = false)
        )
      );
    if (this.$currentUser !== null && this.$currentUser !== undefined) {
      axios
        .get(this.$myUrl + "/api/getUserById?id=" + this.$currentUser)
        .then(response => (this.currentUsername = response.data.user_name));
    }
  }
};
</script>

<style scoped>
.card .card-header {
  align-items: flex-end;
}
.card .card-header > div:first-child {
  position: relative;
  top: -10px;
}
.card .card-header > div:first-child input {
  border-radius: 5px !important;
}
.card .card-header + div {
  text-align: right;
  padding: 15px;
}
.card .card-header + div > div {
  max-width: 141px;
  float: right;
}
.card .card-header + div a {
  border-radius: 3px;
  height: 40px;
  background: #089ce2;
  color: white;
  padding: 10px;
}
.card .card-body > div:first-child {
  margin-bottom: 20px;
}
</style>