
'use strict';

const _publics = {};
var config = require('../../config');
//var targetCoin = config.sage.targetWallet;
//var targetBastoji = config.bastoji.targetBastoji;
const namePublic = config.sage.fileNamePublicKey;
const namePrivate = config.sage.fileNamePrivateKey;
const log = require('ololog').configure({
    time: true
});
var localisation;
const logger = config.logger;
var target = config.target;
//const logger = require('../../logger');
 
_publics.tokenCoin; 
_publics.commonCoins; 
_publics.coinDao; 
_publics.user; 
_publics.nativeCoin; 
_publics.bastoji; 
_publics.fileUtil; 
_publics.requestUtils;
_publics.cryptoUtil;
_publics.tokens;

_publics.generatePrivateKey = (req, res) => {
    return generatePrivateKey(req, res);
}
//get private key from file and create it if it doesn't exist 
function generatePrivateKey(req, res) {
    logger.info("here is generate keys!");
    var privateKeyGenerator;
    var storage;
    _publics.requestUtils.getRawBody(req)
    .then(body => {
    var object = JSON.parse(body);
    res.payload.userId = object.userId;
    res.payload.coin = object.coin;
    res.payload.pin = object.pin;
    storage =target+'target'+res.payload.coin;
    var localisation =require('./'+res.payload.coin+'/controller');
    privateKeyGenerator=localisation.privateKeyGenerator;  
        
    _publics.fileUtil.isFolderExist(res, storage + "/" + res.payload.userId)
    .then((path) => _publics.fileUtil.generateFolder(storage, res.payload.userId)
                .then(response =>privateKeyGenerator()
                    .then((data) =>_publics.cryptoUtil.encryptAndSave(res.payload.pin, data.privateKey, storage + "/" + res.payload.userId + "/" + namePrivate)
                                .then(() =>_publics.user.savePublicKeyToDatabase(res.payload.userId, res.payload.coin, data.publicKey)
                                            .then((resultat) => res.send(data.publicKey)
                                                )
                                    )
                    )
                )
        )
    })
    
}

/*fixer le coin */ 

_publics.getPublicAddressByUserIdRouter = (coin,userId) => {

    return new Promise((resolve, reject) => {
        _publics.user.getPublicKeyByUserId(userId, "BASTOJI")
  
        .then(data => {
            var json = {
                "userId": userId,
                "publickey": data
            };
           resolve(json);
        })//.catch(error=>{reject(error)});
    })

}

_publics.getKeysRouter = (req, res) => {
    _publics.requestUtils.getRawBody(req)
    .then(body => {
   var req = JSON.parse(body);
  
   var userId = req.userId;
    var coin = (req).coin;
    var pin = req.pin;
    var privateKeyGenerator;
    var storage;
    var localisation =require('./'+coin+'/controller');
    privateKeyGenerator=localisation.privateKeyGenerator; 
    _publics.fileUtil.isFolderExist(res, storage + "/" + userId).then(
        (path) => {
            _publics.fileUtil.generateFolder(storage, userId)
                .then(response => {
                    privateKeyGenerator()
                    .then((data) => {
                        logger.info("data = "+data);
                            _publics.cryptoUtil.encryptAndSave(pin, data.privateKey, storage + "/" + userId + "/" + namePrivate)
                                .then(() => {
                                        _publics.user.savePublicKeyToDatabase(userId, coin, data.publicKey)
                                            .then((resultat) => {
                                                logger.info("result "+resultat);
                                                    res.send(data.publicKey);
                                                })//.catch(error=>{res.send(error)});
                                    })
                        })
                })
        })
    })
    }


_publics.getBlockCount =(userId,coin)=>{
    console.log("userid ="+userId+" coin = "+coin );
    var localisation =require('./'+coin+'/controller');
    var blockCountFunction=localisation.getBlockCount;
    return new Promise((resolve, reject) => {
    
    return blockCountFunction()
    .then(data=> resolve(data+""))
    //.catch(error=>reject(error));
    });
}

//validate address
_publics.validateAddress=(publickey,coin)=>{
    //console.log("public key"+publickey);
    var localisation =require('./'+coin+'/controller');
    var validateAddressFunction=localisation.validateAddress;
    return new Promise((resolve, reject) => {
        return validateAddressFunction(publickey)
        .then(data=> resolve(data+""))
        //.catch(error=>reject(error));
        });
}
function extractSendParams(sendParams) {
    console.log("first send prarams "+sendParams);
    var sendParams=JSON.parse(sendParams);
  return new Promise((resolve , reject) => {
        var ret = 
        { "coinname":"BASTOJI",
        "from": sendParams.from ,
        "to":sendParams.to,
        "date": sendParams.date,
        "coin":"BASTOJI", 
        "id_coin":"4", 
        "native":sendParams.native, 
        "amount":sendParams.amount,
        "pin":sendParams.pin//, 
       // "productId":sendParams.productId
    };

       /* if (! ret.from) {
            return reject("Transaction input missing");
        }*/
        console.log("ret "+JSON.stringify(ret));
            return resolve(ret);
      }
       
      );
}
function checkSendParams (sendParams) {
    console.log("send pramars for check function "+JSON.stringify(sendParams));
    return new Promise(
        (resolve , reject) => {
            _publics.coinDao.getCoinIdByName(sendParams.coin)
            .then(
                idCoin=> {sendParams.id_coin=idCoin;
            return resolve(sendParams)}
            ,error=> reject("coin not supported"));
        }
         
        );
}
 

_publics.sellFromRequest = (req , writeFunction) => {
    return extractCheckAndExecute(req , writeFunction ,sell);
}


_publics.sendFromRequest = (req , writeFunction) => {
    return extractCheckAndExecute(req , writeFunction ,send);
}


function extractCheckAndExecute (req , writeFunction , executeFunction){
    return new Promise((resolve , reject) => {
        _publics.requestUtils.getRawBody(req)
        .then(data=>{extractSendParams(data)
            .then(data =>{checkSendParams(data)
                 .then(data=>{executeFunction(data, writeFunction)
                     .then(data=> resolve(data))})})
            })
        })
}


//{"coinname":res.payload.sendParams.coin,"from": res.payload.sendParams.from ,"to":res.payload.sendParams.to,"date": res.payload.sendParams.date,"coin":id_coin, "native":res.payload.sendParams.native, "amount":res.payload.sendParams.amount,"pin":res.payload.sendParams.pin, "productId":res.payload.sendParams.productId} ;
// example :
/* 
{"coinname":"",
"from": res.payload.sendParams.from ,
"to":res.payload.sendParams.to,
"date": res.payload.sendParams.date,
"coin":id_coin, 
"native":res.payload.sendParams.native, 
"amount":res.payload.sendParams.amount,
"pin":res.payload.sendParams.pin, 
"productId":res.payload.sendParams.productId} ;
*/
function send (data , writeFunction){
    logger.debug('send public ' +JSON.stringify(data) );
    var sendFunction;
    return new Promise((resolve, reject) => {
  //  _publics.tokens.getContractAddress(data.coin)
   // .then(contratAddress=>{
      //  if(contratAddress===null || contratAddress===''){
            var localisation =require('./'+data.coin+'/controller');
            sendFunction=localisation.send;  
            return sendFunction(writeFunction, data)
                  .then((data) => {
                        logger.info('result send '+JSON.stringify(data));
                         return resolve(data);
                    });
      /*  }else{
        return _publics.tokenCoin.sendToken(contratAddress,writeFunction, data)
        .then((data) => resolve(data))
        }*/
   // })
})
}

function sell(data , writeFunction){
    logger.debug('sell function ' );
    var response;
    var emailTo;
    return new Promise((resolve, reject) => {
        send(data, writeFunction)
        .then(responseMsg=>
            { response=responseMsg;
                _publics.requestUtils.getPubAddC(data.from,data.coinname)
                .then(publickey=>
                    _publics.order.createOrder(data.coinname,publickey,data,data.date,data.amount)
                    ) // Problem not resolved yet : if transaction is ok and problem in creating order
                .then(responseOrder=>
                    {
                        console.log("response ==> "+JSON.stringify(response));
                        if(response.msg==="failed"){
                        return resolve(response);
                    }else{
                       _publics.emailDao.getEmailById(data.from)
                        .then(emailToResponse=>
                            {console.log("emailToResponse => "+emailToResponse);
                            emailTo=emailToResponse;
                            console.log("data from = "+data.from);
                            _publics.user.getUserNameById(data.from)
                            .then(username=>{console.log("username => "+username);
                            _publics.email.mailSend(data.coin,emailTo,username,response.transactionId,data.amount)
                    })
                }).then(idMessage=>{
                                    var responseNew;
                                            if((idMessage === undefined)||(idMessage=== null)||(idMessage==="")){
                                                logger.warn(idMessage);
                                                responseNew={"email":"erreur send mail"};
                                            }
                                                responseNew ={ "email":"message sent", "transactionId":response.transactionId};
                                    
                                        return resolve(responseNew);
                                })
                    }
})
    })
})
}

_publics.getBalanceCoin = (coin) => {
    return new Promise((resolve, reject) => {
            var response=getBalanceByPublicKey(coin.name,coin.publickey);
            return resolve(response);
    },
    (error)=>{
           return reject(error);
    })
}

// Make clean functions without request and response

function getBalanceByPublicKey (coin, publicKey)  {
    logger.debug('get balance by public key function');
    console.log("coin "+JSON.stringify(coin));
    console.log("publicKey "+publicKey);
    var balanceFunction;
    return new Promise((resolve1, reject) => {
      //    _publics.tokens.getContractAddress(coin)
      //  .then((contract)=>{
           // logger.info('contract '+contract);
         //   if(contract===null || contract===''){
                return new Promise((resolve, reject) => {
                        logger.info('after contract coin is **'+coin+'**');
                        var localisation =require('./'+coin+'/controller');
                        balanceFunction=localisation.getBalance; 
                       return balanceFunction(publicKey)
                        .then((data) => {
                                logger.info('data '+JSON.stringify(data));
                                return resolve1(data);
                            },(error)=>{
                                logger.error('error balance for native coin '+error);
                                return reject(error);
                            })
                });
        /*    }else{
                return new Promise((resolve, reject) => {
                        logger.info('public key=> '+publicKey);
                        logger.info('contract => '+contract);
                         _publics.tokenCoin.getBalanceToken(publicKey, contract)
                        .then((data) => {
                            logger.info('data '+JSON.stringify(data));
                            return resolve1(data);
                            },(error)=>{
                                logger.error('error balance for derived coin '+error);
                                return reject(error);
                            })
                });
            }*/
       // })
    },
    (error)=>{
        reject(error);
    });
}
_publics.getBalanceCoinAll = (coin, publickey) => {
    console.log("coin => "+coin);
    console.log("pk ==> "+publickey);
    logger.info('getBalanceCoinAll function ');
    return new Promise((resolve, reject) => {
        var response;
        if(coin.name===undefined){
            response=getBalanceByPublicKey(coin, publickey);
            return resolve(response);
        }else{
            response=getBalanceByPublicKey(coin.name, publickey);
            return resolve(response);}
    },
    (error)=>{
           return reject(error);
    })
}

_publics.getAllCoinByUser =(user_id)=>{
    logger.debug('get all coin by user'+user_id);
    return new Promise((resolve, reject) => {
        _publics.coinDao.getlistCoinNameByUserId(user_id)
        .then(listCoin=>{
            console.log("list coin "+JSON.stringify(listCoin));
            getListCoinIdByName(listCoin)
            .then(response=>{
                console.log("response final => "+JSON.stringify(response[0]));
                return resolve(response[0]);
            })
        })
    },(error)=>{
           return reject(error);
    }).catch(error=>{res.send(error)});
}

function getListCoinIdByName(list){
    logger.debug('list all coin derived and native for user ')
    let promises = [];
    let listCoin =[];
    var length=list.length;
    for(var i=0;i<length;i++){
        promises.push(new Promise((resolve, reject) => {
            console.log(list[i])
            listCoin.push({"name":list[i].coin});
            _publics.coinDao.getCoinIdByName(list[i].coin)
            .then(coin_id=>{
                console.log("coin id = "+coin_id);
                _publics.coinDao.getCoinDerivedName(coin_id)
                .then(coinList=>{
                    console.log("coinList => "+JSON.stringify(coinList));
                    if(JSON.stringify(coinList) !== "[]"){
                        console.log("here coin non vide");
                    for(var j=0;j<coinList.length;j++){
                        console.log("coin de i "+JSON.stringify(coinList[j]));
                        listCoin.push(coinList[j]);
                    } 
                }
                console.log("listCoin ==> "+JSON.stringify(listCoin));
                return resolve(listCoin); 
                }).catch(error=>{res.send(error)});
            }) 
            
        }
        ))
    }
    //return Promise.all(listCoin); 
    return Promise.all(promises);      
}
module.exports = _publics;
