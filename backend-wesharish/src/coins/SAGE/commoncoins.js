'use strict'; 
const _publics = {};

var config = require('../../../config');
const EthereumTx = require('ethereumjs-tx');
const log = require('ololog').configure({
    time: true
});
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(config.sage.web3));
const axios = require('axios');
var Wallet1 = require('ethereumjs-wallet');
var utils = require('ethereumjs-util');
var destinationAddress = config.sage.fixedAddressWallet;
var logger=config.logger;

_publics.requestUtils ;
_publics.fileUtil;
_publics.coin ;
_publics.cryptoUtil ;
_publics.user ;
_publics.transaction;
_publics.coinDao ;
_publics.nativeCoin;
_publics.tokenCoin ;
_publics.product;



// return the balance value by user public key Native
_publics.getBalance = (publicKey) => {
    logger.info('here sage');
    var pubkeystr = publicKey.toString().substr(0, 42);
    return new Promise((resolve, reject) => {
        let destinationBalanceWei = (web3.eth.getBalance(pubkeystr));
        let destinationBalance = web3.fromWei(destinationBalanceWei, 'ether');
        let balance = Number.parseFloat(destinationBalance).toFixed(3);
        return resolve({'balance' : balance,publickey:publicKey});
       // return resolve({'balance' : 50,publickey:publicKey});
    });

}


/**
 * This is the process that will run when you execute the program.
 */
function sendCoin  (gasPrices,publicKey, amount, publicKeyDestination, decreptedPrivateKey) {
    return new Promise((resolve, reject) => {
    let myBalanceWei = web3.eth.getBalance(publicKey.toString().substr(0, 42)).toNumber();
    let myBalance = web3.fromWei(myBalanceWei, 'ether')
   
    log(`Your wallet balance is currently ${myBalance} ETH`.green)
   
   
    let nonce = web3.eth.getTransactionCount(publicKey.toString().substr(0, 42))
 
    log(`The outgoing transaction count for your wallet address is: ${nonce}`.magenta)
   
    
    var Wallet = require('ethereumjs-wallet');
 console.log("iciii "+web3.toWei(amount, 'ether'));
    let details = {
      "to":publicKeyDestination.toString().substr(0, 42),
      "value": web3.toHex( web3.toWei(amount, 'ether') ),
      "gas": 90000,
      "gasPrice": 100 * 1000000000, 
      "nonce": nonce,
      
    }
    const transaction = new EthereumTx(details)
   
   
   transaction.sign( Buffer.from(decreptedPrivateKey, 'hex'));
   
    const serializedTransaction = transaction.serialize();
    web3.eth.sendRawTransaction('0x' + serializedTransaction.toString('hex'), function(err, transactionId) {
      var msg = {};
      if (err) {
          msg = {
              message: "failed",
              error: err+""
          };
      } else{
          console.log("transaction id "+transactionId);
          msg = {
              message: "success",
              transactionId: transactionId
          };
      }
      return resolve((msg));
  });
     
    log(`Note: please allow for 30 seconds before transaction appears on Etherscan`.magenta)
    });
  }

_publics.coinSage=(publicKey, amount, publicKeyDestination, decreptedPrivateKey) =>{
    return new Promise((resolve, reject) =>{
        getCurrentGasPrices()
        .then(gasPrices => {
          return sendCoin (gasPrices,publicKey, amount, publicKeyDestination, decreptedPrivateKey);
        })
      .then(msg=>{
          console.log("msg ---> "+JSON.stringify(msg));
            return resolve(msg) ;
      })/*.catch(error=>{res.send(error)});  */
    }); 
  }


_publics.publicAddressGenerator=() =>{

    return new Promise( (resolve , reject) => {
        const wallet = Wallet1.generate();
        return  resolve( {  
                    'publicKey': wallet.getAddressString() , 
                });
    });  
}


_publics.isValidPrivateKey = (privateKey,publicKey) => {

    return new Promise((resolve, reject) => {
               var privateKeyBuffer = new Buffer(privateKey);
       var address = "0x"+utils.privateToAddress(privateKeyBuffer).toString('hex')
       publicKey=publicKey.toString().substr(0, 42);
      console.log("public key == "+publicKey);
      console.log("address == "+address);
        if(address == publicKey){
        
            return resolve(true);
        }else{ 

            return  resolve(false);
        }
      })
  }
 
//send transaction and return txn id
function makeTransaction(gasPrices, publicKey, send, publicKeyDestination, decreptedPrivateKey) {
    var send0 = JSON.parse(send);
    var amount = send0.amount;
    var msg = {};
    
    var nonce =Math.random() * 1000000;
   

    return new Promise((resolve, reject) => {
        let details = {
            "to": publicKeyDestination.toString().substr(0, 42),
            "value": web3.toHex(web3.toWei(amount, 'ether')),
            "gas": 21000,
            "gasPrice": gasPrices * 1000000000,
            "nonce": nonce 
        }
        const transaction = new EthereumTx(details)
        transaction.sign(Buffer.from(decreptedPrivateKey, 'hex'));
        const serializedTransaction = transaction.serialize();
        web3.eth.sendRawTransaction('0x' + serializedTransaction.toString('hex'), function(error, transactionId) {
            if (error) {
                msg = {
                    message: "failed",
                    error: error
                };
            } else {
                msg = {
                    message: "success",
                    transactionId: transactionId
                };
            }
            return resolve(msg);
        })

    });

}


//send transaction and return txn id
_publics.makeTransaction=(gasPrices, publicKey, send, publicKeyDestination, decreptedPrivateKey) =>{
    makeTransaction(gasPrices, publicKey, send, publicKeyDestination, decreptedPrivateKey)

}


_publics.getListBalances=(userId)=>{
    return new Promise((resolve, reject) => {
        _publics.user.getCoinPublicKeyByUserId(userId)
        .then((list)=>{
            var response = getListBalances(list);
            return resolve (response);
        },(error)=>{
            return reject(error);
        })
    });
}

function getListBalances(list){
    logger.debug('function get list balance ');
    console.log("list balance coin "+JSON.stringify(list));
    console.log("list balance coin "+list.length);
    let promises = [];
    for(var i=0;i<list.length;i++){
        promises.push(new Promise((resolve, reject) => {
            var response = getCoinBalanceResult(list[i]);
           return resolve(response);
        },
        (error)=>{
            logger.error('error '+error);
            reject(error);
        }));
    }
    return Promise.all(promises)
}
//
function getCoinBalanceResult(coinNPK){
    logger.debug('get coin balance result');
    return new Promise((resolve,reject)=>{
        getCoinBalance(coinNPK)
        .then(response=>{
            logger.info("response getcoinBalance ="+JSON.stringify(response));
            if((response.coin!==null) && (response.coin!==undefined)&& (response.coin!=="")){
                return resolve(response);
            }
            return resolve(null);
        })
        //.catch(error=>{reject(error)})
    })
}

function getCoinBalance(coin){
    logger.debug('get coin balance');
    console.log("********** coin ********"+JSON.stringify(coin));
    return new Promise((resolve, reject) => {
        logger.info('///////// getCoinBalance before then');
        _publics.coin.getBalanceCoin(coin)
        .then(response=>{
            logger.info('balance coin '+response);
            logger.info('///////// getCoinBalance after then');
            var object={"id_coin":coin.id_coin,"coin":coin.name,"balance":response.balance,"publickey":response.publickey,"derivedFrom":coin.derivedFrom};
            return resolve(object);
        },(error)=>{
            var object={coin:coin.coin,balance:undefined};
            return resolve(object);
        })
    },
    (error)=>{
       return reject(error);
    });
}

_publics.getlistCoinProduct=(idProduct,idUser)=>{
    return new Promise((resolve, reject) => {
        var merchantCoins;
       getlistCoinProductByIdProduct(idProduct)
       .then(liste1=>{
           merchantCoins=liste1;
           console.log("liste 1 "+JSON.stringify(liste1));
          _publics.user.getCoinNameByIdUser(idUser)
           .then(userCoins=>{
               console.log("liste 2 "+JSON.stringify(userCoins));
               var response=getUserAndMerchantCoins(merchantCoins,userCoins)//retourner l'intersections des coins list pour user and merchant
               
               resolve(response);
           })
       })//.catch(error=>reject(error));
    })
}

function getUserAndMerchantCoins(merchantCoins,userCoins){
    let promises = [];
    var list =[];
    var l1=merchantCoins.length;
    var l2=userCoins.length;
    console.log("list1= "+JSON.stringify(merchantCoins));
    console.log("list2= "+JSON.stringify(userCoins));
    for(var i=0;i<l1;i++){
        promises.push(new Promise((resolve, reject) => {
         
            for(var j=0;j<l2;j++){
                promises.push(new Promise((resolve, reject) => {
              
                    if((merchantCoins[i].coin===userCoins[j].coin)&&(!list.includes(merchantCoins[i]))){
                        console.log("merchantCoins[i].coin == "+merchantCoins[i].coin+" "+i);
                        list.push(merchantCoins[i]);    
                    }else{
                        console.log("......................."+i); 
                    }
                }));
            }
        }));
        
    }
   
    return Promise.all(list)
}
function getlistCoinProductByIdProduct(id){
    return new Promise((resolve, reject) => {
    _publics.product.getUserIdByProductId(id)
    .then((idUserProduct)=>{
       // console.log("id user == "+idUserProduct);
       return resolve(_publics.user.getListPKById(idUserProduct));
       
    })
})
}

function getlistParentDerived(parentList){
    console.log("parent list == "+JSON.stringify(parentList));
    let promises = [];
    var l1=parentList.length;
    for(var i=0;i<l1;i++){   
        promises.push(new Promise((resolve, reject) => {
            var listF=getOjbParentDerived(parentList[i]);
            return resolve(listF);
        }));  
    }
    return Promise.all(promises)
}

function getOjbParentDerived(parent){
    console.log("1111 "+JSON.stringify(parent));
    return new Promise((resolve, reject) => {
        _publics.coinDao.getCoinDerivedName(parent.id_coin)
        .then(derivedList=>{
                 console.log("2222 "+JSON.stringify(derivedList));
                  var list=[];
                  list.push(parent);
                  list.push(derivedList);
                  return (list);
                })
                .then(response=>{
                    console.log("obj  ==> "+JSON.stringify(response));
                    return resolve(response);
                })//.catch(error=>reject(error))     
    })
}


_publics.getListBalanceDerive=(listParent)=>{
    return new Promise((resolve, reject) => {
        getlistParentDerived(listParent)
        .then(responseF=> resolve(responseF))
        //.catch(error=>reject(error))
})
}

_publics.getListBalancesAll=(userId)=>{
    logger.debug('get list of all balance');
    return new Promise((resolve, reject) => {
        _publics.user.getCoinPublicKeyByUserId(userId)
        .then((list)=>{
            logger.info("list "+JSON.stringify(list));
            var response=getBlanceList(list);
           return resolve(response);
        },(error)=>{
            return reject(error);
        })
        
    });
}

function getBlanceList (list){
    logger.debug('get balance list Function');
    return new Promise((resolve, reject)=>{
            getListBalances(list)
            .then(balanceNative=>{
                logger.info("balance Native ==> "+JSON.stringify(balanceNative));
                var response=getListAllBalance(balanceNative);
                return response;  
            })
            .then(result=>{
                logger.info('getListAllBalance result=>'+result);
                return resolve(result);  
            })
            //.catch(error=>{reject(error)})
    })
}
//function getListAllBalance
function getListAllBalance(balanceNative){
    return new Promise((resolve, reject) => {
        console.log("////////////in getListAllBalance list=>"+JSON.stringify(balanceNative));
        var responseF=listBalanceAll(balanceNative);
        return resolve(responseF);
     });
}

function listBalanceAll(balanceNative){
    return new Promise((resolve, reject) => {
        console.log("////////////in listBalanceAll list=>"+JSON.stringify(balanceNative));
        getListBalancesAll(balanceNative)
        .then(responseNative=>{
            logger.info("derivé liste ==  "+responseNative);
            var responseF= getAllBalance(balanceNative,responseNative);
           return resolve(responseF);
          
        })//.catch(error=>reject(error))
     });
    }

// all the steps for send sage by user id 
_publics.sendPayment = (send) => {
    return new Promise((resolve, reject) => {
    console.log("send "+JSON.stringify(send));
      coinWallet(destinationAddress, send.amount, send.address )
        .then(response => {           
          console.log("response ====> "+response);
            return _publics.transaction.updatePayments (response,send);
     })
     .then(response=>{
         console.log("fedia ==> "+response);
        resolve(response);
     })
    })
}


function getListBalancesAll(list){
    console.log("liste 11"+JSON.stringify(list));
    let promises = [];
    for(var i=0;i<list.length;i++){
       var coin =list[i];
        promises.push(new Promise((resolve, reject) => {
            var response = getBalanceALLOne(coin);
             return resolve(response);
        })
     );
    }
    return Promise.all(promises);
}

function getCoinBalanceDerive(coins,publickey){
    console.log("/////////in getCoinBalanceDerive");
        let promises = [];
    for(var i=0;i<coins.length;i++){
        promises.push(new Promise((resolve, reject) => {
            var response=getBalanceCoin(coins[i],publickey);
          return resolve(response);
        }));
}
    return Promise.all(promises)
    }


//get balance coin
function getBalanceCoin(coin,publickey){
    console.log("/////////in getBalanceCoin  coin "+coin +"and pk ===>"+publickey);
    return new Promise((resolve, reject) => {
        _publics.coin.getBalanceCoinAll(coin,publickey)
        .then((response)=>{
            var object={"id_coin":coin.id_coin,"coin":coin.name,"balance":response.balance,"publickey":response.publickey,"derivedFrom":coin.derivedFrom};
            return resolve(object);
        },(error)=>{
            var object={coin:coin.coin,balance:undefined};
            return resolve(object);
        
       
    })
})
}
//concatenantion deux lists
function getAllBalance(balanceNative,balanceDerive){
    logger.info('***getAllBalance****');
     var listDerive=balanceDerive[0];
     var promises=[];  
     return new Promise((resolve, reject) => {
        
            for (var i = 0; i < listDerive.length; i++){
                logger.info('***for listDerive****'+i);
                if((listDerive[i]!==null)&&(listDerive[i].balance>0)){
                     promises.push({"coin":listDerive[i].coin,"balance":listDerive[i].balance,"publickey":listDerive[i].publickey});
                }
            }
            for (var i = 0; i < balanceNative.length; i++){
                logger.info('***for balanceNative****'+i);
                if((balanceNative[i]!==null)&&(balanceNative[i].balance>0)){
                     promises.push({"coin":balanceNative[i].coin,"balance":balanceNative[i].balance,"publickey":balanceNative[i].publickey});
                }
            }
            return resolve(promises);
    })
    //.catch(error=>{res.send(error)})
     }
 
//get balance one by one
function getBalanceALLOne(coinOJB){
    console.log("coinOJB "+JSON.stringify(coinOJB));
    return new Promise((resolve, reject) => {
        if(coinOJB!==null){
           _publics.coinDao.getCoinIdByName(coinOJB.coin)
           .then(parentId=>{
               console.log("************* parent id********* "+parentId);
           return getCoinByParent(parentId,coinOJB)
           .then(response=>{
               return resolve(response);
           })
            })
        }else{
            return resolve("");
        }
})
}
//
function getCoinByParent (parentId,coinOJB){
    console.log("parentid ==== "+parentId);
    console.log("*************coinOJB ====> "+coinOJB);
    return new Promise((resolve, reject)=>{
        console.log("///////////////in getCoinByParent");
        _publics.user.getCoinDerived(parentId)
        .then(coins=>{
            console.log("coins ==> "+JSON.stringify(coins));
            if(coins!=="according not exist"){              
               var response= getCoinBalanceDerive(coins,coinOJB.publickey);
                return resolve(response);
            }else{
                return resolve([]);
            } 
        })
    })
}
//
function coinWallet(publicKey, amountSAGE, publicKeyDestination) {

   return new Promise((resolve, reject) =>{
    getCurrentGasPrices() 
       .then(gasPrices => {
      
        console.log("res.payload.publicKeyDestination "+publicKeyDestination+ " type == "+typeof(publicKeyDestination));
         return sendCoin (gasPrices,publicKey, amountSAGE, publicKeyDestination , config.sage.fixedDecreptedPrivateKey);
       })
     .then(msg=>{
           console.log("massssg response == "+JSON.stringify(msg));
           return resolve(msg) ;
     })  
   })//.catch(next); 
 }

 function getCurrentGasPrices  ()  {

    return new Promise((resolve, reject) => {
        let response = axios.get('https://ethgasstation.info/json/ethgasAPI.json');
        return resolve(response);
    })
        .then(response => {
            return new Promise((resolve, reject) => {
                let prices = {
                    low: response.data.safeLow / 10,
                    medium: response.data.average / 10,
                    high: response.data.fast / 10
                }
                log(`Current ETH Gas Prices (in GWEI):`.cyan)
                log(`Low: ${prices.low} (transaction completes in < 30 minutes)`.green)
                log(`Standard: ${prices.medium} (transaction completes in < 5 minutes)`.yellow)
                log(`Fast: ${prices.high} (transaction completes in < 2 minutes)`.red)
                return resolve(prices);
            })
        });
}

_publics.getCurrentGasPrices = () => {

    return getCurrentGasPrices  ();
}
module.exports = _publics;