/***************************************************************************************

Classe : Cell 

La classe Cell représente une cellule du plateau de jeu, avec ces coordonnées en x et y, 
ses dimensions et sa localisation x et y dans la matrice de jeu.

***************************************************************************************/


/*
    "Constructeur" on l'initialise avec la position en x et y sur le canvas, pour les dimensions
    la largeur avec w, la hauteur avec h, la dimension de l'hexagone avec "@dimension", et sa localisation dans la représentation matricielle
    avec x "@matriceX" et y "@matriceY" les indexes dans cette matrice.

*/

function CellMulti(x, y, w, h, dimension, matriceX, matriceY, ctx) {

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
    this.ctx = ctx;
    
    this.type = "Cell";
}

/*
    La fonction draw permet d'affiché la cellule sur le canvas
    @Method : affichage
*/

CellMulti.prototype.draw = function(){

    var wide = this.dimension;

    this.ctx.shadowColor = "black";

    this.ctx.beginPath();
    if(this.selected){
        this.ctx.strokeStyle = "red";
    }else{
        this.ctx.strokeStyle = this.color;
    }
    this.ctx.lineWidth=this.lineWidth;
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(this.x+wide, this.y);
    this.ctx.lineTo(this.x+(wide*2), this.y+wide);
    this.ctx.lineTo(this.x+(wide*2), this.y+(wide*2));
    this.ctx.lineTo(this.x+wide, this.y+(wide*3));
    this.ctx.lineTo(this.x, this.y+(wide*3));
    this.ctx.lineTo(this.x-wide, this.y+(wide*2));
    this.ctx.lineTo(this.x-wide, this.y+wide);
    this.ctx.lineTo(this.x, this.y);
    this.ctx.stroke();

    this.ctx.closePath();
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    this.ctx.shadowColor = "black";
}


/* contains permet de savoir si la position mx,my fait partie de la cellule*/
CellMulti.prototype.contains = function(mx, my) {
  /* All we have to do is make sure the Mouse X,Y fall in the area between
   the shape's X and (X + Height) and its Y and (Y + Height)*/
    
  return  (this.x <= mx) && (this.x + this.width >= mx) &&
          (this.y <= my) && (this.y + this.height >= my);
}