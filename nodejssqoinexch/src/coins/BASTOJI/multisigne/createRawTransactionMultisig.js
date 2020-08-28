'use strict'; 
const _publics = {};
var bitcoin_rpc = require("node-bitcoin-rpc");
const config = require("./config");
var localhost = config.bastoji.localhost;
var port = config.bastoji.port;
var username = config.bastoji.username;
var password = config.bastoji.password;



var utxos  = "3ea08bf117a144cd68d28d35ac8d32adce0eb1eddcdc9031945d04cd7a1f0a07";
var vout= 1 ; 
var address4 = "k2pNUcsq5VUcDJbuRiThYd8AtpdeG92Cwt";
var amountTo = 0.01;
var addressTo ="k2pNUcsq5VUcDJbuRiThYd8AtpdeG92Cwt";
var addressFrom =  '8hyyCgP4XLNK5urqQrqq2nFqXkvZEBQN3c';







var outputUtxosToInput = (utxos) => {
    var newUtxos = [];
    var utxos = [
       {
          "txid": "3ea08bf117a144cd68d28d35ac8d32adce0eb1eddcdc9031945d04cd7a1f0a07",
          "vout": 1,
          "address": "jhKgo12Ze5kqHRd4K4fF3PUeQWtJSzWTgP",
          "account": "",
          "scriptPubKey": "76a9141b602543909e832e848ef4d8660c982a5a171fe788ac",
          "amount": 0.02000000,
          "confirmations": 16,
          "spendable": true,
          "solvable": true,
          "ps_rounds": -2
       }
    ];
    for (var i = 0; i < utxos.length; i++) {
       newUtxos.push({ "txid": utxos[i].txid, "vout": utxos[i].vout });
    }
 
    return newUtxos;
 
 }
 
 function outputUtxos(utxos) {
    var addressTo = 'k2pNUcsq5VUcDJbuRiThYd8AtpdeG92Cwt';
    var addressFrom = '8hyyCgP4XLNK5urqQrqq2nFqXkvZEBQN3c';
    var amountTo = 0.01;
    var fee = 0.01;
    var newUtxos = {};
    var amount = 0;
    var utxos = [
       {
          "txid": "3ea08bf117a144cd68d28d35ac8d32adce0eb1eddcdc9031945d04cd7a1f0a07",
          "vout": 1,
          "address": "k2pNUcsq5VUcDJbuRiThYd8AtpdeG92Cwt",
          "account": "",
          "scriptPubKey": "76a9141b602543909e832e848ef4d8660c982a5a171fe788ac",
          "amount": 0.02000000,
          "confirmations": 16,
          "spendable": true,
          "solvable": true,
          "ps_rounds": -2
       }
    ];
    for (var i = 0; i < utxos.length; i++) {
 
       var valeur = utxos[i].amount;
       amount = amount + valeur;
    }
    var amountFrom = amount - amountTo - fee;
    newUtxos[addressTo] = amountTo;
    newUtxos[addressFrom] = amountFrom;
 
    return newUtxos;
 
 }
 





function createRawtransactionMultisig (){
    console.log('create raw transaction function');
    return new Promise((resolve, reject) => {
       bitcoin_rpc.init(localhost, port, username, password)
       bitcoin_rpc.call('createrawtransaction', [outputUtxosToInput(utxos), outputUtxos(utxos, addressTo, amountTo, addressFrom)], function (err, res) {
          if (err) {
             console.log("err create raw transaction == " + err);
             return reject(err);
          } else if (res.error) {
             console.log("res error create raw transaction == " + JSON.stringify(res.error));
             return reject(res.err);
          } else {
             console.log("result raw transaction == " + JSON.stringify(res.result));
             return resolve(res.result)
          }
       }, (err) => {
          return reject(err);
       }, (err) => {
          return reject(err);
       });
    });
 }
 


createRawtransactionMultisig ();



/* ult 
result raw transaction == "0200000001070a1f7acd045d943190dcdcedb10ecead328dac358dd268cd44a117f18ba03e0100000000ffffffff0240420f00000000001976a914f1374ee278fef24cbb93ae5a8849419475b99e8088ac000000000000000017a914270e4ed667c243ac37ccc9f237faa81dace08b6d8700000000"
*/