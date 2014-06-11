function gravity_launch(State_game){
    
     var nb_chute = 0;
     var verif_time = null;
     State_game.plateau.verification_gravity = true;
     State_game.launch_gravity = setInterval(function(){
         if(nb_chute<State_game.plateau.size_x+1){
            State_game.plateau.verification_gravity = State_game.plateau.gravity();
             State_game.valid=false;
             nb_chute++;
         }else{
             if(verif_time == null){
                verif_time = setTimeout(function(){nb_chute = 0;verif_time == null;},300);
             }
         }
     },250);
}


function fall_effect_and_force(State_game){
     var detonation = 0;
     var impact = 0;

     setInterval(function(){
         if(State_game.plateau.verification_gravity == true){
            detonation++;
         }else{
             if(detonation>0){

                 impact++;
                 if(impact == 1){

                     for(var e = 0;e<State_game.plateau.graphique.length;e++){
                         State_game.plateau.graphique[e].y += 2;
                     }

                     for(var g = 0;g < State_game.plateau.size_x;g++){

                        for(var h = 0;h < State_game.plateau.size_y;h++){
                             if(State_game.plateau.matrice[g][h] != 0){
                                State_game.plateau.matrice[g][h].y += 2;
                             }
                        } 	
                    }

                     State_game.valid = false;
                 }else if(impact == 2){

                     for(var e = 0;e<State_game.plateau.graphique.length;e++){
                         State_game.plateau.graphique[e].y -= 2;
                     }

                     for(var g = 0;g < State_game.plateau.size_x;g++){

                        for(var h = 0;h < State_game.plateau.size_y;h++){
                             if(State_game.plateau.matrice[g][h] != 0){
                                State_game.plateau.matrice[g][h].y -= 2;
                             }
                        } 	
                    }

                     impact = 0;
                     detonation = 0;
                     
                     if(State_game.active_force){
                         var pt = State_game.plateau.force(State_game).points;
                         if(pt >0){
                             /* id score*/
                             State_game.plateau.addScore("user-sore-points",State_game,pt);
                         }
                     }
                    //clearInterval(this); 
                }
             }
         }

     },200);
}