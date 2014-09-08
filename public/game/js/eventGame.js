function screenPrepareStart(stateGame){
    stateGame.tours.time.pause();
}

function screenGoStart(stateGame){
    stateGame.tours.time.play();

    stateGame.start = true;
    stateGame.pause = false;

}

function ScreenPause(stateGame){
    if (typeof stateGame === "undefined" || stateGame === null)
        stateGame = _myState;

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
}

function ScreenPauseFadeOut() {
    ScreenPause(_myState);
    $("#canvas").animate({
        opacity: 0.5,
        height: "500px",
        width: "785px",
    });
}

function ScreenResume(stateGame){
    if (typeof stateGame === "undefined" || stateGame === null)
        stateGame = _myState;

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

    stateGame.frame.play();
    //stateGame.tours.time.play();
}

function ScreenResumeFadeIn() {
    ScreenResume(_myState);
    $("#canvas").animate({
        opacity: 1,
        height: "515px",
        width: "800px",
    });
}

function PasseTour(stateGame){
    stateGame.tours.endTour = true;
}


function ChangePlayer(stateGame){
    stateGame.tours.time.pause();
    stateGame.tours.time.play();

    // $("#active-player").css("display","block");
    // $("#active-player").html(stateGame.activePlayers.nom);
    // $("#active-player").animate({
    // left: "+250",
    // }, 1500, function() {
    //     // Animation complete.
    //     $("#active-player").css("left","10%");
    //     $("#active-player").css("display","none");
    //     stateGame.tours.time.play();
    // });
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
    // $("#active-player").html(resultat);
}

function EventGameEndGame() {
    _myState.tours.endCycle();
}
