
function Pieces(){
    
    this.shapes = new Array();
   
}

Pieces.prototype.draw = function(ctx) {
    
    for(var i =0;i<this.shapes.length;i++){
        if(typeof(this.shapes[i]) != "undefined"){
            this.shapes[i].draw(ctx);
        }
    }
}

Pieces.prototype.add = function(shape){
	
    this.shapes.push(shape);
}


Pieces.prototype.remove = function(indice){
	
    if(indice < this.shapes.length){
        this.shapes.splice(indice,1);
    }
}

Pieces.prototype.clear = function(ctx){
	
    for(var i =0;i<this.shapes.length;i++){
        if(typeof(this.shapes[i]) != "undefined"){
            this.shapes[i].clear(ctx);
        }
    }
}

/*
	La Shape représente la piece qui permettra à l'utilisateur de jouer au jeu.
	
	les arguments x et y représente les coordonnées de la pièce, w et h sont respectivement la largeur et la hauteur et fill la couleur de la pièce
*/
function Shape(x, y, w, h, weight, fill) {

    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.weight = weight;

    this.select = false;
    this.fill = fill || "#0128ed";
    this.lineWidth = "4";
    this.text_color = "rgba(121, 195, 201, 0.81)";
    
    this.initial_x = x;
    this.initial_y = y;
}

Shape.prototype.init = function(){
    
    this.x = this.initial_x;
    this.y = this.initial_y;
}

Shape.prototype.draw = function(ctx) {
  
    var radius = 20;
    var r = this.x + this.width;
    var b = this.y + this.height;

    ctx.beginPath();

    if(this.select){
        ctx.strokeStyle = "red";
    }else{
         ctx.strokeStyle = this.fill;
    }
    // ctx.strokeStyle = "red";
   

    ctx.lineWidth = this.lineWidth;
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
    ctx.fillStyle = this.fill;
    ctx.fill();
    ctx.font = 'italic 30pt Calibri';
    ctx.fillStyle = this.text_color;
    //console.log(this.text_color);
    ctx.fillText(this.weight, this.x+(this.width/4), this.y+(this.height/1.5));

}

Shape.prototype.contains = function(mx, my) {
  // All we have to do is make sure the Mouse X,Y fall in the area between
  // the shape's X and (X + Height) and its Y and (Y + Height)
  return  (this.x <= mx) && (this.x + this.width >= mx) &&
          (this.y <= my) && (this.y + this.height >= my);
}

Shape.prototype.clear = function(ctx){
	ctx.clearRect(this.x-this.lineWidth,this.y-this.lineWidth,this.width+(this.lineWidth*2),this.height+(this.lineWidth*2));
}