/* La fonction tours permet de gérer le jeu entre différents participant */

function Tours(state_Game,nombre_action_add, nombre_action_effet, tours_time){

    this.state_Game = state_Game;

    
    this.nombre_action_add = nombre_action_add;
    this.nombre_action_effet = nombre_action_effet;
    
    
    this.action_add_rock = 0;
    this.action_effet_rock = 0;
    
    this.end_tour = false;
    
    this.tours_time = tours_time;
    
    this.cycle_time = tours_time;
    this.interval_verification = null;
    
    this.time = null;
    
    myTours = this;
}

/* ajoute au nombre d'action (pièce ajouter) réaliser */
Tours.prototype.add_action = function(){
       this.action_add_rock++;
}

/* décrémente le nombre d'action réaliser*/
Tours.prototype.remove_action = function(){
       this.action_add_rock--;
}

/* ajoute au nombre d'effet réaliser */
Tours.prototype.add_effet = function(){
       this.action_effet_rock++;
}

/* décrémente le nombre d'effet réaliser*/
Tours.prototype.remove_effet = function(){
       this.action_effet_rock--;
}
/* permet de savoir si l'utilisateur peut ajouter une pièces dans la limite qui lui ai attribué par tour */
Tours.prototype.can_add = function(){
    var can = true;
    if(this.action_add_rock >= this.nombre_action_add){
        can = false;
    }
    
    return can;
}

/* permet de savoir si l'utilisateur peut activer un bonus dans la limite qui lui ai attribué par tour */
Tours.prototype.can_effet = function(){
    var can = true;
    if(this.action_effet_rock >= this.nombre_action_effet){
        can = false;
    }
    
    return can;
}

/* fonction mettant fin au cycle de jeu */
Tours.prototype.end_cycle  = function(){
    if(this.interval_verification != null){
       clearInterval(this.interval_verification);
        this.interval_verification = null;
        clearInterval(this.time);
        this.time = null;
    }
    
}

/* fonction qui decrémente le temps d'un tour */
Tours.prototype.time_cycl = function(callback){
    
        this.time = setInterval(function(){
            if(myTours.cycle_time > 0){
                myTours.cycle_time--;
            }
            
            if( myTours.state_Game.time_combo>=2){
                 myTours.state_Game.time_combo = 0;
                 myTours.state_Game.hit_combo = 0;
                 myTours.state_Game.valid = false;
                
            }
            myTours.state_Game.time_combo++;
            
            callback(myTours.cycle_time);
        },1000);
}

/* fonction qui lance le cycle de jeux */
Tours.prototype.launch_cycle = function(ctx, text_color, id_name, id_score){
    
    
    this.cycle_time = this.tours_time;
    
    
    this.interval_verification = setInterval(function(){
        
        if(myTours.cycle_time <= 0){
            myTours.end_tour = true;
        }
        if( (!myTours.can_add() && !myTours.can_effet() || myTours.end_tour) && !myTours.state_Game.end_of_force){
        
            var i = 0,find = false;
            while(i<myTours.state_Game.players.length && !find){
               
               if(myTours.state_Game.players[i].identifiant == myTours.state_Game.active_players.identifiant){
                   
                   for(var b = 0;b<myTours.state_Game.active_players.power.length;b++){
                        myTours.state_Game.active_players.power[b].unlisten(myTours.state_Game);
                    }
                   
                    if(i+1 == myTours.state_Game.players.length){
                       myTours.state_Game.active_players = myTours.state_Game.players[0];
                    }else{
                       myTours.state_Game.active_players = myTours.state_Game.players[i+1];
                    }
                   
                    for(var b = 0;b<myTours.state_Game.active_players.power.length;b++){
                        myTours.state_Game.active_players.power[b].listen(myTours.state_Game);
                    }
                    $("#"+id_score).html(myTours.state_Game.active_players.score);
                    $("#"+id_name).html(myTours.state_Game.active_players.nom);
                    myTours.cycle_time = myTours.tours_time;
                    myTours.state_Game.usePower = false;
                    myTours.state_Game.powerToUse = null;
                    myTours.state_Game.time_life = myTours.tours_time;
                    myTours.state_Game.score_signal = false;
                    if(myTours.state_Game.selection_piece != null){
                        myTours.state_Game.selection_piece.init();
                        myTours.state_Game.selection_piece = null;
                    }
                    myTours.end_tour = false;
                    myTours.state_Game.hit_combo = 0;
                    myTours.action_add_rock = 0;
                    myTours.action_effet_rock = 0;
                    myTours.state_Game.active_players.pieces.change_color(myTours.state_Game.active_players.color_shape);
                   
                   
                   find = true;
               }
               i++;
           }
        }
        
    },300);
}