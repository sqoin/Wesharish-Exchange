

'use strict';

const _publics = {};

var config = require('../../config');
const pool = config.dbpool;
const logger = config.logger;


_publics.getCoinIdByName = (coin_name) => {
  console.log("coin name "+JSON.stringify(coin_name));
 logger.debug('get coinId by name function');
  return new Promise((resolve, reject) => {
    pool.connect((err, client, release) => {
      if (err) {
        logger.error('error connecting to DB '+err);
        return reject(err);
      }
    var sql = "select id_coin from coin where name=$1 ";
    var value = [coin_name];
    client.query(sql, value, function (err, result) {
      release();
      if (err) { return reject(err); }
      else {
       // console.log("result == "+result.rows);
        if (result.rows.length > 0) {
          return resolve(result.rows[0].id_coin);
        }
        else {
          return reject("according not exist");
        }

      }
    });
  });
});
}

//get coin name with public key or user id 
_publics.getCoinIdAndUserIdByName = (coin_name,userId) => {
  console.log("coin name "+JSON.stringify(coin_name));
  console.log("userId "+JSON.stringify(userId));
 logger.debug('get coinId by name function');
  return new Promise((resolve, reject) => {
    pool.connect((err, client, release) => {
      if (err) {
        logger.error('error connecting to DB '+err);
        return reject(err);
      }
    var sql = "select id_coin, publickey from coin c left join user_public_key upk on c.name=upk.coin where name=$1 and id_user=$2; ";
    var value = [coin_name,userId];
    client.query(sql, value, function (err, result) {
      release();
      if (err) { return reject(err); }
      else {
       // console.log("result == "+result.rows);
        if (result.rows.length > 0) {
          return resolve({"id_coin":result.rows[0].id_coin,"userId":userId,"publickey":result.rows[0].publickey});
        }
        else {
          return reject("according not exist");
        }

      }
    });
  });
});
}





//get list of transaction 
_publics.getListTransactions=()=>{
  logger.debug('get list transaction function');
  return new Promise((resolve, reject)=>{
    pool.connect((err, client, release) => {
      if (err) {
        logger.error('error connecting to DB '+err);
        return reject(err.stack)
      }
      var sql = "select tF.id,uF.user_name as userFromName , uT.user_name as userToName,time,amount,transactionId,log,c.name as coinName,UPK.publicKey as publicKeySender,state from transactions tF left join users uF on (uF.id = tF.userfrom_id) left join users uT on (uT.id = tF.userto_id) left join coin c on (tF.coin_id=c.id_coin) left join user_public_key UPK on (tF.userfrom_id=UPK.id_user and c.name=UPK.coin) where tF.userfrom_id is not null and tF.userto_id is not null and time is not null order by time DESC";
      client.query(sql, (err, result) => {

        release();
        if (err) { return reject(err); }
        else {
          if (result.rows.length > 0) {
            return resolve(result.rows);
          }
          else {
            return reject("according not exist");
          }
        }
      })
    })
      });
}




//get coin name by id 
_publics.getCoinValueByDollar = (coinName) => {
  logger.debug('get coin value by $');
  return new Promise((resolve, reject) => {
    pool.connect((err, client, release) => {
      if (err) {
        logger.error('error connecting to DB '+err);
        return reject(err.stack)
      }
    var sql = "select pricechange from coin where name=$1 ";
    var value = [coinName];
    client.query(sql, value, function (err, result) {
      release();
      if (err) { return reject(err); }
      else {
        if ((result.rows === undefined) || (JSON.stringify(result.rows) === "[]") || (result.rows === null)) {
          return reject("coin not support ");
        } else {

          return resolve(result.rows[0].pricechange);
        }
      }
      
    });
  });
});
}






module.exports = _publics;