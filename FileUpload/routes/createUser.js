var express = require("express");
var mysql = require("./mysql");
var app = express();
var router = express.Router();
var ejs = require("ejs");
var crypto = require('crypto');
var videoSchema = require('../models/videos.js');
var userSchema = require('../models/users.js');
var mongoose = require('mongoose');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });

/*
var hash = function (pass, salt) {
        var h = crypto.createHash('sha512');
        h.update(pass);
        h.update(salt);
        return h.digest('base64');
    };
*/

exports.signUp = function (req, res){
	
	var email= req.body.email;
	var fname = req.body.fname;
	var lname = req.body.lname;
	var password = req.body.password;
	var keyphrase = req.body.keyphrase;

	var StringQuery = "insert into DataSecService.user_records (email, fname, lname, password, keyphrase) " +
			"values( \'" + email+ 
			"\',\'" + fname + 
			"\',\'" + lname + 
			"\',\'" + password +
			"\',\'" + keyphrase +
			"\');";
	//console.log("StringQuery- " + StringQuery);
	mysql.fetchData(StringQuery, function(error, Results){
		if(error){
			return;
		}
		else{
			if(Results.affectedRows > 0){
			var StringQuery = "select email from DataSecService.user_records where email=\'" + email + "\'";
			//console.log("query2- " + StringQuery);
			mysql.fetchData(StringQuery, function(error, Results){
					if(error){
						//throw error;
						return;
					}
					else{
						if(Results.length > 0){
							var emailid = Results[0].email;
							//var keyphrase = Results[0].keyphrase;
							//req.session.email = emailid;
							//req.session.keyphrase = keyphrase;
							//var StringQuery = "insert into DataSecService.access_control (group_id) values (\'00\');";
							//console.log("query3- " + StringQuery);
							//mysql.fetchData(StringQuery, function(error, Results){
								//if(error){
									//throw error;
									//return;
								//}
								//else{
									//if(Results.affectedRows >0){
										//req.session.email = emailid;
										req.session.keyphrase = keyphrase;
										var StringQuery = "insert into DataSecService.keyphrase (email_id, keyphrase) values " +
												"(\'" + emailid + "\'" +
												",\'" + keyphrase + "\');";
										//console.log("query4- " + StringQuery);
										mysql.fetchData(StringQuery, function(error, Results){
											if(error){
												//throw error;
												return;
											}
											else{
												if(Results.affectedRows >0){
													req.session.email = emailid;
													var StringQuery = "insert into DataSecService.folder_mapping (emailid) values (\'" + emailid + "\');";
													//console.log("query5- " + StringQuery);
													mysql.fetchData(StringQuery, function(error, Results){
														if(error){
															//throw error;
															return;
														}
														else{
															if(Results.affectedRows >0){
																//res.send({"signup":"success"});
																/* register on MongoDB */
																var newUser = {
																		email: req.body.email,
																		password: req.body.password,
																		files: []
																	};

																	newUser.fname = req.body.fname || '';
																	newUser.lname = req.body.lname || '';
																	newUser.user_type = 'U' || '';
																	newUser.groupid = '00' || '';

																	var item = new userSchema(newUser);
																	item.save(function(err,data){
																		if(err){
																			console.log(err);
																			res.send(err);
																			return;
																		}
																		//res.send(data);
																		res.send({"signup":"success"});
																	});
															}
															else{
																res.send("Error !!");
															}
														}
													});	
													//res.send({"signup":"success"});
													}
												else{
												res.send("Error !!");
												}
											}
										});	
							
							console.log("Inside SignUp - Results.length > 0");
						}
						else{
							res.send("Error !!");
						}
					}
					});	
						}
						else{
							res.send("Error !!");
						}
					//}
				//});	

			//}
		}
	});	
	
	
//exports.signUp = function (req, res)	
}

exports.adminSignUp = function (req, res){
	
	var email= req.body.email;
	var fname = req.body.fname;
	var lname = req.body.lname;
	var password = req.body.password;
	
	var StringQuery = "insert into DataSecService.user_records (email, fname, lname, password, user_type) " +
			"values( \'" + email 	+ "\'," +
					"\'" + fname    + "\'," +
					"\'" + lname 	+ "\'," +
					"\'" + password + "\'," +
//			"\',\'" + groupid + 
					"\'" + 'A' 		+
//			"\',\'" + encpassword +  
			"\');";
	//console.log("StringQuery- " + StringQuery);
	mysql.fetchData(StringQuery, function(error, Results){
		if(error){
			//console.log("A error occured in Insert query", error);
			return;
		}
		else{
			if(Results.affectedRows > 0){
			var StringQuery = "select email from DataSecService.user_records where email=\'" + email + "\'";
			//console.log("query2- " + StringQuery);
			mysql.fetchData(StringQuery, function(error, Results){
					if(error){
						return;
					}
					else{
						if(Results.length > 0){
							//var emailid = Results[0].email;
							req.session.email = emailid;
							//var StringQuery = "insert into DataSecService.access_control (email_id) values (\'" + emailid + "\');";
							//console.log("query3- " + StringQuery);
							//mysql.fetchData(StringQuery, function(error, Results){
								//if(error){
									//return;
								//}
								//else{
									//if(Results.affectedRows >0){
										//req.session.email = emailid;
										var StringQuery = "insert into DataSecService.keyphrase (email_id) values (\'" + emailid + "\');";
										//console.log("query4- " + StringQuery);
										mysql.fetchData(StringQuery, function(error, Results){
											if(error){
												return;
											}
											else{
												if(Results.affectedRows >0){
													req.session.email = emailid;
													var StringQuery = "insert into DataSecService.folder_mapping (emailid) values (\'" + emailid + "\');";
													//console.log("query5- " + StringQuery);
													mysql.fetchData(StringQuery, function(error, Results){
														if(error){
															return;
														}
														else{
															if(Results.affectedRows >0){
																//res.send({"signup":"success"});
																/* register on MongoDB */
																var newUser = {
																		email: req.body.email,
																		password: req.body.password,
																		files: []
																	};

																	newUser.fname = req.body.fname || '';
																	newUser.lname = req.body.lname || '';
																	newUser.user_type = 'A' || '';
																	newUser.groupid = '00' || '';

																	var item = new userSchema(newUser);
																	item.save(function(err,data){
																		if(err){
																			console.log(err);
																			res.send(err);
																			return;
																		}
																		//res.send(data);
																		res.send({"signup":"success"});
																	});
															}
															else{
																res.send("Error !!");
															}
														}
													});	
													}
												else{
												res.send("Error !!");
												}
											}
										});	
							
							//console.log("Inside SignUp - Results.length > 0");
						}
						else{
							res.send("Error !!");
						}
					}
					});	
						}
						else{
							res.send("Error !!");
						}
					}
				});	
	

}
		
//function Signedup(req,res)
//{
//	ejs.renderFile('./views/adminHome.ejs',function(err, result) {
//        // render on success
//        if (!err) {
//
//            res.end(result);
//        }
//        // render or error
//        else {
//        	
//        	res.end('An error occurred');
//            console.log(err);
//        }
//    });
//};


exports.signIn = function(req, res){
	var password = req.body.password;
	var email = req.body.email;

	var StringQuery= "select email, password, keyphrase from datasecservice.user_records where email =\'" + email+ "\';";
	mysql.fetchData(StringQuery, function(error, results){
		if(error){
			return;
		}
		else{
			if(results.length > 0){
				if(results[0].password == password && results[0].email == email)
				{
					req.session.email = results[0].email;
					req.session.keyphrase = results[0].keyphrase;
					res.send({"user":"valid"});
				}
				else{
					res.send({"user":"invalid"});
				}
			}
			else{
				res.redirect('/login');
			}
		}
	});
	
	/*
	userSchema.findOne(
			{"email": req.body.email, "password": req.body.password},
			{},
			{},
			function(err,data){
				if(err){
					res.statusCode = 500;
					res.send('internal server error');
					return;
				}

				if(!data){
					res.statusCode = 400;
					res.redirect('/login');
					return;
				}

				req.session.email = req.body.email;
				res.redirect('/');
				
			});
	*/
}

exports.adminSignIn = function(req, res){
	var password = req.body.password;
	var email = req.body.email;
	var StringQuery= "select email, password from datasecservice.user_records where user_type = 'A' and email =\'" + email+ "\';";
	mysql.fetchData(StringQuery, function(error, results){
		if(error){
			return;
		}
		else{
			if(results.length > 0){
				if(results[0].password == password)
				{
					req.session.email = results[0].email;
					res.send({"admin":"valid"});
				}
				else{
					res.send({"admin":"invalid"});
				}
			}
			else{
				res.redirect('/adminLogin');
			}
		}
	});
}