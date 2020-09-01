'use strict';

const _publics = {};
var fs = require('fs');
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    iv = Buffer.alloc(16, 0); // Initialization vector.
var config = require('../../config');
const logger = config.logger;
//decrypt text with algorithm 'aes-256-ctr' and an entered pin code 
_publics.decrypt = (text, pin) => {
  return  decrypt  (text, pin)
}


function decrypt  (text, pin) {
    var s = "" + text;
    var buffer = Buffer.from(s, 'hex')

    return new Promise((resolve, reject) => {
        var decipher = crypto.createDecipher(algorithm, pin, iv)
        var dec = decipher.update(buffer)
        return resolve(dec);
    });
}

_publics.decryptedKey=(creptedPrivateKey, send)=> {
    console.log('decrepted function with creptedpk ='+creptedPrivateKey+' and pin ='+send.pin);
    var pin=send.pin;
    return new Promise((resolve, reject) => {
        var b = Buffer.from(creptedPrivateKey, 'hex');
        var decreptedPrivateKey = decrypt(b, pin);
        return resolve(decreptedPrivateKey);
    })
}

_publics.decryptedKeyByPin=(creptedPrivateKey, pin)=> {
    return new Promise((resolve, reject) => {
        var b = Buffer.from(creptedPrivateKey, 'hex');
        var decreptedPrivateKey = decrypt(b, pin);
        return resolve(decreptedPrivateKey);
    })
}

var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',

    iv = Buffer.alloc(16, 0); // Initialization vector.


_publics.encryptAndSave=(pin, privateKey, storage)=> {
    return new Promise((resolve, reject) => {
        var hw = encrypt(privateKey, pin);
        console.log("ffff");
        fs.writeFile(storage, '' + hw.toString('hex'), function (err, result) {
            if (err) {
                logger.error(err);
               return reject("this is the error " + err);
            }
            return resolve(hw);
        });
    });
}

//encrypt text with algorithm 'aes-256-ctr' and an entered pin code 
_publics.encrypt=(text, pin)=> {
    return encrypt(text, pin);
  }
  
  
  function encrypt(text, pin) {
      var cipher = crypto.createCipher(algorithm, pin, iv)
      var crypted = cipher.update(text)
      return crypted; 
  }

module.exports = _publics;