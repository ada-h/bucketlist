var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

require('dotenv').config()
var app = express();
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
})

var options = {
    customCss: '.swagger-ui .topbar { display: none }'
  };

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

//Require Routes
var todoRoutes = require('./routes/todoRoutes')
var authRoutes = require('./routes/authRoutes')
var listRoutes = require('./routes/listRoutes')


mongoose.connect(config.getDbConnectionString(), { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });


todoRoutes(app, process.env.SECRET_KEY)
authRoutes(app, process.env.SECRET_KEY)
listRoutes(app, process.env.SECRET_KEY)

var port = process.env.PORT || 3000;
app.listen(port)