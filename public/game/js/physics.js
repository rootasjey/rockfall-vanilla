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
                         State_game.end_of_force = State_game.plateau.force(State_game).end;
                        if(State_game.end_of_force == false){
                            var find_or_not = myState.plateau.find_four();
                            while(find_or_not.find){

                                var point_gagne = {point:0,proprietaire:"none"};
                                
                                State_game.hit_combo += 4;
                                point_gagne.proprietaire = find_or_not.id;
                                point_gagne.point = find_or_not.point * 2;
                                
                                if(point_gagne.proprietaire == State_game.combo_maker.id){
                                 point_gagne.point = parseInt(point_gagne.point *(State_game.hit_combo/(State_game.hit_combo - 0.1 * State_game.hit_combo)));   
                                }

                                State_game.plateau.addScore("user-sore-points", State_game, point_gagne);                   
                                
                                (State_game.findPlayerById(State_game.players,find_or_not.id)).point = State_game.findPlayerById(State_game.players,find_or_not.id).point + 1 ;
                                
                                for(var i = 0;i<find_or_not.case.length;i++){
                                    State_game.addDrawPoints("+"+(find_or_not.case[i].point*2), find_or_not.case[i].graph_x, find_or_not.case[i].graph_y,find_or_not.case[i].color);
                                }
                                
                                find_or_not = myState.plateau.find_four();
                            }
                        }
                     }
                    
                    
                    var players_win = new Array();
                    var players_point = -1;
                    
                    for(var p = 0;p<State_game.players.length;p++){
                        
                        var plyrs = State_game.players[p];
                        if(plyrs.point>players_point){
                            players_win = new Array();
                            players_win.push(plyrs);
                            players_point = plyrs.point;
                        }else if(plyrs.point == players_point){
                           players_win.push(plyrs);
                        }
                    }
                    
                    if(players_win[0].point>=State_game.point_to_win){
                        var endGame = "Le(s) gagnant(s) sont : \n";
                        for(var p = 0;p<players_win.length;p++){
                            endGame = players_win[p].nom+ " \n";
                        }
                        State_game.tours.end_cycle();
                        
                        alert(endGame);
                    }
                     
                },300);
                 
                 State_game.plateau.verification_gravity = false;
            }

         },200);
    }
}