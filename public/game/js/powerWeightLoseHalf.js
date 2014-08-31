/* La fonction (classe) qui gère le bonus du poid diviser par 2, il permet de diviser le poid par 2 d'une pièce afin de la rendre plus fragile */
function powerWeightLoseHalf (elementListener, price, img){

    /* l'élément sur lequel le bonus pourra être activé au click */
    this.elementListener = elementListener;

    this.id = 3;

    this.nom = "powerWeightLoseHalf";
    this.title = "Half Cut";

    this.desc = "Cut a rock weigth by two";

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
    $("#"+this.elementListener).attr("price", this.price);
    AddTooltipOnPower($("#" + this.elementListener), this); // in squareui-game.js

    // Color automatically the power (green or red)
    // if it cans be activated
    PowerCansbeActivated($("#"+this.elementListener));

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
