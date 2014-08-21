// ---------------------
// SQUAREUI-GAME (.JS)
// ---------------------

// Add games modes panes to the square-ui-game and create square-ui-game
// than add it to square-ui
function GameModes() {
    // Create the container and apply css rules
    // for animations (end of this block)
    $("<div>", {
        class: "square-ui-game",
    }).css({
        opacity: '0',
        marginTop: '50px',
    })
    .appendTo("#square-ui");

    // Create 3 Panes
    // which propose game modes
    // ---------
    // SOLO
    var solo = $("<div>", {
        html: "<img src='../icons/icon_circuit.png'></img> <span> VS CPU </span>" +
                "<span class='text-info'>Battle against the computer</span>",
        class: "vertiacal-pan",
    }).appendTo(".square-ui-game");

    // 2 LOCAL PLAYERS
    var local = $("<div>", {
        html: "<img src='../icons/icon_meeting.png'></img> <span> 2 Players </span>" +
                "<span class='text-info'>2 players on the same computer</span>",
        class: "vertiacal-pan",
    }).appendTo(".square-ui-game");

    // ONLINE
    var online = $("<div>", {
        html: "<img src='../icons/icon_globe.png'></img> <span> Online </span>" +
                "<span class='text-info'>Challenge players around the world</span>",
        class: "vertiacal-pan",
    }).appendTo(".square-ui-game");


    // Animate square-ui-game
    ShowSquareUIGame();

    // Event
    solo.click(function () {
        // Start a Solo game
    });

    local.click(function () {
        TwoPlayers();
    });

    online.click(function () {
        // Start an online party
    });
}

// Start a game with two local players
function TwoPlayers() {
    // Animations
    $(".vertiacal-pan").animate({
        opacity: "0",
        top: "+=20px",
    });
    $("#square-ui").css({
        height: "+=300px",
    });


    // User's avatar
    // & game buttons
    $("<div>", {
        class: "user-pan",
    }).insertBefore(".square-ui-game");

    $("<div>", {
        class: "user-profil",
    }).appendTo(".user-pan");

    $("<span>", {
        class: "user-name",
        html: "Visitor",
    }).appendTo(".user-pan");

    // Add icons
    // ----------
    // Score
    var score = $("<div>", {
        class: 'score-panel',
    }).appendTo("#square-ui");

    $("<span>", {
        html: "0",
        class: "score",
        id : "user-score-points",
    }).appendTo(".score-panel");

    $("<img>", {
        src : "../icons/icon_award.png",
        class: "mini-icon",
    }).appendTo(".score-panel");


    // Bonus
    LoadBonus();


    // Game buttons
    $("<div>", {
        class: "buttons-pan",
    }).appendTo(".user-pan");

    // Play/Pause Icon
    var pause = $("<img>", {
        id      : 'button-pause',
        class   : 'game-icon',
        src     : '../icons/icon_pause.png',
        function: 'pause'
    }).appendTo(".buttons-pan");

    // Skip icon
    var skipe = $("<img>", {
        id      : 'button-passe',
        class   : 'game-icon',
        src     : '../icons/icon_end.png',
        function: 'skipe'
    }).appendTo(".buttons-pan");

    // EVENTS
    // Pause event
    EventGamePause(pause);

    // Skip event
    skipe.click(function () {
        PasseTour(_myState);
    });

    Delay(function () {
        $(".square-ui-game").css({
            width: "90%",
        });

        // Start a 2 local players game
        var board = $('#canvas');

        $(".square-ui-game").html("");
        board.appendTo(".square-ui-game");


        // load the game's board
        LoadBoard();

        Delay(function () {
            AutoStartGame();

        }, 1000);
    }, 1000);
}

// Load powers
function LoadBonus() {
    $("<div>", {
        class: 'powers-panel',
    }).appendTo("#square-ui");

    $("<img>", {
        id: 'cadre-un',
        class: 'power',
        src: './images/bonus/bonus_divide2.png',
    }).appendTo(".powers-panel");

    $("<img>", {
        id: 'cadre-deux',
        class: 'power',
        src: './images/bonus/bonus_double.png',
    }).appendTo(".powers-panel");

    $("<img>", {
        id: 'cadre-trois',
        class: 'power',
        src: './images/bonus/bonus_neutral.png',
    }).appendTo(".powers-panel");
}

// Starts automatically the game
function AutoStartGame() {
    screenGoStart(_myState);
    ChangePlayer(_myState);
}

// Pause the game
function EventGamePause(button) {
    // console.log(button);
    // Change to Resume
    button.off('click');
    button.attr("src", "../icons/icon_pause.png");
    button.click(function () {
        // Pause function in
        // /game/js/main.js
        ScreenPause(_myState);
        // ScreenResume(stateGame);
        EventGameResume(button);
    });
}

// Resume the game
function EventGameResume(button) {
    // Change to Resume
    button.off('click');
    button.attr("src", "../icons/icon_play2.png");
    button.click(function () {
        // Pause function in
        // /game/js/main.js
        // ScreenPause(_myState);
        ScreenResume(_myState);
        EventGamePause(button);
    });
}
