function LoadBoard() {


    InitStyle();
    /* On créé les joueurs du mode solo ici du 1 vs 1, mais qui peut s'étendre,
    chaque joueur jouera de manière alterné */
    var players = new Array();
    players.push(new Players(1,"Joueur_1","black",0,[5,10,15]));
    players.push(new Players(2,"Joueur_2","black",0,[8,10,20]));

    /* On définit les pouvoirs qui seront disponible lors de la partie ici nous avons définit 3 qui seront les mêmes pour chaque joueur */
    var powerPlayerUn = new Array();
    powerPlayerUn.push(new powerWeightDouble("cadre-un",10,'./fois-deux.png'));
    powerPlayerUn.push(new powerNeutralPiece("cadre-deux",10,'./neutre.png'));
    powerPlayerUn.push(new powerWeightLoseHalf("cadre-trois",20,'./diviser-deux.png'));

    /* on assigne le tableau de pouvoir aux personnages */
    for(var i = 0; i < players.length;i++){
        players[i].power = powerPlayerUn;
    }


    /* Ici on se charge de récupérer les images afin de les enregistrer et qu'ils puissent être utilisé dans l'appli */
    var game = null;

    /* Création du tableau des images par joueur en dur (à mettre à la sélection par le joueur) */
    var sources = {
        "Joueur_1": './images/rock-red.png',
        "Joueur_2": './images/rock-ciel.png',
        "System_Neutre":"./images/rock-grey.png"
      };

    /* appel de la fonction qui permet de charger les images et une fois charger lance le jeux*/
      loadImages(sources, function(images) {
          game = new CanvasState(players,2,images);
      });

}
/* permet de centraliser la police de l'appli (on peut faire mieux qu'une variable comme sa )*/
var fontScore = "Calibri";

var ImageNeutre = null;

/*la fonction qui charge toutes les images et une fois terminé qui lance la fonction callback*/
function loadImages(sources, callback) {

    var images = {};
    var loadedImages = 0;
    var numImages = 0;

    for(var src in sources) {
      numImages++;
    }
    for(var src in sources) {
      images[src] = new Image();
      images[src].onload = function() {
        if(++loadedImages >= numImages) {
          callback(images);
        }
      };
      images[src].src = sources[src];
    }
}


function CanvasState (players,pointToWin, imageLoad){

      /* On définit le plateau de jeu avec les différents arguments détaillés dans plateau.js*/
    this.plateau = new Table(4, 6, 160, 15, 20);

    /*la variable qui détermine le nombre de point qu'il faut pour gagner la partie */
    this.pointToWin = pointToWin;

    this.canvas = document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");

    /* Variable qui sert lors de l'utilisation de bonus par l'utilisateur */
    this.idPower = 0;
    this.usePower = false;
    this.powerToUse = null;

    /* un tableau qui contient les joueurs de la partie*/
    this.players = players;

    /* contient les images chargées précédement */
    this.imageLoad = imageLoad;

    ImageNeutre = this.imageLoad["System_Neutre"];

    /* assigne à chaque joueur son image de pièce */
    for(var r = 0;r<this.players.length;r++){
        var name = this.players[r].nom;
        this.players[r].image = this.imageLoad[name];
        this.players[r].getPiece();

    }

    /* initialise le jeux en commencant par choisir le joueur qui commencera, basiquement le premier du tableau */
    this.activePlayers = this.players[0];

    this.pause = true;

    this.start = false;
    /* variable qui sert d'horloge du jeux */
    this.timeLife = 0;

    /* Variable qui sert au stockage de la cellule du plateau et de la pièce sélectionnée */
    this.selectionGraphique = null;
    this.selectionPiece = null;

    /* définit la couleur du texte */
    this.textColor = "rgba(25, 23, 23, 0.49)";

    /*on stock le setIntervall pour ne pas le déclencher à chaque event "mouseup" */
    this.evenementEffetFall = null;

    this.verificationEndGame = null;

    /* lors du drag and drop permet avoir la position de la souris */
    this.dragoffx = 0;
    this.dragoffy = 0;

    /* Tableau qui enregistre les points gagnés par l'utilisateur qui devront être affiché sur le jeux */
    this.pointToDraw = new Array();

    /* le compteur de combo*/
    this.hitCombo = 0;

    /*Enregistre l'utilisateur à l'auteur du combo*/
    this.comboMaker = {"nom":"","id":-1};

     this.timeCombo = 0;

    /* Permet de déterminer le moment ou il n'y a plus aucune intéraction de force entre les pièeces */
    this.endOfForce = false;



    /* permet de déterminer si le score peut être mise à jour*/
    this.scoreSignal = false;

    /* valid est la variable qui permet un redessinement efficace du canvas on la met à false et le canvas se met a jour */
    this.valid = true;

    /* on dessine effectivement le plateau */
    this.plateau.draw(this.ctx);

    /* permet de prévenir le multi setInterval en testant si la variable ne contient pas déjà le lancement de la gravité */
    this.launchGravity = null;

    /* on souhaite effectivement que la force s'applique au jeux*/
    this.activeForce = true;

    /* une fois avoir ajouter tous ses éléments, on force la mise a jour du canvas en mettant valid à false */
    this.valid = false;


    /* On conserve l'etat de l'objet dans la variable afin de pouvoir utiliser les différents éléments dans les listeners à venir*/
    _myState = this;

    /* On lance les listeners pour l'activation des bonus */
    for(var c = 0;c<this.activePlayers.power.length;c++){
        this.activePlayers.power[c].listen(_myState);
    }
    /* On initialise le déroulement d'un tour*/
    this.tours = new Tours(_myState, 1, 1, 15);

    /* lance le début du cycle de jeux*/
    this.tours.launchCycle(this.ctx, this.textColor, "user-avatar-name-id", "user-sore-points" );

    /*détermine le temps d'un tour */
    this.tours.timeCycle(this.timeChange);

    /* on initialise le score à 0 */
    this.plateau.initialiseScore("user-sore-points", "user-avatar-name-id", _myState,0);

    /* fonction qui permet de redessiner le canvas si besoin avec une fréquence de 30 millisecondes*/
  var interval = 30;

  this.frame = $.timer(function() {
    if(!_myState.valid){
        clear(_myState.ctx,_myState.canvas);
        _myState.plateau.draw(_myState.ctx);
        drawInfo(_myState.ctx, _myState.canvas, _myState.textColor, _myState.timeLife);
        _myState.activePlayers.pieces.draw(_myState.ctx);
        _myState.drawCombo(_myState.ctx,630,80,2);
        _myState.drawPointPlayer();
        if(!_myState.drawPoints()){
        _myState.valid = true;
        }
    }
  });//, interval);

  this.frame.set({ time : interval, autostart : true });

    /* Dans la fonction mousemove on récupère la position de la souris et on vérifie qu'elle ne passe pas sur une case du plateau sinon on affiche cette case en propriété selected */
 screenPrepareStart(_myState);

  $(canvas).on("mousemove",function(e){

      /* On récupère le positionnement de la souris */
	var canvas = _myState.canvas;
	var mouse = getMouse(e,canvas);
	var mx = mouse.x, my = mouse.y;


	for (var i = 0; i < _myState.plateau.graphique.length; i++) {
        if(_myState.selectionPiece != null){
            if (_myState.plateau.graphique[i].contains(mx, my)) {

                _myState.plateau.graphique[i].selected = true;
                _myState.selectionGraphique = _myState.plateau.graphique[i];
                _myState.valid = false;

            }else{

                _myState.plateau.graphique[i].selected = false;
                _myState.valid = false;
            }
        }
	}

    if(_myState.selectionPiece != null){
        _myState.selectionPiece.x = mouse.x - _myState.dragoffx;
        _myState.selectionPiece.y = mouse.y - _myState.dragoffy;
        _myState.valid = false;
    }

  });



$(canvas).on("mousedown",function(e) {

    var mouse = getMouse(e,canvas);
    var mx = mouse.x;
    var my = mouse.y;

    /* on vérifie pour chaque pieces/rocks du plateau si on à activé l'evenement sur l'une de ces pièces, si c'est le cas on vérifie aussi qu'il n'y a pas de calcul de gravité qui s'opère. Pour finir pour permettre à l'utilisateur de pouvoir utiliser la fonctionnalité drag&drop il faut que la quantité de pièce soit supérieur à 0 */
    for (var i = 0; i < _myState.activePlayers.pieces.shapes.length; i++) {
		if(typeof(_myState.activePlayers.pieces.shapes[i]) != "undefined" &&  !_myState.plateau.verificationGravity){
		  if (_myState.activePlayers.pieces.shapes[i].contains(mx, my)) {
			var mySel = _myState.activePlayers.pieces.shapes[i];

			_myState.dragoffx = mx - mySel.x;
			_myState.dragoffy = my - mySel.y;

            _myState.selectionPiece = _myState.activePlayers.pieces.shapes[i];
            _myState.selectionPiece.select = true;

            /* on redessine le canvas et ses éléments */
            _myState.valid = false;
	       }
        }
    }

  });


$(canvas).on("mouseup",function(e) {

        /* la variable succes nous permettra de vérifier si l'utilisateur lors de son drag and drop a bien relacher sur une cellule du plateau vide */
        var success = false;


        var mouse = getMouse(e,_myState.canvas);
        var mx = mouse.x;
        var my = mouse.y;
        /* vérification de si on à une pièce/rock sélectionner */
        if(_myState.selectionPiece != null){

           /* pour chaque cellule on vérifie si on relache le rock sur une cellule du plateau libre*/
		  for (var i = 0; i < _myState.plateau.graphique.length; i++) {
            if(typeof(_myState.plateau.graphique[i]) != "undefined"){
if(_myState.tours.canAdd() == true){
                if (_myState.plateau.graphique[i].contains(mx, my) && _myState.plateau.matrice[_myState.plateau.graphique[i].matriceX][_myState.plateau.graphique[i].matriceY] == 0) {

                     success = true;
                     _myState.comboMaker.nom = _myState.activePlayers.nom;
                     _myState.comboMaker.id = _myState.activePlayers.identifiant;

				      var shape = new Shape(_myState.plateau.graphique[i].x-(_myState.plateau.graphique[i].width/2), _myState.plateau.graphique[i].y-(_myState.plateau.graphique[i].height/4.5), _myState.selectionPiece.width, _myState.selectionPiece.height, _myState.selectionPiece.weight, _myState.selectionPiece.fill);
                    shape.image = _myState.activePlayers.image;
                    shape.idProprietaire = _myState.activePlayers.identifiant;
                      _myState.plateau.add(_myState.plateau.graphique[i].matriceX, _myState.plateau.graphique[i].matriceY, shape);

                    /* une fois l'ajout de la pièce dans le plateau on décrémente la quantité et on lance la fonction de gravité de force et on replace la pièce movable à son origine */
                    GravityLaunch(_myState);

                    FallEffectAndForce(_myState);

                    _myState.selectionPiece.init();

                    _myState.tours.addAction();

                }
              }
            }
		}

            /* si le mouseup est relâché dans le vide on remet a sa position initial la cellule */
        if(!success){
            _myState.selectionPiece.init();
        }
        /* Ensuite on remet par defaut l'état de la pièce/rock  et on redessine en mettant valid à false */
        _myState.selectionPiece.select = false;
        _myState.selectionPiece = null;
        _myState.valid = false;

	}else{

        for (var i = 0; i < _myState.plateau.graphique.length; i++) {

            if(typeof(_myState.plateau.graphique[i]) != "undefined"){

                    if(_myState.tours.canEffet() && _myState.usePower){

                        var referenceShape = _myState.plateau.matrice[_myState.plateau.graphique[i].matriceX][_myState.plateau.graphique[i].matriceY];

                        if (_myState.plateau.graphique[i].contains(mx, my) && referenceShape != 0) {

                            if(_myState.activePlayers.score >= _myState.powerToUse.price){

                                _myState.plateau.matrice[_myState.plateau.graphique[i].matriceX][_myState.plateau.graphique[i].matriceY] = _myState.powerToUse.power(referenceShape);
                                _myState.scoreSignal = true;
                                _myState.activePlayers.changeScore("user-sore-points",-_myState.powerToUse.price,_myState);
                                 _myState.tours.addEffet();
                            }
                        }

                    }
                }
        }

        _myState.plateau.verificationGravity = true;
        FallEffectAndForce(_myState);

        _myState.valid = false;
    }

    /* on déselectionne graphiquement la cellule du plateau visée */
    if(_myState.selectionGraphique != null){
        _myState.selectionGraphique.selected = false;
         _myState.selectionGraphique = null;
        _myState.valid = false;
    }


 });

    /* Ecouteur sur le bouton de pause */
    $("#button-pause").on("click",function(e){
        ScreenPause(_myState);
    });


    /* Ecouteur sur le bouton afin de passer son tour*/
    $("#button-passe").on("click",function(e){
        PasseTour(_myState);
    });

}

/* timeChange  la fonction de callback une fois le tour changé  pour réinitialiser */
CanvasState.prototype.timeChange = function(time){
    _myState.timeLife = time;
    if(time<1 && _myState.selectionPiece != null){
        _myState.selectionPiece.init();
        _myState.selectionPiece.select = false;
        _myState.selectionPiece = null;

    }
    _myState.valid = false;
}

/* fonction findPlayerById retourne le profil du player en fonction de l'id fournit */
CanvasState.prototype.findPlayerById = function(players, idPlayer){

    var player = null;
    var find = false;
    var i = 0;

    while(i<players.length && !find){
        if(players[i].identifiant == idPlayer){
            player = players[i];
            find = true;
        }
        i++;
    }

    return player;
}

CanvasState.prototype.addDrawPoints = function(message, x, y, color){

    var i = 0,end = false;
    while(i<this.pointToDraw.length && !end){

        if(!this.pointToDraw[i].active){
            this.pointToDraw[i] = {"active":true,"message":message,"x":x,"y":y,"color":color,"highEff":0};
            end = true;
        }

        i++;
    }

    if(!end){
        this.pointToDraw.push({"active":true,"message":message,"x":x,"y":y,"color":color,"highEff":0});
    }

}


CanvasState.prototype.drawPoints = function(){

    var pointToDrawVerification = false;

    for(var i = 0; i<this.pointToDraw.length;i++){

        if(parseInt(this.pointToDraw[i].highEff) >= parseInt(this.canvas.height)/10){

            this.pointToDraw[i].active = false;

        }else{
            pointToDrawVerification = true;
            if(this.pointToDraw[i].active){
                this.ctx.fillStyle = this.pointToDraw[i].color;
                this.ctx.font="80pt Calibri";
                this.ctx.shadowColor = "white";

                WriteMessage(this.ctx, this.pointToDraw[i].message, this.pointToDraw[i].color, this.pointToDraw[i].x,(parseInt(this.pointToDraw[i].y) - parseInt(this.pointToDraw[i].highEff)),1);
                if(!this.pause){
                    this.pointToDraw[i].highEff += 5;
                }
            }
        }

    }

    return pointToDrawVerification;
}

/* Fonction qui prend en charge l'affichage d'hit et de combo quand il y en a */
CanvasState.prototype.drawCombo = function(ctx,x,y,dpth){

    var hitMessage = "";
    var sizeCombo = 20;
    var hitColor = "black";

    var combo = this.hitCombo;

    if(combo == 1){

        hitMessage = this.comboMaker.nom+" : 1x Hit";
        hitColor = "black";

    }else if(combo == 2){

        hitMessage = this.comboMaker.nom+ " : 2x Hits";
        hitColor = "black";

    }else if(combo ==3){

        hitMessage = this.comboMaker.nom+ " : 3x Hits!!!";
        hitColor = "black";

    }else if(combo >= 4){

        hitMessage = this.comboMaker.nom+ " : 4x Combo";
        hitColor = "red";
    }


    ctx.shadowColor = "#8888e8";
    ctx.shadowBlur = 8;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI/3.5);
    ctx.textAlign = "center";

    ctx.font = "italic "+sizeCombo+"pt Calibri";
    WriteMessage(ctx, hitMessage, hitColor, 100, 0, dpth);

    ctx.restore();

    ctx.shadowColor = "black";
    ctx.shadowBlur = 8;
}

/* Fonction qui prend en charge l'affichage des points des joueurs */
CanvasState.prototype.drawPointPlayer = function(){

    var initPosX = 55;
    var initPosY = 300;

    for(var i = 0;i<this.pointToWin;i++){
      if(this.activePlayers.point>i){
          (new Shape(initPosX, initPosY-(i*100), 50, 50, 0, "yellow", null)).drawStar(this.ctx, 45, 5, 0.5);

      }else{
          (new Shape(initPosX, initPosY-(i*100), 50, 50, 0, "grey", null)).drawStar(this.ctx, 45, 5, 0.5);
      }
    }

}

/* Fonction qui permet d'écrire sur canvas */
function WriteMessage (ctx, message, color, x, y, dpth){
    var cnt;

    ctx.shadowBlur = 4;


    ctx.fillStyle = color;

    for(cnt = 0;cnt < dpth;cnt++){
        ctx.fillText(message, x - cnt, y - cnt);
    }


    ctx.shadowColor = "black";
    ctx.shadowBlur = 4;
}




/* fonction qui efface tout les éléments du canvas */
function clear(ctx,canvas){

    ctx.clearRect(0,0,canvas.width,canvas.height);
}


/* La fonction drawInfo permet d'afficher les informations sur la partie comme le nombre de temps restant, la quantitée de rock restant par catégorie */

function drawInfo(ctx, canvas, textColor, timeSecondGame){

    /* Ligne de séparation entre le plateau de jeu et les pieces */

    ctx.beginPath();
    ctx.rect(170, 380, canvas.width/2, 5);
    ctx.closePath();
    ctx.fillStyle = textColor;
    ctx.fill();

    /* Le texte qui permet d'afficher le temps du tour. */

    ctx.font = "italic 40pt Calibri";
    ctx.fillStyle = textColor;
    ctx.fillText(timeSecondGame, 35, 460);

}


/* La fonction getMouse retourne la position en x et en y de la souris sur l'élément canvas en fesant attention aux propriétées tel que le border, margin, etc. */

function getMouse(e,canvas) {

	/* This complicates things a little but but fixes mouse co-ordinate problems
	 when there's a border or padding.*/
	var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
	if (document.defaultView && document.defaultView.getComputedStyle) {
		stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
		stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
		styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
		styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
	}
  /* Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
   They will mess up mouse coordinates and this fixes that */
  var html = document.body.parentNode;
  htmlTop = html.offsetTop;
  htmlLeft = html.offsetLeft;


  var element = canvas, offsetX = 0, offsetY = 0, mx, my;

  /* Compute the total offset*/
  if (element.offsetParent !== undefined) {
    do {
      offsetX += element.offsetLeft;
      offsetY += element.offsetTop;
    } while ((element = element.offsetParent));
  }

  /* Add padding and border style widths to offset
   Also add the <html> offsets in case there's a position:fixed bar*/
  offsetX += stylePaddingLeft + styleBorderLeft + htmlLeft;
  offsetY += stylePaddingTop + styleBorderTop + htmlTop;

  mx = e.pageX - offsetX;
  my = e.pageY - offsetY;

  /* We return a simple javascript object (a hash) with x and y defined*/
  return {x: mx, y: my};

 }
