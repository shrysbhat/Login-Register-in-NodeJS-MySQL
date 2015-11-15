var express = require('express');
var router = express.Router();
var createUser = require('./createUser');
var upload = require('./upload');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/login', function(req, res){
	res.render('login');
});

router.get('/register', function(req, res){
	res.render('register');
});

router.post('/createUser/signIn',createUser.signIn);

router.get('/userdashboard', function(req, res){
	res.render('userdashboard');
});

router.get('/userupload', function(req,res){
	res.render('userupload');
});

router.get('/usermyfiles', function(req,res){
	res.render('usermyfiles');
});

router.get('/usersettings', function(req,res){
	res.render('usersettings');
});

router.get('/userpaymentdash', function(req,res){
	res.render('userpaymentdash');
});

router.get('/usersupport', function(req,res){
	res.render('usersupport');
});

router.post('/createUser/signUp',createUser.signUp);

router.post('/fileUpload', upload.fileUpload);

router.post('/uploadfile', upload.uploadFile);

module.exports = router;
