var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: String,
    password: String,
    isAdmin: Boolean
});

var User = module.exports = mongoose.model('User', UserSchema);