/*
	Le Table représente le plateau de jeu il est modulable en x et en y. Nous avons différentes méthodes qui nous permette d'ajouter ou de supprimer les éléments de la matrice. les 0 représente une case vide, sinon l'élément contiendra l'objet de type shape.
	
	Les deux arguments représentent la taille de la matrice en x et en y.
*/


function Table(size_x,size_y, start_x, start_y, space){

	/* Le Table du jeu 
		
		[[0,0,0,0,0],
		 [0,0,0,0,0],
		 [0,0,0,0,0],
		 [0,0,0,0,0],
		 [0,0,0,0,0]] 
		 
	donc x définie la ligne 
	et y la colonne c'est une matrice carré */
	
	this.size_x = size_x;
	this.size_y = size_y;
	
	/* couleur par defaut des cases du plateau */
	this.color = "#CCCCCC";
	
	/* Dimension des cases du plateau */
	this.width = 50;
	this.height = 50;
	
	/* Les données de départ qui serviront pour la représentation graphique */
	this.start_x = start_x;
	this.start_y = start_y;
	this.space = space;
	
	/* matrice est la variable qui contient la matrice */
	this.matrice = new Array();
	
	/* graphique est le tableau regroupant les cellules et leurs informations */
	this.graphique = new Array();
	
	/* après l'avoir déclaré on les initialisent */
	var x = this.start_x;
	var y = this.start_y;
	
	for(var j = 0;j < this.size_x;j++){
		
		var tab_x = new Array(); 
		y = this.start_y + j *(this.height+this.space);
		
		for(var i = 0;i < this.size_y;i++){
			
			x = this.start_x + i *(this.width+this.space);
			tab_x.push(0);
			this.graphique.push(new Cell(x,y,this.width,this.height,j+1,i+1));
		}

		this.matrice.push(tab_x.push);	
	} 	
}

/* La cellule est l'objet contenant les informations sur une case du plateau */
function Cell(x, y, w, h, matrice_x, matrice_y){
	
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
	this.color = "#CCCCCC";
	this.selected = false;
	this.matrice_x = matrice_x;
	this.matrice_y = matrice_y;
	
	this.lineWidth = 4;
}



/* remet la cellule à l'état initial*/
Table.prototype.remove = function(x,y){
	this.matrice[y][x] = 0;
}

/* ajoute un element à la cellule de type shape */
Table.prototype.add = function(x,y,shape){
	this.matrice[y][x] = shape;
}

/* dessine les cellules ssur le context canvas donné avec comme argument la position x et y de depart, ainsi que l'espacement entre les cellules. */
Table.prototype.draw = function(ctx){

	for(var i = 0;i < this.graphique.length;i++){	
		
		var cell = this.graphique[i];
		cell.draw(ctx);
	}
}


Table.prototype.clear = function(ctx){

	for(var i = 0;i < this.graphique.length;i++){	
		
		var cell = this.graphique[i];
		cell.clear(ctx);
	}
}


Cell.prototype.contains = function(mx, my) {
  
  return  (this.x <= mx) && (this.x + this.width >= mx) &&
          (this.y <= my) && (this.y + this.height >= my);
}


Cell.prototype.draw = function(ctx){
		
		var radius = 20;
		var r = this.x + this.width;
		var b = this.y + this.height;
	  
		ctx.beginPath();
		if(this.selected){
			ctx.strokeStyle = "red";
		}else{
			ctx.strokeStyle = this.color;
		}
		ctx.lineWidth=this.lineWidth;
		ctx.moveTo(this.x+radius, this.y);
		ctx.lineTo(r-radius, this.y);
		ctx.quadraticCurveTo(r, this.y, r, this.y+radius);
		ctx.lineTo(r, this.y+this.height-radius);
		ctx.quadraticCurveTo(r, b, r-radius, b);
		ctx.lineTo(this.x+radius, b);
		ctx.quadraticCurveTo(this.x, b, this.x, b-radius);
		ctx.lineTo(this.x, this.y+radius);
		ctx.quadraticCurveTo(this.x, this.y, this.x+radius, this.y);
		ctx.stroke();

		ctx.closePath();
		ctx.fillStyle = this.color;
		ctx.fill();
}

Cell.prototype.clear = function(ctx){
	ctx.clearRect(this.x-this.lineWidth,this.y-this.lineWidth,this.width+(this.lineWidth*2),this.height+(this.lineWidth*2));
}
/*
canvas.addEventListener('mousemove', function(e) {
  
		var mouse = myState.getMouse(e);
		var mx = mouse.x;
		var my = mouse.y;
		var shapes = myState.shapes;
		var l = shapes.length;
		for (var i = l-1; i >= 0; i--) {
			if(typeof(shapes[i]) != "undefined"){
				if(shapes[i].grille == true){
				  if (shapes[i].contains(mx, my)) {
					
					shapes[i].passage = true;
					console.log("Je suis passé : "+i);
					myState.indice_over = i;
					//myState.targetCase = shapes[i];
					//alert("target_case x ");
					//$("#nom").html(mySel.nom).text();
					//$("#proprietaire").html(mySel.proprietaire).text();
					//$("#temps_restant").html(mySel.temps_restant);
					//myState.dragoffx = mx - mySel.x;
					//myState.dragoffy = my - mySel.y;
					//myState.dragging = true;
					//myState.selection = mySel;
					myState.valid = false;
					//return;
				  }else{
					//alert("target");
					shapes[i].passage = false;
					
					//myState.targetCase = null;
				  }
				}
			}
		}
	
  }, true);*/