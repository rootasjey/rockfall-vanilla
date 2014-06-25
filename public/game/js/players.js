/* Represente un joueur avec un nom, les caractéristiques du personnage comme le score la couleur 
des rocks etc... */
function Players(id,nom,color_shape,score,weight_shapes){
    
    /* le nom du personnage */
    this.nom = nom;
    
    /* l'identifiant du personnage */
    
    this.identifiant = id;
    
    /* couleur du rock du joueur*/
    this.color_shape = color_shape;
    
    
    /* le nombre de point du joueur */
    this.point = 0;
    
    
    /* score du joueur */
    this.score = score;
   
    /* les 3 poids que le joueur souhaite avoir dans son jeu */
    this.weight_shapes = weight_shapes;
    
     /* on définit l'objet Pieces qui ressence les différentes rocks créés qui seront affiché sur le plateau */
    this.pieces = new Pieces();
    
    /**/
    /*this.ready = false;
    
    this.img = new Image();
     this.img.onload = function(){ 
        state_pl.loadImg();        
    };*/
    //img.onerror=function(){alert("image load failed");} 
    //img.crossOrigin="anonymous";
     this.image = null ;
    /*
    for(var i = 0;i<this.weight_shapes.length;i++){
        this.pieces.add(new Shape(280 + (170*i), 410, 70, 70,this.weight_shapes[i]));
    }*/
    //this.ready = true;
    /*
    for(var i = 0;i<this.weight_shapes.length;i++){
        this.pieces.add(new Shape(280 + (170*i), 410, 70, 70,this.weight_shapes[i],img));
    }*/
    
    //state_pl = this;
    
    this.power_active = null;
}


Players.prototype.getPiece = function(){
    
    for(var i = 0;i<this.weight_shapes.length;i++){
        //console.log(this.image);
        var shape = new Shape(280 + (170*i), 410, 70, 70,this.weight_shapes[i]);
        shape.image = this.image;
        this.pieces.add(shape);
    }
    
}
/*
Players.prototype.loadImg = function(){
    //console.log("rtr");
    for(var i = 0;i<this.weight_shapes.length;i++){
        this.pieces.add(new Shape(280 + (170*i), 410, 70, 70,this.weight_shapes[i], this.img));
    }
    this.ready = true;
}*/