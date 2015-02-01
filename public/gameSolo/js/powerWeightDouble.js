/* La fonction (classe) qui gère le bonus de double poid, il permet de doubler le poid d'une pièce afin de la rendre plus résistante */
function powerWeightDouble (elementListener, price, img){

    /* l'élément sur lequel le bonus pourra être activé au click */
    this.elementListener = elementListener;

    this.id = 1;

    this.nom = "powerWeightDouble";
    this.title = "Double";

    this.desc = "Double a rock weigth";

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
    // object super square pour ajouter la tooltip
    var ssplay = FindSuperSquare("play");

    $("#"+this.elementListener).css("cursor","pointer");
    $("#"+this.elementListener).attr("src",this.img);
    $("#"+this.elementListener).attr("price", this.price);
    ssplay.GameAddTooltipOnPower($("#" + this.elementListener), this); // in squareui-game.js

    // Color automatically the power (green or red)
    // if it cans be activated
    ssplay.GamePowerCansBeActivated($("#"+this.elementListener));

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
