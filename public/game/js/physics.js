/* gravity_launch est la fonction qui lance à interval régulier la gravité pour faire descendre les rocks */

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

/* fall_effect_and_force permet d'appliquer l'effet de chute sur le plateau de jeu et l'ensemble de ses éléments et de vérifier si le poid ne dépasse pas la limite que peut supporter l'élément porteur */

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
                
                 /* On appel valid à false pour redessiner le plateau avec le decallage */
                State_game.valid = false;
                    
                 /* puis dans 300 millisecondes on recalle correctement les éléments du plateau */
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
                        if(State_game.plateau.force(State_game).end == false){
                            var find_or_not = myState.plateau.find_four();
                            while(find_or_not.find){

                                var point_gagne = {point:0,proprietaire:"none"};
                                
                                point_gagne.proprietaire = find_or_not.id;
                                point_gagne.point = find_or_not.point * 2;
                                State_game.plateau.addScore("user-sore-points", State_game, point_gagne);
                                
                                for(var i = 0;i<find_or_not.case.length;i++){
                                    write_score(State_game,"+"+(find_or_not.case[i].point*2),
                                        find_or_not.case[i].graph_x,find_or_not.case[i].graph_y);
                                }
                                
                                find_or_not = myState.plateau.find_four();
                            }
                        }
                     }
                       
                },300);
                 
                 State_game.plateau.verification_gravity = false;
            }

         },200);
    }
}