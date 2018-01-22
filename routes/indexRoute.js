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

var items = new Map();
items.set('test1', 1);
items.set('test2', 3);

router.get('/testKit', function(req, res) {
  res.render('kitchen', { items: items });
});

router.post('/testKit', function(req, res) {
  items.set('test1', items.get('test1') + 1);
  items.set('test3', 4);
  let obj = Array.from(items).reduce((obj, [key, value]) => (
    Object.assign(obj, { [key]: value }) // Be careful! Maps can have non-String keys; object literals can't.
  ), {});
  
  console.log(obj);
  io.sockets.emit('increment', obj); // 广播
  res.status(200).send('ss');
});

module.exports = router;