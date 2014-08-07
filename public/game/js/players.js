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
    
    
}


Players.prototype.getPiece = function(){
    
    for(var i = 0;i<this.weightShapes.length;i++){
        var shape = new Shape(180 + (140*i), 410, 100, 100,this.weightShapes[i],this.colorShape);
        shape.image = this.image;
        this.pieces.add(shape);
    }
    
}

Players.prototype.changeScore = function(idContainer, points, stateGame){
    
    var savePlayer = this;
    
    this.score += points;
    
    this.tamponScore = this.score;
    var startScore = parseInt($("#"+idContainer).html());
    if((this.setScore == null || !this.setScore.isActive) && this.identifiant == stateGame.activePlayers.identifiant){
        this.setScore = $.timer(function(){ //setInterval(function(){
            if(stateGame.scoreSignal){
                if(startScore>savePlayer.tamponScore){
                    startScore--;
                    $("#"+idContainer).html(startScore);
                }else if(startScore<savePlayer.tamponScore){
                    startScore++;
                    $("#"+idContainer).html(startScore);
                }else if(startScore == savePlayer.tamponScore){
                    //clearInterval(this);
                    if(savePlayer.setScore != null){
                        savePlayer.setScore.stop();
                    }
                    //savePlayer.setScore = null;
                }
            }
        });// },50);
        
        this.setScore.set({ time : 50, autostart : true });
    }  
}