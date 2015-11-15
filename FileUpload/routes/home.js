var mysql = require("./mysql");
var ejs = require("ejs");

function aboutUs(req, res)
{
	ejs.renderFile('./views/aboutUs.ejs',function(err, result) {
        // render on success
        if (!err) {

            res.end(result);
        }
        // render or error
        else {
        	
        	res.send('An error occurred');
            console.log(err);
        }
    });
}

function upload(req, res)
{
	ejs.renderFile('./views/upload.ejs',function(err, result) {
        // render on success
        if (!err) {

            res.end(result);
        }
        // render or error
        else {
        	
        	res.send('An error occurred');
            console.log(err);
        }
    });
}

function register(req, res)
{
	ejs.renderFile('./views/register.ejs',function(err, result) {
        // render on success
        if (!err) {

            res.end(result);
        }
        // render or error
        else {
        	
        	res.send('An error occurred in register.ejs');
            console.log(err);
        }
    });	
}

exports.aboutUs = aboutUs;
exports.upload = upload;
exports.register = register;