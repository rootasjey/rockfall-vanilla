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
    Matchmaker = require('matchmaker'),
    tasks = require('tasks');



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


    //console.log("once");

    //players[idFirstPlayer].join("room-"+idFirstPlayer+"-"+idSecondPlayer);
    //players[idSecondPlayer].join("room-"+idFirstPlayer+"-"+idSecondPlayer);

    var retour = addParty(partyInProgress, idFirstPlayer, idSecondPlayer);

    players[idFirstPlayer].emit("majEtatPlayer",retour);
    players[idSecondPlayer].emit("majEtatPlayer",retour);


    //io.sockets.in("room-"+idFirstPlayer+"-"+idSecondPlayer).emit("majEtatPlayer",retour);

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

                    if(tableCheck.idPSReady && tableCheck.idPFReady && tableCheck.active && !tableCheck.start){


                        tableCheck.start = true;

                       /*var customTask = function(obj){
                            var t = 0;
                            for(var z=0;z<100;z++){
                                for(var i=0;i<1000000;i++){
                                    t+=i%2;
                                }
                            }
                        
                        
                    }*/
                        
                        i++;
                    }

                }

                                              
            }, 100);
        }

        StartParty();

}




function addParty(tableauP, idF, idS){

    var idParty = 0;
    var sizeX = 4;
    var sizeY = 6;
    var newElement = {};
    var plateau = createPlateau(sizeX,sizeY);

    if(tableauP.length == 0){

        newElement = {
                        'id':0,
                        'idPF':{'id':idF,'name':'idPF','score':0,'point':0,'idPower':"1-2-3"},
                        'currentPlayer':'idPF',
                        'idPS':{'id':idS,'name':'idPS','score':0,'point':0,'idPower':"1-2-3"},
                        'room':'room-'+idF+'-'+idS,
                        'active':true,
                        'idPFReady':false,
                        'idPSReady':false,
                        'start':false,
                        'plateau':plateau,
                        'pointAdd':{},
                        'nbreAction':1,
                        'nbreActionRealise':0,
                        'nbrePower':1,
                        'nbrePowerRealise':0,
                        'sizeX':sizeX,
                        'sizeY':sizeY,
                        'hitcombo':0,
                        'pieceGagnante':{}
                    };

        tableauP.push(newElement);

    }else{
        var noOld = false, i=0;

        while(i<tableauP.length && !noOld){

            if(!tableauP[i].active){
                newElement = {
                                'id':i,
                                'idPF':{'id':idF,'name':'idPF','score':0,'point':0,'idPower':"1-2-3"},
                                'idPS':{'id':idS,'name':'idPS','score':0,'point':0,'idPower':"1-2-3"},
                                'currentPlayer':'idPF',
                                'room':'room-'+idF+'-'+idS,
                                'active':true,
                                'pointAdd':{},
                                'idPFReady':false,
                                'idPSReady':false,
                                'start':false,
                                'plateau':plateau,
                                'nbreAction':1,
                                'nbreActionRealise':0,
                                'nbrePower':1,
                                'nbrePowerRealise':0,
                                'sizeX':sizeX,
                                'sizeY':sizeY,
                                'hitcombo':0,
                                'pieceGagnante':{}
                            };
                tableauP[i] = newElement;
                idParty = i;
                noOld = true;
            }
            i++;
        }

        if(!noOld){
            newElement = {
                            'id':(tableauP.length-1),
                            'idPF':{'id':idF,'name':'idPF','score':0,'point':0,'idPower':"1-2-3"},
                            'idPS':{'id':idS,'name':'idPS','score':0,'point':0,'idPower':"1-2-3"},
                            'currentPlayer':'idPF',
                            'room':'room-'+idF+'-'+idS,
                            'active':true,
                            'idPFReady':false,
                            'idPSReady':false,
                            'start':false,
                            'pointAdd':{},
                            'plateau':plateau,
                            'nbreAction':1,
                            'nbreActionRealise':0,
                            'nbrePower':1,
                            'nbrePowerRealise':0,
                            'sizeX':sizeX,
                            'sizeY':sizeY,
                            'hitcombo':0,
                            'pieceGagnante':{}
                        };
            tableauP.push(newElement);
        }
    }

    return newElement;

}

    
function StartParty(){
  //  ------------------------------------------------------------------
   if(checkClientParty == null){
            checkClientParty = setInterval(function(){

                var i=0;

                while(i<partyInProgress.length){

                    var tableCheck = partyInProgress[i];

                    if(tableCheck.start){
                        
                        tasks.addJob(customTask, tableCheck, function(result){
                            
                            console.log("rien a faire");
                        
                        });
                        
                        tableCheck.active = false;
                    }
                    i++;
                }

            }, 300);
        }

}


function applyPhysic(donneesATravailler){

    var plateau = donneesATravailler.plateau;
    var sizeX = donneesATravailler.sizeX;
    var sizeY = donneesATravailler.sizeY;
    
    
    var fini = false, finiSuite = false;
    
    //---------------------------Gravity-----------------------------
    
	for(var i = 0; i < sizeY; i++){

		for(var j = sizeX-1; j >= 0; j--){
            

            if(plateau[j][i].item != 0){
                var end = true;
                var k = j
                while(end){
                    if(k == sizeX-1){
                        end = false;
                    }else{
                        if(plateau[k+1][i].item == 0){

                            plateau[k+1][i].item = plateau[k][i].item;

                            plateau[k][i].item = 0;

                            fini =  true;
                            end = false;
                        }
                    }
                    k++;
                }
            }
        }
    }

    //-------------------------------Force----------------------
    if(!fini){

        for(var i = 0;i < sizeY;i++){

            for(var k = sizeX-1; k>=0 ;k--){

                if(plateau[k][i].item != 0){

                    var itemWheight = plateau[k][i].item.weight;

                    var somme = 0;
                    for(var j = k;j >=0;j--){

                        if(j-1 >= 0){

                            if(plateau[j-1][i].item != 0){

                                somme += plateau[j-1][i].item.weight;
                           }

                       }

                    }

                    if((itemWheight * 2) < somme ){

                        donneesATravailler.hitcombo += 1;
                        donneesATravailler.pointAdd = {'multiple':false,'point':plateau[k][i].item.weight * 2,'coordX':k,'coordY':i,'color':plateau[k][i].item.fill,'proprietaire':plateau[k][i].item.idProprietaire};
                        

                        if(plateau[k][i].item.idProprietaire == donneesATravailler.currentPlayer){
                            
                            donneesATravailler.pointAdd.point = parseInt(donneesATravailler.pointAdd.point *  (donneesATravailler.hitcombo/(donneesATravailler.hitcombo - 0.1 * donneesATravailler.hitcombo)));
                            
                        }
                        
                        if(plateau[k][i].item.idProprietaire == donneesATravailler.idPF.id){
                            donneesATravailler.score.idPF += donneesATravailler.pointAdd.point; 
                        }else if(plateau[k][i].item.idProprietaire == donneesATravailler.idPS.id){
                            donneesATravailler.score.idPS += donneesATravailler.pointAdd.point; 

                        }

                        
                        plateau[k][i].item = 0;
                        finiSuite = true;
                    }
                }
            }

        }
    }

    
    //-----------------------------Connect Four Search-------------------------------------
    
    if(!fini && !finiSuite){
        
         var pointWin = findFour(donneesATravailler);
        if(pointWin.find){
            
            donneesATravailler.pieceGagnante = pointWin;
        }
    }
    
    return donneesATravailler;
    
}

    

function verificationD(donneesATravailler,x,y){


    var diagonal = new Array();
    var plateau = donneesATravailler.plateau;
    var find = false;
    
    if(plateau[x][y].item != 0){
        var id = plateau[x][y].item.idProprietaire;
        var compt = 1;
        var i = 1, j = 1 ;
        diagonal.push({"x":x,"y":y,"point":plateau[x][y].item.weight,"color":plateau[x][y].item.fill});

        while(x-i >= 0 && y+j < donneesATravailler.sizeY && !find){

            if(plateau[x-i][y+j] != 0 && id == plateau[x-i][y+j].item.idProprietaire){
                compt++;
                diagonal.push({"x":x-i,"y":y+j,"point":plateau[x-i][y+j].item.weight, "color":plateau[x-i][y+j].item.fill});

                if(compt>=4){
                    find = true;
                }
            }else if(plateau[x-i][y+j].item != 0){
                id = plateau[x-i][y+j].item.idProprietaire;
                diagonal = new Array();
                diagonal.push({"x":x-i,"y":y+j,"point":plateau[x-i][y+j].item.weight, "color":plateau[x-i][y+j].item.fill});
                compt = 1;
            }else{
                id =-1;
                compt = 1;
                diagonal = new Array();
            }

            i++;
            j++;

        }

        if(!find){
            id = plateau[x][y].item.idProprietaire;
            diagonal = new Array();
            diagonal.push({"x":x,"y":y,"point":plateau[x][y].item.weight, "color":plateau[x][y].item.fill});
            i = 1;
            j = 1;
            compt = 1;
            while(x+i < donneesATravailler.sizeX && y+j < donneesATravailler.sizeY && !find){

                if(plateau[x+i][y+j] != 0 && id == plateau[x+i][y+j].item.idProprietaire){
                    diagonal.push({"x":x+i,"y":y+j,"point":plateau[x+i][y+j].item.weight, "color":plateau[x+i][y+j].item.fill});
                    compt++;

                    if(compt>=4){
                        find = true;
                    }
                }else if(plateau[x+i][y+j].item != 0){
                    id = plateau[x+i][y+j].item.idProprietaire;
                    diagonal = new Array();
                    diagonal.push({"x":x+i,"y":y+j,"point":plateau[x+i][y+j].item.weight,"color":plateau[x+i][y+j].item.fill});
                    compt = 1;
                }else{
                    id = -1;
                    compt = 1;
                    diagonal = new Array();
                }


                i++;
                j++;

            }
        }
    }
    return {"find":find,"case":diagonal,"id":id};
}



/* Verification si un joueur à gagner un point en alignant 4 pieces */
function findFour(donneesATravailler){

    var plateau = donneesATravailler.plateau;
    
    var i = 0,j=0;
    find = false;
    var id = -1;
    var compt = 0;
    var sommePoint = 0;
    var aligner = new Array();

    /* verification horizontale */
    while(i < donneesATravailler.sizeX && !find){

        compt = 0;
        var j = 0;

        while(j < plateau.sizeY && compt < 4){

            if(plateau[i][j].item != 0){
                if(plateau[i][j].item.idProprietaire == id){
                    compt++;
                    aligner.push({"x":i,"y":j,"point":plateau[i][j].item.weight, "color":plateau[i][j].item.fill});
                }else{
                    aligner = new Array();
                    aligner.push({"x":i,"y":j,"point":plateau[i][j].item.weight,"color":plateau[i][j].item.fill});
                    compt = 1;
                    id = plateau[i][j].item.idProprietaire;
                }
            }else{
                id = -1;
                aligner = new Array();
                compt = 1;
            }
            j++;


            if(compt >= 4){

                find = true;
                sommePoint = 0;
                for(var k = 0;k<aligner.length;k++){
                    sommePoint += plateau[aligner[k].x][aligner[k].y].item.weight;
                    sommePoint += plateau[aligner[k].x][aligner[k].y].item.weight;
                }
            }
        }
        i++;
    }

   /* verification verticale */
   if(!find){

        i = 0;
         while(i < donneesATravailler.sizeY && !find){

            compt = 0;
            j = 0;

            while(j < donneesATravailler.sizeX && compt < 4){

                if(plateau[j][i].item != 0){

                    if(plateau[j][i].item.idProprietaire == id){
                        aligner.push({"x":j,"y":i,"point":plateau[j][i].item.weight,"color":plateau[j][i].item.fill});
                        compt++;
                    }else{
                        aligner = new Array();
                        aligner.push({"x":j,"y":i,"point":plateau[j][i].item.weight, "color": plateau[j][i].item.fill});
                        compt = 1;
                        id = plateau[j][i].item.idProprietaire;
                    }
                }else{
                    aligner = new Array();
                    id = -1;
                    compt = 1;
                }
                j++;

                if(compt >= 4){

                    find = true;
                    sommePoint = 0;
                    for(var k = 0;k<aligner.length;k++){
                        sommePoint += plateau[aligner[k].x][aligner[k].y].item.weight;
                    }
                }
            }
            i++;
        }
   }

    /* verification diagonale */
    if(!find){
        i = 0;
         while(i < donneesATravailler.sizeX && !find){

             j = 0;

            while(j < donneesATravailler.sizeY && !find){

                    if(plateau[i][j].item != 0){
                        var test = verificationD(donneesATravailler,i,j);

                        if(test.find){

                            find = true;
                            id = test.id;
                            sommePoint = 0;
                            for(var k = 0;k<test.case.length;k++){
                                sommePoint += plateau[test.case[k].x][test.case[k].y].item.weight;
                            }
                            aligner = test.case;
                        }
                    }
                    j++;
                }
            i++;
        }
    }


   

    return {"find":find,"id":id,"box":aligner,"point":sommePoint};
}
    

function traitementPointWin(donneesLocales,tamponPieceWin){
    
    donneesLocales.hitcombo += 4;
    
    var newPointAdd = new Array();
    
    for(var i ;i< tamponPieceWin.box.length;i++){
        
        newPointAdd.push({
                            'point':tamponPieceWin.box[i].point * 2,
                            'coordX':tamponPieceWin.box[i].x,
                            'coordY':tamponPieceWin.box[i].y
                        });
    }
                         
    donneesLocales.pointAdd = {
                                'multiple':true,
                                'point':newPointAdd, 
                                'color':tamponPieceWin.box[0].color, 
                                'proprietaire':tamponPieceWin.id
        
                                };
    

    if(tamponPieceWin.id == donneesLocales.idPF.id){
        donneesLocales.idPF.score += parseInt(tamponPieceWin.point *  (donneesLocales.hitcombo/(donneesLocales.hitcombo - 0.1 * donneesLocales.hitcombo))); 
    }else if(tamponPieceWin.id == donneesLocales.idPS.id){
        donneesLocales.idPS.score += parseInt(tamponPieceWin.point *  (donneesLocales.hitcombo/(donneesLocales.hitcombo - 0.1 * donneesLocales.hitcombo))); 
    }


    for(var i ;i< tamponPieceWin.box.length;i++){
        
        donneesLocales.plateau[tamponPieceWin.box[i].x][tamponPieceWin.box[i].y].item = 0; 
    }
    
    return donneesLocales;
}
    
    
function addItemtoPlateau (donneesLocales,x,y,item){
    
    var success = false;
    if(donneesLocales.plateau[x][y] == 0 && donneesLocales.nbreActionRealise < donneesLocales.nbreAction){
        
        donneesLocales.plateau[x][y] = item;
        donneesLocales.nbreActionRealise += 1;
        success = true;
    }
    
    return success
}

    
function executeBonus(donneesLocales,x,y,bonusChoice){
    
    var success = false;
    var player = null;
    
    if(donneesLocales.currentPlayer == donneesLocales.idPF.name){
        player = donneesLocales.idPF; 
    }else if(donneesLocales.currentPlayer == donneesLocales.idPS.name){
        player = donneesLocales.idPS;  
    }
    
    if(donneesLocales.plateau[x][y] != 0 && donneesLocales.nbrePowerRealise < donneesLocales.nbrePower){

    
        switch(bonusChoice.id){
            
            case 1: if( bonusChoice.price <= player.score){
                        donneesLocales.plateau[x][y].item.weight = donneesLocales.plateau[x][y].item.weight * 2;
                        donneesLocales.nbrePowerRealise += 1;
                        success = true;
                    }
                    break;
                
            case 2: if( bonusChoice.price <= player.score){
                        donneesLocales.plateau[x][y].item.idProprietaire = -1;
                        donneesLocales.nbrePowerRealise += 1;
                        success = true;
                    }  
                    break;
                
            case 3: if( bonusChoice.price <= player.score){
                        donneesLocales.plateau[x][y].item.weight = parseInt(donneesLocales.plateau[x][y].item.weight / 2);
                        donneesLocales.nbrePowerRealise += 1;
                        success = true;
                    }
                    break;
                
            default:success = false;
        }
        
    }
    
    return success
}
    
    
var customTask = function(donneesDePartie){
        
        
        

        var finDeParty = null;
        var donneesLocales = donneesDePartie;


        var party = io.of(donneesLocales.room);

        party.on('connection', function(socket){
            
          console.log('someone connected');
          
            socket.on('changeTour',function(){
                //changeTurn(donneesLocales);
                console.log("changeTour  de la room : "+donneesLocales.room);
            });
            
            socket.on('addPiece',function(objet){
                //addItemtoPlateau (donneesLocales,objet.x,objet.y,objet.item);
                console.log("addPiece  de la room : "+donneesLocales.room);
            });
            
            socket.on('addEffet',function(objet){
                //executeBonus(donneesLocales,objet.x,objet.y,objet.bonusChoice);
                console.log("addEffet  de la room : "+donneesLocales.room);
            });
            
        });

        players[donneesLocales.idPF].join(donneesLocales.room);
        players[donneesLocales.idPS].join(donneesLocales.room);


        var tamponWin = false;
        var temponWinSec = 0;
        
        var tamponPieceWin = {};
        var intervalTempo = 300;
    
        finDeParty = setInterval(function(){
            
            if(!tamponWin){
                donneesLocales = applyPhysic(donneesLocales);
            }else{
                temponWinSec += intervalTempo;
            }
            
            if(donneesLocales.pieceGagnante.find){
                tamponWin = true;
                tamponPieceWin = donneesLocales.pieceGagnante;
            }
                
            party.emit('MiseAJour',donneesLocales);
            
            if( tamponWin && temponWinSec > intervalTempo * 6 ){
                donneesLocales = traitementPointWin(donneesLocales,tamponPieceWin);
                tamponWin = false;
                temponWinSec = 0;
            }
            
            clearDonnees(donneesLocales);
            
        }, intervalTempo);
    

        //party.emit('MiseAJour',donneesDePartie);


        //players[donneesDePartie.idPF].join(donneesDePartie.room);
        //players[donneesDePartie.idPS].join(donneesDePartie.room);
}


function clearDonnees(donnees){
    
    donnees.pointAdd = {};
    /*
        'id':(tableauP.length-1),
        'idPF':{'id':idF,'name':'idPF','score':0,'point':0,'idPower':"1-2-3"},
        'idPS':{'id':idS,'name':'idPS','score':0,'point':0,'idPower':"1-2-3"},
        'currentPlayer':'idPF',
        'room':'room-'+idF+'-'+idS,
        'active':true,
        'idPFReady':false,
        'idPSReady':false,
        'start':false,
        'pointAdd':{},
        'plateau':plateau,
        'nbreAction':1,
        'nbreActionRealise':0,
        'nbrePower':1,
        'nbrePowerRealise':0,
        'sizeX':sizeX,
        'sizeY':sizeY,
        'hitcombo':0,
        'pieceGagnante':{}
        
    */
}


function changeTurn(donnees){
    
    if(donnees.currentPlayer == donnees.idPF.name){
        
        donnees.currentPlayer = donnees.idPS.name;
        
    }else if(donnees.currentPlayer == donnees.idPS.name){
        
        donnees.currentPlayer = donnees.idPF.name;
        
    }
    
    donnees.hitcombo = 0;
    donnees.nbreActionRealise = 0;
    donnees.nbrePowerRealise = 0;
}
    
    
function checkTurn(tableauDeDonnees){



/*La fonction gravity permet d'appliquer une certaine gravité aux pièces du plateau */
/*
    fini = false;
    var plateau = tableauDeDonnees.plateau;
    var sizeX = tableauDeDonnees.sizeX;
    var sizeY = tableauDeDonnees.sizeY;


	for(var i = 0;i < sizeY;i++){

		for(var j = sizeX-1;j >= 0;j--){

            if(this.plateau[j][i] != 0){
               /* var end = true;
                var k = j
                while(end){
                    if(k == this.sizeX-1){
                        end = false;
                    }else{
                        if(this.matrice[k+1][i] == 0){

                            this.matrice[k+1][i] = this.matrice[k][i];
                            var objet = this.search(k+1,i);
                            if(objet != null){
                                this.matrice[k+1][i].x = objet.x-(objet.width/2);
                                this.matrice[k+1][i].y = objet.y-(objet.height/4.5);
                            }
                            this.matrice[k][i]= 0;
                            fini =  true;
                            end = false;
                        }
                    }
                    k++;
                }*/
          /*  }
        }

	}
    if(fini == false && this.justAdd == true){
        fini = true;
    }
    this.justAdd = false;
    return fini;
*/
}

function createPlateau(nbrePieceHori,nbrePieceVerti){

    var plateau = new Array();

    for(var i = 0 ;i<nbrePieceVerti;i++){

        var ligne = new Array();

        for(var j = 0;j<nbrePieceHori;j++){

            ligne.push({
                            "item":0
                        });
        }

        plateau.push(ligne);

    }


    return plateau;
}


var players = {};
var user = {};
var time_disc = {};
var matchList = {};

var tamponCheckTabParty = null;
var checkClientParty = null;


var partyInProgress = new Array();


var partyAdvance = new Array();

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

        var info = partyInProgress[majInfo.idParty];
        console.log(majInfo);
        console.log(partyInProgress);
        if(majInfo.idPlayer == info.idPF){
            partyInProgress[majInfo.idParty].idPFReady = true;
            console.log("first player ready l.268");
        }else if(majInfo.idPlayer == info.idPS){
            partyInProgress[majInfo.idParty].idPSReady = true;
            console.log("second player ready l.271");
        }

        //console.log(majInfo);
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
