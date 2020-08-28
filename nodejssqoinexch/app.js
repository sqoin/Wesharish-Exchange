'use strict';

const path = require('path');
const bodyParser = require('body-parser');
const router = require('./src/router/router');
const config = require('./config');
var jwt    = require('jsonwebtoken');
const express = require('express');
const app = express();  
var cors = require('cors')
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors())

app.use(router);


const server = app.listen(config.port,
 err => handleServerListening(err, server));

function handleServerListening(err, server) {
 if (err)
   return console.error('[!] Catched an error while listening:\n', err);
 console.log(`[*] Server started on port ${config.port}`);
}

//set secret
app.set('Secret', config.secret);

// parse application/json
app.use(bodyParser.json());


//app.use('/api', ProtectedRoutes);
app.post('/authenticate',(req,res)=>{
  
  if("aymen"==="aymen"){

    console.log("user is corect")

      if(123===123){
           //if eveything is okey let's create our token 
      const payload = {
          check:  true
        };
        var token = jwt.sign(payload, app.get('Secret'), {
              expiresIn: 1440 // expires in 24 hours
        });
        res.json({
          message: 'authentication done ',
          token: token
        });

      }else{
          res.json({message:"please check your password !"})
      }
  }else{
      res.json({message:"user not found !"})

  }

})

/* error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
 // res.render('error');
 });
*/

/*
router.use((req, res, next) =>{


  // check header for the token
  var token = req.headers['access-token'];

  // decode token
  if (token) {

    // verifies secret and checks if the token is expired
    jwt.verify(token, app.get('Secret'), (err, decoded) =>{      
      if (err) {
        return res.json({ message: 'invalid token' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token  

    res.send({ 

        message: 'No token provided.' 
    });

  }
});

router.get('/getAllProducts',(req,res)=>{
 let products = [
     {
         id: 1,
         name:"cheese"
     },
     {
        id: 2,
        name:"carottes"
    }
 ]

 res.json(products)

})*/
