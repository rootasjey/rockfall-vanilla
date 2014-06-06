// --------------------
// ROCKFALL
// MAIN JAVASCRIPT FILE
// --------------------
// --------------------


// -----------------------------
// -----------------------------
// ------- REQUIRES ------------
// -----------------------------
var express = require('express'),  // web dev framework
	stylus = require('stylus'),	// css pre-compiler
	morgan = require('morgan'),	// loggin middleware
	nib = require('nib'),		  // Stylus utilities
    http = require('http'),
    path = require('path');

// var fs = require('fs');		// file stream

var bodyParser = require('body-parser');
var methodOverride = require('method-override');



// ----------------
// APP - CREATION
// ----------------
var app = express();
// ----------------
function compile(str, path) {
	return stylus(str)
		.set('filename', path)
		.use(nib());
};


// ---------------------------------------
// set the default views folder
// containing templates
// and the static folder
// ---------------------------------------
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');	// folder templates
app.set('view engine', 'jade');			// template engine
app.use(morgan('dev'));					// logging output (will log incoming requests to the console)
app.use(bodyParser());
app.use(methodOverride());
app.use(stylus.middleware({
	src: __dirname + '/public',
	compile: compile
}));
app.use(express.static(__dirname + '/public'));
// static folder containing css, img & others contents
// ---------------------------------------------------

app.get('/', function(req, res) {
	res.render('index', {title: 'Home'});
})

.use(function(req, res, next) {
	res.render('pages/404', {title: '404'});
});

// listen port => server start
// ---------------------------
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});




// PROTOTYPES
// ----------
String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};
