/*
	Le Table représente le plateau de jeu il est modulable en x et en y. Nous avons différentes méthodes qui nous permette d'ajouter ou de supprimer les éléments de la matrice. les 0 représente une case vide, sinon l'élément contiendra l'objet de type shape.
	
	Les deux arguments représentent la taille de la matrice en x et en y, ensuite nous avons start_x et start_y qui sont les coordonnées qui indique ou le plateau commencera à être dessiné et le dernier space représente l'écart qu'il existe entre deux cases du plateau.
*/


function Table(size_x, size_y, start_x, start_y, space){

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
    this.just_add = false;
    this.evenement_score = null;
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
    this.just_add = true;
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
        
	}
}

/* La fonction search permet de retrouver la cellule du plateau qui est associée à la matrix  */

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

/*La fonction gravity permet d'appliquer une certaine gravité au pièce du plateau */

Table.prototype.gravity = function(){

    fini = false;
	for(var i = 0;i < this.size_y;i++){	
        
		for(var j = this.size_x-1;j >= 0;j--){
            if(this.matrice[j][i] != 0){
                var end = true;
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
    if(fini == false && this.just_add == true){
        fini = true;
    }
    this.just_add = false;
    return fini;
}

/* la fonction force pemet d'appliquer une force aux pièces afin de se briser si la force est trop forte */

Table.prototype.force = function(state_game){
    
    var point_gagne = {point:0,proprietaire:"none",end:false};
    
    for(var i = 0;i < this.size_y;i++){	
        
        for(var k = this.size_x-1; k>=0 ;k--){

            if(this.matrice[k][i] != 0){

                var item_wheight = this.matrice[k][i].weight;

                var somme = 0;
                for(var j = k;j >=0;j--){

                    if(j-1 >= 0){

                        if(this.matrice[j-1][i] != 0){

                            somme += this.matrice[j-1][i].weight;
                       }

                   }

                }

                if((item_wheight+item_wheight) < somme ){
                    point_gagne.end = true;
                    point_gagne.point = this.matrice[k][i].weight * 2;
                    point_gagne.proprietaire = this.matrice[k][i].id_proprietaire;
                    
                    this.addScore("user-sore-points", state_game, point_gagne);
                    write_score(state_game,"+"+point_gagne.point,this.matrice[k][i].x,this.matrice[k][i].y);
                    this.matrice[k][i] = 0;
                }
            }   
        }    
        
    }
    
    return point_gagne;
    
}

/*La fonction write_score permet d'affichier les points gagnés lors de la destruction d'une pièce/rock et l'anime vers le haut */

function write_score(state_game, message, x, y){
    
    state_game.ctx.fillStyle = "rgba(25, 23, 23, 0.8)";
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

/* addScore permet d'ajouter des points au score du joueur */

Table.prototype.addScore = function(id_container, state_game, points){
    
    var plys = state_game.findPlayerById(state_game.players,points.proprietaire);
    
    if(plys != null){   
        var score = plys.score;
        plys.score = score + points.point;
    }
    
    /*if(plys.identifiant == state_game.active_players.identifiant){
        score_actual.
    }*/
    
    if(this.evenement_score == null){
         
       this.evenement_score = setInterval(function(){
                score = parseInt($("#"+id_container).html());
          
                if(score<state_game.active_players.score){
                    score++;
                    $("#"+id_container).html(score);
                }else{
                    clearInterval(this);
                }
        },50);
    }
}

/* removeScore permet de diminuer le score du joueur */

Table.prototype.removeScore = function(id_container, state_game, points){
    
    var plys = state_game.findPlayerById(state_game.players,points.proprietaire);
    
    if(plys != null){   
        var score = plys.score;
        plys.score = score - points.point;
    }
    
    /*if(plys.identifiant == state_game.active_players.identifiant){
        score_actual.
    }*/
    
    if(this.evenement_score == null){
         
       this.evenement_score = setInterval(function(){
                score = parseInt($("#"+id_container).html());
          
                if(score>state_game.active_players.score){
                    score--;
                    $("#"+id_container).html(score);
                }else{
                    clearInterval(this);
                }
        },50);
    }
    
}

/*La fonction initialiseScore permet d'initialiser le score du joueur avec un nombre de point spécifique */

Table.prototype.initialiseScore = function(id_container, id_name, state_game, points){
    
    state_game.active_players.score = points;
    $("#"+id_container).html(""+points);
    $("#"+id_name).html(state_game.active_players.nom);
}

/* la fonction permet de supprimer graphiquement chaque cellule du plateau du canvas */

Table.prototype.clear = function(ctx){

	for(var i = 0;i < this.graphique.length;i++){	
		
		var cell = this.graphique[i];
		cell.clear(ctx);
	}
}

/*La fonction contains permet de vérifier si la position de la souris est sur la cellule généralement utilisé sur l'event mousedown */

Cell.prototype.contains = function(mx, my) {
  
  return  (this.x <= mx) && (this.x + this.width >= mx) &&
          (this.y <= my) && (this.y + this.height >= my);
}


/* cell draw permet de dessiner sur la canvas la cellule avec les coordonnées de celle-ci */

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


/* La fonction clear permet de supprimer la cellule sur le canvas */

Cell.prototype.clear = function(ctx){
	ctx.clearRect(this.x-this.lineWidth,this.y-this.lineWidth,this.width+(this.lineWidth*2),this.height+(this.lineWidth*2));
}

/* verification si en un point x,y il existe une diagonal d'un joueur */
Table.prototype.verification_diagonale = function(x,y){
    
    
    var diagonal = new Array();
    
    if(this.matrice[x][y] != 0){
        var id = this.matrice[x][y].id_proprietaire;
        var compt = 1;
        var find = false;
        var i = 1, j = 1 ;
        diagonal.push({"x":x,"y":y});
        
        while(x-i >= 0 && y+j < this.size_y && !find){

            if(this.matrice[x-i][y+j] != 0 && id == this.matrice[x-i][y+j].id_proprietaire){
                compt++;
                diagonal.push({"x":x-i,"y":y+j});
                console.log("compte : "+compt);
                if(compt>=4){
                    find = true;
                }
            }else if(this.matrice[x-i][y+j] != 0){
                id = this.matrice[x-i][y+j].id_proprietaire;
                diagonal = new Array();
                diagonal.push({"x":x-i,"y":y+j});
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
            id = this.matrice[x][y].id_proprietaire;
            diagonal = new Array();
            diagonal.push({"x":x-i,"y":y+j});
            i = 1;
            j = 1;
            compt = 1;
            while(x+i < this.size_x && y+j < this.size_y && !find){

                if(this.matrice[x+i][y+j] != 0 && id == this.matrice[x+i][y+j].id_proprietaire){
                    diagonal.push({"x":x-i,"y":y+j});
                    compt++;
                
                    if(compt>=4){
                        find = true;
                    }
                }else if(this.matrice[x+i][y+j] != 0){
                    id = this.matrice[x+i][y+j].id_proprietaire;
                    diagonal = new Array();
                    diagonal.push({"x":x+i,"y":y+j});
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



/* Verification si un joueur à gagner */
Table.prototype.find_four = function(){
    
    var i = 0,j=0;
    find = false;
    var id = -1;
    var compt = 0;
    var aligner = new Array();
    
    while(i < this.size_x && !find){	
     
        compt = 0;
        var j = 0;
        
        while(j < this.size_y && compt < 4){	
         
            if(this.matrice[i][j] != 0){
                if(this.matrice[i][j].id_proprietaire == id){
                    compt++;
                    aligner.push({"x":i,"y":j});
                }else{
                    aligner = new Array();
                    aligner.push({"x":i,"y":j});
                    compt = 1;
                    id = this.matrice[i][j].id_proprietaire;
                }
            }else{
                id = -1;
                aligner = new Array();
                compt = 1;
            }
            j++;
        
       
            if(compt >= 4){
                
                find = true;
                for(var k = 0;k<aligner.length;k++){
                    this.matrice[aligner[k].x][aligner[k].y] = 0;
                }
            }
        }
        i++;
    }
    
   
   if(!find){
       
        i = 0;
         while(i < this.size_y && !find){	

            compt = 0;
            j = 0;
        
            while(j < this.size_x && compt < 4){	
                
                if(this.matrice[j][i] != 0){
                    
                    if(this.matrice[j][i].id_proprietaire == id){
                         aligner.push({"x":j,"y":i});
                        compt++;
                    }else{
                        aligner = new Array();
                        aligner.push({"x":i,"y":j});
                        compt = 1; 
                        id = this.matrice[j][i].id_proprietaire;
                    }
                }else{
                     aligner = new Array();
                    id = -1;
                    compt = 1;
                }
                j++;

                if(compt >= 4){
                    find = true;
                    for(var k = 0;k<aligner.length;k++){
                        this.matrice[aligner[k].x][aligner[k].y] = 0;
                    }
                }
            }
            i++;
        }
   }

    if(!find){
        i = 0;
         while(i < this.size_x && !find){	

             j = 0;
        
            while(j < this.size_y && !find){	
                
                    if(this.matrice[i][j] != 0){
                        var test = this.verification_diagonale(i,j);
                        
                        if(test.find){
                            
                           find = true;
                            id = test.id;
                            for(var k = 0;k<test.case.length;k++){
                                this.matrice[test.case[k].x][test.case[k].y] = 0;
                            }
                        }
                    }
                    j++;
                }
            if(compt >= 4){
                find = true;
            }

            i++;
        }
    }
    
    
    
    return {"find":find,"id":id};
    
}