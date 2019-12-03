'use strict'
var sql = require('../db.js');
var log = require('../logger.js').LOG

var City=()=>{
	this.created_at = new Date();
}

City.getAll=(result)=>{
	
	sql.query("SELECT * FROM city",[], 
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