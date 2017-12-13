Category = require("../model/Category.js");
Product = require("../model/Product.js");
Order = require("../model/Order.js");
User = require("../model/User.js");
WebSocketController = require("../controller/WebSocketController.js");


// CATEGORY
module.exports.getCategories = function (req, res) {
    Category.find( function (err, response) {
        if(err) return res.status(500).send("Could not get categories from db.");
        res.json(response);
    });
};

function addCategoryIfNotExists(category, callback) {
    Category.find({ 'name': category.name}, function (err, categories) {
        if(err) throw err;
        console.log(categories);
        if(categories.length<=0) {
            Category.create(category, callback);
            console.log("Creating category");
        }
        else {
            callback(err,categories);
            console.log("Categry exists already, skipping");
        }
    });
};


// PRODUCT
module.exports.getProducts = function (req, res) {
    Product.find( function (err, response) {
        if(err) return res.status(500).send("Could not get products from db.");
        res.json(response);
    });
};

module.exports.addProduct = function (req, res) {
    var product = req.body;
    var category = product.category;

    addCategoryIfNotExists(category, function (err, response) {
        if(err) return res.status(500).send("Could not check/create new category.");
    });

    Product.create( product, function (err, response) {
        if(err) return res.status(500).send("Could not create new product.");
        res.json(response);
    });
};

module.exports.updateProduct = function (req, res) {
    var id = req.params._id;
    var product = req.body;
    var category = product.category;

    var query = { _id: id };
    var update = {
        name: product.name,
        quantity: product.quantity,
        description: product.description,
        longDescription: product.longDescription,
        price: product.price,
        category: {
            name : category.name
        }
    };

    addCategoryIfNotExists(category, function (err, response) {
        if(err) return res.status(500).send("Could not check/create new category.");
    });

    Product.findOneAndUpdate(query, update, {}, function (err, response) {
        if(err) return res.status(500).send("Could not update product in db.");
        res.json(response);
    });
};

// ORDERS
module.exports.getOrders = function (req, res) {
    Order.find( function (err, response) {
        if(err) return res.status(500).send("Could not get orders from db.");
        res.json(response);
    });
};

module.exports.addOrder = function (req, res) {
    var order = req.body;
    Order.create( order, function (err, response) {
        if(err) return res.status(500).send("Could not add order to db.");
        order.products.forEach( function (productOrder) {
            var id = productOrder.product._id;
            Product.findById(id, function (err, product) {
                if(err || !product) return console.error("Could not update product quantity in db - product with given id does not exists.");
                var query = { _id: id };
                var update = {
                    quantity: product.quantity-productOrder.quantity
                };
                Product.findOneAndUpdate(query, update, {}, function (err, response) {
                    if(err) return console.error("Could not update product quantity in db.");
                });
            });

    });

        res.json(response);
        WebSocketController.onNewOrder(order.products);
    });
};

module.exports.updateOrder = function (req, res) {
    var id = req.params._id;
    var query = { _id: id };
    var update = {
        done: true
    };

    Order.findOneAndUpdate(query, update, {}, function (err, response) {
        if(err) return res.status(500).send("Could not update order in db.");
        res.json(response);
    });
};



//USERS
module.exports.getUser = function (username, callback) {
    User.findOne( { 'username': username}, callback);
};

module.exports.getUserById = function (id, callback) {
    User.findById( id, callback);
};

module.exports.createUser = function (req, res) {
    const bcrypt = require('bcrypt');
    var user = req.body;
    bcrypt.hash(user.password, 10, function(err, hash) {
        if(err) return res.status(500).send("Could not create new user - hashing error.");
        user.password = hash;
        User.create( user, function (err, response) {
            if(err) return res.status(500).send("Could not create new user.");
            res.json({success: true, message: "User created"});
        });

    });
};
