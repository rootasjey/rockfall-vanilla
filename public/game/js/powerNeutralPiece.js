/* La fonction (classe) qui gère le bonus de l'appartenance de la pièce, il permet de rendre la pièce neutre afin d'empêche le gain de point ou l'aligenement de 4 pièeces */
function powerNeutralPiece (elementListener, price){
    
    /* l'élément sur lequel le bonus pourra être activé au click */
    this.elementListener = elementListener;
    
    /* permettra de rendre valide ou pas un bonus*/
    this.valid = true;
    
    /*le nombre de point que nécessite le bonus */
    this.price = price;
    
    /* la variable qui garde en mémoire l'état de l'"objet" dans le listener */
    _saveStateN = this;
}

/* la fonction listen permet de mettre effectivement en place l'activation du bonus lors du clique sur l'élément choisi */
powerNeutralPiece.prototype.listen = function(stateGame){
 
    $("#"+this.elementListener).click(function(){

            if(!stateGame.usePower){
                stateGame.usePower = true;
                stateGame.powerToUse = _saveStateN;
            }else{
                stateGame.usePower = false;
                stateGame.powerToUse = null;
            }
    });
    
}

/* power est l'effet du bonus sur la pièce */
powerNeutralPiece.prototype.power = function(shape){
    
    shape.idProprietaire = -1;
    shape.fill = "grey";
   
    return shape;
}

/* permet de supprimer le listener */
powerNeutralPiece.prototype.unlisten = function(stateGame){
    
    $("#"+this.elementListener).unbind( "click" );
}