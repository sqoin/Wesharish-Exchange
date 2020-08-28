'use strict';

const _publics = {};

var config = require('../../config');

const pool = config.dbpool;

//save oder with success status 
_publics.createOrder=( currency,publicKey,response,date,amount)=> {
    var state = response.message;
    var transactionId = response.transactionId;
    const insert = 'INSERT INTO sell_order (currency, address,amount , state, transactions_id,date) VALUES($1, $2, $3, $4, $5,$6) RETURNING *'
    const values = [currency, publicKey,amount, state, transactionId, date]
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

                if(result===""){
                    return reject("error");
                }
                else{
                    return  resolve(result);
                }
                
            }
        })
    });
});
}


module.exports = _publics;