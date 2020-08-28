'use strict';

const _publics = {};

_publics.transaction;
_publics.bastoji;

_publics.resultTransaction=(response, localTransaction)=>{
    console.log("ressssss = "+JSON.stringify(response));
    return new Promise((resolve, reject) => {
        var message = {};
        if (response.complete === true) {
            _publics.bastoji.gettransactionid(response.hex)
            .then((txid)=>{
                console.log("txid = "+txid);
                _publics.transaction.updateTransactionID(localTransaction, txid)
                .then((success)=>{
                    message = {
                        message: "success",
                        transactionId: txid
                    };
                    return   resolve(message);
                })
            })//.catch(next(new Error('Not valid name')));
        } else {
            _publics.transaction.updateTransactionState(localTransaction, response.error)
            .then((failed)=>{
                message = {
                    message: "failed",
                    error: response.message
                };
                return  resolve(message);
            },(err)=>{
                return reject(err);
            })/*.catch(next(new Error('Not valid name')));*/
        } 
    });    
}

//result transaction 
_publics.resultTransactionSage=(response, localTransaction)=>{
    return new Promise((resolve, reject) => {
        var message = {};
        if (response.message === "success") {
            var txnId = response.transactionId;
            _publics.transaction.updateTransactionID(localTransaction,txnId);
            message = {
                message: "success",
                transactionId: txnId
            };
        } else {
            _publics.transaction.updateTransactionState(localTransaction,response.error);
            message = {
                message: "failed",
                error: response.error.toString()
            };
        }
      return  resolve(message);
    })
}



module.exports = _publics;