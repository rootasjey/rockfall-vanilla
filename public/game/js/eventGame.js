function screenPrepareStart(stateGame){
    stateGame.tours.time.pause();
}

// Starts the game
function screenGoStart(stateGame){
    stateGame.tours.time.play();

    stateGame.start = true;
    stateGame.pause = false;

}

// Pause the game
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

// Pause the game with animations
function ScreenPauseFadeOut() {
    ScreenPause(_myState);
    $("#canvas").animate({
        opacity: 0.5,
        height: "500px",
        width: "785px",
    });
}

// Resume the game
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

// Resume the game with animations
function ScreenResumeFadeIn() {
    ScreenResume(_myState);
    $("#canvas").animate({
        opacity: 1,
        height: "515px",
        width: "800px",
    });
}

// End the active player's turn
function PasseTour(stateGame){
    stateGame.tours.endTour = true;
}

// Change to the active player
function ChangePlayer(stateGame){
    stateGame.tours.time.pause();
    stateGame.tours.time.play();

    // $(".player-panel").attr("active", false);
    ActivePlayer($(".player-panel"), "off")

    // Animate active player
    // console.log(_myTours.stateGame.activePlayers);
    var playerNumber = _myTours.stateGame.activePlayers.identifiant;

    var p = $(".player-panel[player='" + playerNumber + "']");
    // p.attr("active", true);
    ActivePlayer(p, "on");
}

function ActivePlayer (player, sw) {
    if (sw === "off") {
        player.css({
            opacity : 0.5,
            height  : '60px',
            width   : '60px',
        }).attr("active", false);
    }
    else if (sw === "on") {
        player.css({
            opacity : 1,
            height  : '70px',
            width   : '70px',
        }).attr("active", true);   
    }
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
