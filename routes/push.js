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

  // 根据不同的推送类型，来储存不同的数据
  if (req.body.type == 10) { // 订单生效，创建新的订单对象
    var Order = Parse.Object.extend('Order');
    var order = new Order();

    order.set('orderId', message.orderId);
    order.set('deliveryAddress', message.address);
    order.set('type', req.body.type);
    order.set('description', (message.description == '') ? '无备注' : message.description);
    order.set('detail', getOrderDetail(message));
    order.set('recipient', message.consignee);
    order.set('orderObject', message);
    order.save(null, {
      success: function(order) {
        console.log('New order created with objectId: ' + order.id); 
        saveItems(message, order);
      },
      error: function(order, error) {
        console.log('Failed to create new order, with error code: ' + error.message);
      }
    });
  } else if (req.body.type == 14) { // 取消订单
    var Order = Parse.Object.extend('Order');
    var query = new Parse.Query(Order);
    query.equalTo('orderId', message.orderId);
    query.find({
      success: function(results) {
        console.log('Successfully retrieved ' + results.length + ' orders.');
        for (var i = 0; i < results.length; i++) {
          var order = results[i];
          order.set('type', req.body.type);
          order.save();
        }
      },
      error: function(error) {
        console.log('Error: ' + error.code + ' ' + error.message);
      }
    });
  }
  
});

function getOrderDetail(message) {
  var numberOfCarts = message.groups.length;
  var orderDetail = '';
  for (let i = 0; i < numberOfCarts; i++) {
    orderDetail += i+1 + '号篮子：';

    var numberOfItems = message.groups[i].items.length;
    for (let j = 0; j < numberOfItems; j++) {
      item = message.groups[i].items[j];
      orderDetail += (item.name + 'x' + item.quantity + (j+1 == numberOfItems ? '。' : '，'));
    }
  }

  return orderDetail;
}

function saveItems(message, order) {
  var numberOfCarts = message.groups.length;
  for (let i = 0; i < numberOfCarts.length; i++) {
    var numberOfItems = message.groups[i].items.length;
    for (let j = 0; j < numberOfItems.length; j++) {
      var itemObject = message.groups[i].items[j];
      console.log('Saving item');
      var Item = Parse.Object.extend('Item');
      var item = new Item();

      item.set('order', order);
      item.set('quantity', itemObject.quantity);
      item.set('name', itemObject.name);
      item.set('price', itemObject.price);
      item.set('itemId', itemObject.id);
      item.save(null, {
        success: function(result) {
          console.log('New item saved: ' + result.get('name'));
        }, error: function(e) {
          console.log('Error: ' + e.code + ' ' + e.message);
        }
      });
    }
    
  }
}

module.exports = router;