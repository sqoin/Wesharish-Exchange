'use strict';

const _publics = {};
var config = require('../../config');
const pool = config.dbpool;
const logger = config.logger;

//get UserId By PublicKey 
_publics.getUserIdByPublicKey=(publicKey)=> {
    return new Promise((resolve, reject) => {
        pool.connect((err, client, release) => {
            if (err) {
                logger.error('error connecting to DB '+err);
              return reject(err)
            }
        var sql = "select id from users where publicKey=$1 ";
        var value = [publicKey];
        client.query(sql, value, function(err, result) {
            release();
            if (err)
              { return  reject(err);
            }else{
               
                if(result.rows.length>0){
                    return resolve(result.rows[0]);
                }
                else{
                    return resolve("according not exist");
                }
               }
        });
    });
});
}

//get UserId By PublicKey 
_publics.getUserPublicKeyById=(id)=> {
    return new Promise((resolve, reject) => {
        pool.connect((err, client, release) => {
            if (err) {
                logger.error('error connecting to DB '+err);
              return reject(err)
            }
        var sql = "select publicKey from users where id=$1 ";
        var value = [id];
        client.query(sql, value, function(err, result) {
            release();
            if (err)
              { return  reject(err);
            }else{
               
                if(result.rows.length>0){
                    return resolve(result.rows[0].publickey);
                }
                else{
                    return resolve("according not exist");
                }
               }
        });
    });
});
}
// get user by id
_publics.getUserByPublicKey = (publicKey) => { 
    console.log("public key ==>"+publicKey);
    return new Promise((resolve, reject) => {  
        pool.connect((err, client, release) => {
            if (err) {
                logger.error('error connecting to DB '+err);
              return reject(err)
            }
      var sql = "select id_user from user_public_key where publicKey=$1 ";
      var value=[publicKey];
      client.query(sql,value, function (err, result) {
          release();
        if (err) {
            return  reject(err);
          }
         else{
              
            if(result.rows.length>0){
               
                return resolve(JSON.stringify(result.rows[0].id_user));
            }
            else{
                return resolve("according not exist");
            }
         }    
      });
  });
});   
}

// get user by id
_publics.getUserByPublicKeyCoin = (publicKey,coin) => { 
    logger.debug('publicKey = '+publicKey);
    logger.debug('coin ='+coin);
    return new Promise((resolve, reject) => {  
        pool.connect((err, client, release) => {
            if (err) {
                logger.error('error connecting to DB '+err);
              return reject(err)
            }
      var sql = "select id_user from user_public_key where publicKey=$1 and coin=$2";
      var value=[publicKey,coin];
      client.query(sql,value, function (err, result) {
          release();
        if (err) {
            return  reject(err);
          }
         else{
            if(result.rows.length>0){
                return resolve(result.rows[0].id_user);
            }
            else{
                return resolve("according not exist");
            }
         }    
      });
  });
});   
  }

// get data of the user by id
_publics.getUserById = (userId) => {
    return new Promise((resolve, reject) => {
        pool.connect((err, client, release) => {
            if (err) {
                logger.error('error connecting to DB '+err);
              return reject(err)
            }
        const sql = "select * FROM users where id=$1";
        const values = [userId];

        client.query(sql, values, function(err, result) {
            release();
            if (err) {
                logger.warn(err);
                return  reject(err);
              }
            else{
              
                if(result.rows.length>0){
                    return resolve(JSON.stringify((result.rows[0])));
                }
                else{
                    return resolve("according not exist");
                }
             }   
        });

    });
});
}

// get user's name by public key
_publics.getUserNameByPublicKey = (publicKey) => {

    return new Promise((resolve, reject) => {
        pool.connect((err, client, release) => {
            if (err) {
                logger.error('error connecting to DB '+err);
              return reject(err)
            }
        const sql = "select CONCAT( first_name,' ' ,  last_name ) as fullname from users where publicKey =$1";
        const values = [publicKey];

        client.query(sql, values, function(err, result) {
            release();
            if (err) {
                return  reject(err);
              }
            else{
              
                if(result.rows.length>0){
                    return resolve((result.rows[0].publicKey));
                }
                else{
                    return resolve("according not exist");
                }
             }    
           
        });

    });
})
}


// get user's name by public key
_publics.getPublicKeyByUserId = (userId , coin) => {
   logger.info('user id is '+userId);
   logger.info('coin is '+coin);
    return new Promise((resolve, reject) => {
        pool.connect((err, client, release) => {
            if (err) {
                logger.error('error connecting to DB '+err);
              return reject(err)
            }
        const sql = "select publicKey from user_public_key where id_user =$1 and coin = $2";
        const values = [userId , coin] ;
      
        client.query(sql, values, function(err, result) {
            release();
            if (err) {
                return  reject(err);
              }
          
            if(result.rows.length>0){
                return resolve((result.rows[0].publickey));
            }
            else{
                return resolve("according not exist");
            }
            
        });

    });
})
}


// get user's name by public key
_publics.savePublicKeyToDatabase = ( userId, coin ,publicKey ) => {

   
    return new Promise((resolve, reject) => {
        pool.connect((err, client, release) => {
            if (err) {
                logger.error('error connecting to DB '+err);
              return reject(err)
            }
        const sql = "insert into user_public_key (id_user , coin , publickey ) values  ($1 , $2 , $3)";
        const values = [userId , coin , publicKey ] ;

        client.query(sql, values, function(err, result) {
            release();
            if (err) {
              return  reject(err);
            }
            else{
                return resolve(publicKey);
            }
               
        });

    });
})
}

//get all users
_publics.getAllUsers = () => {
    const sql = 'select * FROM users'
    return new Promise((resolve, reject) => {
        pool.connect((err, client, release) => {
            if (err) {
                logger.error('error connecting to DB '+err);
              return reject(err)
            }
        client.query(sql, function(err, result) {
            release();
            if (err) {
                return  reject(err);
              }

            if(result.rows.length>0){
                return resolve((result.rows));
            }
            else{
                return resolve("according not exist");
            }            
        });
    });
})
}

//get all users
_publics.getAllUsersPublickeys = () => {
    const sql = 'select id_user , coin , publickey FROM user_public_key'
    return new Promise((resolve, reject) => {
        pool.connect((err, client, release) => {
            if (err) {
                logger.error('error connecting to DB '+err);
              return reject(err)
            }
        client.query(sql, function(err, result) {
            release();
            if (err) return reject(err);

            if(result.rows.length>0){
                return resolve((result.rows));
            }
            else{
                return resolve("according not exist");
            }
        });
    });
})
}


  //get user_name  id by id 
  _publics.getUserNameById=(id_user)=>{ 
    return new Promise((resolve, reject) => {  
        pool.connect((err, client, release) => {
            if (err) {
                logger.error('error connecting to DB '+err);
              return reject(err)
            }
        var sql = "select user_name from users where id=$1 ";
        var value=[id_user];
        client.query(sql,value, function (err, result) {
            release();
           if (err)
             {  return reject(err);}
             else{
                 console.log("result get user name= "+JSON.stringify(result.rows));
                 if((result.rows===undefined)||(JSON.stringify(result.rows)==="[]")||(result.rows===null)){
                     return resolve("user not found ");
                 }else{
                
              return  resolve(result.rows[0].user_name);
             }
          }
        });
    });
}) 
  }

  // update user's data
_publics.updateUser = (req, user) => {
    var user = JSON.parse(user);
    var user_name = user.user_name;
    var email = user.email;
    var birthDate = user.birthDate;
    var address = user.address;
    var lang = user.lang;
    var birthPlace = user.birthPlace;
    var city = user.city;
    var postCode = user.postcode;
    var custom = user.custom;
    var id = req.query.id;
    const update = ' UPDATE USERS SET user_name=$1, email =$2, date_of_birth=$3, address=$4, language=$5, place_of_birth=$6, city=$7, postcode=$8, currency=$9  WHERE id = $10 RETURNING *'
    const values = [user_name, email, birthDate, address, lang, birthPlace, city, postCode, custom, id]
    return new Promise((resolve, reject) => {
        pool.connect((err, client, release) => {
            if (err) {
                logger.error('error connecting to DB '+err);
              return reject(err)
            }
        client.query(update, values, function(err, result) {
            release()
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
})
}

//get coin by publickey 
_publics.getCoinPublicKeyByUserId = (userId) => {
    logger.info('user id is '+userId);
    return new Promise((resolve, reject) => {
        pool.connect((err, client, release) => {
            if (err) {
                logger.error('error connecting to DB '+err);
              return reject(err.stack)
            }
        const sql = "select coin as name,publickey from user_public_key where id_user=$1;";
        const values = [userId] ;
      
        client.query(sql, values, function(err, result) {
            release();
            if (err) {
                return  reject(err);
              }
            if(result.rows.length>0){
                return resolve((result.rows));
            }else{
              return resolve("according not exist");
            }
            
        });

    });
},
(error)=>{
    reject(error);
})
}


_publics.getUserNameByUserId = (id) => {

    return new Promise((resolve, reject) => {
        pool.connect((err, client, release) => {
            if (err) {
                logger.error('error connecting to DB '+err);
              return reject(err)
            }
        const sql = "select CONCAT( first_name,' ' ,  last_name ) as fullname from users where id =$1";
        const values = [id];

        client.query(sql, values, function(err, result) {
            release();
            if (err) {
                return  reject(err);
              }
            else{
              
                if(result.rows.length>0){
                    return resolve((result.rows[0].fullname));
                }
                else{
                    return resolve(null);
                }
             }    
           
        });

    });
})
}




 _publics.getListPKById=(id_user)=>{ 
    return new Promise((resolve, reject) => {  

        pool.connect((err, client, release) => {
            if (err) {
                logger.error('error connecting to DB '+err);
              return reject(err)
            }

            var sql = "select coin,publickey from user_public_key where id_user=$1 ";
            var value=[id_user];
            client.query(sql,value, function (err, result) {
                release();
               if (err)
                 {  return reject(err);}
                 else{
                     if((result.rows===undefined)||(JSON.stringify(result.rows)==="[]")||(result.rows===null)){
                             let array=[];
                            return resolve(array);
                     }else{
                  return  resolve(result.rows);
                 }
              }
            });
        });
    }) 
}


//get Userpassword 
_publics.getUserPasswordByEmail=(email )=> {
    return new Promise((resolve, reject) => {
        pool.connect((err, client, release) => {
            if (err) {
                logger.error('error connecting to DB '+err);
              return reject(err)
            }
        var sql = "select password from users where email=$1  ";
        var value = [email ];
        client.query(sql, value, function(err, result) {
            if (err)
              {  reject(err);
            }else{
                 if (result.rows.length=== 0 ){
                     return resolve ("")

                 }

               console.log(result.rows[0].password)
             resolve(result.rows[0].password)}
        });
    });});
}


//get UserId By PublicKey 
_publics.getUserIdByEmailAndPasswordDao=(email , password) =>{
    return new Promise((resolve, reject) => {
        pool.connect((err, client, release) => {
            if (err) {
                logger.error('error connecting to DB '+err);
              return reject(err)
            }

        console.log( "email d "+email + "password d "+password);
        var sql = "select id from users where email=$1 and password=$2  ";
        var value = [email,password ];
        client.query(sql, value, function(err, result) {
            if (err)
              {  reject(err);
            }else{
             resolve(result.rows[0]);}
        });
    }); });
}


  //get coin name by user id 
_publics.getCoinNameByIdUser=(idUser)=>{
    console.log("user id => "+idUser);
    return new Promise((resolve, reject) => {  
        pool.connect((err, client, release) => {
            if (err) {
                logger.error('error connecting to DB '+err);
              return reject(err)
            }
        var sql = "select coin from user_public_key where id_user=$1 ";
        var value=[idUser];
        client.query(sql,value, function (err, result) {
            release();
           if (err)
             {  return reject(err);}
             else{
                 if((result.rows===undefined)||(JSON.stringify(result.rows)==="[]")||(result.rows===null)){
                     return resolve("according not exist ");
                 }else{
              return  resolve(result.rows);
             }
          }
        });
    });
}) 
}

module.exports = _publics;