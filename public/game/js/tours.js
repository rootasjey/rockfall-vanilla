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
    
    _myTours = this;
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
       //clearInterval(this.intervalVerification);
       this.intervalVerification.stop();
        this.intervalVerification = null;
        this.time.stop();
    }
    
}

/* fonction qui decrémente le temps d'un tour */
Tours.prototype.timeCycle = function(callback){
    
        this.time = $.timer(function() {
                if(_myTours.cycleTime > 0 && _myTours.stateGame.start){
                    _myTours.cycleTime--;
                }

                /* affichage du combo qui dure un certain nombre de seconde */
                if( _myTours.stateGame.timeCombo>=2){
                     _myTours.stateGame.timeCombo = 0;
                     _myTours.stateGame.hitCombo = 0;
                     _myTours.stateGame.valid = false;

                }
                _myTours.stateGame.timeCombo++;

                callback(_myTours.cycleTime);
        });

        this.time.set({ time : 1000, autostart : true });
}

/* fonction qui lance le cycle de jeux */
Tours.prototype.launchCycle = function(ctx, textColor, idName, idScore){
    
    
    this.cycleTime = this.toursTime;
    
    
    this.intervalVerification = $.timer(function(){//setInterval(function(){
        
        if(_myTours.cycleTime <= 0){
            _myTours.endTour = true;
        }
        if( (!_myTours.canAdd() && !_myTours.canEffet() || _myTours.endTour) && !_myTours.stateGame.endOfForce){
        
            var i = 0,find = false;
            while(i<_myTours.stateGame.players.length && !find){
               
               if(_myTours.stateGame.players[i].identifiant == _myTours.stateGame.activePlayers.identifiant){
                   
                   for(var b = 0;b<_myTours.stateGame.activePlayers.power.length;b++){
                        _myTours.stateGame.activePlayers.power[b].unlisten(_myTours.stateGame);
                    }
                    $("#active-power").html("No power-Up");
                   
                    if(i+1 == _myTours.stateGame.players.length){
                       _myTours.stateGame.activePlayers = _myTours.stateGame.players[0];
                    }else{
                       _myTours.stateGame.activePlayers = _myTours.stateGame.players[i+1];
                    }
                   
                    for(var b = 0;b<_myTours.stateGame.activePlayers.power.length;b++){
                        _myTours.stateGame.activePlayers.power[b].listen(_myTours.stateGame);
                    }
                    $("#"+idScore).html(_myTours.stateGame.activePlayers.score);
                    $("#"+idName).html(_myTours.stateGame.activePlayers.nom);
                    _myTours.cycleTime = _myTours.toursTime;
                    _myTours.stateGame.idPower = 0;
                    _myTours.stateGame.usePower = false;
                    _myTours.stateGame.powerToUse = null;
                    _myTours.stateGame.timeLife = _myTours.toursTime;
                    _myTours.stateGame.scoreSignal = false;
                    if(_myTours.stateGame.selectionPiece != null){
                        _myTours.stateGame.selectionPiece.init();
                        _myTours.stateGame.selectionPiece = null;
                    }
                    _myTours.endTour = false;
                    _myTours.stateGame.hitCombo = 0;
                    _myTours.actionAddRock = 0;
                    _myTours.actionEffetRock = 0;
                    _myTours.stateGame.activePlayers.pieces.changeColor(_myTours.stateGame.activePlayers.colorShape);
                   
                   ChangePlayer(_myTours.stateGame);
                   find = true;
               }
               i++;
           }
        }
        
    });//,300);
    this.intervalVerification.set({ time : 300, autostart : true });
}