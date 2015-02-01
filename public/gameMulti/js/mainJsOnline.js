/***************************************************************

    Classe Main
    
    La classe main est le point d'entrée de l'application en
    en mode Online.


****************************************************************/

function Main(imageLoad, player, adversaire, socket, pointPourGagner) {

    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.player = player;
    
    this.adversaire = adversaire;
    
    this.currentPlayer = null;
    
    this.soundInterval = null;
    
    this.listeSound = new Array();
    
    this.pointMax = pointPourGagner;
    
    this.socket = socket;
    
    this.bonusState = false;
    
    this.powerInProgress = null;
    
    /* la variable canContinue permet de réalisé un bloquage sur les actions réalisées par l'utilisateur en attendant une mise a jour du server */
    this.canContinue = true;

    /* contient les images chargées précédement */
    this.piecesImage = imageLoad;
    
    this.piecesPlayer = new Pieces();
    
    /*ajouter pour permettre d'indiquer si l'utilisateur peut jouer */
    this.canPlay = false;
    
    this.fluxInfoServer = null;
    
    this.selectionPieceMulti = null;
    
    this.plateauOnlineObjet = new Plateau(10, 250, 80, this.canvas, player, "#2955e3");
    this.plateauOnlineObjet.initCtx();
    
    /* une fois avoir ajouter tous ses éléments, on force la mise a jour du canvas en mettant valid à false */
    this.valid = false;
    
    _myStateMulti = this;
    
    /* fonction qui permet de redessiner le canvas si besoin avec une fréquence de 30 millisecondes*/
    var interval = 30;
    
    this.frame = $.timer(function() {
        
        if(!_myStateMulti.valid){
            
            _myStateMulti.ctx.clearRect(0,0,_myStateMulti.canvas.width,_myStateMulti.canvas.height);
            if(_myStateMulti.fluxInfoServer != null){
                _myStateMulti.plateauOnlineObjet.drawPlateau();
                _myStateMulti.plateauOnlineObjet.drawInfo(_myStateMulti.fluxInfoServer.time);
                _myStateMulti.plateauOnlineObjet.drawPointRe();
                _myStateMulti.plateauOnlineObjet.drawCombo(_myStateMulti.fluxInfoServer.hitcombo);
            }
             _myStateMulti.piecesPlayer.draw(_myStateMulti.ctx);
            _myStateMulti.valid = true;
        }
    });

    this.frame.set({ time : interval, autostart : true });
}

/** 
    fonction qui est execute pour stopper le jeu, utilisé lors d'une déconnexion d'un des joueurs, ou à la fin d'une partie
**/
Main.prototype.stop = function(){
    
    this.frame.stop();
    clearInterval(this.soundInterval);
}

/**
    fonction qui initilise les listeners pour gérer les différents évènements indispensable au déroulement du jeu
**/
Main.prototype.listener = function(){

        /* évènement lorsque l'on presse le bouton gauche de la souris sur le canvas on vérifie qu'il presse sur une piece */
        $(this.canvas).on("mousedown",function(e) {

            var mouse = getMouse(e,_myStateMulti.canvas);
            var mx = mouse.x;
            var my = mouse.y;

            /* on vérifie pour chaque pieces/rocks du plateau si on à activé l'evenement
       sur l'une de ces pièces, si c'est le cas on vérifie aussi qu'il n'y a pas
       de calcul de gravité qui s'opère. Pour finir pour permettre à l'utilisateur
       de pouvoir utiliser la fonctionnalité drag&drop il faut que la quantité de pièce soit supérieur à 0 */
            for (var i = 0; i < _myStateMulti.piecesPlayer.shapes.length; i++) {
                if(typeof(_myStateMulti.piecesPlayer.shapes[i]) != "undefined" /*&&  !_myState.plateau.verificationGravity*/){
                    if (_myStateMulti.piecesPlayer.shapes[i].contains(mx, my)) {
                        var mySel = _myStateMulti.piecesPlayer.shapes[i];

                        dragoffxMulti = mx - mySel.x;
                        dragoffyMulti = my - mySel.y;

                        _myStateMulti.selectionPieceMulti = _myStateMulti.piecesPlayer.shapes[i];
                        _myStateMulti.selectionPieceMulti.select = true;


                        _myStateMulti.selectionPieceMulti.height  = 100;
                        _myStateMulti.selectionPieceMulti.width   = 100;

                    }
                }
            }

        });

        /* évènement lorsqu'on bouge la souris on vérifie que l'on a bien un objet attaché qui est la piève qui est destiné à être joué sur le plateau */
        $(this.canvas).on("mousemove",function(e){

            /* On récupère le positionnement de la souris */
            var mouse = getMouse(e,_myStateMulti.canvas);
            var mx = mouse.x, my = mouse.y;
            var NoOnePiece = false;
            
        for (var i = 0; i < _myStateMulti.plateauOnlineObjet.tabPiece.length; i++) {
            if(_myStateMulti.selectionPieceMulti != null){
                if (_myStateMulti.plateauOnlineObjet.tabPiece[i].contains(mx, my)) {

                    _myStateMulti.plateauOnlineObjet.tabPiece[i].selected = true;
                    _myStateMulti.plateauOnlineObjet.selectionCell = _myStateMulti.plateauOnlineObjet.tabPiece[i];
                    NoOnePiece=true;
                    _myStateMulti.valid = false;

                }else{
                    
                    _myStateMulti.plateauOnlineObjet.tabPiece[i].selected = false;
                    _myStateMulti.valid = false;
                }
                
            }
        }
            if(!NoOnePiece){
                _myStateMulti.plateauOnlineObjet.selectionCell = null;
            }
        

            if(_myStateMulti.selectionPieceMulti != null){
                _myStateMulti.selectionPieceMulti.x = mouse.x - dragoffxMulti;
                _myStateMulti.selectionPieceMulti.y = mouse.y - dragoffyMulti;
                _myStateMulti.valid = false;
            }

        });

        /* lorsque l'on relache la pression, si il y avait un objet rattaché il retourne à sa position d'origine et si il est relaché sur une case du plateau et qu'il a le droit alors une pièce est ajouté */
        $(this.canvas).on("mouseup",function(e) {
            
            var mouse = getMouse(e,_myStateMulti.canvas);
            var mx = mouse.x;
            var my = mouse.y;

            /* Vérifie si on à une pièce/rock sélectionné(e) */
            if(_myStateMulti.selectionPieceMulti != null){

                _myStateMulti.selectionPieceMulti.height  = 90;
                _myStateMulti.selectionPieceMulti.width   = 90;
                
                if(_myStateMulti.plateauOnlineObjet.selectionCell != null && _myStateMulti.plateauOnlineObjet.selectionCell.type == "Cell" && _myStateMulti.currentPlayer.id == _myStateMulti.player.id && _myStateMulti.fluxInfoServer.nbreActionRealise < _myStateMulti.fluxInfoServer.nbreAction && _myStateMulti.canContinue){
                    
                    var idItem = _myStateMulti.fluxInfoServer.id;
                    var xItem = _myStateMulti.plateauOnlineObjet.selectionCell.matriceX;
                    var yItem = _myStateMulti.plateauOnlineObjet.selectionCell.matriceY;
                    var xItemGraphique = _myStateMulti.plateauOnlineObjet.selectionCell.x-30;
                    var yItemGraphique = _myStateMulti.plateauOnlineObjet.selectionCell.y-10;
                    
                    var itemItem = {
                        'x':_myStateMulti.selectionPieceMulti.x,
                        'y':_myStateMulti.selectionPieceMulti.y,
                        'width':_myStateMulti.selectionPieceMulti.width-8,
                        'height':_myStateMulti.selectionPieceMulti.height-10,
                        'weight':_myStateMulti.selectionPieceMulti.weight,
                        'idProprietaire':_myStateMulti.selectionPieceMulti.idProprietaire,
                        'select':_myStateMulti.selectionPieceMulti.select,
                        'fill':_myStateMulti.selectionPieceMulti.fill,
                        'lineWidth':_myStateMulti.selectionPieceMulti.lineWidth,
                        'textColor':_myStateMulti.selectionPieceMulti.textColor,
                        'initialX':_myStateMulti.selectionPieceMulti.initialX,
                        'initialY':_myStateMulti.selectionPieceMulti.initialY,
                        'image':_myStateMulti.selectionPieceMulti.image.src,
                        'type':_myStateMulti.selectionPieceMulti.type,
                        'xGraphique':xItemGraphique,
                        'yGraphique':yItemGraphique
                                           
                    };
           
            
                    
                    var addPiece = {
                        
                            'id':idItem,
                            'x':xItem,
                            'y':yItem,
                            'idPlayer':_myStateMulti.player.id,
                            'item':itemItem
                    };
                    
                    _myStateMulti.socket.emit("addPiece",addPiece);
                    _myStateMulti.canContinue = false;
                }

                _myStateMulti.selectionPieceMulti.init();
                _myStateMulti.selectionPieceMulti = null;
                _myStateMulti.valid = false;
                
            }
            
            _myStateMulti.plateauOnlineObjet.selectionCell = null;
            /* on déselectionne graphiquement la cellule du plateau visée */
            for (var i = 0; i < _myStateMulti.plateauOnlineObjet.tabPiece.length; i++) {
                _myStateMulti.plateauOnlineObjet.tabPiece[i].selected = false;
            }


        });
    
    
        /* l'évènement click nous permet d'appliquer un bonus à un pièce du jeu si les conditions sont réunies */
        $(this.canvas).on("click",function(e) {

            /* La variable succes nous permettra de vérifier si l'utilisateur
               lors de son drag and drop a bien relacher sur une cellule du plateau vide */


            var mouse = getMouse(e,_myStateMulti.canvas);
            var mx = mouse.x;
            var my = mouse.y;

            /* Vérifie si on à une pièce/rock sélectionné(e) */
            if(_myStateMulti.selectionPieceMulti == null && _myStateMulti.bonusState == true){
                for (var i = 0; i < _myStateMulti.plateauOnlineObjet.tabPiece.length; i++) {

                    if (_myStateMulti.plateauOnlineObjet.tabPiece[i].contains(mx, my)) {
                        
                        var objetEffet = {
                            'id':idParty,
                            'x':_myStateMulti.plateauOnlineObjet.tabPiece[i].matriceX,
                            'y':_myStateMulti.plateauOnlineObjet.tabPiece[i].matriceY,
                            'power':_myStateMulti.powerInProgress,
                            'player':_myStateMulti.player
                        }
                        _myStateMulti.socket.emit("addEffet",objetEffet);
                        _myStateMulti.canContinue = false;
                        _myStateMulti.bonusState = false;
                    }
                }
            }

        });
    
}


/* fonction qui récupère les informations du joueur pour récupérer les pièces à afficher */

Main.prototype.remplirPiecePlayer = function(){
    
    var tabPiece = this.player.piece.split("-");
    
    for(var i = 0;i<tabPiece.length;i++){
        var shapeAdd = new Shape(i*(90+20)+270, 410, 90, 90, parseInt(tabPiece[i]), this.player.color, this.piecesImage[this.player.name]);
        shapeAdd.idProprietaire = this.player.id;
        this.piecesPlayer.add(shapeAdd);
    }
}

/* fonction qui permet d'activer un bonus ou pas */
function clickOnBonus(id,price,sigle){
    
    if(_myStateMulti.bonusState == false){
        _myStateMulti.desactiveBonus();
        _myStateMulti.activeBonus(id, price, sigle);
    
    }else if(_myStateMulti.powerInProgress.id != id){
        _myStateMulti.desactiveBonus();
        _myStateMulti.activeBonus(id, price, sigle);
    }else{
        _myStateMulti.desactiveBonus();
    }
   
}

/* fonction qui récupère les informations du joueur pour récupérer les pièces à afficher */

Main.prototype.initBonus = function(){

    var tableauBonus = this.player.idPower.split("-");
    if(tableauBonus.length == 3){
        for(var i = 0; i < tableauBonus.length;i++){
            
            var detailbonus = tableauBonus[i].split(";");
            if(detailbonus.length == 3 && document.getElementById("bonus_"+i) != null){

                document.getElementById("bonus_"+i).innerHTML = detailbonus[2];
                document.getElementById("bonus_"+i).setAttribute('onclick','clickOnBonus('+detailbonus[0]+','+detailbonus[1]+',\''+detailbonus[2]+'\')');
                
            }
        }
    }
}

/* Fonction qui permet d'activé le bonus en vérifiant les finances du joueur */
Main.prototype.activeBonus = function(idBonus, prixBonus, sigleBonus){
    
    if(this.player.score >= prixBonus){
        
        this.powerInProgress = {"id":idBonus,"prix":prixBonus,"sigle":sigleBonus};
        this.bonusState = true;
        document.getElementById("etatBonus").innerHTML = "Bonus actif d'id "+idBonus;
    }
}

/* Fonction qui permet de sortir de l'état de bonus activé */
Main.prototype.desactiveBonus = function(){

    this.powerInProgress = null;
    this.bonusState = false;
    document.getElementById("etatBonus").innerHTML = "Bonus desactivé";
}

/*
    "@setFluxInfoServer" est le setter de l'attribut fluxInfoServer.
    "@Method" : traitement
*/
Main.prototype.setFluxInfoServer = function(fluxInfoServer){
    
    this.fluxInfoServer = fluxInfoServer;
    this.plateauOnlineObjet.pieceInGame = new Array();
    
    for(var i = 0; i < this.fluxInfoServer.sizeX;i++){

        for(var j = 0;j < this.fluxInfoServer.sizeY;j++){

            if(this.fluxInfoServer.plateau[i][j].item != 0){

                if(this.fluxInfoServer.plateau[i][j].item.image == this.piecesImage["idPS"].src){
                    this.fluxInfoServer.plateau[i][j].item.image = this.piecesImage["idPS"];
                }else if(this.fluxInfoServer.plateau[i][j].item.image == this.piecesImage["idPF"].src){
                    this.fluxInfoServer.plateau[i][j].item.image = this.piecesImage["idPF"];
                }
                if(this.fluxInfoServer.plateau[i][j].item.idProprietaire == -1){
                    this.fluxInfoServer.plateau[i][j].item.image = this.piecesImage["system_Neutre"];
                    this.fluxInfoServer.plateau[i][j].item.fill="#CCCCCC";
                }
                var shap = new Shape(_myStateMulti.plateauOnlineObjet.startX + j *(_myStateMulti.plateauOnlineObjet.width+_myStateMulti.plateauOnlineObjet.space)-_myStateMulti.plateauOnlineObjet.dimension*1.5, _myStateMulti.plateauOnlineObjet.startY + i *(_myStateMulti.plateauOnlineObjet.height+_myStateMulti.plateauOnlineObjet.space)-_myStateMulti.plateauOnlineObjet.dimension/2, this.fluxInfoServer.plateau[i][j].item.width, this.fluxInfoServer.plateau[i][j].item.height, parseInt(this.fluxInfoServer.plateau[i][j].item.weight), this.fluxInfoServer.plateau[i][j].item.fill, this.fluxInfoServer.plateau[i][j].item.image);
                
                this.plateauOnlineObjet.pieceInGame.push(shap);
            }

        }

    }
    
    this.setPointToDraw(this.fluxInfoServer.pointAdd);
    this.setSoundGame(this.fluxInfoServer.soundToPlay);
    
}

/*
    fonction qui permet d'ajouter à la liste des sons qui doit être joué par le jeu
*/
Main.prototype.setSoundGame = function(newDataSound){
 
    for(var i = 0; i < newDataSound.length;i++){
        
        this.listeSound.push(newDataSound[i]);
        
    }
    
}

/*
    fonction qui permet de lancer le processus de lecture des sons
*/
Main.prototype.startSoundGame = function(){
 
    this.soundInterval = setInterval( (function(){
    
        if(this.listeSound.length>0){
            var player = document.getElementById('sound_game');
            player.setAttribute('src',this.listeSound[0]);
            player.play();
            this.listeSound.splice(0,1);
        }
        
    
    }).bind(this),1000);
}

/* fonction qui rajoute à la liste des points qui doit être affiché sur le plateau lors par exemple de la destruction des pièces */
Main.prototype.setPointToDraw = function (objetPointAdd){

    for(var i = 0;i<objetPointAdd.length;i++){

        var objetPoint = objetPointAdd[i];

        var color = objetPoint.color;
        var proprietaire = objetPoint.proprietaire;
        var x = objetPoint.coordX;
        var y = objetPoint.coordY;
        var point = objetPoint.point;


        var pointToPlateau = {
            "highEff":0,
            "active":true,
            "color":color,
            "x":x,
            "y":y,
            "point":point
        };
        this.plateauOnlineObjet.pointToShow.push(pointToPlateau);
    }       
}



/* 
    Fonction qui prend en charge l'affichage des points du joueur.
    
    @Method : affichage
    
*/

Main.prototype.infoPlayer = function(){

    $("#profil_"+this.player.name+"_score").html("score : "+this.player.score);
    $("#profil_"+this.adversaire.name+"_score").html("score : "+this.adversaire.score);
    
    var imgPlayer = "";
    var imgAdversaire = "";
    
    for(var i = 1;i <= this.pointMax ;i++){
        
        if(i > this.player.point){
            imgPlayer += "<img src=\""+this.piecesImage["starNA"].src+"\"/>";
        }else{
            imgPlayer += "<img src=\""+this.piecesImage["starA"].src+"\"/>";
        }
        
        if( i > this.adversaire.point){
            imgAdversaire += "<img src=\""+this.piecesImage["starNA"].src+"\"/>";
        }else{
            imgAdversaire += "<img src=\""+this.piecesImage["starA"].src+"\"/>";
        }
    }

    $("#profil_"+this.player.name+"_point").html(imgPlayer);
    $("#profil_"+this.adversaire.name+"_point").html(imgAdversaire);
}

/*
    fonction d'initialisation des informations du joueur à afficher
*/
Main.prototype.initInfo = function( ContainerPlayer, ContainerAdversaire ){
    
    $("."+ContainerPlayer).attr("id","profil_"+this.player.name);
      $("."+ContainerPlayer+" .profil_img").attr("id","profil_"+this.player.name+"_img");
      $("."+ContainerPlayer+" .profil_name").attr("id","profil_"+this.player.name+"_name");
      $("."+ContainerPlayer+" .profil_score").attr("id","profil_"+this.player.name+"_score");
      $("."+ContainerPlayer+" .profil_point").attr("id","profil_"+this.player.name+"_point");
    
    $("."+ContainerAdversaire).attr("id","profil_"+this.adversaire.name);
    $("."+ContainerAdversaire+" .profil_img").attr("id","profil_"+this.adversaire.name+"_img");
      $("."+ContainerAdversaire+" .profil_name").attr("id","profil_"+this.adversaire.name+"_name");
      $("."+ContainerAdversaire+" .profil_score").attr("id","profil_"+this.adversaire.name+"_score");
      $("."+ContainerAdversaire+" .profil_point").attr("id","profil_"+this.adversaire.name+"_point");
    
    $("#profil_"+this.player.name+"_img").attr("src",this.piecesImage[this.player.name+"_profile"].src);
    $("#profil_"+this.adversaire.name+"_img").attr("src",this.piecesImage[this.adversaire.name+"_profile"].src);
    
    $("#profil_"+this.player.name+"_name").html(this.player.pseudo);
    $("#profil_"+this.adversaire.name+"_name").html(this.adversaire.pseudo);
    
    $("#profil_"+this.player.name+"_score").html("score : "+0);
    $("#profil_"+this.adversaire.name+"_score").html("score : "+0);
   
        
    $("#profil_"+this.player.name+"_point").html("<img src=\""+this.piecesImage["starNA"].src+"\"/> <img src=\""+this.piecesImage["starNA"].src+"\"/>");
    $("#profil_"+this.adversaire.name+"_point").html("<img src=\""+this.piecesImage["starNA"].src+"\"/><img src=\""+this.piecesImage["starNA"].src+"\"/>");
    
    /* on initialise en même le clique sur le bouton passer son tour */
    document.getElementById("passeTour").onclick = function(){
        _myStateMulti.socket.emit("changeTour",{"id":idParty,"idplayer":_myStateMulti.player.id});
    };
}

