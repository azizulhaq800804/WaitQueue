'use strict'
const config = require('../config')
const chamberModel = require('../models/chamberModel')
const categoryModel = require('../models/categoryModel')
const cityModel = require('../models/cityModel')

exports.add_chamber = function(req, res)
{
  console.log(req.body)
  let picture_url = `http://${req.headers.host}:${req.headers.port}/
                ${config.uploadPath}/${req.body.file}`	
                  
  chamberModel.addChamber(picture_url, req.body, (err, result)=>{
	if(err)
	  res.json({result:0, message:"Failed to add chamber", code:0});
	else
	  res.json({result:1, data:result, message:"Chamber Added", code:0}); 
	})
}

exports.cats_cities = function(req, res)
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
		  res.json({result:1, categories:cats, cities:cities, message:"Chamber Added", code:0}); 	

	  })		
	}

  })
}

