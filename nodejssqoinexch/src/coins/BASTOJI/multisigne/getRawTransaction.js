'use strict'; 
const _publics = {};

const config = require("./config");
var bitcoin_rpc = require("node-bitcoin-rpc");
var localhost = config.bastoji.localhost;
var port = config.bastoji.port;
var username = config.bastoji.username;
var password = config.bastoji.password;


var UTXO= "3ea08bf117a144cd68d28d35ac8d32adce0eb1eddcdc9031945d04cd7a1f0a07";


function getRawTransaction(UTXO) {
    return new Promise((resolve, reject) => {
      bitcoin_rpc.init(localhost, port, username, password)
      bitcoin_rpc.call('getrawtransaction', [UTXO, 1], function (err, res) {
        if (err) {
          console.log("************errrrrrrrrrr == "+err);
         return  reject(err);
        } else if (res.error) {
          console.log("************res.errorrrrrrrrrrrr == "+res.error);
          return reject(err);
        } else {
            console.log("************res == "+JSON.stringify(res));
          if ((res.result === '') || (res.result === null) || (res.result === undefined)) {
            return resolve({ 'RAW TRANSACTION': 0,  });
          } else {
            return resolve({ 'RAW TRANSACTION': res});
          }
        }
      }, (err) => {
        return reject(err);
        console.log ("rrr");
      });
    }, (err) => {
      return reject(err);
      console.log("ttttt");
      //return resolve({'balance' : '120',publickey:publicKey});
    });
  }
  


  getRawTransaction (UTXO)  




  /* result : SCRIPTpublickey

  ************res == 
  scriptPublicKey : hex = a914270e4ed667c243ac37ccc9f237faa81dace08b6d87
  {"result":"02000000014b7ca6b84559bf26b785a8db98a90bd818ac7b9301669ae5f76182cc561717c4010000006a47304402205916fb17404b5b5d7aaba5111bb3cba8473a4ce4674a9b171c2c701fb13cd0d702206b18bac50e158652869c8623381b6d00df3562b10eb0b04874ecaa9bc17843340121020fdce8431de8d150950b6f65d26fa37d42545d75c8cc0be2e15e42b95c80b688feffffff0280841e000000000017a914270e4ed667c243ac37ccc9f237faa81dace08b6d87a05eed53020000001976a914d95deb39713954ca6ccd00fe7b67b3593c3d9e4288ac75840500",
  "error":null,"id":"1"}  */