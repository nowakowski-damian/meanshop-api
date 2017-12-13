var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var dataController = require('./controller/DatabaseController.js');
var authController = require('./controller/AuthController.js');
AuthRouter = require('./routers/AuthRouter');

var config = require('./config/config');
config.setConfig();

app.use(bodyParser.json());
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,token');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});


//  DB
var mongoose = require('mongoose');
mongoose.connect(process.env.DB_URI);
mongoose.connection.on('error', console.error.bind(console, 'DB connecting error...'));
mongoose.connection.once('open', function() {
    console.log("Db connected succesfuly ");
});


//  API

app.get('/', function (req, res) {
    res.send("<h1>Server works!</h1>");
});

// products
app.get('/products', dataController.getProducts);
app.post('/products', AuthRouter, dataController.addProduct);
app.put('/products/:_id', AuthRouter, dataController.updateProduct);

// promotion
app.post('/promotion', AuthRouter, WebSocketController.addPromotion);

// categories
app.get('/categories', dataController.getCategories);

// orders
app.get('/orders', AuthRouter, dataController.getOrders);
app.post('/orders', dataController.addOrder);
app.put('/orders/:_id', AuthRouter, dataController.updateOrder);

// users
app.post('/users/new',dataController)

// auth
app.post('/users/login', authController.logIn );




// SERVER
var server = app.listen(process.env.PORT || process.env.SERVER_PORT, function () {
    console.log("Server started on");
});


// SOCKET EVENTS
WebSocketController = require("./controller/WebSocketController.js");
WebSocketController.init(server);

// var io = require('socket.io').listen(server);
// var users = 0;

// io.on('connection' , function(client) {
//     users++;
//     console.log('Client connected...',"("+users+")" );
//     client.emit('message' , {
//         hello: 'test',
//         count: users
//     });
// });
