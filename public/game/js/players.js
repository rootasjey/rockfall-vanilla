/* Represente un joueur avec un nom, les caractéristiques du personnage comme le score la couleur 
des rocks etc... */
function Players(id,nom,colorShape,score,weightShapes){
    
    /* le nom du personnage */
    this.nom = nom;
    
    /* l'identifiant du personnage */
    
    this.identifiant = id;
    
    /* couleur du rock du joueur*/
    this.colorShape = colorShape;
    
    
    /* le nombre de point du joueur */
    this.point = 0;
    
    
    /* score du joueur */
    this.score = score;
   
    /* les 3 poids que le joueur souhaite avoir dans son jeu */
    this.weightShapes = weightShapes;
    
     /* on définit l'objet Pieces qui ressence les différentes rocks créés qui seront affiché sur le plateau */
    this.pieces = new Pieces();

    /* tableau de bonus alloué à l'utilisateur*/
    this.power = new Array();
    
    
    this.image = null ;
    
    this.tamponScore = 0;
    this.setScore = null;
    
    
    this.powerActive = null;
    
    savePlayer = this;
}


Players.prototype.getPiece = function(){
    
    for(var i = 0;i<this.weightShapes.length;i++){
        var shape = new Shape(280 + (170*i), 410, 70, 70,this.weightShapes[i],this.colorShape);
        shape.image = this.image;
        this.pieces.add(shape);
    }
    
}

Players.prototype.changeScore = function(idContainer, points, stateGame){
    
    this.score += points;

    savePlayer.tamponScore = this.score;
    var startScore = parseInt($("#"+idContainer).html());
    if(this.setScore == null && this.identifiant == stateGame.activePlayers.identifiant){
        this.setScore = setInterval(function(){
            if(stateGame.scoreSignal){
                if(startScore>savePlayer.tamponScore){
                    startScore--;
                    $("#"+idContainer).html(startScore);
                }else if(startScore<savePlayer.tamponScore){
                    startScore++;
                    $("#"+idContainer).html(startScore);
                }else{
                    clearInterval(this);
                    savePlayer.setScore = null;
                }
            }
        },50);
    }
    
}