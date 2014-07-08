/* La fonction tours permet de gérer le jeu entre différents participant */

function Tours(stateGame,nombreActionAdd, nombreActionEffet, toursTime){

    this.stateGame = stateGame;

    
    this.nombreActionAdd = nombreActionAdd;
    this.nombreActionEffet = nombreActionEffet;
    
    
    this.actionAddRock = 0;
    this.actionEffetRock = 0;
    
    this.endTour = false;
    
    this.toursTime = toursTime;
    
    this.cycleTime = toursTime;
    this.intervalVerification = null;
    
    this.time = null;
    
    myTours = this;
}

/* ajoute au nombre d'action (pièce ajouter) réaliser */
Tours.prototype.addAction = function(){
       this.actionAddRock++;
}

/* décrémente le nombre d'action réaliser*/
Tours.prototype.removeAction = function(){
       this.actionAddRock--;
}

/* ajoute au nombre d'effet réaliser */
Tours.prototype.addEffet = function(){
       this.actionEffetRock++;
}

/* décrémente le nombre d'effet réaliser*/
Tours.prototype.removeEffet = function(){
       this.actionEffetRock--;
}
/* permet de savoir si l'utilisateur peut ajouter une pièces dans la limite qui lui ai attribué par tour */
Tours.prototype.canAdd = function(){
    var can = true;
    if(this.actionAddRock >= this.nombreActionAdd){
        can = false;
    }
    
    return can;
}

/* permet de savoir si l'utilisateur peut activer un bonus dans la limite qui lui ai attribué par tour */
Tours.prototype.canEffet = function(){
    var can = true;
    if(this.actionEffetRock >= this.nombreActionEffet){
        can = false;
    }
    
    return can;
}

/* fonction mettant fin au cycle de jeu */
Tours.prototype.endCycle  = function(){
    if(this.intervalVerification != null){
       clearInterval(this.intervalVerification);
        this.intervalVerification = null;
        clearInterval(this.time);
        this.time = null;
    }
    
}

/* fonction qui decrémente le temps d'un tour */
Tours.prototype.timeCycle = function(callback){
    
        this.time = setInterval(function(){
            if(myTours.cycleTime > 0){
                myTours.cycleTime--;
            }
            
            if( myTours.stateGame.timeCombo>=2){
                 myTours.stateGame.timeCombo = 0;
                 myTours.stateGame.hitCombo = 0;
                 myTours.stateGame.valid = false;
                
            }
            myTours.stateGame.timeCombo++;
            
            callback(myTours.cycleTime);
        },1000);
}

/* fonction qui lance le cycle de jeux */
Tours.prototype.launchCycle = function(ctx, textColor, idName, idScore){
    
    
    this.cycleTime = this.toursTime;
    
    
    this.intervalVerification = setInterval(function(){
        
        if(myTours.cycleTime <= 0){
            myTours.endTour = true;
        }
        if( (!myTours.canAdd() && !myTours.canEffet() || myTours.endTour) && !myTours.stateGame.endOfForce){
        
            var i = 0,find = false;
            while(i<myTours.stateGame.players.length && !find){
               
               if(myTours.stateGame.players[i].identifiant == myTours.stateGame.activePlayers.identifiant){
                   
                   for(var b = 0;b<myTours.stateGame.activePlayers.power.length;b++){
                        myTours.stateGame.activePlayers.power[b].unlisten(myTours.stateGame);
                    }
                   
                    if(i+1 == myTours.stateGame.players.length){
                       myTours.stateGame.activePlayers = myTours.stateGame.players[0];
                    }else{
                       myTours.stateGame.activePlayers = myTours.stateGame.players[i+1];
                    }
                   
                    for(var b = 0;b<myTours.stateGame.activePlayers.power.length;b++){
                        myTours.stateGame.activePlayers.power[b].listen(myTours.stateGame);
                    }
                    $("#"+idScore).html(myTours.stateGame.activePlayers.score);
                    $("#"+idName).html(myTours.stateGame.activePlayers.nom);
                    myTours.cycleTime = myTours.toursTime;
                    myTours.stateGame.usePower = false;
                    myTours.stateGame.powerToUse = null;
                    myTours.stateGame.timeLife = myTours.toursTime;
                    myTours.stateGame.scoreSignal = false;
                    if(myTours.stateGame.selectionPiece != null){
                        myTours.stateGame.selectionPiece.init();
                        myTours.stateGame.selectionPiece = null;
                    }
                    myTours.endTour = false;
                    myTours.stateGame.hitCombo = 0;
                    myTours.actionAddRock = 0;
                    myTours.actionEffetRock = 0;
                    myTours.stateGame.activePlayers.pieces.changeColor(myTours.stateGame.activePlayers.colorShape);
                   
                   
                   find = true;
               }
               i++;
           }
        }
        
    },300);
}