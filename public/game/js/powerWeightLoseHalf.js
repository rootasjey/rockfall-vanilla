/* La fonction (classe) qui gère le bonus du poid diviser par 2, il permet de diviser le poid par 2 d'une pièce afin de la rendre plus fragile */
function powerWeightLoseHalf (elementListener, price, img){
    
    /* l'élément sur lequel le bonus pourra être activé au click */
    this.elementListener = elementListener;
    
    this.id = 3;
    
    this.nom = "powerWeightLoseHalf";
    
    this.desc = "Divise les points par deux!";
    
    /* permettra de rendre valide ou pas un bonus*/
    this.valid = true;
    
    /*le nombre de point que nécessite le bonus */
    this.price = price;
    
    this.img = img;
    
    /* la variable qui garde en mémoire l'état de l'"objet" dans le listener */
    _saveStateL = this;
}

/* la fonction listen permet de mettre effectivement en place l'activation du bonus lors du clique sur l'élément choisi */
powerWeightLoseHalf.prototype.listen = function(stateGame){
    
    $("#"+this.elementListener).css("cursor","pointer");
    $("#"+this.elementListener).attr("src",this.img);
    $("#"+this.elementListener).attr("title","<p><h5>Effet :</h5> <strong>"+this.desc+" </strong></p><p> <h5>prix : </h5> <strong>"+this.price+" points.</storng></p>");
    $("#"+this.elementListener).qtip({
        show: 'click',
         hide: 'click',
           
    });
    
    
    $("#"+this.elementListener).click(function(){
            if(!stateGame.usePower ||  stateGame.idPower != _saveStateL.id){
                stateGame.idPower = _saveStateL.id;
                stateGame.usePower = true;
                stateGame.powerToUse = _saveStateL;
                $("#active-power").html(_saveStateL.desc);
            }else{
                stateGame.idPower = 0;
                stateGame.usePower = false;
                stateGame.powerToUse = null;
                $("#active-power").html("No power-Up");
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
    $("#"+this.elementListener).unbind( "click" );
}