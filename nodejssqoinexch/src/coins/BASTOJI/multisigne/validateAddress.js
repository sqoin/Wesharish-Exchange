'use strict'; 
const _publics = {};

const config = require("./config");
var bitcoin_rpc = require("node-bitcoin-rpc");
var localhost = config.bastoji.localhost;
var port = config.bastoji.port;
var username = config.bastoji.username;
var password = config.bastoji.password;


//var publicKey = "jo4uKwC5nyZevCX1mHx7VX8Ybw7sTxBsU9";
var publicKey ="jj2a8z5vp71zJTZE7BD4PtXagZAM3FJG9r";

function validateAddress(publicKey) {
    return new Promise((resolve, reject) => {
      bitcoin_rpc.init(localhost, port, username, password)
      bitcoin_rpc.call('validateaddress', [publicKey], function (err, res) {
        if (err) {
          console.log("************errrrrrrrrrr == "+err);
         return  reject(err);
        } else if (res.error) {
          console.log("************res.errorrrrrrrrrrrr == "+res.error);
          return reject(err);
        } else {
            console.log("************res == "+JSON.stringify(res));
          if ((res.result === '') || (res.result === null) || (res.result[publicKey] === undefined)) {
            return resolve({ 'public address': 0, publickey: publicKey });
          } else {
            return resolve({ 'public address': res.result[publicKey], publickey: publicKey });
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
  


  validateAddress (publicKey)  