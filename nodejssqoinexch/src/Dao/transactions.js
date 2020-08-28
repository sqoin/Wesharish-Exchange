
'use strict';

const _publics = {};

var config = require('../../config');
const pool = config.dbpool;
const logger = config.logger;


//   ===DAO===
//save tnxid and update transaction status

_publics.updateTransactionID=(id, txnId)=> {
    var state = "Sent";
    const update = 'UPDATE transactions SET transactionId=$1,state=$2 WHERE id = $3 RETURNING *'
    const values = [txnId, state, id]
    return new Promise((resolve, reject) => {
        pool.connect((err, client, release) => {
            if (err) {
                logger.error('error connecting to DB '+err);
              return reject(err)
            }
        client.query(update, values, function(err, result) {
            release();
            var msg = "";
            if (err) {
                msg = "failure";
               return  reject(err);
            } else {
                msg = "success";
            }
            return  resolve(msg);
        });
    });
});
}

_publics.updateTransactionStateToken=(id)=> {
    var state = "Declined";
    const update = 'UPDATE transactions SET state=$1 WHERE id = $2 RETURNING *'
    const values = [state,  id]
    return new Promise((resolve, reject) => {
        pool.connect((err, client, release) => {
            if (err) {
                logger.error('error connecting to DB '+err);
              return reject(err)
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

//   ===DAO===
//save send transaction error and update transaction status

_publics.updateTransactionState=(id, error) =>{
    var state = "Declined";
    const update = 'UPDATE transactions SET state=$1,log=$2 WHERE id = $3 RETURNING *'
    const values = [state, error+"", id]
    return new Promise((resolve, reject) => {
        pool.connect((err, client, release) => {
            if (err) {
                logger.error('error connecting to DB '+err);
              return reject(err)
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

_publics.createTransaction=( send)=> {
    logger.debug('create transaction in bd' + JSON.stringify(send));
    var userfrom_id=send.from;
    var userto_id=send.to;
    var amount = send.amount;
    var state = "Pending";
    var coin = send.id_coin;
    var date = new Date;
    var productId= send.productId;
    const insert = 'INSERT INTO transactions (userfrom_id, userto_id, time, amount,state,coin_id,product_id ) VALUES($1, $2, $3, $4, $5,$6,$7) RETURNING *'
    const values = [userfrom_id, userto_id, date, amount, state,coin, productId]
    return new Promise((resolve, reject) => {
        pool.connect((err, client, release) => {
            if (err) {
                logger.error('error connecting to DB '+err);
              return reject(err)
            }
        client.query(insert, values, function(err, result) {
            release();
            if (err) {
                return reject(err);
            } else {
                    if(result.rows.length>0){
                        return  resolve(result.rows[0].id);
                    }
                    else{
                        return reject(null);
                    }
            
               
            }
        })
    });
});
}

//get email id by name 
_publics.getPayemntsFailed=()=>{ 

    return new Promise((resolve, reject) => {  
      var sql = "select id,address,coin_id,amount from payments where processed is null or processed=false ";
      pool.connect((err, client, release) => {
        if (err) {
            logger.error('error connecting to DB '+err);
          return reject(err)
        }
      client.query(sql, function (err, result) {
         if (err)
           {  reject(err);}
           else{
          
             return resolve(result.rows);
           }
      });
  });   
}); 
}


//update payments processed  transactions id , eventId
_publics.updatePayments=(response,send)=>{
    var id = send.id;
    var processed  = true;
    var transactions_id=response.transactionId;
    const update = 'UPDATE payments SET processed=$1,transactions_id=$2 WHERE id = $3 RETURNING *'
    const values = [ processed,transactions_id, id]
    return new Promise((resolve, reject) => {
        pool.connect((err, client, release) => {
            if (err) {
                logger.error('error connecting to DB '+err);
              return reject(err)
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

module.exports = _publics;