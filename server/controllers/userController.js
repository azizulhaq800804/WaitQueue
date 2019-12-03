'use strict';
const bcrypt = require('bcrypt')
const jwtvalidator = require("../util/jwtvalidator")
var userModel = require('../models/userModel');


exports.get_txns_bydate = function(req, res) {
  userModel.getTxnsByDate(req.query.op_code, req.query.eqp_class, req.query.station_code, req.query.eqp_location,
                   req.query.fromDate, req.query.toDate, 
    function(err, txns) {

    console.log('TxnController::get_txns_bydate')
    if (err)
      res.send(err);
    console.log(txns);
    //console.log('res', txns);
    res.render('txns', { title: 'Transactions', data: txns })
  });
};


exports.login = function(req, res) {
  userModel.login(req, function(err, result) {
    console.log('AdminController::login')
    if (err)
    {  
      res.json({result:0, message:"Login Failed", code:0});
    }
    else{
      console.log('res', result);
      
      if(result.length > 0)
      {  bcrypt.compare(req.body.password, result[0].password, function(err, match){
          if(match)
          {  const token = jwtvalidator.sign({username:result[0].username});
             res.json({result:1, userid: result[0].id, username:result[0].name, token:token, message:"Login Successful", code:0});
          }
          else
            res.json({result:0, message:"Username/password did not match", code:0});
          
         })
      }
      else
        res.json({result:0, message:"Email not registered", code:0});
    }  
  });
};


exports.signup = function(req, res) {
  
  console.log('AdminController::login')
  
  userModel.findByEmail(req.body.email, (err,result)=>{

    if (err)
    {  
          res.json({result:0, message:"Signup Failed", code:0});
    }
    else
    if(result.length == 0)
    { 
      console.log(result)
      userModel.signup(req, function(err, result) {
  
        if (err)
        {  
          res.json({result:0, message:"Signup Failed", code:0});
        }
        else{
          console.log('res', result);
          res.json({result:1, userid:result.insertId, username:req.body.name, message:"Signup Successful", code:0});
         }  
      });
    }
    else
      res.json({result:0, message:"Email Already Exist", code:0});
      
  }) 
};


exports.add_room = function(req, res) {
  userModel.addRoom(req, function(err, result) {
    console.log('AdminController::add_room')
    if (err)
    {  res.send(err);
    }
    else{
      console.log('res', result);
      console.log(result.insertId);
      res.send("status=success&txnId="+result.insertId);
    }  
  });
};

exports.update_room = function(req, res) {
  userModel.updateRoom(req, function(err, result) {
    console.log('TxnController::update_txn')
    if (err)
    {  res.send(err);
    }
    else{
      console.log('res', result);
      console.log(result.insertId);
      res.send("status=success&txnId="+req.body.id);
    }  
  });
};

exports.add_ledger = function(req, res) {

  var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  var localISOTime = (new Date(Date.now() - tzoffset)).toISOString();
  let ledgerDate = localISOTime.replace(/T.+/, '');
  let updateTS =  localISOTime.
                       replace(/T/, ' ').      // replace T with a space
                       replace(/\..+/, '')     // delete the dot and everything after
  console.log(new Date().toISOString())                     

  Ledger.find(req,ledgerDate, function(err, result) {

    console.log(result)
    if (err)
    {  res.send(err);
    }
    else{
      if (result.length > 0)
      {
        Ledger.add(req,ledgerDate, updateTS, function(err, result) {
          if (err)
            res.send(err);
          else
            res.send("status=success&txnId="+result.insertId);
          }); 
      }
      else{
        Ledger.init(req,ledgerDate,updateTS, function(err, result) {
          if (err)
            res.send(err);
          else
            res.send("status=success&txnId="+result.insertId);
          });
      }  
    }  
  });
} 







