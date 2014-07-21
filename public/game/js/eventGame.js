function screenPrepareStart(stateGame){
    
    stateGame.tours.time.pause();
    $("#opaquePause").css("display","block");
    $("#button-reprendre").html("Start");
    $("#button-reprendre").css("display","block");
    
    $("#button-reprendre").on("click",function(e){
        screenGoStart(stateGame);
        ChangePlayer(stateGame);
    });
}

function screenGoStart(stateGame){
    
    stateGame.tours.time.play();
    $("#opaquePause").css("display","none");
    $("#button-reprendre").css("display","none");
    $("#button-reprendre").unbind("click");
    stateGame.start = true;
    stateGame.pause = false;
    
}

function ScreenPause(stateGame){
    
    stateGame.pause = true;
    if(stateGame.activePlayers.setScore != null)
        stateGame.activePlayers.setScore.pause();
    
    if(stateGame.launchGravity != null)
        stateGame.launchGravity.pause();
    
    if(stateGame.evenementEffetFall != null)
        stateGame.evenementEffetFall.pause();
    
    if(stateGame.tours.time != null)
        stateGame.tours.time.pause();
    
    if(stateGame.tours.intervalVerification != null)
        stateGame.tours.intervalVerification.pause();
    
    stateGame.frame.pause();
    $("#opaquePause").css("display","block");
    $("#button-reprendre").html("Resume");
    $("#button-reprendre").css("display","block");
    
    /* Ecouteur sur le bouton de reprise du jeux */
    $("#button-reprendre").on("click",function(e){
        ScreenResume(stateGame);   
    });
}


function ScreenResume(stateGame){
    
    stateGame.pause = false;
    
    if(stateGame.activePlayers.setScore != null)
        stateGame.activePlayers.setScore.play();
    
    if(stateGame.launchGravity != null)
        stateGame.launchGravity.play();
    
    if(stateGame.evenementEffetFall != null)
        stateGame.evenementEffetFall.play();
    
    if(stateGame.tours.time != null)
        stateGame.tours.time.play();
    
    if(stateGame.tours.intervalVerification != null)
        stateGame.tours.intervalVerification.play();
    
    $("#opaquePause").css("display","none");
    $("#button-reprendre").css("display","none");
    $("#button-reprendre").unbind("click");
    stateGame.frame.play();
    //stateGame.tours.time.play();
}


function PasseTour(stateGame){
    stateGame.tours.endTour = true;
}


function ChangePlayer(stateGame){
    
    stateGame.tours.time.pause();
    $("#opaquePause").css("display","block");
    $("#active-player").css("display","block");
    $("#active-player").html(stateGame.activePlayers.nom);
    $("#active-player").animate({
    left: "+250",
    }, 1500, function() {
        // Animation complete.
        $("#opaquePause").css("display","none");
        $("#active-player").css("left","10%");
        $("#active-player").css("display","none");
        stateGame.tours.time.play();
    });
    
    
}


function ScreenPauseWithFrame(stateGame){
    
    stateGame.pause = true;
    if(stateGame.activePlayers.setScore != null)
        stateGame.activePlayers.setScore.pause();
    
    if(stateGame.launchGravity != null)
        stateGame.launchGravity.pause();
    
    if(stateGame.tours.time != null)
        stateGame.tours.time.pause();
    
    if(stateGame.tours.intervalVerification != null)
        stateGame.tours.intervalVerification.pause();
}


function ScreenContinueWithFrame(stateGame){
    
    stateGame.pause = false;
    if(stateGame.activePlayers.setScore != null)
        stateGame.activePlayers.setScore.play();
    
    if(stateGame.launchGravity != null)
        stateGame.launchGravity.play();
    
    if(stateGame.tours.time != null)
        stateGame.tours.time.play();
    
    if(stateGame.tours.intervalVerification != null)
        stateGame.tours.intervalVerification.play();
}

function ScreenEndGame(stateGame, players){
    
    var resultat = "";
    
    /*html a afficher dans un span*/
    if(players.length == 1)
        resultat = "<p>Le gagnant est "+ players[0].nom+" </p><p>   Félicitation!</p>";
    else{
        
        resultat = "<p>Les gagnants sont ";
        for(var a = 0;a<players.length;a++){
            if(a<players.length-1)
                resultat += +players[a].nom+", ";
            else
                resultat += +players[a].nom;
        }
        resultat += " </p><p>   Félicitation!</p>";
    }
    stateGame.tours.endCycle();
    
    $("#opaquePause").css("display","block");
    $("#button-reprendre").html("Replay");
    $("#button-reprendre").css("display","block");
    $("#button-reprendre").css("top","80%");
    $("#active-player").css("display","block");
    $("#active-player").css("top","5%");
    $("#active-player").css("left","22%");
    $("#active-player").css("height","auto");
    $("#active-player").html(resultat);
    
    /* Ecouteur sur le bouton de relance de jeux */
    $("#button-reprendre").on("click",function(e){
        $("#opaquePause").css("display","none");
        $("#button-reprendre").css("top","30%");
        $("#button-reprendre").css("display","none");
        $("#active-player").css("top","30%");
        $("#active-player").css("left","100px");
        $("#active-player").css("height","100px");
        $("#active-player").css("display","none");
        location.reload();   
    });
}