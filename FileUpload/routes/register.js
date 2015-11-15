var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/userdashboard', function(req, res){
	res.render('userdashboard');
});

module.exports = router;
