function load_board() {

    /* On créé les joueurs du mode solo ici du 1 vs 1, mais qui peut s'étendre,
    chaque joueur jouera de manière alterné */
    var players = new Array();
    players.push(new Players(1,"Joueur_1","blue",0,[5,10,15]));
    players.push(new Players(2,"Joueur_2","red",0,[8,10,20]));
    
    /* On définit les pouvoirs qui seront disponible lors de la partie ici nous avons définit 3 qui seront les mêmes pour chaque joueur */
    var power_player_un = new Array();
    power_player_un.push(new powerWeightDouble("cadre-un",10));
    power_player_un.push(new powerNeutralPiece("cadre-deux",10));
    power_player_un.push(new powerWeightLoseHalf("cadre-trois",20));
    
    /* on assigne le tableau de pouvoir aux personnages */
    for(var i = 0; i < players.length;i++){
        players[i].power = power_player_un;
    }
    
    
    /* Ici on se charge de récupérer les images afin de les enregistrer et qu'ils puissent être utilisé dans l'appli */
    var game = null;
    
    /* Création du tableau des images par joueur en dur (à mettre à la sélection par le joueur) */
    var sources = {
        "Joueur_1": './rocher.png',
        "Joueur_2": './rocher.png'
      };
    
    /* appel de la fonction qui permet de charger les images et une fois charger lance le jeux*/
      loadImages(sources, function(images) {  
          game = new CanvasState(players,1,images);
      });
    
}
/* permet de centraliser la police de l'appli (on peut faire mieux qu'une variable comme sa )*/
var fontScore = "Calibri";

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


function CanvasState (players,point_to_win, image_load){
 
      /* On définit le plateau de jeu avec les différents arguments détaillés dans plateau.js*/
    this.plateau = new Table(4, 6, 140, 40, 10);

    /*la variable qui détermine le nombre de point qu'il faut pour gagner la partie */
    this.point_to_win = point_to_win;
    
    this.canvas = document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");
  
    /* Variable qui sert lors de l'utilisation de bonus par l'utilisateur */
    this.usePower = false;
    this.powerToUse = null;
    
    /* un tableau qui contient les joueurs de la partie*/
    this.players = players;
    
    /* contient les images chargées précédement */
    this.image_load = image_load;
    
    /* assigne à chaque joueur son image de pièce */
    for(var r = 0;r<this.players.length;r++){
        var name = this.players[r].nom
        this.players[r].image = this.image_load[name]; 
        this.players[r].getPiece(); 
        
    }
    
    /* initialise le jeux en commencant par choisir le joueur qui commencera, basiquement le premier du tableau */
    this.active_players = this.players[0];
    
    
    /* variable qui sert d'horloge du jeux */
    this.time_life = 0;
    
    /* Variable qui sert au stockage de la cellule du plateau et de la pièce sélectionnée */
    this.selection_graphique = null;
    this.selection_piece = null;
    
    /* définit la couleur du texte */
    this.text_color = "rgba(25, 23, 23, 0.49)";
    
    /*on stock le setIntervall pour ne pas le déclencher à chaque event "mouseup" */
    this.evenement_effet_fall = null;
    
    /* lors du drag and drop permet avoir la position de la souris */
    this.dragoffx = 0;
    this.dragoffy = 0;
    
    /* Tableau qui enregistre les points gagnés par l'utilisateur qui devront être affiché sur le jeux */
    this.point_to_draw = new Array();
   
    /* le compteur de combo*/
    this.hit_combo = 0;
    
    /*Enregistre l'utilisateur à l'auteur du combo*/
    this.combo_maker = {"nom":"","id":-1};
    
     this.time_combo = 0;
    
    /* Permet de déterminer le moment ou il n'y a plus aucune intéraction de force entre les pièeces */
    this.end_of_force = false;
    
   
    
    /* permet de déterminer si le score peut être mise à jour*/
    this.score_signal = false;
    
    /* valid est la variable qui permet un redessinement efficace du canvas on la met à false et le canvas se met a jour */
    this.valid = true;
    
    /* on dessine effectivement le plateau */
    this.plateau.draw(this.ctx);
  
    /* permet de prévenir le multi setInterval en testant si la variable ne contient pas déjà le lancement de la gravité */
    this.launch_gravity = null;
    
    /* on souhaite effectivement que la force s'applique au jeux*/
    this.active_force = true;
    
    /* une fois avoir ajouter tous ses éléments, on force la mise a jour du canvas en mettant valid à false */
    this.valid = false; 
    
    
    /* On conserve l'etat de l'objet dans la variable afin de pouvoir utiliser les différents éléments dans les listeners à venir*/
    myState = this;
    
    /* On lance les listeners pour l'activation des bonus */
    for(var c = 0;c<this.active_players.power.length;c++){
        this.active_players.power[c].listen(myState);
    }
    /* On initialise le déroulement d'un tour*/
    this.tours = new Tours(myState, 1, 1, 6);
    
    /* lance le début du cycle de jeux*/
    this.tours.launch_cycle(this.ctx, this.text_color, "user-avatar-name-id", "user-sore-points" );
    
    /*détermine le temps d'un tour */
    this.tours.time_cycl(this.time_change);
    
    /* on initialise le score à 0 */
    this.plateau.initialiseScore("user-sore-points", "user-avatar-name-id", myState,0);
  
    /* fonction qui permet de redessiner le canvas si besoin avec une fréquence de 30 millisecondes*/
  var interval = 30;
   
  setInterval(function() { 
    if(!myState.valid){ 
        clear(myState.ctx,myState.canvas); 
        myState.plateau.draw(myState.ctx); 
        draw_info(myState.ctx, myState.canvas, myState.text_color, myState.time_life); 
        myState.active_players.pieces.draw(myState.ctx);
        myState.drawCombo(myState.ctx,630,80,2);
        if(!myState.drawPoints()){
        myState.valid = true; 
        }
    } 
  }, interval);
    
    /* Dans la fonction mousemove on récupère la position de la souris et on vérifie qu'elle ne passe pas sur une case du plateau sinon on affiche cette case en propriété selected */
  $(canvas).on("mousemove",function(e){

      /* On récupère le positionnement de la souris */
	var canvas = myState.canvas;
	var mouse = getMouse(e,canvas);
	var mx = mouse.x, my = mouse.y;

      
	for (var i = 0; i < myState.plateau.graphique.length; i++) {
        if(myState.selection_piece != null){
            if (myState.plateau.graphique[i].contains(mx, my)) {

                myState.plateau.graphique[i].selected = true;
                myState.selection_graphique = myState.plateau.graphique[i];
                myState.valid = false;

            }else{

                myState.plateau.graphique[i].selected = false;
                myState.valid = false;
            }
        }
	}
      
    if(myState.selection_piece != null){
        myState.selection_piece.x = mouse.x - myState.dragoffx;
        myState.selection_piece.y = mouse.y - myState.dragoffy;
        myState.valid = false;
    }

  });



$(canvas).on("mousedown",function(e) {
  
    var mouse = getMouse(e,canvas);
    var mx = mouse.x;
    var my = mouse.y;
    
    /* on vérifie pour chaque pieces/rocks du plateau si on à activé l'evenement sur l'une de ces pièces, si c'est le cas on vérifie aussi qu'il n'y a pas de calcul de gravité qui s'opère. Pour finir pour permettre à l'utilisateur de pouvoir utiliser la fonctionnalité drag&drop il faut que la quantité de pièce soit supérieur à 0 */
    for (var i = 0; i < myState.active_players.pieces.shapes.length; i++) {
		if(typeof(myState.active_players.pieces.shapes[i]) != "undefined" &&  !myState.plateau.verification_gravity){
		  if (myState.active_players.pieces.shapes[i].contains(mx, my)) {
			var mySel = myState.active_players.pieces.shapes[i];
			
			myState.dragoffx = mx - mySel.x;
			myState.dragoffy = my - mySel.y;

            myState.selection_piece = myState.active_players.pieces.shapes[i];
            myState.selection_piece.select = true; 
           
            /* on redessine le canvas et ses éléments */
            myState.valid = false;
	       }
        }
    }
    
  });


$(canvas).on("mouseup",function(e) {
  
        /* la variable succes nous permettra de vérifier si l'utilisateur lors de son drag and drop a bien relacher sur une cellule du plateau vide */
        var success = false;
       
    
        var mouse = getMouse(e,myState.canvas);
        var mx = mouse.x;
        var my = mouse.y;
        /* vérification de si on à une pièce/rock sélectionner */
        if(myState.selection_piece != null){
        
		  
           
           /* pour chaque cellule on vérifie si on relache le rock sur une cellule du plateau libre*/
		  for (var i = 0; i < myState.plateau.graphique.length; i++) {
            if(typeof(myState.plateau.graphique[i]) != "undefined"){
if(myState.tours.can_add() == true){
                if (myState.plateau.graphique[i].contains(mx, my) && myState.plateau.matrice[myState.plateau.graphique[i].matrice_x][myState.plateau.graphique[i].matrice_y] == 0) {
                     
                     success = true;
                     myState.combo_maker.nom = myState.active_players.nom;
                     myState.combo_maker.id = myState.active_players.identifiant;
                    
				      var shape = new Shape(myState.plateau.graphique[i].x, myState.plateau.graphique[i].y, myState.selection_piece.width, myState.selection_piece.height, myState.selection_piece.weight, myState.selection_piece.fill);
                    shape.image = myState.active_players.image;
                    shape.id_proprietaire = myState.active_players.identifiant;
                      myState.plateau.add(myState.plateau.graphique[i].matrice_x, myState.plateau.graphique[i].matrice_y, shape);
                     
                    /* une fois l'ajout de la pièce dans le plateau on décrémente la quantité et on lance la fonction de gravité de force et on replace la pièce movable à son origine */
                    gravity_launch(myState);
                    
                    fall_effect_and_force(myState);
                     
                    myState.selection_piece.init();
                    
                    myState.tours.add_action();
                    
                }
              }  
            }
		}
        
            /* si le mouseup est relâché dans le vide on remet a sa position initial la cellule */
        if(!success){
            myState.selection_piece.init();
        }
        /* Ensuite on remet par defaut l'état de la pièce/rock  et on redessine en mettant valid à false */
        myState.selection_piece.select = false;
        myState.selection_piece = null;
        myState.valid = false;
        
	}else{
        
        for (var i = 0; i < myState.plateau.graphique.length; i++) {
            
            if(typeof(myState.plateau.graphique[i]) != "undefined"){
                
                    if(myState.tours.can_effet() && myState.usePower){
                        
                        var reference_shape = myState.plateau.matrice[myState.plateau.graphique[i].matrice_x][myState.plateau.graphique[i].matrice_y];
                        
                        if (myState.plateau.graphique[i].contains(mx, my) && reference_shape != 0) {
                             
                            if(myState.active_players.score >= myState.powerToUse.price){
                                
                                myState.plateau.matrice[myState.plateau.graphique[i].matrice_x][myState.plateau.graphique[i].matrice_y] = myState.powerToUse.power(reference_shape);
                                myState.score_signal = true;
                                myState.active_players.changeScore("user-sore-points",-myState.powerToUse.price,myState);
                                
                            }
                        }
                    }
                }
        }
        
        myState.plateau.verification_gravity = true;            
        fall_effect_and_force(myState);
        
        myState.valid = false;
    }
    
    /* on déselectionne graphiquement la cellule du plateau visée */
    if(myState.selection_graphique != null){
        myState.selection_graphique.selected = false;
         myState.selection_graphique = null;
        myState.valid = false;
    }
    

 });
  
}

CanvasState.prototype.time_change = function(time){
    myState.time_life = time;
    if(time<1 && myState.selection_piece != null){
        myState.selection_piece.init();
        myState.selection_piece.select = false;
        myState.selection_piece = null;
        
    }
    myState.valid = false;
}

/* fonction findPlayerById retourne le profil du player en fonction de l'id fournit */
CanvasState.prototype.findPlayerById = function(players, id_player){
    
    var player = null;
    var find = false;
    var i = 0;
    
    while(i<players.length && !find){
        if(players[i].identifiant == id_player){
            player = players[i];
            find = true;
        }
        i++;
    }
    
    return player;
}

CanvasState.prototype.addDrawPoints = function(message, x, y, color){
    
    var i = 0,end = false;
    while(i<this.point_to_draw.length && !end){
        
        if(!this.point_to_draw[i].active){
            this.point_to_draw[i] = {"active":true,"message":message,"x":x,"y":y,"color":color,"high_eff":0};
            end = true;
        }
        
        i++;
    }
    
    if(!end){
        this.point_to_draw.push({"active":true,"message":message,"x":x,"y":y,"color":color,"high_eff":0});
    }
    
}


CanvasState.prototype.drawPoints = function(){

    var point_to_draw_verification = false;
    
    for(var i = 0; i<this.point_to_draw.length;i++){
        
        if(parseInt(this.point_to_draw[i].high_eff) >= parseInt(this.canvas.height)/10){
            
            this.point_to_draw[i].active = false;
            
        }else{
            point_to_draw_verification = true;
            if(this.point_to_draw[i].active){
                this.ctx.fillStyle = this.point_to_draw[i].color;
                this.ctx.font="80pt Calibri";//+fontScore;
                this.ctx.shadowColor = "white";
                                  
                write_message(this.ctx, this.point_to_draw[i].message, this.point_to_draw[i].color, this.point_to_draw[i].x,(parseInt(this.point_to_draw[i].y) - parseInt(this.point_to_draw[i].high_eff)),1);
                
                this.point_to_draw[i].high_eff += 5;
            }
        }
        
    }    
    
    return point_to_draw_verification;   
}

/* Fonction qui prend en charge l'affichage d'hit et de combo quand il y en a */
CanvasState.prototype.drawCombo = function(ctx,x,y,dpth){
    
    var hit_message = "";
    var sizeCombo = 20;
    var hit_color = "black";
    
    var combo = this.hit_combo;

    if(combo == 1){
        
        hit_message = this.combo_maker.nom+" : 1x Hit";
        hit_color = "black";
        
    }else if(combo == 2){
        
        hit_message = this.combo_maker.nom+ " : 2x Hits"; 
        hit_color = "black";
        
    }else if(combo ==3){
        
        hit_message = this.combo_maker.nom+ " : 3x Hits!!!"; 
        hit_color = "black";
        
    }else if(combo >= 4){
        
        hit_message = this.combo_maker.nom+ " : 4x Combo"; 
        hit_color = "red";
    }
    
    
    ctx.shadowColor = "#8888e8";
    ctx.shadowBlur = 8;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI/3.5);
    ctx.textAlign = "center";    
    
    ctx.font = "italic "+sizeCombo+"pt Calibri";
    write_message(ctx, hit_message, hit_color, 100, 0, dpth);
    
    ctx.restore();
    
    ctx.shadowColor = "black";
    ctx.shadowBlur = 8;
}

/* Fonction qui permet d'écrire sur canvas */
function write_message (ctx, message, color, x, y, dpth){
    var cnt;
    
    ctx.fillStyle = color;
    
    for(cnt = 0;cnt < dpth;cnt++){
        ctx.fillText(message, x - cnt, y - cnt);
    }
    
    
    ctx.shadowColor = "black";
    ctx.shadowBlur = 8;
}




/* fonction qui efface tout les éléments du canvas */
function clear(ctx,canvas){
    
    ctx.clearRect(0,0,canvas.width,canvas.height);
}


/* La fonction draw_info permet d'afficher les informations sur la partie comme le nombre de temps restant, la quantitée de rock restant par catégorie */

function draw_info(ctx, canvas, text_color, time_sec){
    
    /* Ligne de séparation entre le plateau de jeu et les pieces */
  
    ctx.beginPath();
    ctx.rect(0, 380, canvas.width, 5);
    ctx.closePath();
    ctx.fillStyle = text_color;
    ctx.fill();

    /* Le texte qui permet d'afficher le temps du tour. */
    
    ctx.font = "italic 40pt Calibri";
    ctx.fillStyle = text_color;
    ctx.fillText(time_sec, 35, 460);
    
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
