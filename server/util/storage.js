const multer = require('multer')
const config = require('../config')
Storage = multer.diskStorage({
  destination(req, file, callback) {
  	console.log("Multer destination callback")
    callback(null, "../" + config.uploadPath)
  },
  filename(req, file, callback) {
    console.log(file.fieldname)
    callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`)
  },
  function(err, next) {
      console.log('error', err);
      next(err);
   }
})

const upload  = multer({ dest: 'uploads/' })
module.exports = upload

