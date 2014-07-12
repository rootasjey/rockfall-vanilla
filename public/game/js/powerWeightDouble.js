/* La fonction (classe) qui gère le bonus de double poid, il permet de doubler le poid d'une pièce afin de la rendre plus résistante */
function powerWeightDouble (elementListener, price, img){
    
    /* l'élément sur lequel le bonus pourra être activé au click */
    this.elementListener = elementListener;
    
    this.id = 1;
    
    this.nom = "powerWeightDouble";
    
    this.desc = "Multiplie par deux les points!";
    
    /* permettra de rendre valide ou pas un bonus*/
    this.valid = true;
    
    /**/
    this.img = img;
    
    /*le nombre de point que nécessite le bonus */
    this.price = price;
    
    /* la variable qui garde en mémoire l'état de l'"objet" dans le listener */
    _saveStateD = this;
}

/* la fonction listen permet de mettre effectivement en place l'activation du bonus lors du clique sur l'élément choisi */
powerWeightDouble.prototype.listen = function(stateGame){
    
    $("#"+this.elementListener).css("cursor","pointer");
    $("#"+this.elementListener).attr("src",this.img);
    $("#"+this.elementListener).attr("title","<p><h5>Effet :</h5> <strong>"+this.desc+" </strong></p><p> <h5>prix : </h5> <strong>"+this.price+" points.</storng></p>");
    $("#"+this.elementListener).qtip({
         show: 'click',
         hide: 'click',
    });
            
    $("#"+this.elementListener).click(function(){
            if(!stateGame.usePower || stateGame.idPower != _saveStateD.id){
                stateGame.idPower = _saveStateD.id;
                stateGame.usePower = true;
                stateGame.powerToUse = _saveStateD;
                $("#active-power").html(_saveStateD.desc);
            }else{
                stateGame.idPower = 0;
                stateGame.usePower = false;
                stateGame.powerToUse = null;
                $("#active-power").html("No Power-Up");
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