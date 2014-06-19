/* Represente un joueur avec un nom, les caractéristiques du personnage comme le score la couleur 
des rocks etc... */
function Players(id,nom,color_shape,score,weight_shapes){
    
    /* le nom du personnage */
    this.nom = nom;
    
    /* l'identifiant du personnage */
    
    this.identifiant = id;
    
    /* couleur du rock du joueur*/
    this.color_shape = color_shape;
    
    /* score du joueur */
    this.score = score;
   
    /* les 3 poids que le joueur souhaite avoir dans son jeu */
    this.weight_shapes = weight_shapes;
    
     /* on définit l'objet Pieces qui ressence les différentes rocks créés qui seront affiché sur le plateau */
    this.pieces = new Pieces();
    
    /**/
    //this.shape_cinq = new Shape(280, 410, 70, 70, 5);
    //this.shape_dix = new Shape(450, 410, 70, 70, 10);
    //this.shape_quinze = new Shape(620, 410, 70, 70, 15);
    
    for(var i = 0;i<this.weight_shapes.length;i++){
        this.pieces.add(new Shape(280 + (170*i), 410, 70, 70,this.weight_shapes[i]));
    }
}
