var express = require('express');
var path = require('path');
var router = express.Router();

router.get('/push', function(req, res) {
  res.status(200).send('{"message":"ok"}');
});

router.post('/push', function(req, res) {
  console.log('PUSH RECIEVED');
  console.log(req.body);
  res.status(200).send('{"message":"ok"}');

  var message = JSON.parse(req.body.message);
  console.log('ORDER ID: ' + message.orderId);

  //创建新的订单对象
  var Order = Parse.Object.extend("Order");
  var order = new Order();
  order.set('orderId', message.orderId);
  order.set('deliveryAddress', message.address);
  order.set('type', req.body.type);
  order.save(null, {
    success: function(order) {
      // Execute any logic that should take place after the object is saved.
      console.log('New order created with objectId: ' + order.id);
    },
    error: function(order, error) {
      // Execute any logic that should take place if the save fails.
      // error is a Parse.Error with an error code and message.
      console.log('Failed to create new order, with error code: ' + error.message);
    }
  });
});

router.get('/kitchen', function(req, res) {
  res.render('kitchen');
});

module.exports = router;