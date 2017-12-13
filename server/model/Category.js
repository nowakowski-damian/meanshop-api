var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var CategorySchema = new Schema({
    // _id: Schema.ObjectId,
    name: String
});

var Category = module.exports = mongoose.model('Category', CategorySchema);