/* gravityLaunch est la fonction qui lance à interval régulier la gravité pour faire descendre les rocks */

function GravityLaunch(stateGame){
    
    if(stateGame.launchGravity == null){
         
        stateGame.launchGravity = setInterval(function(){
                if(!stateGame.plateau.gravity()){

                    stateGame.valid=false;
                }else{
                    stateGame.plateau.verificationGravity = true;
                }
         },250);
    }
}

/* FallEffectAndForce permet d'appliquer l'effet de chute sur le plateau de jeu et l'ensemble de ses éléments et de vérifier si le poid ne dépasse pas la limite que peut supporter l'élément porteur */

function FallEffectAndForce(stateGame){
     
    if(stateGame.evenementEffetFall == null){
        
         stateGame.evenementEffetFall = setInterval(function(){
             if(stateGame.plateau.verificationGravity == true){

                 for(var e = 0;e<stateGame.plateau.graphique.length;e++){
                     stateGame.plateau.graphique[e].y += 2;
                 }

                 for(var g = 0;g < stateGame.plateau.sizeX;g++){

                    for(var h = 0;h < stateGame.plateau.sizeY;h++){
                         if(stateGame.plateau.matrice[g][h] != 0){
                            stateGame.plateau.matrice[g][h].y += 2;
                         }
                    } 	
                }
                
                 /* On appel valid à false pour redessiner le plateau avec le decallage */
                stateGame.valid = false;
                    
                 /* puis dans 300 millisecondes on recalle correctement les éléments du plateau */
                setTimeout(function(){
                     for(var e = 0;e<stateGame.plateau.graphique.length;e++){
                         stateGame.plateau.graphique[e].y -= 2;
                     }

                     for(var g = 0;g < stateGame.plateau.sizeX;g++){

                        for(var h = 0;h < stateGame.plateau.sizeY;h++){
                             if(stateGame.plateau.matrice[g][h] != 0){
                                stateGame.plateau.matrice[g][h].y -= 2;
                             }
                        } 	
                    }


                     if(stateGame.activeForce){
                         stateGame.endOfForce = stateGame.plateau.force(stateGame).end;
                        if(stateGame.endOfForce == false){
                            var findOrNot = stateGame.plateau.findFour();
                            while(findOrNot.find){

                                var pointGagne = {point:0,proprietaire:"none"};
                                
                                stateGame.hitCombo += 4;
                                pointGagne.proprietaire = findOrNot.id;
                                pointGagne.point = findOrNot.point * 2;
                                
                                if(pointGagne.proprietaire == stateGame.comboMaker.id){
                                 pointGagne.point = parseInt(pointGagne.point *(stateGame.hitCombo/(stateGame.hitCombo - 0.1 * stateGame.hitCombo)));   
                                }

                                stateGame.plateau.addScore("user-sore-points", stateGame, pointGagne);                   
                                console.log(stateGame.findPlayerById(stateGame.players,findOrNot.id));
                                (stateGame.findPlayerById(stateGame.players,findOrNot.id)).point = stateGame.findPlayerById(stateGame.players,findOrNot.id).point + 1 ;
                                
                                for(var i = 0;i<findOrNot.case.length;i++){
                                    stateGame.addDrawPoints("+"+(findOrNot.case[i].point*2), findOrNot.case[i].graphX, findOrNot.case[i].graphY,findOrNot.case[i].color);
                                }
                                
                                findOrNot = stateGame.plateau.findFour();
                            }
                        }
                     }
                    
                    
                    var playersWin = new Array();
                    var playersPoint = -1;
                    
                    for(var p = 0;p<stateGame.players.length;p++){
                        
                        var plyrs = stateGame.players[p];
                        if(plyrs.point>playersPoint){
                            playersWin = new Array();
                            playersWin.push(plyrs);
                            playersPoint = plyrs.point;
                        }else if(plyrs.point == playersPoint){
                           playersWin.push(plyrs);
                        }
                    }
                    
                    if(playersWin[0].point>=stateGame.pointToWin){
                        var endGame = "Le(s) gagnant(s) sont : \n";
                        for(var p = 0;p<playersWin.length;p++){
                            endGame = playersWin[p].nom+ " \n";
                        }
                        stateGame.tours.endCycle();
                        
                        alert(endGame);
                    }
                     
                },300);
                 
                 stateGame.plateau.verificationGravity = false;
            }

         },200);
    }
}