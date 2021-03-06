'use strict'
var sql = require('../db.js');
var log = require('../logger.js').LOG

var Chamber=()=>{
   this.created_at = new Date();
}

Chamber.addChamber=function(picture_name, thumbnail, params, result){
   sql.query("INSERT INTO chamber (user_id, category_id, name, doctor_name, phone_number, "+
   	         " address, city_id, country_id, latitude, longitude, start_time, end_time,holiday, picture_url,thumbnail  ) " +
                              " VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [params.user_id, params.category,params.name, params.doctor_name, params.phone_number,
             params.address, params.city, params.country, params.latitude, params.longitude, params.start_time, 
             params.end_time, params.holiday, picture_name, thumbnail
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

Chamber.searchChamberByCat=function( params, result){
  sql.query(" SELECT chamber.id as id, chamber.name as chamber_name, chamber.doctor_name as doctor_name, chamber.address, chamber.city, chamber.country, chamber.start_time, chamber.end_time, " +
            " chamber.holiday, chamber.number_of_person, city.name as city " +
            " FROM chamber LEFT JOIN city ON chamber.city_id = city.id " +
            " WHERE category_id=? AND (name like %?% OR doctor_name LIKE %?% address LIKE %?% OR city.name like %?% "+
            " LIMIT ?, 20",
           [params.category_id, params.search_string, params.search_string, params.search_string, params.search_string, params.pageno]
           , 
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

Chamber.searchChamber=function( params, result){
  
  
  
  sql.query(" SELECT chamber.id as id, chamber.name as chamber_name, chamber.doctor_name as doctor_name, chamber.address, city.name as city, category.name as category, chamber.start_time, chamber.end_time, " +
            " chamber.holiday, chamber.number_of_person, chamber.picture_url as picture, chamber.thumbnail " +
            " FROM chamber LEFT JOIN city ON chamber.city_id = city.id " +
                           "LEFT JOIN category on chamber.category_id = category.id " +
            " WHERE  (chamber.name like ? OR doctor_name LIKE ? OR address LIKE ? OR city.name like ? OR category.name LIKE ? )"+
            " ORDER BY chamber.latitude -?,  chamber.longitude - ? ASC",
            " LIMIT ?, 20", 
            [  `%${params.search_string}%`, `%${params.search_string}%`, `%${params.search_string}%`, `%${params.search_string}%`, `%${params.search_string}%`,
             params.latitude, params.longitude, parseInt(params.page)]
            , 
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

Chamber.searchChamber=function( params, result){
  
  let {category} = params 
  let category_cond = category ==0 ? "":` AND chamber.category_id=${category} `
  
  sql.query(" SELECT chamber.id as id, chamber.name as chamber_name, chamber.doctor_name as doctor_name, chamber.address, city.name as city, category.name as category, chamber.start_time, chamber.end_time, " +
            " chamber.holiday, chamber.number_of_person, chamber.picture_url as picture, chamber.thumbnail " +
            " FROM chamber LEFT JOIN city ON chamber.city_id = city.id " +
                           "LEFT JOIN category on chamber.category_id = category.id " +
            " WHERE  (chamber.name like ? OR doctor_name LIKE ? OR address LIKE ? OR city.name like ? OR category.name LIKE ? )" +
            category_cond +
            " ORDER BY ? - chamber.latitude,  ? - chamber.longitude ASC " +
            " LIMIT ?, 20",
            [  `%${params.search_string}%`, `%${params.search_string}%`, `%${params.search_string}%`, `%${params.search_string}%`, `%${params.search_string}%`, 
               params.latitude, params.longitude, parseInt(params.page)]
            , 
         function (err, res) {
           console.log(res)
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