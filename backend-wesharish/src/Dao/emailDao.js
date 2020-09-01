'use strict';

const _publics = {};

var config = require('../../config');

const pool = config.dbpool;

//get email id by name 
_publics.getEmailById=(id_user)=>{ 
    return new Promise((resolve, reject) => {  
        pool.connect((err, client, release) => {
            if (err) {
                logger.error('error connecting to DB '+err);
              return reject(err)
            }
      var sql = "select email from users where id=$1 ";
      var value=[id_user];
      client.query(sql,value, function (err, result) {
          release();
         if (err)
           {  return reject(err);}
           else{
            if(result.rows.length>0){
              return  resolve(result.rows[0].email);
          }
          else{
              return resolve("user does not have email !");
          }
           }
      });
  });  
}); 
  }





module.exports = _publics;