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

module.exports = router;