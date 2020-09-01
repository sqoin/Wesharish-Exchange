
const { Pool } = require('pg');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
const winston = require('winston');
const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
  });
   
// Logger configuration
const logConfiguration = {
    transports: [
        new winston.transports.Console({level: 'error',filename: './logs/error.log',format: combine(timestamp(),myFormat),maxSize: '100m',maxFiles: '5',handleExceptions: true}),
        new winston.transports.Console({level: 'debug',filename: './logs/debug.log',format: combine(timestamp(),myFormat),maxSize: '100m',maxFiles: '5',handleExceptions: true}),
        new winston.transports.Console({level: 'info',filename: './logs/info.log', format: combine(timestamp(),myFormat),maxSize: '100m',maxFiles: '5',handleExceptions: true}),
        new winston.transports.Console({level: 'warn',filename: './logs/warn.log',format: combine(timestamp(),myFormat),maxSize: '100m',maxFiles: '5',handleExceptions: true}),
    ]
};
module.exports = {
// Create the logger
logger : winston.createLogger(logConfiguration),

secret : "c3FvaW5zcW9pbjpzZWNyZXQ=",
secure:"false",
    contract : {
        
        contratAddress:"0xE4F3A03Ee468EB04eB541AFf88126F1e291657d8",
        transactionhash0: "0x86235262834ae605a6ae8e8592fadb7f1a586f936555c758f7b14a98b1d61514",
    },

    file:{
        algorithm : 'aes-256-ctr'
    },

    database: {
        /******connectionString:  "pg://postgres:postgres@localhost:5432/userfrosting",  *******/
      //  connectionString: "pg://postgres:postgres@18.220.209.238:5432/userfrosting", //local database connection  
        connectionString:  "pg://postgres:postgres@localhost:5432/sagecity", //local database connection      
    },
     dbpool : new Pool({
        user: 'postgres',
       // host: '18.220.209.238',
        host:'localhost',
       database: 'sagecity',
     //  database: 'userfrosting',
      // password: 'postgres',
        password: 'J2VgcQnEUNCjry88',
        port: 5432,
        max: 10,
        idleTimeoutMillis:30000}),

    dbConfig: {
        "user": "postgres",
        "database": "userfrosting",
        "port": 5432,
        "max": 10, // max number of clients in the pool
        "idleTimeoutMillis": 30000
    },
    target:"C:/",
    //target: "/home/ubuntu/sqoindoc/",
    sage: {
      // targetWallet:"/home/ubuntu/sqoindoc/wallet", //server emplacement public and private key
       targetSage:"/home/ubuntu/sqoindoc/targetSAGE",
         //  target:"/home/ubuntu/sqoindoc/",
         //   target:"C:/",
       // targetWallet: "C:/wallet", //local emplacement public and private key for wallet 
       // targetSage: "C:/targetSage", //local emplacement public and private key for sage 
        urlHost: "http://localhost:3008",
        //urlHost :"http://localhost:3005",
        fileNamePublicKey: "pubKey.txt",
        fileNamePrivateKey: "privKey.txt",
        //web3: "http://localhost:8584",
        web3: "http://3.15.161.49:8545",

        fixedAddressWallet: "0xee783754fd5812aee50b19492c916e32b1916c27",
        fixedDecreptedPrivateKey:"a803ab69e6931c324de365005549fda4bb42f67076d49ddf1f9c7a68d090c5a0",
        fixedAddressSage: "",
        
    },
    bastoji: {
        /*
            host: '3.236.68.50',
            port: '8332',
            user: 'bastoji',
            pass: '123',
            timeout: 8000, // 8 seconds
         */
        //target:"/home/ubuntu/sqoindoc/",
        //target:"C:/",
        targetBastoji:"C:/targetBASTOJI", //local emplacement public and private key for bastoji 
      //  targetBastoji: "/home/ubuntu/sqoindoc/targetBASTOJI",
      // username:'hkLrD3CS3KHYZQrZ',
      // password:'Srn682KVvxX6Znsm',
        username: 'multichainrpc',
       password: 'j3536YzAeJMXRZXLkt94bqmeWYWaKGNjETtDwAN2w6T',
        port: 8332,
       //localhost:'localhost',
       localhost:'3.236.68.50',
       timeout: 8000, // 8 seconds
        fixedAddressBastoji:"jj2a8z5vp71zJTZE7BD4PtXagZAM3FJG9r",
        bastojiAddressForBanque:"jiXvaxM4TejfjyZMkHbiJPy5kYhyTSpEEa",
        scriptPublicKeyForBanqueAddress:"76a91428a8c6b02229910e2fffc8eb51c421f0311ef8f488ac",
        bastojiMultiSigne:"035737e75e44718c510013c08331275ad9bce8fe18cd896809355067866509b1fb",
        bastojiPrivForMulti: "J2shxLBvbew7Hp4iSSGvb3hfMrXnJ7EcLtBuQAjjtT2QTHLx19pZ",
        address:"jezpAdt4fMWNq8oXSyLyhua54AVAbuguvA"
        
    },

    email: {

        service: "Gmail",
        host: 'mail.privateemail.com',
        port: 587,
        from: "admin@sqoin.us",
        to: "fedianeyli@yahoo.fr",
        subject: "Withdraw request approval",
        html: "leCorpsDeVotreMessageEnHTML",
        authEmail: 'admin@sqoin.us',
        authPassword: 'basto@sqoin2020',


    },

    authentication: {
        url: "http://18.221.180.139:8857/oauth/check_token"
    },

    port: process.env.PORT || 3014,
    env: process.env.NODE_ENV || 'development',

    /****** connectionString:  "pg://userName:password@localhost:5432/databaseName";   *******/
    //server database connection
    // connectionString:  "pg://postgres:J2VgcQnEUNCjry88@localhost:5432/sagecity", //local database connection
    //  targetWallet:"C:/wallet", //local emplacement public and private key for wallet 
    //targetSage:"C:/sage", //local emplacement public and private key for sage 
    //targetBastoji:"C:/bastoji", //local emplacement public and private key for bastoji 

};
