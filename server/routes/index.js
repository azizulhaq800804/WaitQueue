var express = require('express')
var router = express.Router()
var userController = require('../controllers/userController')
var chamberController = require('../controllers/chamberController')

var log = require('../logger.js').LOG
var jwtvalidator = require('../util/jwtvalidator').validateToken
var upload = require('../util/storage')
const formidable = require('express-formidable');

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  console.log(fullUrl)
  console.log(req.params)
  log.info(fullUrl)
  log.info(req.body)
  // log.info(req.fields)
  console.log('Time: ', Date.now())
  next()
})


// define the about route
router.post('/login', function (req, res) {
  userController.login(req, res);
})


router.post('/signup', function (req, res) {
  userController.signup(req, res);
})

router.route('/userrooms').post(jwtvalidator,function(req,res)
{
  res.send("Validator test")
})

router.route('/addchamber').post(jwtvalidator, 
  function (req, res) {
    chamberController.add_chamber(req, res);
  }
)

router.get('/cats_cities_countries', function(req, res){
  chamberController.cats_cities_countries(req, res);

})
router.get('/searchchamber', function(req, res){
  chamberController.searchchamber(req, res);

})


router.post('/updateroom', function (req, res) {
  adminController.update_room(req, res);
})

module.exports = router
