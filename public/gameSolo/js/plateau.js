/*
	Le Table représente le plateau de jeu il est modulable en x et en y.
	Nous avons différentes méthodes qui nous permette d'ajouter ou de
	 supprimer les éléments de la matrice. les 0 représente une case vide,
	sinon l'élément contiendra l'objet de type shape.

	Les deux arguments représentent la taille de la matrice en x et en y,
	ensuite nous avons startX et startY qui sont les coordonnées qui indique
	ou le plateau commencera à être dessiné et le dernier space représente
	 l'écart qu'il existe entre deux cases du plateau.
*/


function Table(sizeX, sizeY, startX, startY, space){

	/* La Table du jeu

		[[0,0,0,0,0],
		 [0,0,0,0,0],
		 [0,0,0,0,0],
		 [0,0,0,0,0],
		 [0,0,0,0,0]]

	donc x définie la ligne
	et y la colonne c'est une matrice carré */

	this.sizeX = sizeX;
	this.sizeY = sizeY;

	/* couleur par defaut des cases du plateau */
	this.color = "#CCCCCC";

	/* Dimension des cases du plateau */
	this.width = 60;
	this.height = 60;
    this.dimension = 20;

	/* Les données de départ qui serviront pour la représentation graphique */
	this.startX = startX;
	this.startY = startY;
	this.space = space;

	/* matrice est la variable qui contient la matrice */
	this.matrice = [];

	/* graphique est le tableau regroupant les cellules et leurs informations */
	this.graphique = [];

	/* après l'avoir déclaré on les initialisent */
	var x = this.startX;
	var y = this.startY;

	for(var j = 0;j < this.sizeX;j++){

		var tabX = [];
		y = this.startY + j *(this.height + this.space);

		for(var i = 0; i < this.sizeY; i++){

			x = this.startX + i *(this.width + this.space);
			tabX.push(0);
			this.graphique.push(new Cell(x, y, this.width, this.height, this.dimension, j, i));
		}

		this.matrice.push(tabX);
	}

    this.verificationGravity = false;
    this.justAdd = false;
    this.evenementScore = null;
}


/* La cellule est l'objet contenant les informations sur une case du plateau */

function Cell(x, y, w, h, dimension, matriceX, matriceY){

	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
    this.dimension = dimension;
	this.color = "#CCCCCC";
	this.selected = false;
	this.matriceX = matriceX;
	this.matriceY = matriceY;

	this.lineWidth = 4;
}



/* remet la cellule à l'état initial*/

Table.prototype.remove = function(x,y){
	this.matrice[x][y] = 0;
};

/* ajoute un element à la cellule de type shape */

Table.prototype.add = function(x,y,shape){
	this.matrice[x][y] = shape;
    this.justAdd = true;
};

/* dessine les cellules ssur le context canvas donné
avec comme argument la position x et y de depart,
ainsi que l'espacement entre les cellules. */

Table.prototype.draw = function(ctx){

	for(var i = 0;i < this.graphique.length;i++){
		 var cell = this.graphique[i];
		if(this.matrice[cell.matriceX][cell.matriceY] === 0){
		  cell.draw(ctx);
        }else{
            this.matrice[cell.matriceX][cell.matriceY].draw(ctx);
        }

	}
};

/* La fonction search permet de retrouver la cellule du plateau qui est associée à la matrix  */

Table.prototype.search = function(matriceX,matriceY){

    var resultat = null;
    for(var i = 0;i < this.graphique.length;i++){
		 var cell = this.graphique[i];
        if(cell.matriceX == matriceX && cell.matriceY == matriceY){
            resultat = cell;
        }
    }
    return resultat;
};

/*La fonction gravity permet d'appliquer une certaine gravité aux pièces du plateau */

Table.prototype.gravity = function(){

    fini = false;
	for(var i = 0;i < this.sizeY;i++){

		for(var j = this.sizeX-1;j >= 0;j--){
            if(this.matrice[j][i] !== 0){
                var end = true;
                var k = j;
                while(end){
                    if(k == this.sizeX-1){
                        end = false;
                    }else{
                        if(this.matrice[k+1][i] === 0){

                            this.matrice[k+1][i] = this.matrice[k][i];
                            var objet = this.search(k+1,i);
                            if(objet !== null){
                                this.matrice[k+1][i].x = objet.x-(objet.width/2);
                                this.matrice[k+1][i].y = objet.y-(objet.height/4.5);
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
    if(fini === false && this.justAdd === true){
        fini = true;
    }
    this.justAdd = false;
    return fini;
};

/* la fonction force pemet d'appliquer une force aux pièces afin de se briser si la force est trop forte */

Table.prototype.force = function(stateGame){

    var pointGagne = {point:0,proprietaire:"none",end:false,color:"grey"};

    for(var i = 0;i < this.sizeY;i++){

        for(var k = this.sizeX-1; k>=0 ;k--){

            if(this.matrice[k][i] !== 0){

                var itemWheight = this.matrice[k][i].weight;

                var somme = 0;
                for(var j = k;j >=0;j--){

                    if(j-1 >= 0){

                        if(this.matrice[j-1][i] !== 0){

                            somme += this.matrice[j-1][i].weight;
                       }

                   }

                }

                if((itemWheight+itemWheight) < somme ){
                    stateGame.hitCombo += 1;
                    pointGagne.end = true;
                    pointGagne.point = this.matrice[k][i].weight * 2 ;
                    pointGagne.color = this.matrice[k][i].fill;
                    pointGagne.proprietaire = this.matrice[k][i].idProprietaire;

                    if(pointGagne.proprietaire == stateGame.comboMaker.id){
                       pointGagne.point = parseInt(pointGagne.point *  (stateGame.hitCombo/(stateGame.hitCombo - 0.1 * stateGame.hitCombo)));
                    }

                    this.addScore("user-score-points", stateGame, pointGagne);
                    stateGame.addDrawPoints("+"+pointGagne.point, this.matrice[k][i].x, this.matrice[k][i].y, pointGagne.color);

                    this.matrice[k][i] = 0;
                }
            }
        }

    }

    return pointGagne;

};

/* addScore permet d'ajouter des points au score du joueur */

Table.prototype.addScore = function(idContainer, stateGame, points){

    var plys = stateGame.findPlayerById(stateGame.players,points.proprietaire);

    if(plys !== null){
        stateGame.scoreSignal = true;
        plys.changeScore(idContainer,points.point,stateGame);
    }
};

/* removeScore permet de diminuer le score du joueur */

Table.prototype.removeScore = function(idContainer, stateGame, points){

    var plys = stateGame.findPlayerById(stateGame.players,points.proprietaire);

    if(plys !== null){
        stateGame.scoreSignal = true;
        plys.changeScore(idContainer, -points, stateGame);
    }
};

/*La fonction initialiseScore permet d'initialiser le score du joueur avec un nombre de point spécifique */

Table.prototype.initialiseScore = function(idContainer, idName, stateGame, points){

    stateGame.activePlayers.score = points;
    $("#"+idContainer).html(""+points);
    $("#"+idName).html(stateGame.activePlayers.nom);
};

/* la fonction permet de supprimer graphiquement chaque cellule du plateau du canvas */

Table.prototype.clear = function(ctx){

	for(var i = 0;i < this.graphique.length;i++){

		var cell = this.graphique[i];
		cell.clear(ctx);
	}
};

/*La fonction contains permet de vérifier si la position de la souris est sur la cellule généralement utilisé sur l'event mousedown */

Cell.prototype.contains = function(mx, my) {

  return  (this.x <= mx) && (this.x + this.width >= mx) &&
          (this.y <= my) && (this.y + this.height >= my);
};


/* cell draw permet de dessiner sur la canvas la cellule avec les coordonnées de celle-ci */

Cell.prototype.draw = function(ctx){

    /*
        ctx.shadowColor = "black";
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
        ctx.shadowColor = "black";
        */

        var wide = this.dimension;

        ctx.shadowColor = "black";

		ctx.beginPath();
		if(this.selected){
			ctx.strokeStyle = "red";
		}else{
			ctx.strokeStyle = this.color;
		}
		ctx.lineWidth=this.lineWidth;

        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x+wide, this.y);
        ctx.lineTo(this.x+(wide*2), this.y+wide);
        ctx.lineTo(this.x+(wide*2), this.y+(wide*2));
        ctx.lineTo(this.x+wide, this.y+(wide*3));
        ctx.lineTo(this.x, this.y+(wide*3));
        ctx.lineTo(this.x-wide, this.y+(wide*2));
        ctx.lineTo(this.x-wide, this.y+wide);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();

        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.shadowColor = "black";
};


/* La fonction clear permet de supprimer la cellule sur le canvas */

Cell.prototype.clear = function(ctx){
	ctx.clearRect(this.x-this.lineWidth,this.y-this.lineWidth,this.width+(this.lineWidth*2),this.height+(this.lineWidth*2));
};

/* verification si en un point x,y il existe une diagonal d'un joueur */
Table.prototype.verificationDiagonale = function(x, y) {
    var diagonal = [];
	var find = null;
	var id = null;

    if(this.matrice[x][y] !== 0){
        id = this.matrice[x][y].idProprietaire;
        var compt = 1;
        find = false;
        var i = 1, j = 1 ;
        diagonal.push({"x":x,"y":y,"graphX":this.matrice[x][y].x,"graphY":this.matrice[x][y].y,"point":this.matrice[x][y].weight,"color":this.matrice[x][y].fill});

        while(x - i >= 0 && y + j < this.sizeY && !find){

            if(this.matrice[x-i][y+j] !== 0 && id == this.matrice[x-i][y+j].idProprietaire){
                compt++;
                diagonal.push({"x":x-i,"y":y+j,"graphX":this.matrice[x-i][y+j].x,"graphY":this.matrice[x-i][y+j].y,"point":this.matrice[x-i][y+j].weight, "color":this.matrice[x-i][y+j].fill});

                if(compt >= 4){
                    find = true;
                }
            }else if(this.matrice[x-i][y+j] !== 0){
                id = this.matrice[x-i][y+j].idProprietaire;
                diagonal = [];
                diagonal.push({"x":x-i,"y":y+j,"graphX":this.matrice[x-i][y+j].x,"graphY":this.matrice[x-i][y+j].y,"point":this.matrice[x-i][y+j].weight, "color":this.matrice[x-i][y+j].fill});
                compt = 1;
            } else{
                id =-1;
                compt = 1;
                diagonal = [];
            }

            i++;
            j++;
        }

        if( !find ){
            id = this.matrice[x][y].idProprietaire;
            diagonal = [];
            diagonal.push({"x":x,"y":y,"graphX":this.matrice[x][y].x,"graphY":this.matrice[x][y].y,"point":this.matrice[x][y].weight, "color":this.matrice[x][y].fill});
            i = 1;
            j = 1;
            compt = 1;
            while(x+i < this.sizeX && y+j < this.sizeY && !find){

                if(this.matrice[x+i][y+j] !== 0 && id == this.matrice[x+i][y+j].idProprietaire){
                    diagonal.push({"x":x+i,"y":y+j,"graphX":this.matrice[x+i][y+j].x,"graphY":this.matrice[x+i][y+j].y,"point":this.matrice[x+i][y+j].weight, "color":this.matrice[x+i][y+j].fill});
                    compt++;

                    if(compt>=4){
                        find = true;
                    }
                }else if(this.matrice[x+i][y+j] !== 0){
                    id = this.matrice[x+i][y+j].idProprietaire;
                    diagonal = [];
                    var posGraph = this.search(x+i,y+j);
                    diagonal.push({"x":x+i,"y":y+j,"graphX":this.matrice[x+i][y+j].x,"graphY":this.matrice[x+i][y+j].y,"point":this.matrice[x+i][y+j].weight,"color":this.matrice[x+i][y+j].fill});
                    compt = 1;
                }else{
                    id = -1;
                    compt = 1;
                    diagonal = [];
                }


                i++;
                j++;

            }
        }
    }
    return {"find":find, "case":diagonal, "id":id};
};



/* Verification si un joueur à gagner un point en alignant 4 pieces */
Table.prototype.findFour = function(){

    var i = 0;
	var j = 0;
	var k = 0;
    var find = false;
    var id = -1;
    var compt = 0;
    var sommePoint = 0;
    var aligner = [];

    /* verification horizontale */
    while(i < this.sizeX && !find){

        compt = 0;
        j = 0;

        while(j < this.sizeY && compt < 4){

            if(this.matrice[i][j] !== 0){
                if(this.matrice[i][j].idProprietaire == id){
                    compt++;
                    aligner.push({"x":i,"y":j,"graphX":this.matrice[i][j].x,"graphY":this.matrice[i][j].y,"point":this.matrice[i][j].weight, "color":this.matrice[i][j].fill});
                }else{
                    aligner = [];
                    aligner.push({"x":i,"y":j,"graphX":this.matrice[i][j].x,"graphY":this.matrice[i][j].y,"point":this.matrice[i][j].weight,"color":this.matrice[i][j].fill});
                    compt = 1;
                    id = this.matrice[i][j].idProprietaire;
                }
            }else{
                id = -1;
                aligner = [];
                compt = 1;
            }
            j++;


            if(compt >= 4){

                find = true;
                sommePoint = 0;
                for(k = 0; k < aligner.length; k++){
                    sommePoint += this.matrice[aligner[k].x][aligner[k].y].weight;

                    //this.matrice[aligner[k].x][aligner[k].y] = 0;
                }
            }
        }
        i++;
    }

   /* verification verticale */
   if( !find ) {

        i = 0;
         while(i < this.sizeY && !find){

            compt = 0;
            j = 0;

            while(j < this.sizeX && compt < 4){

                if(this.matrice[j][i] !== 0){

                    if(this.matrice[j][i].idProprietaire == id){
                        aligner.push({"x":j,"y":i,"graphX":this.matrice[j][i].x,"graphY":this.matrice[j][i].y,"point":this.matrice[j][i].weight,"color":this.matrice[j][i].fill});
                        compt++;
                    }else{
                        aligner = [];
                        aligner.push({"x":j,"y":i,"graphX":this.matrice[j][i].x,"graphY":this.matrice[j][i].y,"point":this.matrice[j][i].weight, "color": this.matrice[j][i].fill});
                        compt = 1;
                        id = this.matrice[j][i].idProprietaire;
                    }
                }else{
                    aligner = [];
                    id = -1;
                    compt = 1;
                }
                j++;

                if(compt >= 4){

                    find = true;
                    sommePoint = 0;
                    for(k = 0; k < aligner.length; k++) {
                        sommePoint += this.matrice[aligner[k].x][aligner[k].y].weight;
                        //this.matrice[aligner[k].x][aligner[k].y] = 0;
                    }
                }
            }
            i++;
        }
   }

    /* verification diagonale */
    if(!find){
        i = 0;
         while(i < this.sizeX && !find){

             j = 0;

            while(j < this.sizeY && !find){

                    if(this.matrice[i][j] !== 0){
                        var test = this.verificationDiagonale(i,j);

                        if(test.find){

                            find = true;
                            id = test.id;
                            sommePoint = 0;
                            for(k = 0; k<test.case.length; k++){
                                sommePoint += this.matrice[test.case[k].x][test.case[k].y].weight;
                                //this.matrice[test.case[k].x][test.case[k].y] = 0;
                            }
                            aligner = test.case;
                        }
                    }
                    j++;
                }
            i++;
        }
    }


    /*
    if(find){

        for(var k = 0;k<aligner.length;k++){

            this.matrice[aligner[k].x][aligner[k].y].fill = "yellow";
        }

        var matrice = this.matrice;
        var affichResult = $.timer(function() {
            for(var k = 0;k<aligner.length;k++){
                matrice[aligner[k].x][aligner[k].y] = 0;
            }
        });

        affichResult.once({time:500});
    }
    */

    return {"find":find,"id":id,"box":aligner,"point":sommePoint};

};
