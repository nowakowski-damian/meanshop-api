User = require("../model/User.js");
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports.logIn = function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    User.findOne( { 'username': username}, function (err, response) {
        if(err) return res.status(500).json({
            success: false,
            error: "Could get user from db."
        });

        if(response===null) return res.status(403).json({
            success: false,
            error: "Wrong credentials."
        });

        if(bcrypt.compareSync(password, response.password)) {
            // Passwords match, generate session token
            var token = jwt.sign(response.toJSON(), process.env.JWT_SECRET_KEY, { expiresIn: process.env.TOKEN_EXPIRATION_MS });
            res.json({
                success: true,
                token: token
            });
        } else {
            // Passwords don't match return 403
            res.status(403).json({
                success: false,
                error: "Wrong credentials."
            });
        }
    });
};

// module.exports.logOut = function (req, res) {
//     var token = req.headers['token'];
//     if(!token) return res.status(401).json({
//         success: false,
//         error: "Can not find 'token' value in headers"
//     });
//     tokenBlackList.push(token);
//     res.json({
//         success: true
//     });
// };