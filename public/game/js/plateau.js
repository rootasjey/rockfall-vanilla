/*
	Le Table représente le plateau de jeu il est modulable en x et en y. Nous avons différentes méthodes qui nous permette d'ajouter ou de supprimer les éléments de la matrice. les 0 représente une case vide, sinon l'élément contiendra l'objet de type shape.
	
	Les deux arguments représentent la taille de la matrice en x et en y, ensuite nous avons start_x et start_y qui sont les coordonnées qui indique ou le plateau commencera à être dessiné et le dernier space représente l'écart qu'il existe entre deux cases du plateau.
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
	this.width = 70;
	this.height = 70;
	
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
			this.graphique.push(new Cell(x,y,this.width,this.height,j,i));
		}

		this.matrice.push(tab_x);	
	}
    
    this.verification_gravity = false;
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
	this.matrice[x][y] = 0;
}

/* ajoute un element à la cellule de type shape */
Table.prototype.add = function(x,y,shape){
	this.matrice[x][y] = shape;
}

/* dessine les cellules ssur le context canvas donné avec comme argument la position x et y de depart, ainsi que l'espacement entre les cellules. */
Table.prototype.draw = function(ctx){

	for(var i = 0;i < this.graphique.length;i++){	
		 var cell = this.graphique[i];
		if(this.matrice[cell.matrice_x][cell.matrice_y] == 0){
		  cell.draw(ctx);
        }else{
            this.matrice[cell.matrice_x][cell.matrice_y].draw(ctx);
        }
		//var cell = this.graphique[i];
		//cell.draw(ctx);
	}
}

Table.prototype.search = function(matrice_x,matrice_y){
 
    var resultat = null;
    for(var i = 0;i < this.graphique.length;i++){	
		 var cell = this.graphique[i];
        if(cell.matrice_x == matrice_x && cell.matrice_y == matrice_y){
            resultat = cell;
        }
    }
    return resultat;
}


Table.prototype.gravity = function(){

    fini = false;
	for(var i = 0;i < this.size_y;i++){	
        
		for(var j = this.size_x-1;j >= 0;j--){
            if(this.matrice[j][i] != 0){
                var end = true;
                //this.matrice[j][i];
                var k = j
                while(end){
                    if(k == this.size_x-1){
                        end = false;
                    }else{
                        if(this.matrice[k+1][i] == 0){
                            
                            
                           
                            this.matrice[k+1][i] = this.matrice[k][i];
                            var objet = this.search(k+1,i);
                            if(objet != null){
                                this.matrice[k+1][i].x = objet.x;
                                this.matrice[k+1][i].y = objet.y;
                            }
                            this.matrice[k][i]= 0;
                            fini =  true;
                            end = false;
                        }
                    }
                    k++;
                }
            }
        }
   
	}
    return fini;
}


Table.prototype.force = function(state_game){
    
    var point_gagne = 0;
    
    for(var i = 0;i < this.size_y;i++){	
        
		if(this.matrice[this.size_x-1][i] != 0){
            
            var item_wheight = this.matrice[this.size_x-1][i].weight;
            var indice = this.size_x-1;
            
            var somme = 0;
            for(var j = this.size_x-1;j >=0;j--){
               
                if(j-1 >= 0){
                   
                    if(this.matrice[j-1][i] != 0){
                       
                        somme += this.matrice[j-1][i].weight;
                   }
                    
               }
                
            }
            
            if((item_wheight+item_wheight) < somme ){
                point_gagne = this.matrice[this.size_x-1][i].weight * 2;
                write_score(state_game,"+"+point_gagne,this.matrice[this.size_x-1][i].x,this.matrice[this.size_x-1][i].y);//ctx.fillText("+"point_gagne,this.matrice[this.size_x-1][i].x,this.matrice[this.size_x-1][i].y);
                this.matrice[this.size_x-1][i] = 0;
            }
            
        }
        
    }
    return {"points":point_gagne};
    
}


function write_score(state_game, message, x, y){
    
    state_game.ctx.fillStyle = "rgba(25, 23, 23, 0.8)";//state_game.text_color;
    state_game.ctx.font="20px Georgia";
    state_game.ctx.fillText(message,x,y);
    var nmbre = 0;
    setInterval(function(){
    
        if(nmbre<250){
            nmbre -= 5;
            state_game.ctx.fillText(message,x,y + nmbre);
            state_game.valid = false;
        }else{
            clearInterval(this);   
        }
    
    },20);
}


Table.prototype.addScore = function(id_container, state_game, points){
    
    var score = state_game.score;
    
    var score_a_atteindre = score + points;
    state_game.score = score_a_atteindre;
    
    setInterval(function(){
            score = parseInt($("#"+id_container).html());
            if(score<score_a_atteindre){
                score++;
                $("#"+id_container).html(score);
            }else{
                clearInterval(this);
            }
    },50);
}


Table.prototype.removeScore = function(id_container, state_game, points){
    
    var score = state_game.score;
    
    var score_a_atteindre = score - points;
    state_game.score = score_a_atteindre;
    
    setInterval(function(){
            score = parseInt($("#"+id_container).html());
            if(score>score_a_atteindre){
                score--;
                $("#"+id_container).html(score);
            }else{
                clearInterval(this);
            }
    },50);
    
}

Table.prototype.initialiseScore = function(id_container, state_game, points){
    
    state_game.score = points;
    $("#"+id_container).html(""+points);
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
