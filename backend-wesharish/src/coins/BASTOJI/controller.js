'use strict';

const _publics = {};
var config = require('../../../config');
const logger = config.logger;
var targetBastoji = config.bastoji.targetBastoji;
const namePublic = config.sage.fileNamePublicKey;
const namePrivate = config.sage.fileNamePrivateKey;
var username = config.bastoji.username;
var password = config.bastoji.password;
var port = config.bastoji.port ;
var localhost = config.bastoji.localhost;
var bitcoin_rpc = require('node-bitcoin-rpc')
var destinationBalance;
var addressMultiSigne= config.bastoji.bastojiMultiSigne;
var privForMulti = config.bastoji.bastojiPrivForMulti;
var validateAddressForBanque=config.bastoji.scriptPublicKeyForBanqueAddress;
_publics.fileUtil; 
_publics.cryptoUtil;
_publics.coin;
_publics.transactionUtil;
_publics.transaction;
_publics.requestUtils;
_publics.order;
_publics.emailDao;
_publics.email;
_publics.user;
_publics.commoncoin;


function outputUtxosToInput (utxos){
    console.log("utxos =>"+utxos);
    logger.debug('output Utxos to input function');
    var newUtxos=[];  
      for (var i = 0; i < utxos.length; i++){
           newUtxos.push({"txid":utxos[i].txid,"vout":utxos[i].vout});
      }
      return newUtxos;
}

function outputUtxos (utxos,addressTo,amountTo,addressFrom){
    logger.debug('output utxos function');
    console.log("utxos ==>"+utxos);
    console.log("addressTo ==> "+addressTo);
    console.log("amountTo ==> "+amountTo);
    console.log("addressFrom ==> "+addressFrom);
    var fees=0.0001;
    var newUtxos={};
    var amount=0.0 ;
      for (var i = 0; i < utxos.length; i++){
       var valeur =utxos[i].amount;
       amount = amount+valeur;
   }
   var amountFrom = amount-amountTo-fees;
   newUtxos[addressTo] = amountTo;
   newUtxos[addressFrom] =  amountFrom;
   return newUtxos;
}
// return the balance value by user public key
_publics.getBalance = (publicKey ) => {
    logger.debug('here bastoji balance')
    return new Promise((resolve, reject) => {
        bitcoin_rpc.init(localhost,port, username, password)
        bitcoin_rpc.call('listunspent', [0 ,999999999 , [publicKey]], function (err, res) {
            if (err) {
                logger.error('err bastoji '+err);
               return  reject(err);
              } else if (res.error) {
                logger.error('error bastoji '+JSON.stringify(res.error));
                return reject(err);
              } else {
                  logger.info('res balance bastoji'+JSON.stringify(res));
                  console.log("res  "+res.result);
                  if((res.result==='') || (res.result===null)||(res.result===undefined)){
                    return resolve({'balance' : 0,publickey:publicKey});
                  }else{
                      var balance = res.result.reduce( (t , i) => t + i.amount, 0)
                      console.log("balanc "+balance);
                  return resolve({'balance' : res.result.reduce( (t , i) => t + i.amount, 0),publickey:publicKey});
              }
            }
          },(err)=>{
            return  reject(err);
          },(err)=>{
            return reject(err);
          }); 
    });
}
// return list of transaction by public key 
function getListUnspent (publicKey ) {
   logger.debug('get list unspent')
    return new Promise((resolve, reject) => {
        bitcoin_rpc.init(localhost,port, username, password)
        bitcoin_rpc.call('listunspent', [0 ,999999999 , [publicKey]], function (err, res) {
            if (err) {
                logger.error("err == "+err);
                return reject(err);
            } else if (res.error) {
                logger.error("res error == "+res.error);
                return reject(res.error);
            } else {
                logger.info("result listunspent == "+JSON.stringify(res.result));
                return  resolve(res.result);
            }
          },(err)=>{
            return  reject(err);
          },(err)=>{
            return reject(err);
          }); 
    });
}


function createRawTransaction  (utxos,addressTo,amountTo,addressFrom ) {
    logger.debug('create raw transaction function');
    return new Promise((resolve, reject) => {
        bitcoin_rpc.init(localhost,port, username, password)
        var inputs = outputUtxosToInput(utxos)
        if ( (!inputs) || (inputs === [])) {
            reject(" No utxos for senders account");
        }
        var outputs =  outputUtxos(utxos,addressTo,amountTo,addressFrom) ;
        bitcoin_rpc.call('createrawtransaction', [ inputs , outputs ], function (err, res) {
           if (err) {
            logger.error("err create raw transaction == "+err );
            
            return  reject(err);
           } else if (res.error) {
            logger.error(" UTXO : " + JSON.stringify(inputs))
            logger.error(" VOUT : " + JSON.stringify(outputs))
            logger.error("res error create raw transaction == "+JSON.stringify(res.error));
            return resolve(res.err);
           } else {
               logger.info("result create raw transaction == "+JSON.stringify(res.result));
            return resolve(res.result)
           }          
         },(err)=>{
             logger.error(" /* description  */")
            return  reject(err);
         },(err)=>{
            return  reject(err);
         }); 
    });
}

function signRawTransaction (txhex,addressPrivateFromDecripted ) {
    logger.debug('sign raw transaction function');
    return new Promise((resolve, reject) => {
        bitcoin_rpc.init(localhost,port, username, password)
        bitcoin_rpc.call('signrawtransaction', [txhex ,[], [addressPrivateFromDecripted.toString()] ], function (err, res) {
            if (err) {
                logger.error('err sign transaction '+err);
                return  reject(err);
            } else if (res.error) {
                logger.error('res error sign transaction '+res.error);
                return   resolve(res.error);
            } else {
                return  resolve(res.result);
            }
          },(err)=>{
            return   reject(err);
          },(err)=>{
            return  reject(err);
          });
    });
}

function sendRawTransaction (SIGNED_RAW_TX ) {
    logger.debug('send raw transaction fucntion');
    return new Promise((resolve, reject) => {
        bitcoin_rpc.init(localhost,port, username, password)
        bitcoin_rpc.call('sendrawtransaction', [SIGNED_RAW_TX                                                                                                                                                                                                                                                                                                                                                                                                                                                                        ], function (err, res) {
            if (err) {
                logger.error('error send raw transaction '+err);
                return  reject(err);
            } else if (res.error) {
                logger.error('res.error send raw transaction =>'+JSON.stringify(res.error));
                return   resolve(res.error);
            } else {
                return  resolve(res.result);
            }
          },(err)=>{
            return   reject(err);
          },(err)=>{
            return  reject(err);
          });
    });
}


 
function sendTransaction (publicKey,amountTo,addressTo,descreptedPK){
    logger.debug('send transaction bastoji');
    logger.info("publicKey ==== "+publicKey );
    logger.info("amountTo ==== "+amountTo );
    logger.info("addressTo ==== "+addressTo );
    logger.info("descreptedPK ==== "+descreptedPK );
    var hexData;
    return new Promise((resolve, reject) => {  
    getListUnspent(publicKey)
    .then((data) => {   
        logger.info("data after getListUnspent ==== "+JSON.stringify(data));
        createRawTransaction(data,addressTo.toString(),amountTo,publicKey.toString())
        .then(txhx=>{
            console.log("rep "+txhx);
            logger.info("tnhx "+txhx);
                    signRawTransaction(txhx,descreptedPK)
                    .then((data)=>{
                        hexData=data;
                        logger.info("data after signRawTransaction == "+JSON.stringify(data));
                        sendRawTransaction(data.hex)
                        .then(data=>{
                            logger.info("data final for sendTransaction == "+JSON.stringify(data));
                            return resolve(hexData);
                        },(err)=>{
                            return  reject(err);
                        })
                        },(err)=>{
                            return  reject(err);
                        })
                          }),(err)=>{
                            return reject(err);
                          }
                        }, (err)=>{  
                            return reject(err);
                             }) 
                             });
                            
                        }

// all the steps for send sage by user id 
_publics.send = (writeFunction, data) => {

    logger.debug('send function for bastoji '+JSON.stringify(data));
    var localTransaction;
    var leave;
    var publicKeyDestination;
    var publicKey;
    var decreptedPrivateKey;
    var response;
    var privatefilepath = targetBastoji + "/" + data.from + "/" + namePrivate;
    return new Promise((resolve, reject) => {
        _publics.transaction.createTransaction( data)
    .then(localTransactionResponse=>{
            localTransaction = localTransactionResponse;
            _publics.requestUtils.getPubAddC(data.to,data.coinname)
            .then(publicKeyDestinationResponse=>{
            if((publicKeyDestinationResponse==null)||(publicKeyDestinationResponse=="") ){
                leave=true;
                return; 
            }
            logger.info("publicKeyDestination ="+publicKeyDestinationResponse);
                       if (publicKeyDestinationResponse==="according not exist"){
                     //   writeFunction("according not exist");
                     if(leave===true ){
                        return; 
                    }
                       }
            publicKeyDestination = publicKeyDestinationResponse;
            _publics.requestUtils.getPubAddC(data.from,data.coinname)
            .then(publicKeyResponse=>{
                if(leave===true ){
                    return; 
                }
                logger.info("publicKey ="+publicKeyResponse);
                    if(publicKeyResponse==="according not exist"){
                      //  writeFunction("according not exist");
                      if(leave===true ){
                        return; 
                    }
                    }
                publicKey = publicKeyResponse;
                _publics.fileUtil.readFileCrepted(privatefilepath)
                .then((creptedPrivateKey)=>{
                    if(leave===true ){
                        return; 
                    }
                    _publics.cryptoUtil.decryptedKey(creptedPrivateKey, data)
                    .then((decreptedPrivateKeyResponse)=>{
                        if(leave===true ){
                            return; 
                        }
                        decreptedPrivateKey=decreptedPrivateKeyResponse;
                        console.log("=====> "+publicKey + " "+  publicKeyDestination + " DC "+decreptedPrivateKey)
                        sendTransaction(publicKey, data.amount, publicKeyDestination, decreptedPrivateKey)
                              .then((response)=>{
                                logger.info("response == "+JSON.stringify(response));
                                if(leave === true ){
                                    logger.warn('receiver does not have public key');
                                    var message = {msg: "failed",error: "receiver doesn't have public key"};
                                     return resolve( message);
                                 }
                                 _publics.transactionUtil.resultTransaction (response,localTransaction)
                                 .then(response=> resolve(response)
                                 ).catch(error=>{writeFunction(error)});
                              })
                    }) 
                })
            })
            })
    }) 
    })
}


// return the blockcount value by user public key
_publics.getBlockCount = () => {
    return new Promise((resolve, reject) => {
        bitcoin_rpc.init(localhost,port, username, password)
        bitcoin_rpc.call('getblockcount', [], function (err, res) {
          if (err) {
            return reject(err);
          } else if (res.error) {
            return  reject(res.error);
          } else {
            return resolve(res.result);
          }
        });
    },(err)=>{
      return reject(err);
    });

}


// return transaction id after sign trasanction  
function gettransactionid (transactionhex ) {
    return new Promise((resolve, reject) => {
        bitcoin_rpc.init(localhost,port, username, password)
        bitcoin_rpc.call('decoderawtransaction',  [transactionhex], function (err, res) {
            if (err) {
                return  reject(err);
            } else if (res.error) {
                return reject(err);
            } else {

                return resolve(res.result.txid);
            }
          },(err)=>{
            return reject(err);
          },(err)=>{
            return reject(err);
          }); 
    });
}

_publics.gettransactionid=(transactionhex )=> {
   
    return gettransactionid (transactionhex ) ;
}
//get public key from file or create it if doesn't exist 
function getNewPublicAddress (target, storage )  {
    var walletfolder = target+"/"+storage;
    var filename = walletfolder + "/" + namePublic;
    return new Promise ( ( resolve, reject) => {
       
        _publics.fileUtil.getOrCreatePath(walletfolder , fileUtil.createFolder , storage) 
        .then( (path) => {
                      
                        _publics.fileUtil.getOrCreatePath(filename , fileUtil.createFile , filename)
                        .then((file) =>{
                          
                            _publics.fileUtil.getOrCreateFilePublicContent(file , generatePublicKey)
                        .then((data) =>
                            resolve(data));
                        })
                        },
                (err)=>{
                    return reject(err)
                    })//.catch(error=>{res.send(error)});  
        });
}

_publics.getNewPublicAddress = (target, storage ) => {
    return getNewPublicAddress  (target, storage )
}
// generate public key 
function generatePublicKey (){
    console.log(localhost);
    console.log(port );
    console.log(username);
    console.log(password);
    return new Promise((resolve, reject) => {
        bitcoin_rpc.init(localhost,port, username, password)
        console.log("connect");
        bitcoin_rpc.call('getnewaddress', [], function (err, res) {
            console.log("res "+res);
            console.log("err "+err);
            if (err) {
                console.log("err => "+err);
                return reject(err);
            } else if (res.error) {
                console.log("res.error =>"+JSON.stringify(res.error));
                return reject(err);
            } else {
                console.log("result => "+res.result);
                return resolve(res.result);
            }
        });  
    });   
}

_publics.publicAddressGenerator = () => {
    return new Promise( (resolve , reject) => {
        generatePublicKey ()
        .then((publicKey) => {
                return resolve( { 'publicKey': publicKey });
                    } ,
             (error) => {
                return  reject(error);
                    }
                )//.catch(error=>{res.send(error)});
    });
}


_publics.privateKeyGenerator = () => {
    return new Promise( (resolve , reject) => {
        generatePublicKey ()
        .then((publicKey) => {
                return generatePrivateKey(publicKey)
                .then((privateKey) => {
                        return  resolve( { 'publicKey': publicKey , 'privateKey': privateKey});
                    } ,
                    (error) => {
                        return  reject(error);
                    }
                );
            } ,
            (error) => {
                return  reject(error);
            }

        ).catch(error=>{res.send(error)});
    });
}
/*
//generate keys for multi-signe
_publics.privateKeyGenerator=()=>{
    logger.debug('here is privateKeyGenerator for Bastoji');
    var publicAddressFirst;
    return new Promise( (resolve , reject) => {
        return generatePublicKey()
        .then(publicAddress=>{
            console.log("publicAddress "+publicAddress);
            publicAddressFirst=publicAddress;
                return createmultisig(validateAddressForBanque,addressMultiSigne)
                .then(addressMulti=>{
                    console.log("addressMulti "+addressMulti);
                    return generatePrivateKey(publicAddressFirst)
                    .then(privateAddress=>{
                        console.log("privateAddress "+privateAddress);
                        console.log("publicAddressFirst "+publicAddressFirst);
                        return  resolve( { 'publicKey': addressMulti , 'privateKey': privateAddress});
                    })
                })
        })
    })//.catch(error=>{console.log(error)});
}*/

// get private key or create it if doesn't not exist
function getPrivateKey (target,storage, pin,publicKey) {
    logger.debug('here get private key function');
    var target = targetBastoji;
           
    var walletfolder = target+"/"+storage;
   var filename = walletfolder + "/" + namePrivate;
   return new Promise ( ( resolve, reject) => {
    _publics.fileUtil.getOrCreatePath(walletfolder , fileUtil.createFolder , storage). 
       then( (path) => {
        _publics.fileUtil.getOrCreatePath(filename , fileUtil.createFile , filename)
       .then((file) =>{
        _publics.fileUtil.getOrCreateFilePrivateContent(pin , file , generatePrivateKey,publicKey)
        .then((data) =>
             resolve(data));
           },(err)=>{
            return reject(err);
           })
           },(err)=>{
            return reject(err);
           })   })//.catch(next);
       }
 
        
 _publics.getPrivateKey = (target,storage, pin,publicKey) => {
    return getPrivateKey (target,storage, pin,publicKey) ;
 }
// generate private key 
function generatePrivateKey (publicKey){
    return new Promise((resolve, reject) => {
        bitcoin_rpc.init(localhost,port, username, password)
       bitcoin_rpc.call('dumpprivkey', [publicKey], function (err, res) {
        if (err) {
            return reject(errMsg);
        } else if (res.error) {
            return reject(errMsg);
        } else {
            return resolve(res.result);
        } 
      });
    },(err)=>{
        return reject(err);
    });   
}


///sell Token 
_publics.sellBastoji=(writefunc, coin, send)  => {
    logger.debug('sell bostoji function');
    var privatefilepath = targetBastoji + "/" + (send).from + "/" + namePrivate;
    
    return new Promise((resolve, reject) => {        
        _publics.transaction.createTransaction( (send))
         .then((localTransaction)=>{
           res.payload.localTransaction = localTransaction;
           _publics.requestUtils.getPubAddC((send).to,coin)
           .then((publicKeyDestination)=>{
           if((publicKeyDestination==null)||(publicKeyDestination=="") ){
               res.payload.leave=true;
               return; 
           }
           res.payload.publicKeyDestination = publicKeyDestination;
           _publics.requestUtils.getPubAddC((send).from,coin)
           .then((publicKey)=>{
               if(res.payload.leave===true ){
                   return; 
               }
               res.payload.publicKey = publicKey;
               _publics.fileUtil.readFileCrepted(privatefilepath)
               .then((creptedPrivateKey)=>{
                   if(res.payload.leave===true ){
                       return; 
                   }
                   _publics.cryptoUtil.decryptedKey(creptedPrivateKey, (send))
                   .then((decreptedPrivateKey)=>{
                       if(res.payload.leave===true ){
                           return; 
                       }
                       res.payload.decreptedPrivateKey=decreptedPrivateKey;
                       sendTransaction(res.payload.publicKey, (send).amount, config.bastoji.fixedAddressBastoji, res.payload.decreptedPrivateKey)
                             .then((response)=>{
                                 res.payload.response=response;
                               if(res.payload.leave === true ){
                                   logger.warn('receiver does not have public key');
                                   var message = {msg: "failed",error: "receiver doesn'it have public key"};
                                    return resolve( message);
                                }
                             else{
                            return _publics.order.createOrder((send).coin,res.payload.publicKey,response,(send).date,(send).amount)
                            }    
                        })
                     .then(response=>{
                        return _publics.transactionUtil.resultTransaction (res.payload.response,res.payload.localTransaction)
                        .then((responseFinal)=>{
                            res.payload.responseFinal=responseFinal;                            
                            return _publics.emailDao.getEmailById((send).from)
                                .then((emailTo)=>{
                                    console.log("email => "+emailTo)
                                    res.payload.emailTo=emailTo;
                                    return _publics.user.getUserNameById((send).from)
                                    .then((username)=>{
                                        
                                        return _publics.email.mailSend(coin,res.payload.emailTo,username,res.payload.responseFinal.transactionId,(send).amount)
                                            .then((idMessage )=>{
                                                var responseNew;
                                                if((idMessage === undefined)||(idMessage=== null)||(idMessage==="")){
                                                    responseNew={"email":"erreur send mail"};
                                                }
                                               responseNew ={ "email":"message sent", "transactionId":(res.payload.responseFinal).transactionId};
                                           
                                               return resolve(responseNew);
                                            })
                                    })
                                   
                                })
                            })      
                        })
           })
       })
          })
})
         }).catch(error=>{writefunc(error)});
         });
        }
//verified public key 
_publics.isValidPrivateKey = (privateKey,publicKey) => {
    logger.debug('isValidPrivateKey function for bastoji');
    return new Promise((resolve, reject) => {

        var privateKeyGenerated = generatePrivateKey(publicKey);
        publicKey=publicKey.toString().substr(0, 42);
        logger.info('privateKeyGenerated key == '+privateKeyGenerated);
        logger.info('address == '+privateKey);
        if(privateKey === privateKeyGenerated){
        logger.info('is valid');
            return resolve(true);
        }else{
        logger.info('is not valid');
            return  resolve(false);
        }
        })
}

//send bastoji new !
_publics.sendB=(res,coin, send)=>{
    return new Promise((resolve, reject) => {
        _publics.transaction.createTransaction( send)
        .then(localTransaction=>{
            res.payload.localTransaction = localTransaction; 
           return _publics.requestUtils.getPubAddC(send.from,coin)
            .then(publickey=>{
                console.log("publicKey ="+publickey);
                    if(publickey==="according not exist"){
                        res.send("according not exist");
                        return;
                    }
                     res.payload.publickey=publickey;
                    return _publics.requestUtils.getPubAddC(send.to,coin)
                    .then(publicKeyDestination=>{
                        console.log("publicKeyDestination ="+publicKeyDestination);
                        if (publicKeyDestination==="according not exist"){
                            res.send("according not exist");
                            return;
                        }
                          res.payload.publicKeyDestination=publicKeyDestination;
                          return getBalance(publicKeyDestination)
                          .then(balanceTo=>{
                            console.log("balanceTo =="+balanceTo);
                            res.payload.balanceTo=balanceTo;
                            return _publics.fileUtil.readFileCrepted(targetBastoji + "/" + send.from + "/" + namePrivate)
                            .then(creptedPrivateKey=>{
                                console.log("crepted private key = "+creptedPrivateKey);
                                return  _publics.cryptoUtil.decryptedKey(creptedPrivateKey, send)
                                .then(decryptedPrivateKey=>{
                                    return isValidPrivateKey(decryptedPrivateKey,res.payload.publickey)
                                    .then(isValid=>{
                                        if(isValid == false){
                                            var message = {msg: "failed",error: "verify your PIN !!"};
                                            res.send(message);
                                            }else{
                                                getBalance(res.payload.publickey)
                                                .then(balanceFrom=>{
                                                    console.log("balance from = "+balanceFrom);
                                                    var amount = send.amount;
                                                    if (balanceFrom < amount){
                                                        var message = {msg :"failed", error:"user does not have enough coins !"};
                                                        return resolve(message);
                                                    }else{
                                                        var response=sendTransaction(res.payload.publicKey, send.amount, res.payload.publicKeyDestination, res.payload.decreptedPrivateKey)
                                                            return response;
                                                    }
                                                })
                                                then(response=>{
                                                    return  _publics.transactionUtil.resultTransaction (response,res.payload.localTransaction)
                                                    .then(message=>{
                                                        return resolve(message);
                                                    },err=>{
                                                        return reject(err);
                                                    })
                                                },err=>{
                                                    return reject(err);
                                                })
                                            }
                                    },err=>{
                                        return reject(err);
                                    })
                                },err=>{
                                    return reject(err);
                                })
                            },err=>{
                                return reject(err);
                            })
                          },err=>{
                            return reject(err);
                          })

                    },err=>{
                        return reject(err);
                    })
            },err=>{
                return reject(err);
            })
        },err=>{
            return reject(err);
        })
    })
}

// return the balance value by user public key
function getBalance (publicKey ){
    logger.debug('here getbalance function')
    return new Promise((resolve, reject) => {
        bitcoin_rpc.init(localhost,port, username, password)
        bitcoin_rpc.call('listunspent', [0 ,999999999 , [publicKey]], function (err, res) {
            if (err) {
                logger.error('err bastoji '+err);
               return  reject(err);
              } else if (res.error) {
                logger.error('error bastoji '+JSON.stringify(res.error));
                return reject(err);
              } else {
                  logger.info('res balance bastoji'+JSON.stringify(res));
                  if((res.result==='') || (res.result===null)||(res.result[publicKey]===undefined)){
                    return resolve({'balance' : 0,publickey:publicKey});
                  }else{
                    logger.info('res balance bastoji'+JSON.stringify(res));
                    console.log("res  "+res.result);
                    if((res.result==='') || (res.result===null)||(res.result===undefined)){
                      return resolve({'balance' : 0,publickey:publicKey});
                    }else{
                        var balance = res.result.reduce( (t , i) => t + i.amount, 0)
                        console.log("balanc "+balance);
                    return resolve({'balance' : res.result.reduce( (t , i) => t + i.amount, 0),publickey:publicKey});
                }
              }
            }
          },(err)=>{
            return  reject(err);
          },(err)=>{
            return reject(err);
          }); 
    });
}

// validate Address 
_publics.validateAddress=(publicKey)=> {
    console.log(localhost);
       console.log(port );
       console.log(username);
       console.log(password);
       console.log(publicKey);
    return new Promise((resolve, reject) => {
      bitcoin_rpc.init(localhost, port, username, password)
      console.log("connect");
      bitcoin_rpc.call('validateaddress', [publicKey], function (err, res) {
        if (err) {
          console.log("************errrrrrrrrrr == "+err);
         return  reject(err);
        } else if (res.error) {
          console.log("************res.errorrrrrrrrrrrr == "+JSON.stringify(res.error));
          return reject(err);
        } else {
            console.log("************res validate == "+JSON.stringify(res));
            console.log("***validate == "+res.result.pubkey);
          if ((res.result === '') || (res.result === null) || (res.result.pubkey === undefined)) {
            return resolve({ 'pubkey': 0, publickey: publicKey });
          } else {
            return resolve(res.result.pubkey);
          }
        }
      }, (err) => {
        return reject(err);
      });
    }, (err) => {
      return reject(err);
    });
  }
 
//create multi signe address
function createmultisig(publicAddress1,bastojiAddressForMulti) {
    console.log("publik "+publicAddress1);
    console.log("static ="+bastojiAddressForMulti);
    return new Promise((resolve, reject) => {
      bitcoin_rpc.init(localhost, port, username, password)
      bitcoin_rpc.call('createmultisig', [2,[publicAddress1,bastojiAddressForMulti]], function (err, res) {
        if (err) {
          console.log("************errrrrrrrrrr == "+JSON.stringify(err));
         return  reject(err);
        } else if (res.error) {
          console.log("************res.errorrrrrrrrrrrr == "+JSON.stringify(res.error));
          return reject(err);
        } else {
            console.log("************res createmultisigne == "+JSON.stringify(res));
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

module.exports = _publics;