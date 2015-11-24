var mongoose = require('mongoose');

var videoSchema = new mongoose.Schema({
	fileName: { type : String, required : true },
	originalName : String,
	fileType: String,
	fileSize: Number,
	timeStamp: String
});

module.exports = mongoose.model('videos', videoSchema);