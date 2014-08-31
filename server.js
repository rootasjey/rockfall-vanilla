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



var fs = require('fs');		// file stream
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


// -------------------
// DATABASE: AZURE
// -------------------
var azure = require('azure-storage');
var nconf = require('nconf');
var uuid = require('node-uuid');
var entGen = azure.TableUtilities.entityGenerator;
// ----------------------------------------
// ----------------------------------------
// configuration for local developpement
// ----------------------------------------
nconf.env()
     .file({ file: './public/database/config.json'});
var tableName = nconf.get("TABLE_NAME");
var partitionKey = nconf.get("PARTITION_KEY");
var accountName = nconf.get("STORAGE_NAME");
var accountKey = nconf.get("STORAGE_KEY");
// --------------------------------------------
// --------------------------------------------
// An object (Table) for table access storage
// --------------------------------------------
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

.get('/helpmanual/', function (req, res) {
	var jsonArray = [];
	var path = __dirname + '/public/docs/help.json';

	// open file
	fs.readFile(path, function (err, data) {
		if (err) res.send(404);

		// parse the data as json
		var content = JSON.parse(data);
		jsonArray.push(content);

		res.json(200, jsonArray);
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


// MATCHMAKING

var mymatch = new Matchmaker;

mymatch.policy = function(a,b) {
    return 100
};

mymatch.on('match', function(result) {
    console.log(result);
    askMatching(result.a.socketId,result.b.socketId);
    /*console.log(result.a); // match a
    console.log(result.b); // match b*/
});

mymatch.start();

//mymatch.push({user:'walter',rank:1450});

function askMatching(idFirstPlayer, idSecondPlayer){
    
    
    console.log("once");
    
    players[idFirstPlayer].join("room-"+idFirstPlayer+"-"+idSecondPlayer);
    players[idSecondPlayer].join("room-"+idFirstPlayer+"-"+idSecondPlayer);
    
    var retour = addParty(partyInProgress, idFirstPlayer, idSecondPlayer);
    
    io.sockets.in("room-"+idFirstPlayer+"-"+idSecondPlayer).emit("majEtatPlayer",retour);
    
    //players[idFirstPlayer].leave("multiJoueur");
    //players[idSecondPlayer].leave("multiJoueur");
    
    /*io.sockets.on('etatPlayersOk', function (majInfo) {
        
        var info = partyInProgress[majInfo.idParty];
        console.log(majInfo);
        console.log(info);
        if(majInfo.idPlayer == info.idPF){
            partyInProgress[majInfo.idParty].idPFReady = true;
            console.log("first player ready l.268");
        }else if(majInfo.idPlayer == info.idPS){
            partyInProgress[majInfo.idParty].idPSReady = true;
            console.log("second player ready l.271");
        }
        
    });*/
    
   /* 
    var tabPlayer = {};
    tabPlayer[idFirstPlayer] = {"etat":"attente","nom":"Players1"}; 
    tabPlayer[idSecondPlayer] = {"etat":"attente","nom":"Players2"}; 
    
    
    players[idFirstPlayer].join("room-"+idFirstPlayer+"-"+idSecondPlayer);
   
    players[idSecondPlayer].join("room-"+idFirstPlayer+"-"+idSecondPlayer);
    
    console.log(" id est a la romm  :  "+"room-"+idFirstPlayer+"-"+idSecondPlayer);
    */
    //io.of("room-"+idFirstPlayer+"-"+idSecondPlayer).on('connection', function (socket) {
        
       
/*
        io.of("room-"+idFirstPlayer+"-"+idSecondPlayer).on("etatPlayersOk",function(){

            tabPlayer[socket.id].etat = "pret";
            if(tabPlayer[idFirstPlayer].etat == "pret" && tabPlayer[idSecondPlayer].etat == "pret")             {
                nomDeLaFonctionPourDemarrerLeJeu(tabPlayer,idFirstPlayer,idSecondPlayer);
            }else{
                io.of("room-"+idFirstPlayer+"-"+idSecondPlayer).emit('majEtatPlayer',tabPlayer);  
            }
            
        });
        
        io.of("room-"+idFirstPlayer+"-"+idSecondPlayer).on("etatPlayersNo",function(){
            
            io.of("room-"+idFirstPlayer+"-"+idSecondPlayer).emit('cancel');
        });
        */
        //console.log("a la room "+"room-"+idFirstPlayer+"-"+idSecondPlayer);
        //io.sockets.in("room-"+idFirstPlayer+"-"+idSecondPlayer).emit("majEtatPlayer");
        //console.log("fini room");
   // });
        if(tamponCheckTabParty == null){
            tamponCheckTabParty = setInterval(function(){

                var i=0;

                while(i<partyInProgress.length){

                    var tableCheck = partyInProgress[i];     

                    if(tableCheck.idPSReady && tableCheck.idPFReady && tableCheck.active){

                        console.log("ON EST ARRIVE ENFIN ICI");
                    }
                    i++;
                }

            }, 100);
        }
    
}




function addParty(tableauP, idF, idS){
    
    idParty = 0;
    
    if(tableauP.length == 0){
        
        tableauP.push({'id':0,'idPF':idF,'idPS':idS,'room':'room-'+idF+'-'+idS,'active':true,'idPFReady':false,'idPSReady':false});
        
    }else{
        var noOld = false, i=0;
        
        while(i<tableauP.length && !noOld){
            
            if(!tableauP[i].active){
                tableauP[i] = {'id':i,'idPF':idF,'idPS':idS,'room':'room-'+idF+'-'+idS,'active':true,'idPFReady':false,'idPSReady':false};
                idParty = i;
                noOld = true;
            }
            i++;
        }
        
        if(!noOld){
            tableauP.push({'id':tableauP.length,'idPF':idF,'idPS':idS,'room':'room-'+idF+'-'+idS,'active':true,'idPFReady':false,'idPSReady':false});
        }
    }
    
    return {'id':tableauP.length,'idPF':idF,'idPS':idS,'room':'room-'+idF+'-'+idS,'active':true,'idPFReady':false,'idPSReady':false};
     
}
//socket

function nomDeLaFonctionPourDemarrerLeJeu(tabPlayer,idFirstPlayer,idSecondPlayer){
    
    console.log("pret "+idFirstPlayer+" vs "+idSecondPlayer);
    
}

var players = {};
var user = {};
var time_disc = {};
var matchList = {};

var tamponCheckTabParty = null;


var partyInProgress = new Array();


var tamponSetInter = null;

//var io = require('socket.io').listen(server);

//var hs = null;

//io.sockets.on('connection', function (socket) {
/*
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
});*/

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
	console.log('Fun client est connecté');
    socket.join('multiJoueur')
    socket.on('newUser', function (username) {
        if(typeof(players[socket.id]) == "undefined"){
            console.log("detected newUser");
            socket.username = username;
            players[socket.id] = socket;
            user[socket.username] = socket.id; 
            time_disc[socket.username] = new Date().getTime(); 
            players[socket.id].emit('startSync',socket.id);
            //socket.of('/multiJoueur').emit('newListe',user);
            io.sockets.in("multiJoueur").emit('newListe',user);
        }else{
            if(typeof(matchList[socket.id]) == "undefined"){
                console.log("rejoind le matchmaking");
                matchList[socket.id] = true;
                mymatch.push({user:socket.username,socketId:socket.id});
            }
        }
    });
    
    
    socket.on('Sync',function(){
      time_disc[socket.username] = new Date().getTime(); 
    });
    
    if(tamponSetInter == null){
        tamponSetInter = setInterval(function(){
            verificationConn();
        }, 10000);
    }
    
    
    socket.on('etatPlayersOk', function (majInfo) {
        /*
        var info = partyInProgress[majInfo.idParty];
        console.log(majInfo);
        console.log(info);
        if(majInfo.idPlayer == info.idPF){
            partyInProgress[majInfo.idParty].idPFReady = true;
            console.log("first player ready l.268");
        }else if(majInfo.idPlayer == info.idPS){
            partyInProgress[majInfo.idParty].idPSReady = true;
            console.log("second player ready l.271");
        }
        */
        console.log(majInfo);
    });
});





    
function verificationConn(){
     for(var i in time_disc){
         console.log(i+"    "+time_disc[i]);
         if(time_disc[i]+30000<(new Date().getTime())){
            delete players[user[i]];
            delete user[i];
            delete time_disc[i];
            
            io.sockets.in("multiJoueur").emit('newListe',user);
         }
     }
 }


