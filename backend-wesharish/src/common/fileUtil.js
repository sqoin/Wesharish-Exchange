'use strict';

const _publics = {};
var Wallet1 = require('ethereumjs-wallet');
const wallet = Wallet1.generate();
var fs = require("fs");
var config = require('../../config');
const logger = config.logger;


var crypto = require('crypto'),
    algorithm = config.file.algorithm,
    iv = Buffer.alloc(16, 0); // Initialization vector.


const namePrivate = config.sage.fileNamePrivateKey;

//read a file
_publics.readFile =(path) =>  {
    return readFile(path); 
}

//read a file
function readFile (path)  {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) {
                return resolve("");
            }else{
            return resolve(data);
            }
        });
    });
}


//check if a file is exists or not
_publics.isFileExist=(path)=> {
    return isFileExist(path);
}


//check if a file is exists or not
function isFileExist(path) {
    return new Promise((resolve, reject) => {
        fs.stat(path, function(err) {
            if (!err) {
                return resolve(path);
            } else if (err.code === 'ENOENT') {
              
                return resolve(null);
            }
        });
    });
}


_publics.writeFilePublicVide=(path)=> {
    return new Promise((resolve, reject) => {
        wallet.getAddress
        fs.writeFile(path, '' + wallet.getAddressString(), function(err, result) {
            if (err) {
                return reject(err);
            }else{
            return resolve(wallet.getAddressString());}
        });
    });

}


_publics.writeFilePrivateVide=(path, req)=>{
    return new Promise((resolve, reject) => {
        var hw = encrypt(coin.getPrivateKey(), req);
        fs.writeFile(path, '' + hw.toString('hex'), function(err, result) {
            if (err) {
                logger.error(err);
                return reject(err);
            }else{
            return resolve(hw);}
        });
    });
}

_publics.writeFilePublic =(path, publicKey)=> {
   return  writeFilePublic (path, publicKey)
}

function writeFilePublic (path, publicKey) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, publicKey, function(err, result) {
            if (err) {
                return  reject(err);
            } else{
            return resolve(publicKey);}
        });
    });
}

function encrypt(text, pin) {
    var cipher = crypto.createCipher(algorithm, pin, iv)
    var crypted = cipher.update(text)
    return crypted;
}

//write the private key
function writeFilePrivateEmpty(path, req){
    return new Promise((resolve, reject) => {
        var hw = encrypt(wallet.getPrivateKey(), req);
        fs.writeFile(path, '' + hw.toString('hex'), function(err, result) {
            if (err) {
              return reject(err);
            }else{
            return resolve(hw);}
        });
    });
}


_publics.readFileCrepted=(path) => {
        return new Promise((resolve, reject) => {
            fs.readFile(path, (err, data) => {
                if (err) {           
                    return reject(err);
                }else{
                return resolve(data);
                }
    
            });
        });
 }

    //common
_publics.getOrCreatePath= (path , createfunction , filename)=> {
    return new Promise( (resolve, reject) => {
        isFileExist(path)
        .then((path) => {
            return resolve(path);
             } ,(error) => {
                createfunction(filename)
                .then( ()=> { 
                    return resolve(path);
                 }) 
                })//.catch(next(new Error('Not valid name')));
    });
}

_publics.getOrCreateFilePublicContent=  (file , generateContent )=> {
    return new Promise( (resolve , reject) => {
        readFile(file)
         .then( (data) => { 
            if (data == "") { 
                generateContent()
                .then( (data) => {
                    writeFilePublic(file , data) 
                .then((data) => { 
                    return  resolve(data) }); });
            } else {
            return resolve(data);}
            })//.catch(next(new Error('Not valid name')));
        });
}


_publics.createFolder=(storage, userid)=> {
    return  createFolder(storage, userid);
}

function createFolder(storage, userid) {
    return new Promise((resolve, reject) => {
        fs.mkdir(storage + '/' + userid, {
            recursive: true
        }, (err) => {
            if (err) {
               return reject(err);
            } else {
               return resolve(storage + '/' + userid);

            }
        });
    });
}
//create file 
_publics.createFile=(file)=> {
    return createFile(file) ;}

    function createFile(file) {
        return new Promise((resolve, reject) => {
            console.log("file "+file);
            var fd = fs.openSync(file, 'w');
            resolve(fd);
         /*   var fd = fs.openSync(file, 'w', function (err, result) {
                console.log("err ="+err);
                console.log("result ="+result);
                if (!err) {
                    return resolve(result);
                } else {
                    logger.error(err);
                    return  reject(err);
                }
            });*/
        });
    }

_publics.isFolderExist=(res, path)=> {
    console.log("path 1 "+path);
    var path = path+'/privKey.txt'
    return new Promise((resolve, reject) => {
        fs.stat(path, function (err) {
            if (!err) {

                res.status(500).send({ error: 'Private Key Already Exists' });
            } else if (err.code === 'ENOENT') {
                return resolve(path);
            }
        });
    });

}

_publics.generateFolder=(storage, userid)=> {
    console.log("user "+userid);
    return new Promise((resolve, reject) => {
        createFolder(storage, userid)
            .then(path => {
                console.log("path 2 "+path);
               createFile(namePrivate)
            .then(response => {
                console.log("response ==> "+response);
                return  resolve(response);
            })//.catch((new Error('Not valid name')));
        });
    });
}

_publics.getOrCreateFilePrivateContent=(pin,file , generateContent,publicKey )=> {
        return new Promise( (resolve , reject) => {
            return new Promise( (resolve , reject) => {
                    fs.readFile(file, (err, data) => {
                            if (err) {
                                return reject(err);
                            }else{
                            return resolve(data);
                            }
                        })
            })
            .then( (data) => { 
                if (data == "") { 
                    generateContent(publicKey)
                    .then( (data) => {
                    writeFilePrivateEmpty(file ,pin, data)
                    .then((data) => { 
                        return  resolve(data); }) });
                } else {
                return resolve(data);}
                })//.catch(next(new Error('Not valid name')));
            })
            }
    
module.exports = _publics;