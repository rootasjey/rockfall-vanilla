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
app.set('port', process.env.PORT);
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

// Variable spécifiant le chemin relatif du serveur
var addressServer = "localhost";

app.get('/', function(req, res) {
	if (addressServer.indexOf("::") != -1) {
		// Variable redéfinissant le chemin relatif du serveur sous io.js
		// var fullUrl = req.protocol + "://" + req.get('host') + req.originalUrl;
		addressServer = req.get('host');
	}

	res.render('index', {title: 'Home'});
})

.get('/getPort', function (req, res) {

	var jsonArray = [];

	jsonArray.push(JSON.parse('{port:'+process.env.PORT+'}'));

	res.json(200, jsonArray);
	//res.send();
})
.post('/login/', function (req, res) {
	// get variables from the form
	var user 	= req.param('login');
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
					user.rock = result.entries[0].rock['_'];
					user.credit = result.entries[0].credit['_'];

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
	var user 	= req.param('login');
	var password= req.param('password');
	var email 	= req.param('email');
	var rock	= 'default';
    var credit  = 0;

	// escape special chars
	user 		= escape(user);
	password 	= escape(password);
	email		= escape(email);


	// console.log(user + ' ' + password + ' ' + email + ' ' + color1 + ' ' + color2);

	// Test if the username and/or email isn't already in use in the database
	var queryUsername = new azure.TableQuery()
		.select()
		.where('user eq ?', user);
	var queryEmail = new azure.TableQuery()
		.select()
		.where('email eq ?', email);

	usersTable.storageClient.queryEntities('users', queryUsername, null, function (error, result, response) {
		if(!error) {
			// console.log(result);
			if(result.entries.length > 1) res.send(401, 'username : the username already exists');
		}
		else res.send(404, 'error');
	});

	usersTable.storageClient.queryEntities('users', queryEmail, null, function (error, result, response) {
		if(!error) {
			// console.log(result);
			if(result.entries.length > 1) res.send(401, 'email : the email already exists');
		}
		else res.send(404, 'error');
	});

	// Insert a new user (create the query)
	var tesk = {
		PartitionKey: entGen.String('game')
		, RowKey 	: entGen.String(uuid())
		, user 		: entGen.String(user)
		, password  : entGen.String(password)
		, email 	: entGen.String(email)
        , credit    : entGen.String(credit)
        , rock      : entGen.String(rock)
	};

	// Add a new entity
	usersTable.storageClient.insertOrReplaceEntity(
		"users"
		, tesk
		, function (error, result, response) {
			if(!error) {
				// Success : Entity inserted
                // Create a user object to send
                var userResult = {
                    "name"      : user
                    ,"pass"     : password
                    ,"email"    : email
                    ,"rock"     : rock
                    ,"credit"   : credit
                };

				res.send(200, userResult);
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
    if(server.address().address != "0.0.0.0"){
        addressServer = server.address().address + ":" + app.get('port');
    }else{
        addressServer += ":"+app.get('port');
    }
    console.log("En attente de connexion sur le port :" + app.get('port'));
});

var Tableau_Joueur = require('./public/gameCommun/js/playerArray.js');

var mymatch = new Matchmaker;

mymatch.policy = function(a,b) {
    return 100
};

mymatch.on('match', function(result) {
    new askMatching(result.a,result.b);
});

mymatch.start();

var justAdd = [];
var wantToTurn = [];


/* Fonction qui permet d'initier une partie entre 2 joueurs */
function askMatching(joueurUn, joueurDeux){

    var idJoueurUn = joueurUn.id;
    var idJoueurDeux = joueurDeux.id;

    this.party = addParty(partyInProgress, joueurUn, joueurDeux);
    justAdd[this.party.id] = false;
    wantToTurn[this.party.id] = false;

    if(lobby_server.getJoueurById(idJoueurUn) != null && lobby_server.getJoueurById(idJoueurDeux) != null){

        if(!lobby_server.isBientotHorsConnexion(lobby_server.getJoueurById(idJoueurUn)) && !lobby_server.isBientotHorsConnexion(lobby_server.getJoueurById(idJoueurDeux))){

            tableauJeu.ajout(lobby_server.supprimer(idJoueurUn));
            tableauJeu.ajout(lobby_server.supprimer(idJoueurDeux));
            tableauJeu.getJoueurById(idJoueurUn).socket.emit("majJoueurStatusParty",this.party);
            tableauJeu.getJoueurById(idJoueurDeux).socket.emit("majJoueurStatusParty",this.party);
        }
    }

    this.tamponWin = false;
    this.temponWinSec = 0;

    this.tamponPieceWin = {};
    this.intervalTempo = 250;
    this.countForSeconde = 0;

    this.countForPointPlayer = 0;

    this.endOfPhysic = true;

    this.resetStateBonus = false;

    this.isFinDePartie = false;

    /*----------------------------------------------------------Attente --------------------------------*/

        this.partyTamponInterval = setInterval( (function(){

            var donneesLocales = partyInProgress[this.party.id];
            if(donneesLocales.idPF.ready == true && donneesLocales.idPS.ready == true){

                if(tableauJeu.getJoueurById(donneesLocales.idPF.id) != null && tableauJeu.getJoueurById(donneesLocales.idPS.id) != null){
                    if(!tableauJeu.isBientotHorsConnexion(tableauJeu.getJoueurById(donneesLocales.idPF.id)) && !tableauJeu.isBientotHorsConnexion(tableauJeu.getJoueurById(donneesLocales.idPS.id))){

                        if(donneesLocales.pointJoueur == true){

                            donneesLocales.action = false;
                            if(this.countForPointPlayer == 4){
                                this.isFinDePartie = traitementPointWin(donneesLocales,donneesLocales.pieceGagnante);
                                donneesLocales.pointJoueur = false;
                                this.countForPointPlayer = 0;
                                donneesLocales.action = true;

                            }else{
                                this.countForPointPlayer++;
                            }

                        }else{

                            /* 4 * 250 = 1000 milliseconde */
                            if(this.countForSeconde == 4){

                                if((donneesLocales.time == 0 || wantToTurn[this.party.id]) && this.endOfPhysic ){
                                    changeTurn(donneesLocales);
                                    wantToTurn[this.party.id] = false;
                                    donneesLocales.time = timeTurn;
                                }else{
                                    if(donneesLocales.time >= 0 ){
                                        donneesLocales.time = donneesLocales.time - 1;
                                    }else{
                                        donneesLocales.time = 0;
                                    }
                                }
                                this.countForSeconde = 0;

                            }

                            if(justAdd[this.party.id] == false){
                                this.endOfPhysic = applyPhysic(donneesLocales);

                            }else{
                                justAdd[this.party.id] = false;
                                this.endOfPhysic = false;
                            }
                    }

                    if(this.resetStateBonus == true){
                        donneesLocales.isChangeTurn = false;
                        this.resetStateBonus = false;
                    }
                    if(donneesLocales.isChangeTurn == true){
                        this.resetStateBonus = true;

                    }
                    if(tableauJeu.getJoueurById(donneesLocales.idPF.id) != null){
                        tableauJeu.getJoueurById(donneesLocales.idPF.id).socket.emit("MiseAJour",donneesLocales);
                    }
                        if(tableauJeu.getJoueurById(donneesLocales.idPS.id) != null){
                        tableauJeu.getJoueurById(donneesLocales.idPS.id).socket.emit("MiseAJour",donneesLocales);
                    }
                    clearDonnees(donneesLocales);
                    if(donneesLocales.pointJoueur == false){
                        this.countForSeconde++;
                    }

                    partyInProgress[this.party.id] = donneesLocales;

                    }else{
                        interruptionDePartie(donneesLocales.id);
                        clearInterval(this.partyTamponInterval);

                    }
                }else{
                    //Deconnexion Effective !!
                    console.log("Deconnexion");
                }
            }else if(donneesLocales.idPF.ready == false || donneesLocales.idPS.ready == false){

                lobby_server.ajout(tableauJeu.supprimer(donneesLocales.idPF.id));
                lobby_server.ajout(tableauJeu.supprimer(donneesLocales.idPS.id));
                lobby_client_affichage(new Tableau_Joueur.Personne(donneesLocales.idPF.id, donneesLocales.idPF.pseudo));
                lobby_client_affichage(new Tableau_Joueur.Personne(donneesLocales.idPS.id, donneesLocales.idPS.pseudo));
                io.sockets.emit('miseAJourDeLaListeJoueur',lobby_client_affichage);
            }
            if(this.isFinDePartie){
                clearInterval(this.partyTamponInterval);
            }

        }).bind(this), this.intervalTempo);

}


/* addParty créé la partie afin de mettre ne relation deux joueur */
function addParty(tableauP, joueurUn, joueurDeux){

    var idParty = 0;
    var sizeX = 4;
    var sizeY = 6;
    var newElement = {};
    var plateau = createPlateau(sizeX,sizeY);
    var idF = joueurUn.id;
    var idS = joueurDeux.id;

    newElement = {
        'id':0,
        'idPF':{'id':idF, 'name':'idPF', 'pseudo':joueurUn.pseudo, 'score':0, 'point':0, 'idPower':"1;20;x2-2;40;/2-3;80;[]", 'piece':"5-10-15",'color':"blue",'ready':null},
        'currentPlayer':idF,
        'idPS':{'id':idS, 'name':'idPS' ,'pseudo':joueurDeux.pseudo, 'score':0, 'point':0, 'idPower':"1;20;x2-2;40;/2-3;80;[]", 'piece':"8-16-20",'color':"red",'ready':null},
        'active':true,
        'start':false,
        'plateau':plateau,
        'pointAdd':new Array(),
        'nbreAction':1,
        'nbreActionRealise':0,
        'nbrePower':1,
        'nbrePowerRealise':0,
        'sizeX':sizeX,
        'sizeY':sizeY,
        'hitcombo':0,
        'pointPourGagner':2,
        'pieceGagnante':{},
        'time':timeTurn,
        'action':false,
        'pointJoueur':false,
        'isChangeTurn':false,
        'soundToPlay':new Array(),
        'finDeParty':{}
    };

    if(tableauP.length == 0){

        tableauP.push(newElement);

    }else{

        var noOld = false, i=0;
        while(i<tableauP.length && !noOld){

            if(!tableauP[i].active){

                newElement.id = i;
                tableauP[i] = newElement;
                idParty = i;
                noOld = true;
            }
            i++;
        }

        if(!noOld){
            newElement.id = (tableauP.length);
            tableauP.push(newElement);
        }
    }

    return newElement;
}


/* Le traitement sur le plateau de jeu qui définie les règles qui y sont appliqué comme la gravité ou la destruction d'une pièce */

function applyPhysic(donneesATravailler){

    var allEnd = false;
    var sizeX = donneesATravailler.sizeX;
    var sizeY = donneesATravailler.sizeY;

    var fini = false, finiSuite = false;

    //---------------------------Gravity-----------------------------

	for(var i = 0; i < sizeY; i++){

		for(var j = sizeX-1; j >= 0; j--){


            if(donneesATravailler.plateau[j][i].item != 0){
                var end = true;
                var k = j
                while(end){
                    if(k == sizeX-1){
                        end = false;
                    }else{
                        if(donneesATravailler.plateau[k+1][i].item == 0){

                            donneesATravailler.plateau[k+1][i].item = donneesATravailler.plateau[k][i].item;

                            donneesATravailler.plateau[k][i].item = 0;
                            donneesATravailler.soundToPlay.push("http://"+addressServer+"/sound/chute_pierre.mp3");
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

                if(donneesATravailler.plateau[k][i].item != 0){

                    var itemWheight = donneesATravailler.plateau[k][i].item.weight;
                    var somme = 0;
                    var j = k

                    while(j-1 >=0 && donneesATravailler.plateau[j-1][i].item != 0){

                        somme += donneesATravailler.plateau[j-1][i].item.weight;
                        j--;
                    }

                    if((itemWheight * 2) < somme ){

                        donneesATravailler.hitcombo += 1;
                        donneesATravailler.soundToPlay.push("http://"+addressServer+"/sound/low_hit.mp3");

                        var data = {
                                    'point':donneesATravailler.plateau[k][i].item.weight * 2,
                                    'coordX':k,
                                    'coordY':i,
                                    'color':donneesATravailler.plateau[k][i].item.fill,
                                    'proprietaire':donneesATravailler.plateau[k][i].item.idProprietaire
                                   };

                        if(donneesATravailler.plateau[k][i].item.idProprietaire == donneesATravailler.currentPlayer){

                            data.point = parseInt(data.point *  (donneesATravailler.hitcombo/(donneesATravailler.hitcombo - 0.1 * donneesATravailler.hitcombo)));

                        }

                        if(donneesATravailler.plateau[k][i].item.idProprietaire == donneesATravailler.idPF.id){
                            donneesATravailler.idPF.score += data.point;
                        }else if(donneesATravailler.plateau[k][i].item.idProprietaire == donneesATravailler.idPS.id){
                            donneesATravailler.idPS.score += data.point;
                        }else if(donneesATravailler.plateau[k][i].item.idProprietaire == -1){
                            data.color = "#CCCCCC";
                        }

                        donneesATravailler.pointAdd.push(data);
                        donneesATravailler.plateau[k][i].item = 0;
                        finiSuite = true;

                    }
                }
            }

        }
    }


    //--------------------------------Connect Four Search------------------------------

    if(!fini && !finiSuite){

        var pointWin = findFour(donneesATravailler);

        if(pointWin.find){
            donneesATravailler.pieceGagnante = pointWin;
            donneesATravailler.pointJoueur = true;
            zoomPieceGagnante(donneesATravailler);
        }

        donneesATravailler.action = true;
        allEnd = true;
    }

    return allEnd;
}

/* Permet d'agrandir la dimension d'un ensemble de pièce en modifiant leurs attributs de largeur et hauteur */

function zoomPieceGagnante(donnees){

    var pos = donnees.pieceGagnante.box;

    var tamponArray = new Array();

    for(var i = 0; i < pos.length; i++){

        if(donnees.plateau[pos[i].x][pos[i].y].item != 0){
            donnees.plateau[pos[i].x][pos[i].y].item.width += 10;
            donnees.plateau[pos[i].x][pos[i].y].item.height += 10;
        }
    }
}

/* fonction qui vérifie l'alignement de 4 pièces en diagonale */
function verificationD(donneesATravailler,x,y){

    var diagonal = new Array();
    var plateau = donneesATravailler.plateau;
    var find = false;
    var id =-1;

    if(plateau[x][y].item != 0){
        id = plateau[x][y].item.idProprietaire;
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
    var find = false;
    var id = -1;
    var compt = 0;
    var sommePoint = 0;
    var aligner = new Array();

    /* verification horizontale */
    while(i < donneesATravailler.sizeX && !find){

        compt = 0;
        var j = 0;

        while(j < donneesATravailler.sizeY && compt < 4){


            if(plateau[i][j].item != 0 && plateau[i][j].item.idProprietaire != -1){
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


/*fonction qui est exécuté lorsqu'un joueur à aligné 4 pièces afin de gérer les points gagnés, le score */
function traitementPointWin(donneesLocales,tamponPieceWin){

    var isFinDePartie = false;
    donneesLocales.hitcombo += 4;

    for(var i = 0 ;i< tamponPieceWin.box.length;i++){

    donneesLocales.pointAdd.push({
                            'point':parseInt(tamponPieceWin.box[i].point) * 2,
                            'coordX':tamponPieceWin.box[i].x,
                            'coordY':tamponPieceWin.box[i].y,
                            'color':tamponPieceWin.box[i].color,
                            'proprietaire':tamponPieceWin.id
                        });
    }

    var scorePoint = parseInt(tamponPieceWin.point);
    if(tamponPieceWin.id == donneesLocales.idPF.id){

        donneesLocales.idPF.score += parseInt(scorePoint + parseInt(scorePoint * (donneesLocales.hitcombo*0.1)));
        donneesLocales.idPF.point += 1;
        if(donneesLocales.pointPourGagner <= donneesLocales.idPF.point ){
            finDePartie(donneesLocales.id,donneesLocales.idPF.id);
            isFinDePartie = true;
        }
    }else if(tamponPieceWin.id == donneesLocales.idPS.id){
        donneesLocales.idPS.score += parseInt(scorePoint + parseInt(scorePoint * (donneesLocales.hitcombo*0.1)));
        donneesLocales.idPS.point += 1;
        if(donneesLocales.pointPourGagner <= donneesLocales.idPS.point ){
            finDePartie(donneesLocales.id,donneesLocales.idPS.id);
            isFinDePartie = true;
        }
    }

    for(var i = 0;i< tamponPieceWin.box.length;i++){

        donneesLocales.plateau[tamponPieceWin.box[i].x][tamponPieceWin.box[i].y].item = 0;
    }
    return isFinDePartie;
}

/*fonction qui rajoute une pièce en x, y sur une partie */
function addItemtoPlateau(donneesLocales,x,y,item){

    var success = false;
    if(donneesLocales.plateau[x][y].item == 0 && donneesLocales.nbreActionRealise < donneesLocales.nbreAction){

        donneesLocales.plateau[x][y].item = item;
        donneesLocales.nbreActionRealise += 1;
        success = true;
    }

}

/* fonction qui exécute un bonus sur une partie donnée et une pièce précise */
function executeBonus(donneesLocales,bonusChoice){

    var success = false;
    var x = bonusChoice.x;
    var y = bonusChoice.y;

    if(donneesLocales.plateau[x][y] != 0 && donneesLocales.nbrePowerRealise < donneesLocales.nbrePower){


        switch(parseInt(bonusChoice.power.id)){

            case 1: if( bonusChoice.power.prix <= bonusChoice.player.score){
                        donneesLocales.plateau[x][y].item.weight = donneesLocales.plateau[x][y].item.weight * 2;
                        if(bonusChoice.player.id == donneesLocales.idPF.id){
                            donneesLocales.idPF.score = donneesLocales.idPF.score - bonusChoice.power.prix;
                        }else if(bonusChoice.player.id == donneesLocales.idPS.id){
                            donneesLocales.idPS.score = donneesLocales.idPS.score - bonusChoice.power.prix;
                        }
                        donneesLocales.nbrePowerRealise += 1;

                        success = true;
                    }
                    break;

            case 2: if( bonusChoice.power.prix <= bonusChoice.player.score){
                        donneesLocales.plateau[x][y].item.weight = parseInt(donneesLocales.plateau[x][y].item.weight) / 2;
                        if(bonusChoice.player.id == donneesLocales.idPF.id){
                            donneesLocales.idPF.score = donneesLocales.idPF.score - bonusChoice.power.prix;
                        }else if(bonusChoice.player.id == donneesLocales.idPS.id){
                            donneesLocales.idPS.score = donneesLocales.idPS.score - bonusChoice.power.prix;
                        }
                        donneesLocales.nbrePowerRealise += 1;
                        success = true;
                    }
                    break;

            case 3: if(bonusChoice.power.prix <= bonusChoice.player.score){
                        donneesLocales.plateau[x][y].item.idProprietaire = -1;
                        if(bonusChoice.player.id == donneesLocales.idPF.id){
                            donneesLocales.idPF.score = donneesLocales.idPF.score - bonusChoice.power.prix;
                        }else if(bonusChoice.player.id == donneesLocales.idPS.id){
                            donneesLocales.idPS.score = donneesLocales.idPS.score - bonusChoice.power.prix;
                        }
                        donneesLocales.nbrePowerRealise += 1;
                        success = true;
                    }
                    break;



            default:success = false;
        }

    }

}


/* fonction qui supprime des informations sur la partie par exemple à chaque envoie d'information, on supprime des informations pour le prochain envoie */
function clearDonnees(donnees){
    donnees.pointAdd = new Array();
    donnees.soundToPlay = new Array();
}

/* fonction exécuté pour supprimer la partie et informer les joueurs de la fin d'une partie*/
function finDePartie (idPartie, idJoueurGagner){

    tableauJeu.getJoueurById(partyInProgress[idPartie].idPF.id).socket.emit("finDePartie",idJoueurGagner);
    tableauJeu.getJoueurById(partyInProgress[idPartie].idPS.id).socket.emit("finDePartie",idJoueurGagner);

    var nouveau_joueur_un = new Tableau_Joueur.Client(partyInProgress[idPartie].idPF.id, partyInProgress[idPartie].idPF.pseudo, tableauJeu.supprimer(partyInProgress[idPartie].idPF.id).socket, new Date().getTime());

    var nouveau_joueur_lite_un = new Tableau_Joueur.Personne(partyInProgress[idPartie].idPF.id, partyInProgress[idPartie].idPF.pseudo);


    lobby_server.ajout(nouveau_joueur_un);
    lobby_client_affichage.ajout(nouveau_joueur_lite_un);

    var nouveau_joueur_deux = new Tableau_Joueur.Client(partyInProgress[idPartie].idPS.id, partyInProgress[idPartie].idPS.pseudo, tableauJeu.supprimer(partyInProgress[idPartie].idPS.id).socket, new Date().getTime());

    var nouveau_joueur_lite_deux = new Tableau_Joueur.Personne(partyInProgress[idPartie].idPS.id, partyInProgress[idPartie].idPS.pseudo);

    lobby_server.ajout(nouveau_joueur_deux);
    lobby_client_affichage.ajout(nouveau_joueur_lite_deux);

    partyInProgress[idPartie].active = false;

}

/*
    fonction qui permet d'avertir le joueur restant que son adversaire à interrompue la partie (problème de connexion ) et procède à l'initialisation     des éléments d'une partie
*/
function interruptionDePartie(idPartie){

    if(tableauJeu.getJoueurById(partyInProgress[idPartie].idPF.id) != null){
        tableauJeu.getJoueurById(partyInProgress[idPartie].idPF.id).socket.emit("Interruption");
        var nouveau_joueur_un = new Tableau_Joueur.Client(partyInProgress[idPartie].idPF.id, partyInProgress[idPartie].idPF.pseudo, tableauJeu.supprimer(partyInProgress[idPartie].idPF.id).socket, new Date().getTime());

        var nouveau_joueur_lite_un = new Tableau_Joueur.Personne(partyInProgress[idPartie].idPF.id, partyInProgress[idPartie].idPF.pseudo);


        lobby_server.ajout(nouveau_joueur_un);
        lobby_client_affichage.ajout(nouveau_joueur_lite_un);
    }

    if(tableauJeu.getJoueurById(partyInProgress[idPartie].idPS.id) != null){
        tableauJeu.getJoueurById(partyInProgress[idPartie].idPS.id).socket.emit("Interruption");
        var nouveau_joueur_deux = new Tableau_Joueur.Client(partyInProgress[idPartie].idPS.id, partyInProgress[idPartie].idPS.pseudo, tableauJeu.supprimer(partyInProgress[idPartie].idPS.id).socket, new Date().getTime());

        var nouveau_joueur_lite_deux = new Tableau_Joueur.Personne(partyInProgress[idPartie].idPS.id, partyInProgress[idPartie].idPS.pseudo);


        lobby_server.ajout(nouveau_joueur_deux);
        lobby_client_affichage.ajout(nouveau_joueur_lite_deux);
    }

    partyInProgress[idPartie].active = false;

}

/* fonction lors du changement de tour d'une partie entre deux joueurs */
function changeTurn(donnees){

    if(donnees.currentPlayer == donnees.idPF.id){

        donnees.currentPlayer = donnees.idPS.id;

    }else if(donnees.currentPlayer == donnees.idPS.id){

        donnees.currentPlayer = donnees.idPF.id;

    }

    donnees.hitcombo = 0;
    donnees.nbreActionRealise = 0;
    donnees.nbrePowerRealise = 0;
    donnees.action = true;
    donnees.isChangeTurn = true;
}


/* fonction qui créé un plateau de jeu*/
function createPlateau(nbrePieceHori,nbrePieceVerti){

    var plateau = new Array();

    for(var i = 0 ;i<nbrePieceHori;i++){

        var ligne = new Array();

        for(var j = 0;j<nbrePieceVerti;j++){

            ligne.push({
                "item":0
            });
        }

        plateau.push(ligne);
    }

    return plateau;
}

/* les variables globales pour la gérer les différents éléments tel que les parties, joueurs.*/
var lobby_server = new Tableau_Joueur.Tableau_EnAttente();
var lobby_client_affichage = new Tableau_Joueur.Tableau_EnAttente_Affichage();
var tableauJeu = new Tableau_Joueur.Tableau_EnJeu();

/* Le temps de jeu d'un tour dan sune partie */
var timeTurn = 10;

var partyInProgress = new Array();
var tamponSetInter = null;

/* on lance l'écoute du server */
var io = require('socket.io').listen(server);

/* Et enfin on déclare les listeners qui serviront au serveur pour coordonner les différentes requêtes */
io.sockets.on('connection', function (socket) {

    /* lorsqu'un nouveau joueur apparait on informe l'ensemble des joueurs*/
    socket.on('nouveauJoueur', function (pseudoJoueur) {

        var nouveau_joueur = new Tableau_Joueur.Client(socket.id, pseudoJoueur, socket, new Date().getTime());
        var nouveau_joueur_lite = new Tableau_Joueur.Personne(socket.id, pseudoJoueur);

        lobby_server.ajout(nouveau_joueur);
        lobby_client_affichage.ajout(nouveau_joueur_lite);

        socket.emit('start_synchronisation',nouveau_joueur_lite);
        io.sockets.emit('miseAJourDeLaListeJoueur',lobby_client_affichage);
    });

    /* permet d'obtenir la liste de tous les joueurs connectés*/
    socket.on('ListeJoueur', function () {

        socket.emit('miseAJourDeLaListeJoueur',lobby_client_affichage);
    });

    /* permet d'entrer dans la file d'attente du matchmaking pour trouver une partie */
    socket.on('entrerFileAttente', function (idUtilisateur) {

        if(lobby_client_affichage.getJoueurById(idUtilisateur) != null){
            console.log("Ajouter au matchMaking");
            mymatch.push(lobby_server.getJoueurById(idUtilisateur));
            lobby_client_affichage.supprimer(idUtilisateur);
            io.sockets.emit('miseAJourDeLaListeJoueur',lobby_client_affichage);
        }
    });


    /* mise à jour l'information du joueur sur le timestamp de la synchronisation */
    socket.on('synchronisation',function(idJoueur){

        if(!lobby_server.timeLifeSynchronisation(idJoueur)){
            tableauJeu.timeLifeSynchronisation(idJoueur);
        }
    });

   /* information concernant la demande de partie d'un joueur */
    socket.on('etatJoueurOk', function (idParty, idJoueur) {

        var partie = partyInProgress[idParty];
        if(idJoueur == partie.idPF.id){
            partyInProgress[idParty].idPF.ready = true;
        }else if(idJoueur == partie.idPS.id){
            partyInProgress[idParty].idPS.ready = true;
        }
    });

    /* le refus d'un joueur concernant une partie */
    socket.on('etatJoueurNo', function (idParty, idJoueur) {

        var partie = partyInProgress[idParty];

        if(idJoueur == partie.idPF.id){
            partyInProgress[idParty].idPF.ready = false;
        }else if(idJoueur == partie.idPS.id){
            partyInProgress[idParty].idPS.ready = false;
        }
    });

    /* déconnection sur le serveur*/
    socket.on('deconnection', function (idJoueur) {
        lobby_server.supprimer(idJoueur);
        lobby_client_affichage.supprimer(idJoueur);
        tableauJeu.supprimer(idJoueur);
        io.sockets.emit('miseAJourDeLaListeJoueur',lobby_client_affichage);
    });

    /* la joueur à fini de jouer et décide de passer son tour */
    socket.on('changeTour',function(objetAsker){
        if(objetAsker.idplayer == partyInProgress[objetAsker.id].currentPlayer){
            wantToTurn[objetAsker.id] = true;
        }
    });

    /* le joueur ajoute une pièce au plateau de jeu */
    socket.on('addPiece',function(objet){

        if(partyInProgress[objet.id].currentPlayer == objet.idPlayer){
            addItemtoPlateau(partyInProgress[objet.id],objet.x,objet.y,objet.item);
            justAdd[objet.id] = true;
        }
    });

    /* le joueur ajoute un effet sur une pièce */
    socket.on('addEffet',function(objet){

        if(partyInProgress[objet.id].currentPlayer == objet.player.id){
            executeBonus(partyInProgress[objet.id],objet);
        }
        justAdd[objet.id] = true;
    });

});

/* vérification de la synchronisation des joueurs avec le serveur afin de gérer les coupures de comminucation */
var verification_Enligne = setInterval(function(){

    for(var i = 0; i < lobby_server.element.length;i++){

        if(new Date().getTime() - lobby_server.element[i].timeLife > 6000){
            var id = lobby_server.element[i].id;
            lobby_server.supprimer(id);
            lobby_client_affichage.supprimer(id);
            io.sockets.emit('miseAJourDeLaListeJoueur',lobby_client_affichage);
        }else if(new Date().getTime() - lobby_server.element[i].timeLife > 3000){
            lobby_server.element[i].almostLeave = true;
        }
    }

    for(var i = 0; i < tableauJeu.element.length;i++){

        if(new Date().getTime() - tableauJeu.element[i].timeLife > 6000){
            var id = tableauJeu.element[i].id;
            tableauJeu.supprimer(id);
        }else if(new Date().getTime() - tableauJeu.element[i].timeLife > 3000){
            tableauJeu.element[i].almostLeave = true;
        }
    }

}, 2000);
