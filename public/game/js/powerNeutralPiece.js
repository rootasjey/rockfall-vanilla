/* La fonction (classe) qui gère le bonus de l'appartenance de la pièce, il permet de rendre la pièce neutre afin d'empêche le gain de point ou l'aligenement de 4 pièeces */
function powerNeutralPiece (elementListener, price, img){

    /* l'élément sur lequel le bonus pourra être activé au click */
    this.elementListener = elementListener;

    this.id = 2;

    this.nom = "powerNeutralPiece";
    this.title = "Neutral",

    this.desc = "Transform a rock into a neutral & innofensive piece";

    /* permettra de rendre valide ou pas un bonus*/
    this.valid = true;

    /*le nombre de point que nécessite le bonus */
    this.price = price;


    this.img = img;


    /* la variable qui garde en mémoire l'état de l'"objet" dans le listener */
    _saveStateN = this;
}

/* la fonction listen permet de mettre effectivement en place l'activation du bonus lors du clique sur l'élément choisi */
powerNeutralPiece.prototype.listen = function(stateGame){

    $("#"+this.elementListener).css("cursor","pointer");
    $("#"+this.elementListener).attr("src",this.img);
    $("#"+this.elementListener).attr("price", this.price);
    AddTooltipOnPower($("#" + this.elementListener), this); // in squareui-game.js

    // Color automatically the power (green or red)
    // if it cans be activated
    PowerCansbeActivated($("#"+this.elementListener));

    $("#"+this.elementListener).click(function(){

            if(!stateGame.usePower ||  stateGame.idPower != _saveStateN.id){
                stateGame.idPower = _saveStateN.id;
                stateGame.usePower = true;
                stateGame.powerToUse = _saveStateN;
                $("#active-power").html(_saveStateN.desc);

            }else{
                stateGame.idPower = 0;
                stateGame.usePower = false;
                stateGame.powerToUse = null;
                // $("#active-power").html("No power-Up");
            }
    });

}

/* power est l'effet du bonus sur la pièce */
powerNeutralPiece.prototype.power = function(shape){

    shape.idProprietaire = -1;
    if(ImageNeutre != null){
        shape.image = ImageNeutre;
    }
    return shape;
}

/* permet de supprimer le listener */
powerNeutralPiece.prototype.unlisten = function(stateGame){

    $("#"+this.elementListener).unbind( "click" );
}
