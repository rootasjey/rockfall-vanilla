// -----------------------------
// SERVER.JS (ROCKFALL)
// -----------------------------
// This file contains
// the server's logic
// -----------------------------
// -----------------------------


// -----------------------------
// -----------------------------
// ------- REQUIRES ------------
// -----------------------------
var express = require('express'),  // web dev framework
	stylus = require('stylus'),	// css pre-compiler
	morgan = require('morgan'),	// loggin middleware
	nib = require('nib'),		  // Stylus utilities
    http = require('http'),
    path = require('path'),
    Matchmaker = require('matchmaker');
    //io = require('socket.io').listen(8080);

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
app.set('port', process.env.PORT || 8080);
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


// ---------------
// DATABASE: AZURE
// ---------------
var azure = require('azure-storage');
var nconf = require('nconf');
var uuid = require('node-uuid');
var entGen = azure.TableUtilities.entityGenerator;
// -----------------------------
// -----------------------------
// configuration for local developpement
// -----------------------------
nconf.env()
     .file({ file: './public/database/config.json'});
var tableName = nconf.get("TABLE_NAME");
var partitionKey = nconf.get("PARTITION_KEY");
var accountName = nconf.get("STORAGE_NAME");
var accountKey = nconf.get("STORAGE_KEY");
// -----------------------------
// -----------------------------
// An object (Table) for table access storage
// -----------------------------
var Table = require('./public/database/table');
// var usersTable = new Table(azure.createTableService(accountName, accountKey), tableName, partitionKey);


app.get('/', function(req, res) {
	res.render('index', {title: 'Home'});
})

.get('/new', function (req, res) {
	// new design
	res.render('index2', {title: 'Home'});
})
.post('/login/', function (req, res) {
	// get variables from the form
	var user 	= req.param('user');
	var password= req.param('password');

	// escape special chars
	user 		= escape(user);
	password 	= escape(password);


	var query = new azure.TableQuery()
		.select()
		.where('user eq ?', user);

	usersTable.storageClient.queryEntities('users', query, null, function (error, result, response) {
		if(!error) {
			// result contains an array of result
			// check if password is correct
			if(result.entries.length > 0) {
				// get the user password
				var pass = result.entries[0].password['_'];

				// verify the validity of the password entered
				if(pass === password) {
					// login success!
					// console.log('login success');
					var user = {};
					user.name = result.entries[0].user['_'];
					user.pass = result.entries[0].password['_'];
					user.email = result.entries[0].email['_'];
					user.color1 = result.entries[0].color1['_'];
					user.color2 = result.entries[0].color2['_'];

					res.send(200, user);
				}
				else res.send(401, 'wrong password');
			}
		}
		else res.send(404, 'wrong login');
	});
})

.post('/signup/', function (req, res) {
	// get variables from the form
	var user 	= req.param('user');
	var password= req.param('password');
	var email 	= req.param('email');
	var color1	= req.param('color1');
	var color2	= req.param('color2');

	// escape special chars
	user 		= escape(user);
	password 	= escape(password);
	email		= escape(email);


	// console.log(user + ' ' + password + ' ' + email + ' ' + color1 + ' ' + color2);

	// Test if the username and/or email isn't already in use in the database
	// -----------
	var queryUsername = new azure.TableQuery()
		.select()
		.where('user eq ?', user);
	var queryEmail = new azure.TableQuery()
		.select()
		.where('email eq ?', email);

	usersTable.storageClient.queryEntities('users', queryUsername, null, function (error, result, response) {
		if(!error) {
			console.log(result);
			if(result.entries.length > 1) res.send(401, 'username');
		}
		else res.send(404, 'error');
	});

	usersTable.storageClient.queryEntities('users', queryEmail, null, function (error, result, response) {
		if(!error) {
			console.log(result);
			if(result.entries.length > 1) res.send(401, 'email');
		}
		else res.send(404, 'error');
	});

	// Insert a new user
	// -----------------
	// Create the query
	var task = {
		PartitionKey: entGen.String('game')
		, RowKey 	: entGen.String(uuid())
		, user 		: entGen.String(user)
		, password  : entGen.String(password)
		, email 	: entGen.String(email)
		, color1 	: entGen.String(color1)
		, color2 	: entGen.String(color2)
	};

	// Add a new entity
	usersTable.storageClient.insertOrReplaceEntity(
		"users"
		, task
		, function (error, result, response) {
			if(!error) {
				// Success : Entity inserted
				res.send(200);
			}
			else res.send(404); // error
	});
})

.use(function(req, res, next) {
	res.render('pages/404', {title: '404'});
});

// listen port => server start
// ---------------------------
var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

//socket

var players = {};
var user = {};
var time_disc = {};

var tamponSetInter = null;

var io = require('socket.io').listen(server);

var hs = null;

io.sockets.on('connection', function (socket) {

    hs = socket.handshake;
    //users[hs.session.username] = socket.id; 
    //players[socket.id] = socket; 
  
    socket.on('disconnect', function () {
        delete user[hs.session.username]; 
        delete players[socket.id]; 
        delete time_disc[hs.session.username];
        //delete users[hs.session.username];
    });
    
    socket.on('newUser', function (username) {
        
        hs.session.username = username;
        players[socket.id] = socket;
        user[hs.session.username] = socket.id; 
        time_disc[hs.session.username] = new Date().getTime(); 
        players[socket.id].emit('startSync');
        io.sockets.emit('newListe',players);
    });
    
    socket.on('Sync',function(){
      time_disc[hs.session.username] = new Date().getTime(); 
    });
    
    if(tamponSetInter == null){
        tamponSetInter = setInterval(function(){
            verificationConn();
        }, 10000);
    }
});


    
function verificationConn(){
    /* for(var i in time_disc){
         if(time_disc[i]+30000>(new Date().getTime())){
            delete players[user[i]];
            delete user[i];  
            delete time_disc[i];
             
            io.sockets.emit('newListe',players);
         }
     }
    return;*/
 }

// MATCHMAKING
/*
var mymatch = new Matchmaker;

mymatch.policy = function(a,b) {
    return 100
};

mymatch.on('match', function(result) {
    console.log(result.a); // match a
    console.log(result.b); // match b
});

mymatch.start();
*/
//mymatch.push({user:'walter',rank:1450});
