'user strict';
var log = require('../logger.js').LOG
var connection = require('../db.js');

//Taxn object constructor
var Ledger = function(ledger){
   this.created_at = new Date();
};


Ledger.add = function(req, ledgerDate, updateTS, result){
  console.log("Executing Query");
  connection.getConnection(function(err, conn)
  { 
    conn.beginTransaction(function(err){
    if(err)
      throw err;

    conn.query("UPDATE tom_account_balance SET balance=balance-?, updatedAt=? WHERE op_code=? AND eqp_class=? AND station_code=? AND eqp_location=? AND ledgerDate=?",
                                [req.body.txnAmt, updateTS, req.body.op_code, req.body.eqp_class, req.body.station_code, req.body.eqp_location, ledgerDate], 
          function (err, res) {
            if(err) {
              console.log("error: ", err);
              log.error(err);
              conn.release();
              result(err, null);
            }
            else{   
              console.log("Query Success");
              console.log(this.sql);
              log.info(this.sql);  
              conn.query("UPDATE tom_total_account_balance SET balance= balance+?, updatedAt=?", 
                      [req.body.txnAmt, updateTS],
                      function(err, res)
                      {
                        if(err) {
                          
                          console.log("error: ", err);
                          log.error(err);
                          conn.rollback(function(){
                            conn.release();
                            result(err, null);
                          });
                        }
                        else{   
                          console.log("Query Success");
                          console.log(this.sql);
                          log.info(this.sql);
                          conn.commit(function(){  
                             if(err)
                             { 
                               conn.rollback(function(){
                                  conn.release();
                                  throw err;
                               });     
                             } 
                             else{  
                                log.info("Success Updating ledger entry.");
                                
                                conn.release();
                                result(null, res) 
                             } 
                          })
                        }
                }); 
            }  
          }); 
   }); 
  });  
};

Ledger.init = function(req,ledgerDate,updateTS, result){
  
  connection.getConnection(function(err, conn)
  { 
    conn.beginTransaction(function(err){
      if(err)
      { conn.release(); 
        throw err;
      }  
    console.log("Executing Query");
    conn.query("INSERT INTO tom_account_balance (op_code, eqp_class, station_code, eqp_location, ledgerDate, balance)" +
                              " VALUES(?,?,?,?,?,-?)",
          [req.body.op_code, req.body.eqp_class, req.body.station_code, req.body.eqp_location, ledgerDate,req.body.txnAmt], 
          function (err, res) {
            if(err) {
              console.log("error: ", err);
              log.error(err);
              conn.release();
              result(err, null);
            }
            else{   
              console.log("Query Success");
              console.log(this.sql);
              log.info(this.sql);  
              conn.query("UPDATE tom_total_account_balance SET balance= balance+?, updatedAt=?", 
                      [req.body.txnAmt, updateTS],
                      function(err, res)
                      {
                        if(err) {
                          
                          console.log("error: ", err);
                          log.error(err);
                          conn.rollback(function(){
                          conn.release();
                          result(err, null);
                          });
                      }
                      else{   
                          console.log("Query Success");
                          console.log(this.sql);
                          log.info(this.sql);
                          conn.commit(function(){  
                             if(err)
                             { 
                               conn.rollback(function(){
                                  conn.release();
                                  throw err;
                               });     
                             } 
                             else{  
                                log.info("Success Init ledger entry.");
                                
                                conn.release();
                                result(null, res) 
                             } 
                          })
                         }
                }); 
            }  
          }); 
   });  
  });
};



Ledger.find=function(req,ledgerDate,result)
{
console.log("Executing Query");
  connection.query("SELECT * FROM tom_account_balance WHERE op_code=? AND eqp_class=? AND station_code=? AND eqp_location=? AND ledgerDate=?",
          [req.body.op_code, req.body.eqp_class, req.body.station_code, req.body.eqp_location, ledgerDate], 
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
};

module.exports= Ledger;