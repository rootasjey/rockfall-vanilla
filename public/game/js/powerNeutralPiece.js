/* La fonction (classe) qui gère le bonus de l'appartenance de la pièce, il permet de rendre la pièce neutre afin d'empêche le gain de point ou l'aligenement de 4 pièeces */
function powerNeutralPiece (element_listener, price){
    
    /* l'élément sur lequel le bonus pourra être activé au click */
    this.element_listener = element_listener;
    
    /* permettra de rendre valide ou pas un bonus*/
    this.valid = true;
    
    /*le nombre de point que nécessite le bonus */
    this.price = price;
    
    /* la variable qui garde en mémoire l'état de l'"objet" dans le listener */
    saveStateN = this;
}

/* la fonction listen permet de mettre effectivement en place l'activation du bonus lors du clique sur l'élément choisi */
powerNeutralPiece.prototype.listen = function(stateGame){
 
    $("#"+this.element_listener).click(function(){

            if(!stateGame.usePower){
                stateGame.usePower = true;
                stateGame.powerToUse = saveStateN;
            }else{
                stateGame.usePower = false;
                stateGame.powerToUse = null;
            }
    });
    
}

/* power est l'effet du bonus sur la pièce */
powerNeutralPiece.prototype.power = function(shape){
    
    shape.id_proprietaire = -1;
    shape.fill = "grey";
   
    return shape;
}

/* permet de supprimer le listener */
powerNeutralPiece.prototype.unlisten = function(stateGame){
    
    $("#"+this.element_listener).unbind( "click" );
}