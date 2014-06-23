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
    
    for(var i = 0;i<this.weight_shapes.length;i++){
        this.pieces.add(new Shape(280 + (170*i), 410, 70, 70,this.weight_shapes[i]));
    }
    
    this.power_active = null;
}
