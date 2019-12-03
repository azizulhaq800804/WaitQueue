const express = require('express')
app = express()
bodyParser = require('body-parser');
require('dotenv').config();
port = process.env.PORT || 5000;



app.listen(port);

console.log('API server started on: ' + port);
app.use(express.static('public'))
//app.use(formidable());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'pug');
app.set('views', './views')
var routes = require('./routes'); //importing route
app.use('/', routes); //register the route