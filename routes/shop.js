var express = require('express');
var path = require('path');
var freshGreen = require('eleme-openapi-sdk');
var router = express.Router();

router.get('/shopinfo', function(req, res) {
  var config = new freshGreen.Config({
    key: 'AZsizwuuF1',
    secret: '14ab21a61a032dc5c7de69ce5b426f2ff6313dcd',
    sandbox: true
  });
  
  var oAuthClient = new freshGreen.OAuthClient(config);
  oAuthClient.getToken().then((result) => {
    var token = result.substring(17, 49);
    var rpcClient = new freshGreen.RpcClient(token, config);
    var shopService = new freshGreen.ShopService(rpcClient);
      shopService.getShop(157427755).then(shopInfo => {
        res.render('shopInfo', { shop: shopInfo });
      });
  });
});

module.exports = router;