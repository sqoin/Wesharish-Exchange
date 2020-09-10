
const config = require('../../config');
var jwt    = require('jsonwebtoken');
const express = require('express');
const app = express(); 
app.set('Secret', config.secret);
app.set('secure', config.secure);
app.set('authentification', config.authentication.url);
const router = require('express').Router();
const logger = config.logger;

if (app.get('secure')==="false"){


router.use((req, res, next) => {
    res.payload = {};
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Set-Cookie", "HttpOnly;Secure;SameSite=Strict");
    next();
});

}  else{



router.use((req, res, next) =>{
    res.payload = {};
    //const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiQXp1cmVEaWFtb25kIiwicGFzc3dvcmQiOiIqKioqKioqKioiLCJzY29wZXMiOlsicGFuZ29saW5zIl19LCJpYXQiOjE0OTk0MjAxMTEsImV4cCI6MTQ5OTQyMDQxMX0.KkoS0sKV1Hc5fFV5V7J1HlKVQYfmfpZZAwBZ9aDXRFc'; // JSON Web Token
    //const secret = 'ssshhh'; // Secret used in the JWT signature
    
    // check header for the token

    var token = req.headers['access-token'];
  
    // decode token
    if (token) {
 
        const JS = require('circular-json')
        const axios = require('axios');
        
       
        // timeout
            axios.get(app.get('authentification')+'?token='+token ,
            {
                headers: {
                  Authorization: 'Basic '+app.get('Secret') //the token is a variable which holds the token
                }
               
            },
            { timeout: 2000 })
              .then((response) => {
              
                console.log("ressss "+JS.stringify(response.data));
                next();
               })
              .catch(error => {
                return  res.status(401).json({ message: 'invalid token' });  
              });
        

      /*// verifies secret and checks if the token is expired
      jwt.verify(token, app.get('Secret'), (err, decoded) =>{      
        if (err) {
          return  res.status(401).json({ message: 'invalid token' });    
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;    
          next();
        }
      });*/
  
    } else {
  
      // if there is no token  
    res.status(401).send({
        message: 'No token provided.' 

    });
      
    }
  });

}

var commonCoins = require("../coins/SAGE/commoncoins");
var user = require("../Dao/user");
var coinDao = require("../Dao/coin");
var coin= require("../coins/coin");
var tokenCoin= require("../coins/SAGE/tokencoin");
var nativeCoin = require("../coins/SAGE/controller");
var bastoji = require("../coins/BASTOJI/controller");
var fileUtil = require("../common/fileUtil");
var userUtil = require("../common/userUtil");
var requestUtils = require("../common/requestUtils");
var transaction = require("../Dao/transactions");
var cryptoUtil = require("../common/crytoUtil");
var transactionUtil= require("../common/transactionUtil");
var email= require("../common/email");
var order = require("../Dao/order");
var emailDao= require("../Dao/emailDao");

//coin
coin.fileUtil=fileUtil;
coin.bastoji=bastoji;
coin.user=user;
coin.nativeCoin= nativeCoin;
coin.commonCoins=commonCoins;
coin.coinDao=coinDao;
coin.requestUtils=requestUtils;
coin.tokenCoin = tokenCoin;
coin.cryptoUtil=cryptoUtil;
coin.order=order;
coin.emailDao=emailDao;
coin.email=email;

//commoncoins
commonCoins.requestUtils=requestUtils;
commonCoins.fileUtil=fileUtil;
commonCoins.coin=coin;
commonCoins.cryptoUtil=cryptoUtil;
commonCoins.user=user;
commonCoins.transaction=transaction;
commonCoins.coinDao=coinDao;
commonCoins.nativeCoin=nativeCoin;
commonCoins.tokenCoin=tokenCoin;

//nativeCoin
nativeCoin.fileUtil=fileUtil;
nativeCoin.requestUtils=requestUtils ;
nativeCoin.transaction=transaction;
nativeCoin.transactionUtil=transactionUtil;
nativeCoin.commonCoins=commonCoins ;
nativeCoin.coin=coin ;
nativeCoin.cryptoUtil=cryptoUtil ;
nativeCoin.user=user; 
nativeCoin.order=order; 
nativeCoin.email=email ;
nativeCoin.emailDao=emailDao;
nativeCoin.coinDao=coinDao;
//tokenCoin
tokenCoin.fileUtil=fileUtil;
tokenCoin.coin=coin ;
tokenCoin.cryptoUtil=cryptoUtil ;
tokenCoin.user=user;
tokenCoin.transaction=transaction ;
tokenCoin.email=email ;
tokenCoin.order=order;
tokenCoin.commonCoins=commonCoins;
tokenCoin.requestUtils=requestUtils;
tokenCoin.emailDao=emailDao;
tokenCoin.coinDao=coinDao;
//email
email.requestUtils=requestUtils;

//requestUtils
requestUtils.fileUtil=fileUtil;
requestUtils.user=user;

//transactionUtil
transactionUtil.transaction=transaction;
transactionUtil.bastoji=bastoji;

//userUtil
userUtil.user=user;
userUtil.requestUtils=requestUtils;

//fileUtil
bastoji.fileUtil=fileUtil;
bastoji.cryptoUtil=cryptoUtil;
bastoji.coin=coin;
bastoji.transactionUtil=transactionUtil;
bastoji.transaction=transaction;
bastoji.requestUtils=requestUtils;
bastoji.order=order;
bastoji.email=email;
bastoji.emailDao=emailDao;
bastoji.user=user;
bastoji.coinDao=coinDao;



//get user by id
router.get('/api/getUserById', (req, res, next) => 
user.getUserById(req.query.id )
.then(response=> res.send(response))
.catch(next));

//update user
router.post('/api/updateUser', (req, res, next) => {
userUtil.updateUserRouter(req)
.then(response=>res.send(response))
.catch(next);
});
/*waiting*/
//get private key and create it if it does not exist
router.post('/api/generatePrivateKey', (req, res, next) =>{  
coin.generatePrivateKey (req,res)
});



  
//get private key and create it if it does not exist
router.post('/api/generatePrivateKeyAndPublicKey', (req, res, next) =>{  
  coin.generatePrivateKeyAndPublicKey (req,res)
  });
/*waiting*/
//get public key
/*router.get('/api/getPubAdd', (req, res, next) =>{
requestUtils.getPubAdd( req.query.coin, req.query.idUser)
.then(response=>res.send(response))
.catch(next);
});*/


  //get all the public key in a list
router.get('/api/getlistPublicAddresses', (req, res, next) =>{
userUtil.getlistPublicAddressesRouter()
.then(response=>res.send(response))
.catch(next);
});

//get a public key by user id *************>>>> get public key by only user id 
router.get('/api/getPublicAddressByUserId', (req, res, next) =>{
coin.getPublicAddressByUserIdRouter(req.query.coin,req.query.userId)
.then(response=>res.send(response))
.catch(next);
})


//return the balance value by public key *****>> get balance with only pk 
router.get('/api/getBalance', (req, res, next) =>{
coin.getBalanceCoinAll(req.query.coin,req.query.publickey)
.then(response=>res.send(response))
.catch(next);
})
/*waiting*/
//sell sage by id user
router.post('/api/sell', (req, res, next) =>{
coin.sellFromRequest(req, res)
.then(response=>res.send(response))
.catch(error=>res)
})
/*waiting*/
//send sage by id user
router.post('/api/send', (req, res, next) =>{
coin.sendFromRequest(req,res)
.then(response=>res.send(response),
      error => {
        res.status(500);
        res.send(error)
    }
).catch(next);
})
 
//list of balance by user id of all coin     ==> we have only one key
router.get('/api/listBalance',(req,res,next)=>
commonCoins.getListBalances(req.query.userId)
.then(response=>res.send(response))
.catch(next));

//list of all transactions
router.get('/api/getlistTransactions',(req,res,next)=>
  coinDao.getListTransactions()
.then(response=>res.send(response))
.catch(next)); 

//get id by public key
router.get('/api/getIdByPublicKey', (req, res, next) => 
user.getUserByPublicKey(req.query.publicKey)
.then(response=>res.send(response+""))
.catch(next));


//get all users
router.get('/api/getAllUsers', (req, res, next) => 
user.getAllUsers()
.then(response=>res.send(response))
.catch(next));


//get user by id
router.get('/api/getUserNameByUserId', (req, res, next) => 
user.getUserNameByUserId(req.query.id )
.then(response=>res.send(response))
.catch(next));

//get user by id
router.get('/api/getCoinValueByDollar', (req, res, next) => 
coinDao.getCoinValueByDollar(req.query.coin )
.then(response=>res.send(response+""))
.catch(next));


//get idUser by email and password
router.get('/api/getUserIdByEmailAndPassword', (req, res, next)=>{  
userUtil.getUserIdByEmailAndPassword(req.query.email,req.query.password)
.then(response=>res.send(response))
.catch(next);
})


//get user by publicKey
router.get('/api/getPayementToProccess', (send, res, next) => 
transaction.getPayemntsFailed()
.then(data=>commonCoins.sendPayment(data[1]))
.then(response=>res.send(response))
.catch(next));


//return the blockCount value by public key
router.get('/api/validateAddress', (req, res, next) =>{
  coin.validateAddress(req.query.publickey,req.query.coin)
  .then(response=>res.send(response))
  .catch(next);
})

//verified public and private key
router.get('/api/verifiedKeys', (req, res, next) =>{
  commonCoins.isValidPrivateKey(req.query.privateKey,req.query.publicKey)
  .then(response=>{
    console.log("response == "+response);
    res.send(response)})
  .catch(next);
})


router.post('/api/login', (req, res, next) =>
requestUtils.getRawBody(req)
.then(admin => {
    return user.login(admin);
})
.then(response => {
    res.send(response);
})
.catch(next));
module.exports = router;

