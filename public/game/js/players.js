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

    /* tableau de bonus alloué à l'utilisateur*/
    this.power = new Array();
    
    
    this.image = null ;
    
    this.tampon_score = 0;
    this.set_score = null;
    
    
    this.power_active = null;
    
    savePlayer = this;
}


Players.prototype.getPiece = function(){
    
    for(var i = 0;i<this.weight_shapes.length;i++){
        var shape = new Shape(280 + (170*i), 410, 70, 70,this.weight_shapes[i],this.color_shape);
        shape.image = this.image;
        this.pieces.add(shape);
    }
    
}

Players.prototype.changeScore = function(id_container, points, stateGame){
    
    this.score += points;

    savePlayer.tampon_score = this.score;
    var start_score = parseInt($("#"+id_container).html());
    if(this.set_score == null && this.identifiant == stateGame.active_players.identifiant){
        this.set_score = setInterval(function(){
            if(stateGame.score_signal){
                if(start_score>savePlayer.tampon_score){
                    start_score--;
                    $("#"+id_container).html(start_score);
                }else if(start_score<savePlayer.tampon_score){
                    start_score++;
                    $("#"+id_container).html(start_score);
                }else{
                    clearInterval(this);
                    savePlayer.set_score = null;
                }
            }
        },50);
    }
    
}