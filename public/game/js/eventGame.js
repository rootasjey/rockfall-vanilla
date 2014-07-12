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