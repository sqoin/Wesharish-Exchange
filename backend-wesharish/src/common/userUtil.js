'use strict';

const _publics = {};

const crypto = require("crypto");




_publics.user;
_publics.requestUtils;


_publics.getName = (publicKey)=>{
    return new Promise((resolve, reject) => {
    _publics.user.getUserNameByPublicKey(publicKey)
        .then(response=>{
        if(response===undefined){
            return "";
        }else{
        return response.fullname;}
        })
        .then(name=>resolve(name))
        //.catch(next(new Error('Not valid name')));
    })
}

//get all public key by ids
_publics.getAllpublicKeysByUsersIds = (users) => {
    let promises = [];

    for (var i = 0; i < users.length; i++) {
        promises.push(new Promise((resolve, reject) => {
            var response = (users[i].id);
            return resolve(response);
        }));
    }
    return Promise.all(promises)
}


//get all public key by ids
_publics.updateUserRouter = (req) => {
    return new Promise((resolve, reject) => {
 _publics.requestUtils.getRawBody(req)
.then(user =>_publics.user.updateUser(req, user))
.then(msg => resolve(msg))
//.catch(next(new Error('Not valid name')));
    })
}

_publics.getlistPublicAddressesRouter = () => {
    return new Promise((resolve, reject) => {
        _publics.user.getAllUsersPublickeys()
        .then(data=>resolve(data))
       // .catch(next(new Error('Not valid name')));

    })
}


function verifPassword(email , password){
    return new Promise((resolve, reject) => {
        _publics.user.getUserPasswordByEmail(email)
        .then(res => {
            console.log(res)
            var encrypted= res;
            var bcrypt = require('bcrypt');
            var hash = encrypted.replace('$2y$', '$2a$');
          
            bcrypt.compare(password, hash,async function(err, correct) {
             console.log("correct -> " + correct);
             console.log("error -> " + err);
             if (correct === true){
                return resolve (encrypted);
            }
            else{
                return resolve ("verify your email or password ");
            }
            });
           
            
        })
    
})
}


_publics.getUserIdByEmailAndPassword=(email ,password) =>{
    console.log( "email "+email + "password "+password);
    return new Promise((resolve, reject) => {
    verifPassword(email ,password ) 
    .then(cryptedPassword =>_publics.user.getUserIdByEmailAndPasswordDao(email , cryptedPassword))
         .then(data =>resolve(data))
        // .catch(next(new Error('incorrect email or password ')));
})
    }



_publics.generateMerchantId=(userId)=>{
        return new Promise((resolve, reject) => {
            _publics.user.getMerchantInformations(userId).then(res => {
                console.log(JSON.stringify(res))
                    if (res === "user hasn't a merchantId"){
                        console.log("under res not merchant")
                        const merchantId = crypto.randomBytes(16).toString("hex");
                        console.log(merchantId); 
                      _publics.user.saveMerchant(userId ,merchantId )
                      .then(res =>resolve (merchantId)
                      ,error=>reject(error));
                    }else {
                        console.log("under res is merchant")
                        return resolve (res)
                    }
            })        
    })
    }


_publics.checkConnectedUser=(accessToken , userId)=>{
        return new Promise((resolve, reject) => {           
            const userIdFromAccessToken = "" ; 
            if (userIdFromAccessToken === userId  ){
                //execute Api

            }
            else{
                res.status(403).send({
                    message: 'unauthorized' 
            
                });
            }        
    })
    }


    
module.exports = _publics;