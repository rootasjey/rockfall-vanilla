/* La fonction (classe) qui gère le bonus du poid diviser par 2, il permet de diviser le poid par 2 d'une pièce afin de la rendre plus fragile */
function powerWeightLoseHalf (element_listener,price){
    
    /* l'élément sur lequel le bonus pourra être activé au click */
    this.element_listener = element_listener;
    
    /* permettra de rendre valide ou pas un bonus*/
    this.valid = true;
    
    /*le nombre de point que nécessite le bonus */
    this.price = price;
    
    /* la variable qui garde en mémoire l'état de l'"objet" dans le listener */
    saveStateL = this;
}

/* la fonction listen permet de mettre effectivement en place l'activation du bonus lors du clique sur l'élément choisi */
powerWeightLoseHalf.prototype.listen = function(stateGame){
    
    $("#"+this.element_listener).click(function(){
            if(!stateGame.usePower){
                stateGame.usePower = true;
                stateGame.powerToUse = saveStateL;
            }else{
                stateGame.usePower = false;
                stateGame.powerToUse = null;
            }
    });    
}

/* power est l'effet du bonus sur la pièce */
powerWeightLoseHalf.prototype.power = function(shape){
    
    shape.weight = parseInt(shape.weight / 2);
   
    return shape;
}

/* permet de supprimer le listener */
powerWeightLoseHalf.prototype.unlisten = function(stateGame){
    $("#"+this.element_listener).unbind( "click" );
}