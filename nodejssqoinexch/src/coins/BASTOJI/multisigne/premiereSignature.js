'use strict'; 
const _publics = {};
var bitcoin_rpc = require("node-bitcoin-rpc");
const config = require("./config");
var localhost = config.bastoji.localhost;
var port = config.bastoji.port;
var username = config.bastoji.username;
var password = config.bastoji.password;



var txhex = "0200000001070a1f7acd045d943190dcdcedb10ecead328dac358dd268cd44a117f18ba03e0100000000ffffffff0240420f00000000001976a914f1374ee278fef24cbb93ae5a8849419475b99e8088ac000000000000000017a914270e4ed667c243ac37ccc9f237faa81dace08b6d8700000000";
var address1Private = "J3mWWdYNSzEEzPvmdtE1Ahx5MBjymLgsCUj7BbRXtz2TPyrnqkym";
var utxos = "3ea08bf117a144cd68d28d35ac8d32adce0eb1eddcdc9031945d04cd7a1f0a07";
var scriptPubKey= "02000000014b7ca6b84559bf26b785a8db98a90bd818ac7b9301669ae5f76182cc561717c4010000006a47304402205916fb17404b5b5d7aaba5111bb3cba8473a4ce4674a9b171c2c701fb13cd0d702206b18bac50e158652869c8623381b6d00df3562b10eb0b04874ecaa9bc17843340121020fdce8431de8d150950b6f65d26fa37d42545d75c8cc0be2e15e42b95c80b688feffffff0280841e000000000017a914270e4ed667c243ac37ccc9f237faa81dace08b6d87a05eed53020000001976a914d95deb39713954ca6ccd00fe7b67b3593c3d9e4288ac75840500";
var redeemScript= "5321020fdce8431de8d150950b6f65d26fa37d42545d75c8cc0be2e15e42b95c80b6882103d830b8eda8164f22c6d4f62208bd3d3963f7fa1e2a3546309243e740727a94ea21024d480aa54d70f825cb78a5ac64bd12c5c8734a55a51f4f180c4efe8baeb844bb53ae";
var vout = 1 ;

//function outputUtxos(utxos) {
var ut  = 
    {
       "txid": "3ea08bf117a144cd68d28d35ac8d32adce0eb1eddcdc9031945d04cd7a1f0a07",
       "vout": 0,
       "scriptPubKey": "a914270e4ed667c243ac37ccc9f237faa81dace08b6d87",
       "redeemScript": "5321020fdce8431de8d150950b6f65d26fa37d42545d75c8cc0be2e15e42b95c80b6882103d830b8eda8164f22c6d4f62208bd3d3963f7fa1e2a3546309243e740727a94ea21024d480aa54d70f825cb78a5ac64bd12c5c8734a55a51f4f180c4efe8baeb844bb53ae",
    }
  /* return ut ; 
}*/

function signrawtransactionMultisig(txhex,ut,address1Private ) {
    return new Promise((resolve, reject) => {
      bitcoin_rpc.init(localhost, port, username, password)
      bitcoin_rpc.call('signrawtransaction', [txhex,[ut],[address1Private.toString()]], function (err, res) {
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
        console.log ("rrr");
      });
    }, (err) => {
      return reject(err);
      console.log("ttttt");
    });
  }
  


  signrawtransactionMultisig(txhex,ut,address1Private ) ;  


  /* RESULTAT = 
   "hex":"0200000001070a1f7acd045d943190dcdcedb10ecead328dac358dd268cd44a117f18ba03e0100000000ffffffff0240420f00000000001976a914f1374ee278fef24cbb93ae5a8849419475b99e8088ac000000000000000017a914270e4ed667c243ac37ccc9f237faa81dace08b6d8700000000"

   */