function gravity_launch(State_game){
    
    if(State_game.launch_gravity == null){
         
        State_game.launch_gravity = setInterval(function(){
                if(!State_game.plateau.gravity()){

                    State_game.valid=false;
                }else{
                    State_game.plateau.verification_gravity = true;
                }
         },250);
    }
}


function fall_effect_and_force(State_game){
     
    if(State_game.evenement_effet_fall == null){
        
         State_game.evenement_effet_fall = setInterval(function(){
             if(State_game.plateau.verification_gravity == true){

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
                    
                setTimeout(function(){
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


                     if(State_game.active_force){
                         //console.log("force");
                         var pt = State_game.plateau.force(State_game).points;
                        // console.log(pt);
                         //if(pt >0){
                            // console.log("vant le score !");
                            // State_game.plateau.addScore("user-sore-points",State_game,pt);
                        // }
                     }
                       
                },300);
                 
                 State_game.plateau.verification_gravity = false;
            }

         },200);
    }
}