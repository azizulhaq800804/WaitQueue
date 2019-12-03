'use strict'
var sql = require('../db.js');
var log = require('../logger.js').LOG

var Chamber=()=>{
   this.created_at = new Date();
}

Chamber.addChamber=function(picture_url, params, result){
   sql.query("INSERT INTO chamber (user_id, category_id, name, doctor_name, phone_number, "+
   	         " address, city_id, country_id, start_time, end_time,holiday, picture_url ) " +
                              " VALUES(?,?,?,?,?,?,?,?,?,?,?,?)",
            [params.user_id, params.category_id,params.name, params.doctor_name, params.phone_number,
             params.address, params.city_id, params.country_id, params.start_time, 
             params.end_time, params.holiday, picture_url
            ], 
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
}



module.exports = Chamber;