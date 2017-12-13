var express = require('express');
var jwt = require('jsonwebtoken');
var AuthRouter = module.exports = express.Router();

AuthRouter.use( function (req, res, next) {
    var token = req.headers['token'];
    if(!token) return res.status(401).json({
        success: false,
        error: "Can not find 'token' value in headers"
    });
    jwt.verify(token, process.env.JWT_SECRET_KEY, function (err, decode) {
        console.error(err);
        if(err) return res.status(401).json({
            success: false,
            error: "Invalid token"
        });
        next();
    });
});