'use strict';


const _publics = {};
var config = require('../../../config');
var target = config.sage.targetSage;
const namePrivate = config.sage.fileNamePrivateKey;
var destinationAddress = config.sage.fixedAddressWallet;
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(config.sage.web3));
var Wallet1 = require('ethereumjs-wallet');
const logger = config.logger;
_publics.fileUtil;
_publics.requestUtils ;
_publics.transaction;
_publics.transactionUtil;
_publics.commonCoins ;
_publics.coin ;
_publics.cryptoUtil ;
_publics.user; 
_publics.order; 
_publics.email ;
_publics.emailDao;
_publics.coinDao;


_publics.privateKeyGenerator = () => {
    return new Promise( (resolve , reject) => {
        const wallet = Wallet1.generate();
        return resolve( {  
                    'publicKey': wallet.getAddressString() , 
                    'privateKey': wallet.getPrivateKey().toString("hex")
                });
    });
}
// all the steps for send sage by user id 
_publics.send = (writefunction, send) => {
    return sendFunction(writefunction,send);
}

// return the balance value by user public key Native
_publics.getBalance = (publicKey) => {
    logger.info('here sage balance');
    var pubkeystr = publicKey.toString().substr(0, 42);
    return new Promise((resolve, reject) => {
        let destinationBalanceWei = (web3.eth.getBalance(pubkeystr));
        let destinationBalance = web3.fromWei(destinationBalanceWei, 'ether');
        let balance = Number.parseFloat(destinationBalance).toFixed(3);
        return resolve({'balance' : balance,publickey:publicKey});
       // return resolve({'balance' : 50,publickey:publicKey});
    });

}
// function send for SAGE coin
function sendFunction (writefunction, send) {
    console.log("send params "+JSON.stringify(send));
    var localTransaction;
    var leave;
    var publicKeyDestination;
    var publicKey;
    var decreptedPrivateKey;
    var response;
    return new Promise((resolve, reject) => {
  
        _publics.transaction.createTransaction( send) 
            .then(localTransactionResponse => {
                console.log("localtransaction "+localTransactionResponse);
                localTransaction = localTransactionResponse;
                console.log("to "+send.to);
                console.log("coin "+send.coinname);
                return  _publics.requestUtils.getPubAddC(send.to,send.coinname);
            },error=>{
                logger.error("error transactioin "+error);
                return reject(error);
            })
            .then(publicKeyDestinationResponse  => {
                 logger.info("destination ="+publicKeyDestinationResponse);
                if((publicKeyDestinationResponse==null)||(publicKeyDestinationResponse=="") ){
                    leave=true;
                    return; 
                }
                publicKeyDestination = publicKeyDestinationResponse;
                return _publics.requestUtils.getPubAddC(send.from,send.coinname)
            },error=>{
                logger.error("eroor get pk "+error);
                return reject(error);
            })
            .then(publicKeyResponse => {
                logger.info("publickey == "+publicKeyResponse);
                if(leave===true ){
                    return; 
                }
                publicKey = publicKeyResponse;
             
                return _publics.fileUtil.readFileCrepted(target + "/" + send.from + "/" + namePrivate);
            },error=>{
                return reject(error);
            })
            .then(creptedPrivateKey => {
                logger.info("crep == "+creptedPrivateKey);
                if(leave===true ){
                    return; 
                }
             
                return _publics.cryptoUtil.decryptedKey(creptedPrivateKey, send); 
            },error=>{
                return reject(error);
            })
              .then(decreptedPrivateKeyResponse=>{
                 // logger.info("decrapted == "+Buffer(decreptedPrivateKeyResponse).toString('hex'));
                if(leave===true ){
                    return; 
                }
                decreptedPrivateKey=decreptedPrivateKeyResponse;
               _publics.commonCoins.isValidPrivateKey(decreptedPrivateKey,publicKey)
                .then((isValid)=>{                
                    if(isValid == false){
                        var message = {msg: "failed",error: "verify your PIN !!"};
                        return message;
                    }else{
                        var response =_publics.commonCoins.coinSage(publicKey, send.amount, publicKeyDestination, decreptedPrivateKey); 
                        return (response);
                        
                    }
                },error=>{
                    return reject(error);
                })
            .then(responseR => {   
                console.log("response RR =>"+JSON.stringify(responseR));
                response=responseR;
                if(leave === true ){
                    message = {msg: "failed",error: "receiver doesn't have public key"};
                   _publics.transaction.updateTransactionState(localTransaction, message.error);
                    return message;
                }
                return _publics.transactionUtil.resultTransaction (responseR,localTransaction);
         },error=>{
             logger.error(error);
             return reject(error);
         })
         .then(responseF=>{
             console.log("response "+JSON.stringify(response));
            return resolve(response)
         })/*.catch(error=>{writefunction(error)});*/
        })
    });
}

module.exports = _publics;