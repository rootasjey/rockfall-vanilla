function load_board() {

   var game = new CanvasState();
    
    
}


function CanvasState (){
 
      /* On définit le plateau de jeu avec les différents arguments détaillés dans plateau.js*/
    this.plateau = new Table(4, 6, 140, 40, 10);

    this.canvas = document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");
  
    this.selection_graphique = null;
    this.selection_piece = null;
    
    this.text_color = "rgba(25, 23, 23, 0.49)";
    
    this.evenement_effet_fall = null;
    
    this.dragoffx = 0;
    this.dragoffy = 0;
    
    this.shape_cinq = new Shape(280, 410, 70, 70, 5);
    this.shape_dix = new Shape(450, 410, 70, 70, 10);
    this.shape_quinze = new Shape(620, 410, 70, 70, 15);

    this.quantite_cinq = 5;
    this.quantite_dix = 5;
    this.quantite_quinze = 5;
    
    this.valid = true;
    
    this.plateau.draw(this.ctx);
  
    this.pieces = new Pieces(this.text_color);
   
    this.pieces.add(this.shape_cinq);
   
    this.pieces.add(this.shape_dix);
    
    this.pieces.add(this.shape_quinze);
    
    this.launch_gravity = null;
    this.active_force = true;
    
    this.valid = false; 
    myState = this;
    
    /* id container */
    this.plateau.initialiseScore("user-sore-points",myState,0);
    
  /* fonction qui permet de redessiner le canvas si besoin */
  var interval = 30;
  setInterval(function() { if(!myState.valid){ clear(myState.ctx,myState.canvas); myState.plateau.draw(myState.ctx);draw_info(myState.ctx, myState.canvas, myState.text_color, myState.quantite_cinq, myState.quantite_dix, myState.quantite_quinze);myState.pieces.draw(myState.ctx);myState.valid = true;} }, interval);

    
    
    /* Dans la fonction mousemove on récupère la position de la souris et on vérifie qu'elle ne passe pas sur une case du plateau sinon on affiche cette case en propriété selected */
  $(canvas).on("mousemove",function(e){

	var canvas = myState.canvas;
	var mouse = getMouse(e,canvas);
	var mx = mouse.x, my = mouse.y;

	for (var i = 0; i < myState.plateau.graphique.length; i++) {
        if(myState.selection_piece != null){
            if (myState.plateau.graphique[i].contains(mx, my)) {

                myState.plateau.graphique[i].selected = true;
                myState.selection_graphique = myState.plateau.graphique[i];
                //myState.
                myState.valid = false;

            }else{

                myState.plateau.graphique[i].selected = false;
                //myState.selection_graphique = myState.plateau.graphique[i];
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
    
    for (var i = 0; i < myState.pieces.shapes.length; i++) {
		if(typeof(myState.pieces.shapes[i]) != "undefined" &&  !myState.plateau.verification_gravity){
		  if (myState.pieces.shapes[i].contains(mx, my)) {
			var mySel = myState.pieces.shapes[i];
			
			myState.dragoffx = mx - mySel.x;
			myState.dragoffy = my - mySel.y;
			if(myState.pieces.shapes[i].weight == 5 && myState.quantite_cinq != 0){
              
                myState.selection_piece = myState.pieces.shapes[i];
                myState.selection_piece.select = true;
                
            }else if(myState.pieces.shapes[i].weight == 10 && myState.quantite_dix != 0){
                myState.selection_piece = myState.pieces.shapes[i];
                myState.selection_piece.select = true;
                
            }else if(myState.pieces.shapes[i].weight == 15 && myState.quantite_quinze != 0){
                myState.selection_piece = myState.pieces.shapes[i];
                myState.selection_piece.select = true; 
            }
            myState.valid = false;
            //return;
	       }
        }
    }
    
  });


$(canvas).on("mouseup",function(e) {
  
        var success = false;
       
        if(myState.selection_piece != null){
        
		  var mouse = getMouse(e,myState.canvas);
		  var mx = mouse.x;
		  var my = mouse.y;
           
           
		  for (var i = 0; i < myState.plateau.graphique.length; i++) {
            if(typeof(myState.plateau.graphique[i]) != "undefined"){

                if (myState.plateau.graphique[i].contains(mx, my) && myState.plateau.matrice[myState.plateau.graphique[i].matrice_x][myState.plateau.graphique[i].matrice_y] == 0) {
                     
                     success = true;
                     
				      var shape = new Shape(myState.plateau.graphique[i].x, myState.plateau.graphique[i].y, myState.selection_piece.width, myState.selection_piece.height, myState.selection_piece.weight, myState.selection_piece.fill);
                      myState.plateau.add(myState.plateau.graphique[i].matrice_x, myState.plateau.graphique[i].matrice_y, shape);
                    
                     switch(myState.selection_piece.weight){
                             case 5 :   if(myState.quantite_cinq>0){myState.quantite_cinq--};
                                        break;
                             
                             case 10 :  if(myState.quantite_dix>0){myState.quantite_dix--};
                                        break;
                             
                             case 15:   if(myState.quantite_quinze>0){myState.quantite_quinze--};
                                        break;
                             
                             default : break;
                     }
                     
                    gravity_launch(myState);
                    
                    fall_effect_and_force(myState);
                     
                    myState.selection_piece.init();
				  }
			}
		}
	}
    
    
    
    if(myState.selection_piece != null){
        if(!success){
            myState.selection_piece.init();
        }
        myState.selection_piece.select = false;
        myState.selection_piece = null;
        myState.valid = false;
    }
    
    if(myState.selection_graphique != null){
        myState.selection_graphique.selected = false;
         myState.selection_graphique = null;
        myState.valid = false;
    }
	

 });
    
}


function clear(ctx,canvas){
    
    ctx.clearRect(0,0,canvas.width,canvas.height);
}


function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}


function draw_info(ctx, canvas, text_color, quantite_cinq, quantite_dix, quantite_quinze){
    
    /* Ligne de séparation entre le plateau de jeu et les pieces */
  
    ctx.beginPath();
    ctx.rect(0, 380, canvas.width, 5);
    ctx.closePath();
    ctx.fillStyle = text_color;
    ctx.fill();

    /* Le texte qui permet d'afficher le temps du tour. */
    
    ctx.font = 'italic 40pt Calibri';
    ctx.fillStyle = text_color;
    ctx.fillText('00 : 00', 35, 460);
    
    ctx.fillStyle = text_color;
    ctx.font = 'italic 40pt Calibri';

    if(quantite_cinq == 0){
         ctx.fillStyle ="red";
    }
    
    ctx.fillText('x'+quantite_cinq, 354, 480);

    ctx.fillStyle = text_color;
    if(quantite_dix == 0){
         ctx.fillStyle ="red";
    }
    ctx.fillText('x'+quantite_dix, 524, 480);

    ctx.fillStyle = text_color;
    if(quantite_quinze == 0){
         ctx.fillStyle ="red";
    }
    ctx.fillText('x'+quantite_quinze, 694, 480);
}









/*La fonction getMouse retourne la position en x et en y de la souris sur l'élément canvas en fesant attention aux propriétées tel que le border, margin, etc. */
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
