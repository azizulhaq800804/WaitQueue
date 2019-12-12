'use strict'
const config = require('../config')
const chamberModel = require('../models/chamberModel')
const categoryModel = require('../models/categoryModel')
const cityModel = require('../models/cityModel')
const countryModel = require('../models/countryModel')
var upload = require('../util/storage').single('photo')
const multer = require('multer')
var formidable = require('formidable');
var fs = require('fs');
var log = require('../logger.js').LOG
var gm = require('gm').subClass({imageMagick: true})
exports.add_chamber = function(req, res)
{
  
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
	console.log(files)  
    if(err)
	{ 
	  	console.log(err)
	  	log.error(err) 
	  	res.json({result:0, message:"Failed to add chamber", code:0});
	} 
	let picture_name = null	
	if( files.photo )
	{ 
	  picture_name = `user_${fields.user_id}_${Date.now()}`
	  var oldpath = files.photo.path;
      var newpath = `${config.uploadPath}${picture_name}` ;
      console.log("Renaming file "+oldpath + "To" + newpath)
      
      //const rename = async(oldpath, newpath)=>{return await fs.rename(oldpath,newpath)}
      //let err = rename(oldpath,newpath)
      //console.log(err)
      //return
	  var appRoot = process.cwd();

      fs.rename(oldpath,  newpath, function (err) {
        if (err)
        {   	
          console.log(err)
	      log.error(err) 
	  	  res.json({result:0, message:"Failed to add chamber", code:0});
	    }
		
		console.log("Generating thumbnail..")
		gm(newpath)
		  .resize(100, 100)
		  .noProfile()
		  .write( newpath+"_thumb", function (err) {
  			if (!err)
			{ chamberModel.addChamber(picture_name, picture_name + "_thumb", fields, (err, result)=>{
				if(err)
					res.json({result:0, message:"Failed to add chamber", code:0});
				else
					res.json({result:1, data:result, message:"Chamber Added", code:0}); 
				})	
			}
			else
			res.json({result:0, message:"Failed to add chamber", code:0});	
		});

		
	  })
    }        
   
    else{
      chamberModel.addChamber(picture_name, fields, (err, result)=>{
	    if(err)
	      res.json({result:0, message:"Failed to add chamber", code:0});
	    else
	      res.json({result:1, data:result, message:"Chamber Added", code:0}); 
	  })
    }

    
  });

  
}

exports.cats_cities_countries = function(req, res)
{
  categoryModel.getAll((err, cats)=>{
	
	if(err)
	  res.json({result:0, message:"Failed to add chamber", code:0});
	else
	{
	  cityModel.getAll((err,cities)=>{
 		if(err)
		  res.json({result:0, message:"Failed to add chamber", code:0});
		else
		{  
		  countryModel.getAll((err, countries)=>{
		    if(err)
		      res.json({result:0, message:"Failed to add chamber", code:0});
			else   
   		      res.json({result:1, countries:countries, categories:cats, cities:cities, message:"Chamber Added", code:0}); 	
		  })
	  	} 	  
	  })		
	}
  })
}


exports.searchchamber = function(req, res)
{
   console.log(req.query)
   chamberModel.searchChamber(req.query, (err, data)=>{
	
    if(err)
	  res.json({result:0, message:"Failed to retrieve chambers", code:0});
	else
	  res.json({result:1, data: data, code:0}); 	

  })
	
}


