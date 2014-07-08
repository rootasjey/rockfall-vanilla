/* La fonction (classe) qui gère le bonus de double poid, il permet de doubler le poid d'une pièce afin de la rendre plus résistante */
function powerWeightDouble (elementListener, price){
    
    /* l'élément sur lequel le bonus pourra être activé au click */
    this.elementListener = elementListener;
    
    /* permettra de rendre valide ou pas un bonus*/
    this.valid = true;
    
    /*le nombre de point que nécessite le bonus */
    this.price = price;
    
    /* la variable qui garde en mémoire l'état de l'"objet" dans le listener */
    _saveStateD = this;
}

/* la fonction listen permet de mettre effectivement en place l'activation du bonus lors du clique sur l'élément choisi */
powerWeightDouble.prototype.listen = function(stateGame){
    
    
    $("#"+this.elementListener).click(function(){
            if(!stateGame.usePower){
                stateGame.usePower = true;
                stateGame.powerToUse = _saveStateD;
            }else{
                stateGame.usePower = false;
                stateGame.powerToUse = null;
            }
    });
    
}

/* power est l'effet du bonus sur la pièce */
powerWeightDouble.prototype.power = function(shape){
    
    shape.weight = parseInt(shape.weight * 2);
    
    return shape;
}


/* permet de supprimer le listener */
powerWeightDouble.prototype.unlisten = function(stateGame){
    
    $("#"+this.elementListener).unbind( "click" );

}