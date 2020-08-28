'use strict';

const _publics = {};

var config = require('../../config');
const nodemailer = require('nodemailer');
var host = config.email.host;
var port = config.email.port;
var authEmail = config.email.authEmail;
var authPassword = config.email.authPassword;
var from = config.email.from;
var to = config.email.to;
var subject = config.email.subject;

function mailBASTOJI(emailTo,username,transactionID,amount ) {
    
    return new Promise((resolve, reject) => {

  let transporter = nodemailer.createTransport({
      host: host,
      port: port,
      secure: false, 
      auth: {
          user: authEmail,
          pass: authPassword
      }
     
  });
 
  let info = transporter.sendMail({
      from:from, 
      to: emailTo, 
      subject: subject, 
      text: 'Dear '+username+''+  'Thank you for your withdrawal request. We can confirm the request has now been received and the withdrawal should appear within your account within 72 hours. Your receipt can be found here: "http://explorer.sqoin.us/#/tx/'+transactionID+ '"'+' Kind regard'+
      'SQOIN. ', 
      html: 'Dear <b>'+username+'</b>'+'\n'+  'Thank you for your withdrawal request. We can confirm the request has now been received and the withdrawal should appear within your account within 72 hours. Your receipt can be found here:<b> <a href="http://explorer.sqoin.us/#/tx/'+transactionID+'">'+transactionID +'</a>  </b>'+'\n Kind regard\n'+
      'SQOIN. \n',  
  });
 
  return resolve( info);
 
});
}

_publics.mailSend=(coin,emailTo,username,transactionID,amount)=>{
   return new Promise((resolve, reject) => {
       var response;
        
            response= mailBASTOJI(emailTo,username,transactionID,amount);
               
       return   resolve(response);
   });
  
}
module.exports = _publics;