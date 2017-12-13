var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var OrderSchema = new Schema({
    // _id: Schema.ObjectId,
    names: String,
    address: String,
    totalAmount: Number,
    products: [{
        product: {
            // _id: Schema.ObjectId,
            name: String,
            description: String,
            price: Number,
            category: {
                // _id: Schema.ObjectId,
                name: String
            }
        },
        quantity: Number
    }
    ],
    done: Boolean
});

var Order = module.exports = mongoose.model('Order', OrderSchema);