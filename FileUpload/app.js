var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');
//var ejs = require('ejs');

var routes = require('./routes/index');
var users = require('./routes/users');

var home = require('./routes/home');
var createUser = require('./routes/createUser');
var userdashboard = require('./routes/userdashboard');
//var upload = require('./routes/upload');

var app = express();

var server = http.createServer(app);


app.set('port', process.env.PORT || 8000);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
	secret:'phoenix',
		 resave: true,
		    saveUninitialized: true
}));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//app.post('/createUser/signIn', createUser.signIn);
//app.get('/aboutUs', home.aboutUs);
//app.get('/upload', home.upload);
//app.get('/userdashboard', userdashboard);

//app.get('/createUser/signUp', createUser.signUp);

server.listen(app.get('port'), function(){
	  console.log('Server listening on port ' + app.get('port') + '...');
	});

module.exports = app;
