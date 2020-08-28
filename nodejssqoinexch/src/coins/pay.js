var pg = require("pg");
var config = require('../../config');
var request = require('request');
var destinationAddress = config.sage.fixedAddressWallet;
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
var resplayTo;
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
request({
    headers: {
        'Connection': 'keep-alive',
        'Accept':'*/*' ,
        'Origin': 'https://sqoin.exchange',
        'Authorization': 'Basic c3FvaW5zcW9pbjpzZWNyZXQ=',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
        'Content-Length': contentLength,
        'Content-Type': 'application/x-www-form-urlencoded' ,
        'Sec-Fetch-Site': 'same-site' ,
        'Sec-Fetch-Mode': 'cors' ,
        'Referer': 'https://sqoin.exchange/account/sign-in',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cookie': 'uf4=igqm710rdbmo8jgfjj2recjj9g'
    },
    uri: 'http://18.221.180.139:8857/oauth/token' ,
    body: formData,
    method: 'POST'
  }, function (err, res, body) {
    token=JSON.parse(res.body).access_token;
    console.log("res "+JSON.stringify(token));
    getPayemntsPending()
    .then((data)=>{
    send=data[0];
    console.log("send "+send);
    if(send == undefined || send == '' || send == null ){
        logger.warn("no data !! ");
    }else{
        var addressFrom=send.address;
        var amount=send.amount;
        var coin_id=send.coin_id;
        console.log("token "+token);
        request({
            headers: {
                'access-token':token
            },
            uri:'https://sqoin.exchange/api/coinName/'+coin_id,
            method: 'GET'
        },function (err, res, coinName) {
            console.log("coinName "+coinName);
            if(!err && res.statusCode == 200){
                resplayCoinName=coinName;
                request({
                    headers: {
                        'access-token':token
                    },
                    uri:'https://sqoin.exchange/api/getIdByPublicKeyCoin?publicKey='+destinationAddress+'&coin='+resplayCoinName,
                    method:'GET'
                },function (err, res, idFrom) {
                    console.log("idFrom "+idFrom);
                    if(!err && res.statusCode == 200){
                        resplayFrom=idFrom;
                        request({
                            headers: {
                                'access-token':token
                            },
                            uri:'https://sqoin.exchange/api/getIdByPublicKeyCoin?publicKey='+addressFrom+'&coin='+resplayCoinName,
                            method:'GET'
                        },function (err, res, idTo) {
                            console.log("idTo "+idTo);
                            console.log("res "+res);
                            var result=JSON.parse(res.body);
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
                                        uri:'https://sqoin.exchange/api/getBalance?userId='+resplayFrom+'&coin='+resplayCoinName,
                                        method:'GET'
                                    },function (err, res, balance) {
                                        console.log("balance "+balance);
                                        if (!err && res.statusCode == 200){
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
                                                    uri:'https://sqoin.exchange/api/send',
                                                    body: newSend,
                                                    method:'POST'
                                                },function (err, res, body) {
                                                    logger.info("send ==> "+JSON.stringify(res));
                                                    if (!err && res.statusCode == 200) {
                                                         logger.info("send ==> "+JSON.stringify(body));
                                                        return updatePaymentsTrue(body,send)
                                                        .then((final)=>{
                                                       logger.info(final);
                                                       process.exit();
                                                       }) 
                                            }
                                                  });
                                            }
                                            }
                                      });
                                }
                          });
                    }
                  });
            }
          });
        }
    })
  });