const multer = require('multer')
const config = require('../config')
Storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, config.uploadPath)
  },
  filename(req, file, callback) {
    callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`)
  },
})

const upload = multer({ storage: Storage })
module.exports = upload

