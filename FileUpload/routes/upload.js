var fs = require('fs');
var path = require('path');
var uid = require('uid2');
var mime = require('mime');

var mkdirp = require('mkdirp');
//var multiparty = require('multiparty');
var multer  = require('multer');

//var upload = multer({ dest: 'uploads/' })

var express = require('express');
var app = express();
var router = express.Router();

//Constants
//var TARGET_PATH = path.resolve(__dirname, '../writable/');

//var IMAGE_TARGET_PATH = path.resolve(__dirname, '../writable/images');

var IMAGE_TARGET_PATH = multer({ dest: '../writable/images' });

//var VIDEO_TARGET_PATH = path.resolve(__dirname, '../writable/videos');

var VIDEO_TARGET_PATH = multer({ dest: '../writable/videos' });

//var AUDIO_TARGET_PATH = path.resolve(__dirname, '../writable/audios');

var AUDIO_TARGET_PATH = multer({ dest: '../writable/audios' });

var FILE_TYPES = ['image/jpeg', 'image/png', 'audio/mpeg', 'audio/mp3', 'video/mp4'];

//var AUDIO_TYPES = [];
//var VIDEO_TYPES = [];

exports.fileUpload = function(req, res) {
    var is;
    var os;
    var folderPath;
    var targetPath;
    var targetName;
    //var tempPath = req.files.file.path;
    //get the mime type of the file
    var type = mime.lookup(req.files.file.path);
    //get the extenstion of the file
    var extension = req.files.file.path.split(/[. ]+/).pop();
      
    //get the file name of the uploaded file
    var fName = path.basename(req.files.file.path);
      
    var uniq_id = uid(10);

    //check to see if we support the file type
//    if (IMAGE_TYPES.indexOf(type) == -1) {
//      return res.send(415, 'Supported image formats: jpeg, jpg, jpe, png.');
//    }
//      
//    else if (AUDIO_TYPES.indexOf(type) == -1) {
//      return res.send(415, 'Supported audio formats: mp3');
//    }
//      
//    else if (VIDEO_TYPES.indexOf(type) == -1) {
//      return res.send(415, 'Supported video formats: mp4');
//    }
      
    if (FILE_TYPES.indexOf(type) === -1) {
      return res.send(415, 'Unsupported file type');
    }

    //create a new name for the image
    targetName = uniq_id + '.' + extension;
      
    console.log("file name - " + fName);
    console.log("type - " + type);
    console.log("tempPath - " + tempPath);
    console.log("targetName - " + targetName);
      
    //tempPath for rendering multimedia
    //tempPath1 = tempPath + '.' + extension;
      
    //console.log(tempPath);

    //determin the new path to save the image
    //targetPath = path.join(TARGET_PATH, targetName);
    switch(extension)
    {
        case 'png':
        case 'jpg':
        case 'jpeg':
            
            folderPath = path.join(IMAGE_TARGET_PATH, uniq_id);
            targetPath = path.join(IMAGE_TARGET_PATH, uniq_id, targetName);
//            
//            mkdirp(folderPath, function(err) { 
//                // path was created unless there was error
//                if (err) {
//                	console.error(err);
//                }
//                else {
//                	console.log('pow!');
//                }
//            });
        	
//        	app.use(multer({ dest: targetPath,
//        	    rename: function (fieldname, filename) {
//        	        return filename;
//        	    },
//        	    onFileUploadStart: function (file) {
//        	        console.log(file.originalname + ' is starting ...')
//        	    },
//        	    onFileUploadComplete: function (file) {
//        	        console.log(file.fieldname + ' uploaded to  ' + file.path)
//        	        //done=true;
//        	    }
//        	}));

            app.post(targetPath, IMAGE_TARGET_PATH.single(targetName), function(req, res, next){
            	
            });

            break;
        
        case 'mp3':
            folderPath = path.join(AUDIO_TARGET_PATH, uniq_id);
            targetPath = path.join(AUDIO_TARGET_PATH, uniq_id, targetName);
//            
//            mkdirp(folderPath, function(err) { 
//                // path was created unless there was error
//                if (err) {
//                	console.error(err);
//                }
//                else {
//                	console.log('pow!');
//                }
//            });
            
            app.use(multer({ dest: targetPath,
        	    rename: function (fieldname, filename) {
        	        return filename;
        	    },
        	    onFileUploadStart: function (file) {
        	        console.log(file.originalname + ' is starting ...');
        	    },
        	    onFileUploadComplete: function (file) {
        	        console.log(file.fieldname + ' uploaded to  ' + file.path);
        	        //done=true;
        	    }
        	}));
            break;
            
        case 'mp4':
            folderPath = path.join(VIDEO_TARGET_PATH, uniq_id);
            targetPath = path.join(VIDEO_TARGET_PATH, uniq_id, targetName);
//            
//            mkdirp(folderPath, function(err) { 
//                // path was created unless there was error
//                if (err) {
//                	console.error(err);
//                }
//                else {
//                	console.log('pow!');
//                }
//            });
            
            app.use(multer({ dest: targetPath,
        	    rename: function (fieldname, filename) {
        	        return filename;
        	    },
        	    onFileUploadStart: function (file) {
        	        console.log(file.originalname + ' is starting ...');
        	    },
        	    onFileUploadComplete: function (file) {
        	        console.log(file.fieldname + ' uploaded to  ' + file.path);
        	        //done=true;
        	    }
        	}));
            
            break;
        default:
            break;
                
    }

//    fs.readFile(req.files.file.path, function (err, data) {
//	  // ...
//	  //var newPath = __dirname + "/uploads/uploadedFileName";
//	  //fs.writeFile(newPath, data, function (err) {
//    	fs.writeFile(targetPath, data, function (err) {
//	    //res.redirect("back");
//	  });
//	});
/*
    //create a read stream in order to read the file
    is = fs.createReadStream(tempPath);

    //create a write stream in order to write the a new file
    os = fs.createWriteStream(targetPath);

    is.pipe(os);

    //handle error
    is.on('error', function(err) {
      if (err) {
        console.log("invalid- is.on - upload.js");
      }
    });

    //if we are done moving the file
    is.on('end', function() {

      //delete file from temp folder
      fs.unlink(tempPath, function(err) {
        if (err) {
          return res.send({"user":"invalid"});
        }
        else{
        	return res.send({"user":"valid"});
        }
*/
        //send something nice to user
//        if (IMAGE_TYPES.indexOf(type) != -1) {
//          res.render('image', {
//          name: targetName,
//          type: type,
//          extension: extension
//        });
//        }
//        
//        if (AUDIO_TYPES.indexOf(type) != -1) {
//          res.render('audio', {
//          name: targetName,
//          type: type,
//          extension: extension
//        });
//        }
//        
//        if (VIDEO_TYPES.indexOf(type) != -1) {
//          res.render('video', {
//          name: targetName,
//          type: type,
//          extension: extension
//        });
//        }
          
//          if (FILE_TYPES.indexOf(type) != -1) {
//          res.render('video', {
//          name: targetName,
//          type: type,
//          extension: extension
//        });
//        }
          
//        switch(FILE_TYPES.indexOf(type))
//        {
//            case 0,1:
//
//            res.render('image', {
//            name: targetName,
//            //name: tempPath1,
//            type: type,
//            extension: extension
//        });
//                break;
//            
//            case 2,3:
//
//            res.render('audio', {
//            name: targetName,
//            //name: tempPath1,
//            type: type,
//            extension: extension
//        });
//                break;
//            
//            case 4:
//
//            res.render('video', {
//            name: targetName,
//            //name: tempPath1,
//            type: type,
//            extension: extension
//                
//        });
//                break;
//            
//            default:
//                res.send('something else');
//                break;
//                
//        }
//      });//#end - unlink
//    });//#end - on.end
 }

exports.uploadFile = function(req, res){
	multer({dest: './writable/'}).single('file'), function(req, res){
		console.log(req.body); //form fields
		/* example output:
		{ title: 'abc' }
		 */
		console.log(req.file); //form files
		/* example output:
	            { fieldname: 'upl',
	              originalname: 'grumpy.png',
	              encoding: '7bit',
	              mimetype: 'image/png',
	              destination: './uploads/',
	              filename: '436ec561793aa4dc475a88e84776b1b9',
	              path: 'uploads/436ec561793aa4dc475a88e84776b1b9',
	              size: 277056 }
		 */
		res.status(204).end();
		res.redirect('/userdashboard');
	};
}
//module.exports=router;