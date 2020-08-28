'use strict'; 
const _publics = {};

const config = require("./config");
var bitcoin_rpc = require("node-bitcoin-rpc");
var localhost = config.bastoji.localhost;
var port = config.bastoji.port;
var username = config.bastoji.username;
var password = config.bastoji.password;

//var address1 = "jj2a8z5vp71zJTZE7BD4PtXagZAM3FJG9r";
var address1 = "jo4uKwC5nyZevCX1mHx7VX8Ybw7sTxBsU9";
var publicAddress1 = "020fdce8431de8d150950b6f65d26fa37d42545d75c8cc0be2e15e42b95c80b688";
var address2 = "jxV1xBYASfjcNg6vp4mq1JtBs4GkVBXqE8";
var publicAddress2 ="03d830b8eda8164f22c6d4f62208bd3d3963f7fa1e2a3546309243e740727a94ea";
var address3 = "jk6b9wb1iJ9WZhrwcTnTk1QFdLSqvRUQDy"
var publicAddress3 = "024d480aa54d70f825cb78a5ac64bd12c5c8734a55a51f4f180c4efe8baeb844bb";
var privkey3 = "JA2gL3SQKSUPNU5DMHrbqBn3ASp9P8KGgMfQH2Dpb7JLkCPQPgiF"
var address4 = "k2pNUcsq5VUcDJbuRiThYd8AtpdeG92Cwt";



function createmultisig(publicAddress1,publicAddress2,publicAddress3) {
    return new Promise((resolve, reject) => {
      bitcoin_rpc.init(localhost, port, username, password)
      bitcoin_rpc.call('createmultisig', [3,[publicAddress1,publicAddress2,publicAddress3]], function (err, res) {
        if (err) {
          console.log("************errrrrrrrrrr == "+JSON.stringify(err));
         return  reject(err);
        } else if (res.error) {
          console.log("************res.errorrrrrrrrrrrr == "+JSON.stringify(res.error));
          return reject(err);
        } else {
            console.log("************res == "+JSON.stringify(res));
          if ((res.result === '') || (res.result === null) || (res.result === undefined)) {
            return resolve({ 'multisig': 0 });
          } else {
            return resolve({ 'multisig': res.result});
          }
        }
      }, (err) => {
        return reject(err);
      });
    }, (err) => {
      return reject(err);
    });
  }
  


  createmultisig(publicAddress1,publicAddress2,publicAddress3) ;  


  /*  RESULTAT : 
  Multisig {"result":{"address":"8hyyCgP4XLNK5urqQrqq2nFqXkvZEBQN3c",
"redeemScript":"5321020fdce8431de8d150950b6f65d26fa37d42545d75c8cc0be2e15e42b95c80b6882103d830b8eda8164f22c6d4f62208bd3d3963f7fa1e2a3546309243e740727a94ea21024d480aa54d70f825cb78a5ac64bd12c5c8734a55a51f4f180c4efe8baeb844bb53ae"},*/