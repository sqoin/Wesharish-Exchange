var pg = require("pg");
var config = require('../../config');
var request = require('request');
var destinationAddressSage = config.sage.fixedAddressWallet;
var destinationAddressBastoji= config.bastoji.fixedAddressBastoji;
const pool = config.dbpool;
const logger = config.logger;
var querystring = require('querystring');
var request = require('request');
//const secure = config.secure;

//get failed payments 
function getPayemntsPending(){ 
    return new Promise((resolve, reject) => {  
        pool.connect((err, client, release) => {
            if (err) {
                logger.error(err);
              return reject(err);
            }
      var sql = "select id,address,coin_id,amount,state from payments where(processed is null or processed=false) and state is null; ";
      client.query(sql, function (err, result) {
        release();
         if (err)
           { return reject(err);}
           else{
              
        if (result.rows.length > 0) {
            return resolve(result.rows);
          }
          else {
            return reject(result);
          }
           }
      });
    });
  });   
}


//get coin name by id 
function getCoinNameById  (id_coin)  {
    return new Promise((resolve, reject) => {
      pool.connect((err, client, release) => {
        if (err) {
            logger.error(err);
          return reject(err.stack)
        }
      var sql = "select name from coin where id_coin=$1 ";
      var value = [id_coin];
      client.query(sql, value, function (err, result) {
        release();
        if (err) { return reject(err); }
        else {
          if ((result.rows === undefined) || (JSON.stringify(result.rows) === "[]") || (result.rows === null)) {
            return reject("coin not support ");
          } else {
  
            return resolve(result.rows[0].name);
          }
        }
        
      });
    });
  });
  }

//update payments processed  transactions id , eventId
function updatePaymentsTrue(response,send){
    var id = send.id;
    var processed  = true;
    var transactions_id=response.transactionId;
    logger.info("id == "+id);
    logger.info("processed == "+processed);
    const update = 'UPDATE payments SET processed=$1,transactions_id=$2 WHERE id = $3 RETURNING *'
    const values = [ processed,transactions_id, id]
    return new Promise((resolve, reject) => {
        pool.connect((err, client, release) => {
            if (err) {
                logger.error(err);
              return reject(err);
            }
        client.query(update, values, function(err, result) {
            release();
            var msg = "";
            if (err) {
                logger.warn(err);
                msg = "failure";
               return reject(err);
            } else {
                msg = "success";
            }
            return resolve(msg);
        });
    });
});
}
//update payments processed  transactions id , eventId
function updatePaymentsPending(send){
    var id = send.id;
    var state='pending';
    logger.info("id == "+id);
    const update = 'UPDATE payments SET state=$1 WHERE id = $2 RETURNING *'
    const values = [ state, id]
    return new Promise((resolve, reject) => {
        pool.connect((err, client, release) => {
            if (err) {
                logger.error(err);
              return reject(err);
            }
        client.query(update, values, function(err, result) {
            var msg = "";
            if (err) {
                msg = "failure";
               return reject(err);
            } else {
                msg = "success";
            }
            return resolve(msg);
        });
    });
});
}
//update payments processed  transactions id , eventId
function updatePaymentsNoPublicKey(send){
    var id = send.id;
    var state='user does not have public key';
    logger.info("id == "+id);
    const update = 'UPDATE payments SET state=$1 WHERE id = $2 RETURNING *'
    const values = [ state, id]
    return new Promise((resolve, reject) => {
        pool.connect((err, client, release) => {
            if (err) {
                logger.error(err);
              return reject(err);
            }
        client.query(update, values, function(err, result) {
            release();
            var msg = "";
            if (err) {
                msg = "failure";
               return reject(err);
            } else {
                msg = "success";
            }
            return resolve(msg);
        });
    });
});
}
var resplayFrom;
var amount;
var resplayTo;
var addressTo;
var resplayCoinName;
var send;
var form = {
    grant_type: 'password',
    username: 'neylii',
    password: '123456789sqoin' 
};

var formData = querystring.stringify(form);
var contentLength = formData.length;
var token;
var url ='http://localhost:3014';
//var url ='http://localhost:3016';

function send_callback(err, res, body) {
    logger.info("send ==> "+JSON.stringify(res));
    if (!err && res.statusCode == 200) {
         logger.info("send ==> "+JSON.stringify(body));
        return updatePaymentsTrue(body,send)
        .then((final)=>{
       logger.info(final);
       process.exit();
       }).catch(error=>{return(error)});
}
  }

function balance_callback(err, res, balance) {
    console.log("balance "+balance);
    if (!err && res.statusCode == 200){
        if(resplayCoinName==="BASTOJI"){

            balance=JSON.parse(balance).balance;
        }
        console.log("balance "+balance);
        var balanceDouble = parseFloat(balance);
        var amountDouble = parseFloat(amount);
        if(balanceDouble<amountDouble){
            return updatePaymentsPending(send)
            .then((response)=>{
                process.exit();
            })
            }else{
            var newSend ={"coin":resplayCoinName ,"amount":(amount/100) , "from":resplayFrom,"to": resplayTo, pin:"123"}
            request({
                headers: {
                    'access-token':token
                },
                uri:url+'/api/send',
                body: JSON.stringify(newSend),
                method:'POST'
            },send_callback);
        }
        }
  }

function user_to_callback(err, res, idTo) {
    console.log("idTo "+idTo);
    console.log("res "+(res.statusCode));
    var result=JSON.parse(res.body);
    console.log("resplayFrom "+resplayFrom);
        if(result.error !== undefined){
            logger.error(result.error);
            return updatePaymentsNoPublicKey(send)
            .then((response)=>{
                process.exit();
            })
        
        }else{
             resplayTo=idTo;
             request({
                headers: {
                    'access-token':token
                },
                uri:url+'/api/getBalance?coin='+resplayCoinName+'&publickey='+addressTo,
                method:'GET'
            },balance_callback);
        }
  }

function user_from_callback(err, res, idFrom) {
    console.log("idFrom "+idFrom);
   /* if(!err && res.statusCode == 200){
        resplayFrom=idFrom;
        request({
            headers: {
                'access-token':token
            },
            uri:url+'/api/getIdByPublicKeyCoin?publicKey='+addressTo+'&coin='+resplayCoinName,
            method:'GET'
        },user_to_callback);
    }*/
    //console.log("coinName "+coinName);
    //  console.log("destinationAddressBastoji "+destinationAddressBastoji);
      if(!err && res.statusCode == 200){
        resplayFrom=idFrom;
          if(resplayCoinName==="BASTOJI"){
              logger.info('here bastoji');
              request({
                  headers: {
                      'access-token':token
                  },
                  uri:url+'/api/getIdByPublicKeyCoin?publicKey='+addressTo+'&coin='+resplayCoinName,
                  method:'GET'
              },user_to_callback);
          }else{
              logger.info('here '+resplayCoinName);
              var coin="SAGE"
          request({
              headers: {
                  'access-token':token
              },
              uri:url+'/api/getIdByPublicKeyCoin?publicKey='+addressTo+'&coin='+coin,
              method:'GET'
          },user_to_callback);
      }
      }
  }

function coin_name_call_back(err, res, coinName) {
    console.log("coinName "+coinName);
  //  console.log("destinationAddressBastoji "+destinationAddressBastoji);
    if(!err && res.statusCode == 200){
        resplayCoinName=coinName;
        if(coinName==="BASTOJI"){
            logger.info('here bastoji');
            request({
                headers: {
                    'access-token':token
                },
                uri:url+'/api/getIdByPublicKeyCoin?publicKey='+destinationAddressBastoji+'&coin='+resplayCoinName,
                method:'GET'
            },user_from_callback);
        }else{
            logger.info('here '+resplayCoinName);
            var coin="SAGE"
        request({
            headers: {
                'access-token':token
            },
            uri:url+'/api/getIdByPublicKeyCoin?publicKey='+destinationAddressSage+'&coin='+coin,
            method:'GET'
        },user_from_callback);
    }
    }
  }

function token_received(err, res, body) {
    token=JSON.parse(res.body).access_token;
    console.log("res "+JSON.stringify(token));
    getPayemntsPending()
    .then((data)=>{
    send=data[0];
    console.log("send "+JSON.stringify(send));
    if(send == undefined || send == '' || send == null ){
        logger.warn("no data !! ");
    }else{
        addressTo=send.address;
        amount=send.amount;
        var coin_id=send.coin_id;
       // console.log("token "+token);
        request({
            headers: {
                'access-token':token
            },
            uri:url+'/api/coinName?id='+coin_id,
            method: 'GET'
        },coin_name_call_back);
        }
    }).catch(error=>{return(error)});
  }

request({
    headers: {
        
        'Authorization': 'Basic c3FvaW5zcW9pbjpzZWNyZXQ=',
        'Content-Length': contentLength,
        'Content-Type': 'application/x-www-form-urlencoded' 
    },
    uri: 'http://18.221.180.139:8857/oauth/token' ,
    body: formData,
    method: 'POST'
  }, token_received); 