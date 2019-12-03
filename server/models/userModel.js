'use strict';
var config = require('../config');
const bcrypt = require('bcrypt')
var log = require('../logger.js').LOG
var sql = require('../db.js');

//Taxn object constructor
var User = function(){
   this.created_at = new Date();
};


User.login = function(req, result){
  console.log("Executing Query");

  sql.query("SELECT * FROM user WHERE email=?",
    [req.body.email], 
    function (err, res) {
      if(err) {
        console.log("error: ", err);
        log.error(err);
        result(err, null);
      }
      else{   
        console.log("Query Success");
        console.log(this.sql);
        log.info(this.sql); 
        result(null, res);
      }  
    }); 

};


User.signup = function(req, result){
  console.log("Executing Query");
  
  bcrypt.hash(req.body.password, config.saltRounds, function(err, passwordHash) {

    sql.query("INSERT INTO user (name, email, password, phone_number,sex, role) " +
                              " VALUES(?,?,?,?,?,?)",
          [req.body.name, req.body.email, passwordHash, req.body.phoneNumber, req.body.sex,2], 
          function (err, res) {
            if(err) {
              console.log("error: ", err);
              log.error(err);
              result(err, null);
            }
            else{   
              console.log("Query Success");
              console.log(this.sql);
              log.info(this.sql);     
              result(null, res)  

            }  
    }); 
  });
};

User.findByEmail = (email,result) => {

  sql.query("SELECT * FROM user WHERE email=?",[email], 
      function(err, res){
        console.log(this.sql);
        if(err) {
          console.log("error: ", err);
          log.error(err);
          result(err, null);
        }
        else{   
          console.log("Query Success");
          //console.log(this.sql);
          log.info(this.sql);     
          result(null, res)  

        }  

      })
}  

User.findById = (id,result) => {

  sql.query("SELECT * FROM user WHERE email=?",[id], 
      (err, res)=>{
        if(err) {
          console.log("error: ", err);
          log.error(err);
          result(err, null);
        }
        else{   
          console.log("Query Success");
          console.log(this.sql);
          log.info(this.sql);     
          result(null, res)  

        }  

      })
}  

User.addRoom = function(req, result){
  console.log("Executing Query");
  sql.query("INSERT INTO user (name, email, phone_number) " +
                              " VALUES(?,?,?,)",
          [req.body.name, req.body.email, req.body.phoneNumber], 
          function (err, res) {
            if(err) {
              console.log("error: ", err);
              log.error(err);
              result(err, null);
            }
            else{   
              console.log("Query Success");
              console.log(this.sql);
              log.info(this.sql);     
              result(null, res)  

             /* sql.query("SELECT MAX(id) as txnID from tom_txn_log where op_code=? AND eqp_class=? AND station_code=? AND eqp_location=? ",   
                [req.body.op_code, req.body.eqp_class, req.body.station_code, req.body.eqp_location],
                function(err, res){
                    log.info(res);     
                    result(null, res);
                });
            */
            }  
          }); 
};

User.updateRoom = function(req, result){
  console.log("Executing Query");
  sql.query("UPDATE tom_txn_log SET op_code=?, eqp_class=?, station_code=?, eqp_location=?," +
                              " dateTime=?, status=?, serviceID=?, txnAmt=?, txnFee=?, depositAmt=?,"+ 
                              "negAmt=?, txnData=?, packetNo=?, createdBy=?, processUnfinishedFlag=? WHERE id=?" ,
                              
          [req.body.op_code, req.body.eqp_class, req.body.station_code, req.body.eqp_location, req.body.dateTime,
          req.body.status, req.body.serviceID,req.body.txnAmt, req.body.txnFee, req.body.depositAmt, 
          req.body.negAmt, req.body.txnData, req.body.packetNo, req.body.createdBy, req.body.processUnfinishedFlag,
          req.body.id], 
          function (err, res) {
            if(err) {
              console.log("error: ", err);
              log.error(err);
              result(err, null);
            }
            else{   
              console.log("Query Success");
              console.log(this.sql);
              log.info(this.sql);     
              result(null, res)  

             /* sql.query("SELECT MAX(id) as txnID from tom_txn_log where op_code=? AND eqp_class=? AND station_code=? AND eqp_location=? ",   
                [req.body.op_code, req.body.eqp_class, req.body.station_code, req.body.eqp_location],
                function(err, res){
                    log.info(res);     
                    result(null, res);
                });
            */
            }  
          }); 
};

module.exports= User;