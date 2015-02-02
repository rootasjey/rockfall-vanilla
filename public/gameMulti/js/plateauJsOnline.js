/***************************************************************************************
	 
Classe : Plateau 
	       
La classe Plateau contient les éléments qui permet l'affiche du plateau sur un 
élément de type canvas. Elle définie le début en position X et Y de l'affichage
sur l'élément, l'espacement entre les objets (ici les cases qui composent le tableau).	
	         
***************************************************************************************/


/*
    "Constructeur" on l'initialise avec les informations comme l'espace entre les case "@space",
    le commencement en X et Y lors de l'affichage sur un élément canvas "@startX", "@startY" et le canvas
    support d'affichage "@canvas".

*/

function Plateau(space, startX, startY, canvas, player, imageIconPiece, textColor){


	/* couleur par defaut des cases du plateau */

	this.color = "#CCCCCC";

	/* Dimension des cases du plateau */

	this.width = 60;
	this.height = 60;
    
    /* Les cases du plateau sont des hexagones et lors de leurs construction il faut une 
        variable ici "@dimension" pour l'affichage */
    this.dimension = 20;
    
    /* "@tabPiece" est le tableau qui regroupe les cases du jeu */
    this.tabPiece = new Array();

    /* piece en jeu*/
    this.pieceInGame = new Array();
    
    //this.selectionCell = {"x":-1,"y":-1};
    
    this.startX = startX;
    this.startY = startY;
    
	this.space = space;
    
    /* le tableau des points générés par la destruction de pièce */
    this.pointToShow = new Array();
    this.canvas = canvas;
    this.ctx = null;
    
    /* information sur le joueur client */
    this.player = null || player;
    
    /* Les cases du plateau de jeu en cours de partie sont remplie avec les pièces des joueurs,
        ces pièces sont des images que nous avons récupéré sur le serveur et stocké dans une variable */
    this.imgPiece = imageIconPiece;
    
    this.textColor = textColor;
    
    this.selectionCell = null;
}


/*
    setPlayer met à jour le joueur client.
    @Method : traitement
*/
Plateau.prototype.setPlayer = function(player){
    this.player = player;
}

/*
    initCtx initialise le context de dessin du canvas.
    
    @Method : traitement
*/

Plateau.prototype.initCtx = function(){
    
    /* le context qui est nécessaire pour le dessin */
    this.ctx = this.canvas.getContext("2d");
}

/*
    initialisePlateau initialise les cellules du plateau

    @Method : traitement
*/
Plateau.prototype.initialisePlateau = function(fluxPlateau){
    
     /* on réinitialise le tableau de pièce contenant les cases pour pouvoir
        ajouter les nouvelles cases après réception des données*/
    this.tabPiece = new Array();
    
    this.pieceInGame = new Array();
    
    /* Dans l'information reçu du server on récupère l'élément que l'on souhaite ici c'est le plateau */
    var plateau = fluxPlateau.plateau;
    
    
    /* On parcours les éléments du plateau qui sont représentés dans un tableau en 2 dimensions et donc les 
       variables "@sizeX" et "@sizeY" représentent le nombre d'éléments sur l'axe des X et Y 
  
          Indice       0            1              2            3           4           5
              0  [[{"item":0}],[{"item":0}],[{"item":0}],[{"item":0}],[{"item":0}],[{"item":0}]]
              
              1  [[{"item":0}],[{"item":0}],[{"item":0}],[{"item":0}],[{"item":0}],[{"item":0}]]
              
              2  [[{"item":0}],[{"item":0}],[{"item":0}],[{"item":0}],[{"item":0}],[{"item":0}]]
              
              3  [[{"item":0}],[{"item":0}],[{"item":0}],[{"item":0}],[{"item":0}],[{"item":0}]]
      
     */
    
    for(var i = 0; i < fluxPlateau.sizeX;i++){
        
		 for(var j = 0;j < fluxPlateau.sizeY;j++){
            
             if(plateau[i][j].item == 0){
                 
                 /* un "@item" égal à 0 représente la case vide, donc lorsque l'on rencontre ce cas on rajoute dans le tableau la cellule
                 qui correspond graphiquement. */
                 this.tabPiece.push(new CellMulti(this.startX + j *(this.width+this.space), this.startY /*- 420*/ + i *(this.height+this.space), this.width, this.height, this.dimension, i, j, this.ctx));
             }
             
         }

	}
    
}


/*
    "@drawPlateau", "method" de Plateau qui affiche graphiquement sur le canvas définit
    le plateau avec les cases de celui-ci.
    Etant en mode Online les éléments du plateau sont émisent par le server
     et la variable "@flucPlateau" est un élément de cet envoi qui contient
     le plateau de jeux codifié et permet une fois le traitement fini d'avoir 
     un plateau graphique sur le canvas.
     
     @Method : traitement & affichage
    
*/
Plateau.prototype.drawPlateau = function(){
    
    /* Une fois les cases initialisées dans le tableau  on les dessine sur le canvas, on appel la fonction draw de la "Classe" Cell 
        en passant en paramètre la context du canvas */
    
    this.ctx.shadowColor = "black";
    this.ctx.shadowBlur = 4;
    
    for(var i = 0;i < this.tabPiece.length;i++){
            this.tabPiece[i].draw(this.ctx);
    }
    
    for(var j = 0;j < this.pieceInGame.length;j++){
        if(typeof(this.pieceInGame[j]) != "undefined"){
            this.pieceInGame[j].draw(this.ctx);
        }
    }
}

/*
    La "methode" DrawPointRe affiche les points obtenus à la destruction d'une pièce,
    lors de l'affichage des points il y a une petite animation les montrants bouger.
    Pour se faire, la position des points sera modifié par une autre méthode.

    @Method : traitement + affichage
*/

Plateau.prototype.drawPointRe = function (){
        
    for(var i = 0; i<this.pointToShow.length;i++){
        /* pour chaque point on vérifie si il a parcouru une distance suffisante, 
            ici 1/10 de la hauteur du canvas avant de la rendre inactive et donc de ne plus l'afficher
        */
        if(parseInt(this.pointToShow[i].highEff) >= parseInt($(this.canvas).height())/10){
            
            this.pointToShow[i].active = false;
            this.pointToShow.splice(i,1);
        }else{
            if(this.pointToShow[i].active){
                this.ctx.fillStyle = this.pointToShow[i].color;
                this.ctx.font="50pt Arial";
                this.ctx.shadowColor = "black";
                this.pointToShow[i].highEff += 5;
                /* "@WriteMessage" function ligne 68 du fichier globals.js  */
                writeMessage(this.ctx, "+"+this.pointToShow[i].point, this.pointToShow[i].color, this.startX + this.pointToShow[i].y *(this.width+this.space),this.startY /*- 420*/ + this.pointToShow[i].x*(this.height+this.space)-this.pointToShow[i].highEff,1);
            }
        }

    }
    
}


/* 
    fonction qui efface tout les éléments du canvas
    @Method : affichage
*/

Plateau.prototype.clear = function(){

    this.ctx.clearRect(0,0,this.canvasWidth,this.canvasHeight);
}

/* 
    La fonction drawInfo permet d'afficher les informations sur la partie comme le nombre de temps restant 
    @Method : affichage
*/

Plateau.prototype.drawInfo = function(timeSecondGame){

    /* Ligne de séparation entre le plateau de jeu et les pieces */

    this.ctx.beginPath();
    this.ctx.rect(205, 380, this.canvas.width/1.75, 5);
    this.ctx.closePath();
    this.ctx.fillStyle = this.textColor;
    this.ctx.fill();

    /* Le texte qui permet d'afficher le temps du tour. */

    this.ctx.font = "40pt Calibri";
    this.ctx.fillStyle = this.textColor;
    this.ctx.fillText(timeSecondGame, 60, 460);

}


/* 

    Fonction qui prend en charge l'affichage d'hit et de combo
    @Method : affichage

*/

Plateau.prototype.drawCombo = function(combo){

    var hitMessage = "";
    var sizeCombo = 40;
    var hitColor = "black";

    if(combo == 1){

        hitMessage = " 1 Hit";
        hitColor = "black";

    }else if(combo == 2){

        hitMessage = " +2 Hits";
        hitColor = "black";

    }else if(combo == 3){

        hitMessage = " +3 Hits";
        hitColor = "black";

    }else if(combo >= 4){

        hitMessage = " +"+combo+" Combo";
        hitColor = "red";
    }

    
    this.ctx.shadowColor = "#8888e8";
    this.ctx.shadowBlur = 8;

    this.ctx.save();
    this.ctx.translate(700, 100);
    
    this.ctx.textAlign = "center";
    this.ctx.rotate(Math.PI/4);

    this.ctx.font = "italic "+sizeCombo+"pt Calibri";
    writeMessage(this.ctx, hitMessage, hitColor, 0, 0, 3);
    this.ctx.restore();

    this.ctx.shadowColor = "black";
    this.ctx.shadowBlur = 8;
}
