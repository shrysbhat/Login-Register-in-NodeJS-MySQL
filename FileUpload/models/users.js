var mongoose = require('mongoose');

var fileSchema = new mongoose.Schema({
	fileName: { type : String, required : true },
	originalName : String,
	fileType: String,
	fileSize: Number,
	timeStamp: String,
	algorithm : String
});

var userSchema = new mongoose.Schema({
	fname : String,
	lname : String,
	user_type : String,
	groupid: String,
	email : {type: String, required: true, unique: true},
	password : {type: String, required: true},
	files: [fileSchema]
});

module.exports = mongoose.model('users', userSchema);