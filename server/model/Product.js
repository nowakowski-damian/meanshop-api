var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ProductSchema = new Schema({
    // _id: Schema.ObjectId,
    name: String,
    img: String,
    description: String,
    longDescription: String,
    price: Number,
    category: {
        // _id: Schema.ObjectId,
        name : String
    },
    quantity: Number
});

var Product = module.exports = mongoose.model('Product', ProductSchema);