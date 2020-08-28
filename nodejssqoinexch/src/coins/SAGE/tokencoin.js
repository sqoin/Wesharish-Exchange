'use strict'; 
const _publics = {};

let fs = require("fs");
var config = require('../../../config');
var target = config.sage.targetSage;
const logger = config.logger;
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(config.sage.web3));
var destinationAddress = config.sage.fixedAddressWallet;
const namePrivate = config.sage.fileNamePrivateKey;
var contracts = require('./contracts/FixedSupplyToken.json');

let abi = require('./build/abi/SimpleStorage.json');
var solc = require('solc');
var path = require('path'); 



_publics.fileUtil ;
_publics.coin ;
_publics.cryptoUtil ;
_publics.user;
_publics.transaction ;
_publics.email ;
_publics.order;
_publics.commonCoins;
_publics.tokens;
_publics.requestUtils ;
_publics.emailDao;
_publics.coinDao;


/// old transfer token 
_publics.sendToken = (contratAddress,writeFunction, data) => {
    console.log("contratAddress "+contratAddress);
    console.log("data ="+JSON.stringify(data));
    logger.info('here sell for other token');
    var localTransaction;
    var publicKeyDestination;
    var publicKey;
    var balanceTo;
    return new Promise((resolve, reject) => {          
             return  _publics.transaction.createTransaction( data)
             .then(localTransactionResponse=>{
                 logger.info('localTransaction =='+localTransactionResponse);
                 localTransaction=localTransactionResponse;
                return _publics.requestUtils.getPubAddSAGE(data.from,data.coinname)
                 .then(publicKeyResponse=>{
                    logger.info('publicKey ='+publicKeyResponse);
                    if(publicKeyResponse==="according not exist"){
                        writeFunction("according not exist");
                        return;
                    }
                     publicKey=publicKeyResponse;
                    return  _publics.requestUtils.getPubAddSAGE(data.to,data.coinname)
                     .then(publicKeyDestinationResponse=>{
                        logger.info('publicKeyDestination ='+publicKeyDestinationResponse);
                       if (publicKeyDestinationResponse==="according not exist"){
                        writeFunction("according not exist");
                           return;
                       }
                         publicKeyDestination=publicKeyDestinationResponse;
                         getBalanceToken(publicKeyDestination,contratAddress)
                         .then(balanceToResponse=>{
                             logger.info('balanceTo =='+balanceToResponse);
                             balanceTo=balanceToResponse;
                             return _publics.fileUtil.readFileCrepted(target + "/" + data.from + "/" + namePrivate)
                         })
                 .then(creptedPrivateKey=>{
                    logger.info('creptedPrivateKey =='+creptedPrivateKey);
                     return _publics.cryptoUtil.decryptedKey(creptedPrivateKey, data)
                     .then((decryptedPrivateKey)=>{

                        return _publics.commonCoins.isValidPrivateKey(decryptedPrivateKey,publicKey)
                         .then((isValid)=>{
                             if(isValid == false){
                                 var message = {msg: "failed",error: "verify your PIN !!"};
                                 writeFunction(message);
                                 }else{
                                    
                                      getBalanceToken(publicKey,contratAddress)
                                     .then((balanceFrom)=>{
                                        logger.info('balanceFrom =='+balanceFrom);
                                        var amount = data.amount*100;
                                    
                                        if(balanceFrom < amount ){
                                         
                                           var message = {msg: "failed",error: "user does not have enough coins !"};
                                           return resolve(message);
                                        }else{
                                        
                                        var response =getTransferToken(contratAddress,publicKey ,publicKeyDestination , data.amount , decryptedPrivateKey)   
                                        return (response); 
                                        }
                                     })   
                         .then((response)=>{
                          
                            return resultTransactionToken (response,localTransaction)
                            .then((message)=>{
                                logger.info('message ='+message);
                                return resolve(message);
                            })
                         })
                        }
                    })
                        })
                    
                     })
                 })
             })
         })
        })
     }
 



// return the balance value by user public key using Oussema Code ( using publickey and contract address (PublishServiceContractAddress))
_publics.getBalanceToken = (publicKey , contract ) => {
    return getBalanceToken (publicKey,contract) ;
}
// return the supply value by user public key using Oussema Code using contract address (PublishServiceContractAddress)
_publics.getTotalSupplyToken = () => {
    return new Promise((resolve, reject) => {
        var res = '' ;
         web3.eth.defaultAccount = web3.eth.accounts[0];
         var PublishServiceContractAddress = config.contract.contratAddress;
         var SimpleStorage = web3.eth.contract(contracts.abi);
         const PublishServiceContract= SimpleStorage.at(PublishServiceContractAddress);
         res = PublishServiceContract.totalSupply().toNumber() ;
        return  resolve(res);

    });

}


//balance token 
function getBalanceToken (publicKey,contract) {
    logger.debug('get balance for contract address =>'+contract);
    return new Promise((resolve, reject) => {
          web3.eth.defaultAccount = web3.eth.accounts[0];
           var PublishServiceContractAddress=contract;
            var SimpleStorage = web3.eth.contract(contracts.abi);
            
            const PublishServiceContract= SimpleStorage.at(PublishServiceContractAddress);
       
            let res = PublishServiceContract.balanceOf(publicKey+"").toNumber();
            let balanceToken = res / 100 ;
           return resolve( {'balance' : balanceToken,publickey:publicKey});
           // return resolve( {'balance' : 20,publickey:publicKey});
       });
}


function  resultTransactionToken(response, localTransaction){
    logger.debug('after transaction');
    return new Promise((resolve, reject) => {
        var message = {};
       
        if ((response === null)||(response=== "")||(response=== undefined) ){
            _publics.transaction.updateTransactionStateToken(localTransaction);
            message = {
                message: "failed",
            }
        } else {
           var txnId = response;
           _publics.transaction.updateTransactionID(localTransaction,txnId);
           message = {
            message: "success",
               transactionId: txnId
           }
        }
        return  resolve(message);
    })
}


// token send old 
function getTransferToken (contratAddress,userFromPublicKey , userToPublicKey , totalSupply , decryptedPrivateKey) {

    var userFrom=(userFromPublicKey.toString().substr(0, 42));
    var stringUserToPublicKey=userToPublicKey.toString().substr(0, 42);
    var convertedTotalSupply=totalSupply*100;
    
    return new Promise((resolve, reject) => {
         var PublishServiceContractAddress = contratAddress;
    
         var SimpleStorage = web3.eth.contract(contracts.abi);
         const PublishServiceContract= SimpleStorage.at(PublishServiceContractAddress)
         logger.info('userFrom ='+userFrom);
         logger.info('stringUserToPublicKey ='+stringUserToPublicKey);
         logger.info('total supply ='+convertedTotalSupply);
         var result= PublishServiceContract.transferFrom(userFrom, stringUserToPublicKey , convertedTotalSupply )
        logger.info('result token '+result);
         if(result== undefined){
             logger.warn('coin enough for user');
             return resolve("error: user does not have enough coins");
         }else{
             return resolve(result);
         }
          })
    
 }


_publics.createTokensRouter=(req)=>{
    
    var name = req.query.name;
    var total= req.query.total;
    var user_id = req.query.userId;
    var pin= req.query.pin;
    return new Promise((resolve, reject)=> { 
    _publics.tokens.createTokens(name , total , user_id , pin )
    .then(response =>resolve(response+""))
    //.catch(error=>reject(error))
    })

}


  
function waitBlock(contract , SimpleStorage , publickey) {

    return new Promise((resolve, reject)=> {  
            var Contractadress08;
            while (true) {
                let receipt = web3.eth.getTransactionReceipt(contract.transactionHash);
                if (receipt && receipt.contractAddress) {
                   
                    Contractadress08=receipt.contractAddress;
                        break;
                }
                console.log("Waiting a mined block to include your contract... currently in block " + web3.eth.blockNumber);
                
            }
        
            const PublishServiceContract= SimpleStorage.at(Contractadress08);
         
          
           // var hashAddress= PublishServiceContract.set(165,{from : publickey });
          
       return resolve(Contractadress08);
  
  });
}

_publics.createContract=(contractInfo)=>{
    logger.info('contractInfo create contract ==> '+contractInfo);
 var contractInfo=JSON.parse(contractInfo);
 var coin=contractInfo.parent;
 var userId=contractInfo.userId;
 return new Promise((resolve, reject) => {
  _publics.coinDao.getCoinIdAndUserIdByName(coin,userId)
  .then((result) =>{
      console.log("result "+JSON.stringify(result));
      contractInfo={"userId":result.userId,"id":contractInfo.id,"totalSupply":contractInfo.totalSupply,"name":contractInfo.name,"parent_id":result.id_coin,"publickey":result.publickey};
     var response= createContract(contractInfo)
     return resolve (response);
  
  })//.catch(error=>reject(error)); 
});
}

function createContract(contractInfo){
    logger.debug('contract info  == '+JSON.stringify(contractInfo));
    return new Promise((resolve, reject) => {
        var contractAddress;
        var publickey;
        var name = contractInfo.name;
        var totalSupply = contractInfo.totalSupply;
        var id = contractInfo.userId;
        var publickey=contractInfo.publickey;
        var parent_id= contractInfo.parent_id;
            let SimpleStorage = web3.eth.contract(abi);
            const myContractPath = path.resolve(__dirname, 'contracts','FixedSupplyToken.sol');
            const sourceCode = fs.readFileSync(myContractPath,'utf8');
            //replace owner balance by address params
            console.log("source code ==> "+sourceCode);
            sourceCode.replace("{{address}}",publickey);
           // fs.writeFile("D:/",sourceCode);
            fs.writeFile("D:/source.txt", '' + sourceCode, function (err, result) {
                if (err) {
                    logger.error(err);
                   return reject("this is the error " + err);
                }
                console.log("result =="+result);
                return resolve(result);
            });
            let code='0x'+solc.compile(sourceCode,1).contracts[':FixedSupplyToken'].bytecode;
            var password = "123456";
            var address =  "0xee783754fd5812aee50b19492c916e32b1916c27";
            try {
                web3.personal.unlockAccount(web3.eth.coinbase, password);
            } catch(e) {
            logger.error('error unlockAccount '+e);
            return;
            }
            let contract = SimpleStorage.new(publickey,{from: web3.eth.coinbase, gas: 1000000, gasPrice: 1000 ,data :code });
              _publics.user.getPublicKeyByUserId(id, "SAGE")
              .then(publickeyResponse=>{
                publicKey=publickeyResponse;
                var contractvv= waitBlock(contract , SimpleStorage , publickey);
                return contractvv;
                 
                })
              .then((contractAddressResponse)=>{
                    console.log(contractAddressResponse)
                    contractAddress=contractAddressResponse;
                    return _publics.coinDao.createTokenAddress(name , totalSupply, publicKey,contractAddress,parent_id  )
                })
               .then((resultat)=>{
                   console.log(resultat);
                    return resolve(contractAddress);
                })//.catch(error=>reject(error));
                })
       

}


_publics.getAllTokenByUserId=(userId)=>{
    
    return new Promise((resolve, reject) => {

              _publics.user.getPublicKeyByUserId(userId, "SAGE")
              .then((publickey)=>{
                  console.log(publickey)
                 return _publics.coinDao.getListTokenByUserId(publickey)
                 
                })
               .then((resultat)=>{
                  console.log("resultat "+resultat);
                    return resolve(resultat);
                })//.catch(error=>reject(error));
                
                });
       

}

module.exports = _publics; 






