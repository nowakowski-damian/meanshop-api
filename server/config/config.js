module.exports.setConfig = function () {
    process.env.SERVER_PORT = 5000;
    process.env.TOKEN_EXPIRATION_MS =15*60*1000;
    process.env.DB_URI = 'mongodb://DB_ADDRESS';
    process.env.JWT_SECRET_KEY = "SECRET_KEY";
    process.env.ORDER_EVENT_KEY = "new_order";
    process.env.PROMOTION_EVENT_KEY = "promotion";
};