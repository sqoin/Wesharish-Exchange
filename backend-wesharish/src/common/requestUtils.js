'use strict';

const _publics = {};

var getRawBody = require('raw-body');

var config = require('../../config');
const logger = config.logger;
const namePublic = config.sage.fileNamePublicKey;

_publics.fileUtil;
_publics.user;



 _publics.getRawBody =(req)=>{
        return new Promise((resolve, reject) => {
            getRawBody(req, {
                
                length: req.headers['content-length'],
                limit: '1mb',
            }, function(err, string) {
                if (err){ 
                    logger.warn(err);
                    return next(err)
                    }else{ req.text = string;
                       
                return resolve(req.text);}
            })
        });
    
}

// round a number
_publics.financial = (x) => {
    return new Promise((resolve, reject) => {
        return resolve(Number.parseFloat(x).toFixed(3));
    });
}


_publics.getPubAdd  =(coin, userId)  => {
   return new Promise((resolve, reject) => {
    _publics.user.getPublicKeyByUserId(userId , coin)
       .then((data) => {
              logger.info('public key is '+data);
              resolve(data);
           })/*.catch(next(new Error('Not valid name')));*/
        })
}


_publics.getPubAddC  =(userId,coin)  => {
    return new Promise((resolve, reject) => {
    _publics.user.getPublicKeyByUserId(userId , coin)
       .then((data) => {
             logger.info('public key is '+data);
            return resolve(data);
           })/*.catch(next(new Error('Not valid name')));*/
        });
}
_publics.getPubAddSAGE  =(userId,coin)  => {
    logger.debug('get public key for derived coin'+coin);
    return new Promise((resolve, reject) => {
    _publics.user.getPublicKeyByUserIdSAGE(userId , coin)
       .then((data) => {
            return resolve(data);
           },err=>{
               logger.error(err);
           })/*.catch(next(new Error('Not valid name')));*/
        });
}

_publics.getPubAddT =(target, userFrom_id)  => {
    //var send0 = JSON.parse(send);
   // var userFrom_id=send.from;
    return new Promise((resolve, reject) => {
        var response;
      
        response = _publics.fileUtil.readFile(target + "/" + userFrom_id + "/" + namePublic);

        return resolve(response);
    })
}

//get public key from file
_publics.getPubAddUser = (target, send) => {
    var send0 = JSON.parse(send);
    var userId = send0.to;
    return new Promise((resolve, reject) => {
        var response;
     
        response = _publics.fileUtil.readFile(target + "/" + userId + "/" + namePublic);

        return resolve(response);
    })
}



module.exports = _publics;