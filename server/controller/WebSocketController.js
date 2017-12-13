var io;

module.exports.init = function (server) {
    io = require('socket.io').listen(server);
};


module.exports.onNewOrder = function (productsOrder) {
    io.emit(process.env.ORDER_EVENT_KEY,productsOrder);
    // this.io.send(productsOrder);
};


// PROMOTION
module.exports.addPromotion = function (req, res) {
    var promotion = req.body;
    var durationMin = promotion.durationMin;
    if(!promotion || !durationMin) return res.status(400).json({success: false, message: "Wrong body type"});
    io.emit(process.env.PROMOTION_EVENT_KEY,req.body);
    setTimeout(function() {
        promotion.active = false;
        io.emit(process.env.PROMOTION_EVENT_KEY,promotion);
    }, durationMin*60*1000);
    res.status(200).json({success: true, message: "Promotion started"});
};