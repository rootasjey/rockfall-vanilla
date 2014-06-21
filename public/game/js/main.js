function load_board() {

    
    var players = new Array();
    players.push(new Players(1,"Joueur_1","blue",0,[5,10,15]));
    players.push(new Players(2,"Joueur_2","red",0,[8,10,20]));
   var game = new CanvasState(players,1);
    
    
}


function CanvasState (players,point_to_win){
 
      /* On définit le plateau de jeu avec les différents arguments détaillés dans plateau.js*/
    this.plateau = new Table(4, 6, 140, 40, 10);

    this.point_to_win = point_to_win;
    
    this.canvas = document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");
  
    /* un tableau qui contient les joueurs de la partie*/
    this.players = players;
    
    this.active_players = this.players[0];
    
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
    
    /* Les variables  représentant les pièces/rocks qui intéragissent avec l'utilisateur et qui sont dessinés en bas du canvas */
    
    //this.shape = new Array();
    
   /* for(var i = 0;i<this.shape.length;i++){
        
        
        
    }*/
    /*
    this.shape_cinq = new Shape(280, 410, 70, 70, 5);
    this.shape_dix = new Shape(450, 410, 70, 70, 10);
    this.shape_quinze = new Shape(620, 410, 70, 70, 15);
*/
    /* Les variables de quantité des rocks qui sont initialisées pour chaque catégorie */
    
    /*this.quantite_cinq = 5;
    this.quantite_dix = 5;
    this.quantite_quinze = 5;*/
    
    /* valid est la variable qui permet un redessinement efficace du canvas on la met à false et le canvas se met a jour */
    this.valid = true;
    
    /* on dessine effectivement le plateau */
    this.plateau.draw(this.ctx);
  
    /* on définit l'objet Pieces qui ressence les différentes rocks créés qui seront affiché sur le plateau */
    //this.pieces = new Pieces();
   
    /* On ajoute à l'objet les différents rocks qui seront affiché sur le canvas*/
    /*this.pieces.add(this.shape_cinq);
   
    this.pieces.add(this.shape_dix);
    
    this.pieces.add(this.shape_quinze);
    */
    /* permet de prévenir le multi setInterval en testant si la variable ne contient pas déjà le lancement de la gravité */
    this.launch_gravity = null;
    
    /* on souhaite effectivement que la force s'applique au jeux*/
    this.active_force = true;
    
    /* une fois avoir ajouter tous ses éléments, on force la mise a jour du canvas en mettant valid à false */
    this.valid = false; 
    
    /* On conserve l'etat de l'objet dans la variable afin de pouvoir utiliser les différents éléments dans les listeners à venir*/
    myState = this;
    
    this.tours = new Tours(myState, 1, 0, 6);
    
    this.tours.launch_cycle(this.ctx, this.text_color, "user-avatar-name-id", "user-sore-points" );
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
                            myState.valid = true; 
                        } 
  }, interval);

    
    
    /* Dans la fonction mousemove on récupère la position de la souris et on vérifie qu'elle ne passe pas sur une case du plateau sinon on affiche cette case en propriété selected */
  $(canvas).on("mousemove",function(e){

	var canvas = myState.canvas;
	var mouse = getMouse(e,canvas);
	var mx = mouse.x, my = mouse.y;

      /**/
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
			/*if(myState.pieces.shapes[i].weight == 5 && myState.active_players.quantite_cinq != 0){
              
                myState.selection_piece = myState.pieces.shapes[i];
                myState.selection_piece.select = true;
                
            }else if(myState.pieces.shapes[i].weight == 10 && myState.active_players.quantite_dix != 0){
                myState.selection_piece = myState.pieces.shapes[i];
                myState.selection_piece.select = true;
                
            }else if(myState.pieces.shapes[i].weight == 15 && myState.active_players.quantite_quinze != 0){
                */
            myState.selection_piece = myState.active_players.pieces.shapes[i];
            myState.selection_piece.select = true; 
           /* }*/
              /* on redessine le canvas et ses éléments */
            myState.valid = false;
	       }
        }
    }
    
  });


$(canvas).on("mouseup",function(e) {
  
        /* la variable succes nous permettra de vérifier si l'utilisateur lors de son drag and drop a bien relacher sur une cellule du plateau vide */
        var success = false;
       
        /* vérification de si on à une pièce/rock sélectionner */
        if(myState.selection_piece != null){
        
		  var mouse = getMouse(e,myState.canvas);
		  var mx = mouse.x;
		  var my = mouse.y;
           
           /* pour chaque cellule on vérifie si on relache le rock sur une cellule du plateau libre*/
		  for (var i = 0; i < myState.plateau.graphique.length; i++) {
            if(typeof(myState.plateau.graphique[i]) != "undefined"){

                if (myState.plateau.graphique[i].contains(mx, my) && myState.plateau.matrice[myState.plateau.graphique[i].matrice_x][myState.plateau.graphique[i].matrice_y] == 0) {
                     
                     success = true;
                     
				      var shape = new Shape(myState.plateau.graphique[i].x, myState.plateau.graphique[i].y, myState.selection_piece.width, myState.selection_piece.height, myState.selection_piece.weight, myState.selection_piece.fill);
                    shape.id_proprietaire = myState.active_players.identifiant;
                      myState.plateau.add(myState.plateau.graphique[i].matrice_x, myState.plateau.graphique[i].matrice_y, shape);
                     
                    /* une fois l'ajout de la pièce dans le plateau on décrémente la quantité et on lance la fonction de gravité de force et on replace la pièce movable à son origine */
                    gravity_launch(myState);
                    
                    fall_effect_and_force(myState);
                     
                    myState.selection_piece.init();
                    if(myState.tours.can_add() == true){
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
    
    ctx.font = 'italic 40pt Calibri';
    ctx.fillStyle = text_color;
    ctx.fillText(time_sec, 35, 460);
    
}









/* La fonction getMouse retourne la position en x et en y de la souris sur l'élément canvas en fesant attention aux propriétées tel que le border, margin, etc. */

function getMouse(e,canvas) {

	// This complicates things a little but but fixes mouse co-ordinate problems
	// when there's a border or padding.
	var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
	if (document.defaultView && document.defaultView.getComputedStyle) {
		stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
		stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
		styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
		styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
	}
  // Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
  // They will mess up mouse coordinates and this fixes that
  var html = document.body.parentNode;
  htmlTop = html.offsetTop;
  htmlLeft = html.offsetLeft;


  var element = canvas, offsetX = 0, offsetY = 0, mx, my;

  // Compute the total offset
  if (element.offsetParent !== undefined) {
    do {
      offsetX += element.offsetLeft;
      offsetY += element.offsetTop;
    } while ((element = element.offsetParent));
  }

  // Add padding and border style widths to offset
  // Also add the <html> offsets in case there's a position:fixed bar
  offsetX += stylePaddingLeft + styleBorderLeft + htmlLeft;
  offsetY += stylePaddingTop + styleBorderTop + htmlTop;

  mx = e.pageX - offsetX;
  my = e.pageY - offsetY;

  // We return a simple javascript object (a hash) with x and y defined
  return {x: mx, y: my};

 }
