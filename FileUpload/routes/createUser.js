var express = require("express");
var mysql = require("./mysql");
var app = express();
var router = express.Router();
var ejs = require("ejs");
var crypto = require('crypto');

/*
var hash = function (pass, salt) {
        var h = crypto.createHash('sha512');
        h.update(pass);
        h.update(salt);
        return h.digest('base64');
    };
*/

exports.signUp = function (req, res){
	
	var email= req.param("email");
	var fname = req.param("fName");
	var lname = req.param("lName");
	var password = req.param("password");
	console.log("email- " + email);
	console.log("fname- " + fname);
	console.log("lname- " + lname);
	console.log("password- " + password);
	//var groupid = req.param("groupid");
	//var user_type = req.param("user_type");
	//var encpassword = hash(password, email);
	var StringQuery = "insert into DataSecService.user_records (email, fname, lname, password) " +
			"values( \'" + email+ 
			"\',\'" + fname + 
			"\',\'" + lname + 
			"\',\'" + password +
//			"\',\'" + groupid + 
//			"\',\'" + user_type + 
//			"\',\'" + encpassword +  
			"\');";
	console.log("StringQuery- " + StringQuery);
	mysql.fetchData(StringQuery, function(error, Results){
		if(error){
			throw error;
		}
		else{
			if(Results.affectedRows > 0){
			var StringQuery = "select email from DataSecService.user_records where email=\'" + email + "\'";
			console.log("query2- " + StringQuery);
			mysql.fetchData(StringQuery, function(error, Results){
					if(error){
						throw error;
					}
					else{
						if(Results.length > 0){
							var emailid = Results[0].email;
							req.session.email = emailid;
							var StringQuery = "insert into DataSecService.access_control (email_id) values (\'" + emailid + "\');";
							console.log("query3- " + StringQuery);
							mysql.fetchData(StringQuery, function(error, Results){
								if(error){
									throw error;
								}
								else{
									if(Results.affectedRows >0){
										req.session.email = emailid;
										var StringQuery = "insert into DataSecService.keyphrase (email_id) values (\'" + emailid + "\');";
										console.log("query4- " + StringQuery);
										mysql.fetchData(StringQuery, function(error, Results){
											if(error){
												throw error;
											}
											else{
												if(Results.affectedRows >0){
													req.session.email = emailid;
													var StringQuery = "insert into DataSecService.folder_mapping (emailid) values (\'" + emailid + "\');";
													console.log("query5- " + StringQuery);
													mysql.fetchData(StringQuery, function(error, Results){
														if(error){
															throw error;
														}
														else{
															if(Results.affectedRows >0){
																res.send({"signup":"success"});
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
					}
				});	

			}
		}
	});	
//exports.signUp = function (req, res)	
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
	
	var password = req.param("password");
	var email = req.param("email");
//	var newHash = hash(password, userName);
//	console.log("password- " + password);
//	console.log("email- " + email);
//	console.log("new hash"+newHash);
	var StringQuery= "select email, password from datasecservice.user_records where email =\'" + email+ "\';";
//	console.log("StringQuery- " + StringQuery);
	mysql.fetchData(StringQuery, function(error, results){
		if(error){
			throw error;
		}
		else{
			//console.log("results.password-" + results[0].password);
//			if(results[0].password == newHash){
			if(results[0].password == password)
			{
				//console.log("results.pwd-" + results[0].password);
				req.session.email = results[0].email;
				res.send({"user":"valid"});
			}
			else{
				res.send({"user":"invalid"});
			}
		}
	});
}


//module.exports = router;
//exports.signUp=signUp;
//exports.Signedup=Signedup;
//exports.signIn=signIn;