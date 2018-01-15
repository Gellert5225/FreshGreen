var express = require('express');
var path = require('path');
var router = express.Router();

router.get('/', function(req, res) {
  res.status(200).render('home');
});

router.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/test.html'));
});

router.get('/reception', function(req, res) {
  var Order = Parse.Object.extend('Order');
  var query = new Parse.Query(Order);
  query.descending("createdAt");
  query.find({
    success: function(results) {
      console.log('Successfully retrieved ' + results.length + ' orders.');
      res.render('reception', { orders : results });
    },
    error: function(error) {
      console.log('Error: ' + error.code + ' ' + error.message);
    }
  });
});

router.get('/kitchen', function(req, res) {
  var Item = Parse.Object.extend('Item');
  var query = new Parse.Query(Item);
  query.find({
    success: function(results) {
      console.log('Successfully retrieved ' + results.length + ' items.');
      var itemMap = new Map();
      results.forEach(item => {
        var itemName = item.get('name');
        if (!itemMap.has(itemName)) {
          itemMap.set(itemName, item.get('quantity'));
        } else {
          itemMap.set(itemName, itemMap.get(itemName) + item.get('quantity'));
        }
      });

      for (var [key, value] of itemMap.entries()) {
        console.log(key + ' = ' + value);
      }
      res.render('kitchen', { items : itemMap });
    }, 
    error: function(error) {
      console.log('Error: ' + error.code + ' ' + error.message);
    }
  });
});

router.get('/testAJAX', function(req, res) {
  res.render('testAJAX');
})

router.post('/testAJAX', function(req,res) {
  console.log(req.body.abc);
  io.sockets.emit('ORDER_STATUS_CHANGED', req.body.abc);
  res.status(200).send('ss');
});


module.exports = router;