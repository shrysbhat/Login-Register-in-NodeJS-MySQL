var express = require('express');
var router = express.Router();
var createUser = require('./createUser');
var multer  = require('multer');
//var upload = require('./upload');
var upload = multer({ dest: 'uploads/' });
var mongoose = require('mongoose');
var session = require('express-session');
var videoSchema = require('../models/videos.js');
var userSchema = require('../models/users.js');
var fs = require('fs');
var crypto = require('crypto');
var fileExists = require('file-exists');
var mysql = require("./mysql");
var forEachAsync = require('forEachAsync').forEachAsync;

var sess;

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
	sess = req.session;
	if(sess.email){
		res.render('userdashboard');
	}
	else{
		res.render('login');
	}
});

router.get('/userupload', function(req,res){
	sess = req.session;
	if(sess.email){
		/*var email = sess.email;
		var StringQuery = "select image_upload, audio_upload, video_upload from DataSecService.access_control where email=\'" + email + "\'";
		mysql.fetchData(StringQuery, function(error, Results){
			if(error){
				return;
			}
			else{
				if(Results.length > 0){
					var iUpload = Results[0].image_upload;
					var aUpload = Results[0].audio_upload;
					var vUpload = Results[0].video_upload;
				}
				else{
					res.send("Error !!");
				}
			}
		});*/
		res.render('userupload');
	}
	else{
		res.render('login');
	}
});

router.get('/usermyfiles', function(req, res, next){
	sess = req.session;
	if(sess.email){		
		userSchema.findOne(
				{"email": sess.email},
				{"files":1},
				{},
				function(err,data){
					if(err){
						console.log(err);
						res.send(err);
						return;
					}
					if(data && data.files){
							res.render('usermyfiles', {myFiles: data.files});
					}
					else{
							res.render('usermyfiles', {myFiles: []});
					}
					
					return;
				});	
	}
	else{
		res.render('login');
	}
});

router.get('/usersettings', function(req,res){
	sess = req.session;
	if(sess.email){
		res.render('usersettings');
	}
	else{
		res.render('login');
	}
});

router.get('/userpaymentdash', function(req,res){
	sess = req.session;
	if(sess.email){
		res.render('userpaymentdash');
	}
	else{
		res.render('login');
	}
});

router.get('/usersupport', function(req,res){
	sess = req.session;
	if(sess.email){
		res.render('usersupport');
	}
	else{
		res.render('login');
	}
});

router.get('/userLogout', function(req,res){
	req.session.destroy(function(err){
	if(err){
		console.log(err);
	}
	else{
		res.redirect('login');
	}
	});
});

router.post('/createUser/signUp',createUser.signUp);

//router.post('/fileUpload', upload.fileUpload);

//router.post('/uploadfile', upload.uploadFile);
router.post('/uploadFile',upload.array('myFile'), function (req, res, next) {
	if(!req.session || !req.session.email){
		res.redirect('/login');
		return;
	}
	//console.log(req.file);
	//var key = req.body.key;
	var key = req.session.keyphrase;
	var algo = req.body.algoName;
	//var cipher = crypto.createCipher('aes256', key);
	forEachAsync(req.files, function (next, element, index, array) {
 	  	console.log('element: ' + JSON.stringify(element));
 	  	var cipher = crypto.createCipher(algo, key);
		var input = fs.createReadStream(String(String(__dirname).slice(0,-6) + "uploads/" + element.filename));
		var output = fs.createWriteStream(String(String(__dirname).slice(0,-6) + "encrypted/" + element.filename + ".enc"));
		input.pipe(cipher).pipe(output);
		output.on('finish', function(err){
			if(err){
				console.log('error in "output.on()": '+err);
				next();
			}
			else{
				console.log("File encrypted successfully");
				var deleteThis = String(String(__dirname).slice(0,-6) + "uploads/" + element.filename);
				fs.unlinkSync(deleteThis);

				var newEntry = { 
					originalName : element.originalname,
					algorithm : req.body.algoName,
					fileName : element.filename,
					fileType : element.mimetype,
					fileSize : parseInt(element.size),
					timeStamp : new Date()
				}

				userSchema.findOneAndUpdate(
					{"email": req.session.email},
					{$push: {"files": newEntry}},
					{new: true, upsert: false},
					function(err,data){
						if(err){
							console.log('error saving to database: ' + err);
							res.send(err);
							return;
						}
						//res.redirect('/');
					}
				);

				next();
				cipher.end();
			}
		});

 	  	})
		.then(function(err){
			if(err){
				console.log('error in ".then()": ' + err);
			}
    		res.redirect("/myFiles");
  		});
});

router.get('/myFiles',function(req,res){
	if(!req.session || !req.session.email){
		res.redirect('/login');
		return;
	}
	
	userSchema.findOne(
		{"email": req.session.email},
		{"files":1},
		{},
		function(err,data){
			if(err){
				console.log(err);
				res.send(err);
				return;
			}
			if(data && data.files){
				res.render('usermyfiles', {myFiles: data.files});
			}
			else{
				res.render('usermyfiles', {myFiles: []});
			}
			return;
		});	
});

router.post('/download/:fileName', function(req, res, next) {
	if(!req.session || !req.session.email){
		res.redirect('/login');
		return;
	}
	var key = req.session.keyphrase;
	var key1 = req.body.key1;
	console.log('key in /download-'+ key1);
	if(!req.body.key1){
		res.send('cannot decrypt without a "key"');
		return;
	}

	userSchema.aggregate(
		[
			{$match: {"email": req.session.email}},
			{$unwind: "$files"},
			{$match: {"files.fileName": req.params.fileName}},
			{$project: {"files":1}}
		],
		function(err,data){
			if(err){
				console.log(err);
				res.send(err);
				return;
			}

			data = JSON.parse(JSON.stringify(data));
			data = data[0].files;

			console.log('data.algorithm-'+ data.algorithm);
			var decipher = crypto.createDecipher(data.algorithm, key1);
			decipher.setAutoPadding(auto_padding = false);
			var output = fs.createWriteStream(String(String(__dirname).slice(0,-6) + "decrypted/" + data.originalName).split(".")[0]);
			var input = fs.createReadStream(String(String(__dirname).slice(0,-6) + "encrypted/" + req.params.fileName + ".enc"));
			input.pipe(decipher).pipe(output);
			output.on('finish', function(){
				console.log("File decrypted successfully");
				console.log('/secret/download/file/' + String(data.originalName).split(".")[0]);
				res.redirect('/secret/download/file/' + String(data.originalName).split(".")[0]);
				return;
			});
		});
});

router.get('/secret/download/file/:fileName', function(req,res){
	res.sendFile(String(String(__dirname).slice(0,-6) + "decrypted/" + req.params.fileName), function(){
		console.log(String(String(__dirname).slice(0,-6) + "decrypted/" + String(req.params.fileName)));
		var deleteThis = String(String(__dirname).slice(0,-6) + "decrypted/" + String(req.params.fileName));
		fs.unlinkSync(deleteThis);
	});
});

router.post('/createUser/adminSignIn',createUser.adminSignIn);

router.post('/createUser/adminSignUp',createUser.adminSignUp);

router.get('/adminRegister', function(req, res){
	res.render('adminRegister');
});

router.get('/adminLogin', function(req, res){
	res.render('adminLogin');
});

router.get('/adminpolicyengine', function(req, res){
	sess = req.session;
	if(sess.email){
		res.render('adminpolicyengine');
	}
	else{
		res.render('adminLogin');
	}
});

router.get('/adminsettings', function(req, res){
	sess = req.session;
	if(sess.email){
		res.render('adminsettings');
	}
	else{
		res.render('adminLogin');
	}
});

router.get('/adminsupport', function(req, res){
	sess = req.session;
	if(sess.email){
		res.render('adminsupport');
	}
	else{
		res.render('adminLogin');
	}
});

router.get('/adminuserportal', function(req, res){
	sess = req.session;
	if(sess.email){
		res.render('adminuserportal');
	}
	else{
		res.render('adminLogin');
	}
});

router.get('/adminpaymentdash', function(req, res){
	sess = req.session;
	if(sess.email){
		res.render('adminpaymentdash');
	}
	else{
		res.render('adminLogin');
	}
});

router.get('/adminLogout', function(req,res){
	req.session.destroy(function(err){
	if(err){
		console.log(err);
	}
	else{
		res.redirect('adminLogin');
	}
	});
});

router.delete('/:fileID/:filename', function(req,res,next){
	if(!req.session || !req.session.email){
		res.redirect('/login');
		return;
	}
	var filename = req.params.filename;

	userSchema.findOneAndUpdate(
		{"email": req.session.email},
		{$pull: {"files": {"_id": mongoose.Types.ObjectId(req.params.fileID)}}},
		{new: true},
		function(err,data){
			if(err){
				res.send(err);
				console.log(err);
				return;
			}
			else{
				var deleteThis = String(String(__dirname).slice(0,-6) + "encrypted/" + String(filename) + ".enc");
				fs.unlinkSync(deleteThis);
				res.redirect('/usermyfiles');
				return;
			}
		});
});

module.exports = router;
