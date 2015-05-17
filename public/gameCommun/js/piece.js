/* La Piece représente l'ensemble des rocks
 * qui seront mis à disposition dans le jeu
 */
function Pieces(){
    this.shapes = [];
}

/* La fonction permet de dessiner
 * l'ensemble des pieces/rocks contenu dans l'objet
 */
Pieces.prototype.draw = function(ctx) {

    for(var i =0;i<this.shapes.length;i++){
        if(typeof(this.shapes[i]) != "undefined"){
            this.shapes[i].draw(ctx);
        }
    }
};

/* La fonction changeColor permet de definir
 * la couleur de l'ensemble des pieces/rocks contenu dans l'objet
 */
Pieces.prototype.changeColor = function(color,textColor) {

    for(var i =0;i<this.shapes.length;i++){
        if(typeof(this.shapes[i]) != "undefined"){
            this.shapes[i].fill = color;
            this.shapes[i].textColor = textColor || "rgba(121, 195, 201, 0.81)";
        }
    }
};


/* permet d'ajouter un rock à l'ensemble */
Pieces.prototype.add = function(shape){
	//console.log(shape.image);
    this.shapes.push(shape);
};

/* permet de supprimer un rock en précisant l'indice */
Pieces.prototype.remove = function(indice){

    if(indice < this.shapes.length){
        this.shapes.splice(indice,1);
    }
};

/* permet de supprimer graphiquement l'ensemble des rocks*/
Pieces.prototype.clear = function(ctx){

    for(var i =0;i<this.shapes.length;i++){
        if(typeof(this.shapes[i]) != "undefined"){
            this.shapes[i].clear(ctx);
        }
    }
};

/*
	La Shape représente la piece qui permettra à l'utilisateur de jouer au jeu.

	les arguments x et y représente les coordonnées de la pièce, w et h sont
    respectivement la largeur et la hauteur et fill la couleur de la pièce
*/
function Shape(x, y, w, h, weight, fill, img) {

    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.weight = weight;

    this.idProprietaire = -1;
    this.select = false;
    this.fill = fill || "#0128ed";
    this.lineWidth = "1";
    this.textColor = "rgba(121, 195, 201, 0.81)";

    this.initialX = x;
    this.initialY = y;

    this.image = img || null;

    this.type="Shape";

}

/* init est la fonction qui permet de remettre
 * la position d'une shape à l'endroit de sa création
 */
Shape.prototype.init = function(){

    this.x = this.initialX;
    this.y = this.initialY;
};

/* draw permet de dessiner une shape */
Shape.prototype.draw = function(ctx) {

    ctx.save();
    var radius = 20;
    var r = this.x + this.width;
    var b = this.y + this.height;

    ctx.beginPath();

    if(this.select){
        ctx.strokeStyle = "red";
    }else{
         ctx.strokeStyle = this.fill;
    }



    var xImg = parseInt(this.x)+parseInt(this.lineWidth);
    var yImg = parseInt(this.y)+parseInt(this.lineWidth);
    var wImg = parseInt(this.width)-parseInt(this.lineWidth);
    var hImg = parseInt(this.height)-parseInt(this.lineWidth);

    ctx.drawImage(this.image, xImg, yImg, wImg, hImg);


    ctx.font = this.width/2.8+"pt "+fontScore;
    if(parseInt(this.weight)<10){
        writeMessage(ctx, this.weight, this.fill, (this.x + (this.width/2.8)),
                (this.y + (this.height/1.6)), 1);
    }else{
        writeMessage(ctx, this.weight, this.fill, (this.x + (this.width/3.5)),
                (this.y + (this.height/1.6)), 1);
    }

    ctx.restore();

};

/* contains permet de savoir si la position mx,my fait partie de la shape*/
Shape.prototype.contains = function(mx, my) {
  /* All we have to do is make sure the Mouse X,Y fall in the area between
   the shape's X and (X + Height) and its Y and (Y + Height)*/
  return  (this.x <= mx) && (this.x + this.width >= mx) &&
          (this.y <= my) && (this.y + this.height >= my);
};

/* clear supprime graphique l'élément shape*/
Shape.prototype.clear = function(ctx){

	ctx.clearRect(this.x-this.lineWidth,
        this.y-this.lineWidth,
        this.width+(this.lineWidth*2),
        this.height+(this.lineWidth*2));
};


/* Draw a star */
Shape.prototype.drawStar = function(ctx, r, p, m){
    ctx.save();
    ctx.strokeStyle = "#e74c3c";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.translate(this.x, this.y);
    ctx.moveTo(0, 0 - r);

    for (var i = 0; i < p; i++)
    {
        ctx.rotate(Math.PI / p);
        ctx.lineTo(0, 0 - (r*m));
        ctx.rotate(Math.PI / p);
        ctx.lineTo(0, 0 - r);
    }

    ctx.fillStyle = this.fill;
    ctx.fill();
    ctx.restore();
};
