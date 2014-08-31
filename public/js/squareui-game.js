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
    // ------------------------
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

    // Expend square ui
    ExpendSquareUI('300');


    // User's avatar
    // & game buttons
    $("<div>", {
        class: "user-pan",
    }).insertBefore(".square-ui-game");

    var profil = $("<div>", {
        class: "user-profil",
    }).css({
        opacity: '0',
    })
    .appendTo(".user-pan");

    var userName = $("<span>", {
        class: "user-name",
        html: "Visitor",
    }).css({
        opacity: '0',
    }).appendTo(".user-pan");

    // Add icons
    // ----------
    // Score
    var score = $("<div>", {
        class: 'score-panel',
    }).appendTo("#square-ui");

    var userScorePoints = $("<span>", {
        html: "0",
        class: "score",
        id : "user-score-points",
    }).css({
        opacity: '0',
    }).appendTo(".score-panel");

    var userScoreIcon = $("<img>", {
        src : "../icons/icon_award.png",
        class: "mini-icon",
    }).css({
        opacity: '0',
    }).appendTo(".score-panel");

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
    }).css({
        opacity: '0',
    }).appendTo(".buttons-pan");

    // Skip icon
    var skip = $("<img>", {
        id      : 'button-skip',
        class   : 'game-icon',
        src     : '../icons/icon_end.png',
        function: 'skip'
    }).css({
        opacity: '0',
    }).appendTo(".buttons-pan");

    // Add tooltip on points
    ApplyTooltipCenterRight(userScoreIcon, "your points");

    // Powers
    LoadPowers();


    // ANIMATIONS
    ShowGameIcons();

    // EVENTS
    // Pause event
    EventGamePause(pause);
    HoverGameIcons();

    // Skip event
    skip.click(function () {
        PasseTour(_myState);
    });

    Delay(function () {
        var squareuiGame = $(".square-ui-game").css({
            width: "90%",
            opacity: 1,
        });

        // Start a 2 local players game
        var board = $('#canvas');

        $(".square-ui-game").html("");
        board.appendTo(".square-ui-game");


        $("#canvas").css({
            opacity: 0,
            height: '500px',
            width: '785px',
        }).animate({
            opacity: 1,
            height: '515px',
            width: '800px',
        });

        // Load the game's board
        LoadBoard();

        Delay(function () {
            AutoStartGame();

        }, 1000);
    }, 1000);

    // Indicated the user's already started a game
    _settings.gameStarted = true;
}

function ShowGameIcons() {
    $(".power").animate({
        height: '30px',
        width: '30px',
        opacity: 0.5,
    });

    $(".score-panel").animate({
        opacity: 1,
    });

    $(".user-profil").animate({
        height: '60px',
        width: '60px',
        opacity: 0.5,
    });

    $(".user-name").animate({
        opacity: 1,
        height: "0px",
    });

    $(".game-icon").animate({
        height: '40px',
        width: '40px',
        opacity: 0.2,
    });

    $(".score-panel .mini-icon").animate({
        height: "50px",
        width: "50px",
        opacity: 0.2,
    });

    $("#user-score-points").animate({
        opacity: 1,
    });
}

function HideGameIcons() {
    $(".power").animate({
        height: '0px',
        width: '0px',
        opacity: 0,
    });

    $(".score-panel").animate({
        height: '0px',
        width: '0px',
        opacity: 0,
    });

    $(".user-profil").animate({
        height: '0px',
        width: '0px',
        opacity: 0,
    });

    $(".user-name").animate({
        opacity: 0,
        height: "-10px",
    });

    $(".game-icon").animate({
        height: '0px',
        width: '0px',
        opacity: 0,
    });
}


// Load powers
function LoadPowers() {
    $("<div>", {
        class: 'powers-panel',
    }).appendTo("#square-ui");

    var one = $("<img>", {
        id: 'power-one',
        class: 'power',
    }).css({
        opacity: 0,
        height: '20px',
        width: '20px',
    }).appendTo(".powers-panel");

    var two = $("<img>", {
        id: 'power-two',
        class: 'power',
    }).css({
        opacity: 0,
        height: '20px',
        width: '20px',
    }).appendTo(".powers-panel");

    var three = $("<img>", {
        id: 'power-three',
        class: 'power',
    }).css({
        opacity: 0,
        height: '20px',
        width: '20px',
    }).appendTo(".powers-panel");

    // ANIMATIONS
    one.animate({
        opacity: 0.5,
        height: '30px',
        width: '30px',
    }, {
        delay: 500,
    });

    two.animate({
        opacity: 0.5,
        height: '30px',
        width: '30px',
    }, {
        delay: 2000,
    });

    three.animate({
        opacity: 0.5,
        height: '30px',
        width: '30px',
    }, {
        delay: 3000,
    });

    HoverPowersIcons();
}

// Event activated when the mouse is over a power icon
function HoverPowersIcons() {
    $("#power-one").hover(function () {
        $(this).css({
            height: '38px',
            width: '38px',
            borderWidth: '0px',
            opacity: 1,
        });
    }, function () {
        $(this).css({
            height: '30px',
            width: '30px',
            borderWidth: '3px',
            opacity: 0.5,
        });
    });

    $("#power-two").hover(function () {
        $(this).css({
            height: '38px',
            width: '38px',
            borderWidth: '0px',
            opacity: 1,
        });
    }, function () {
        $(this).css({
            height: '30px',
            width: '30px',
            borderWidth: '3px',
            opacity: 0.5,
        });
    });

    $("#power-three").hover(function () {
        $(this).css({
            height: '38px',
            width: '38px',
            borderWidth: '0px',
            opacity: 1,
        });
    }, function () {
        $(this).css({
            height: '30px',
            width: '30px',
            borderWidth: '3px',
            opacity: 0.5,
        });
    });
}

// Event activated when the mouse is game's icon
function HoverGameIcons() {
    $(".user-profil").hover(function () {
        $(this).css({
            opacity : 1,
            height  : '70px',
            width   : '70px',
        });
    }, function () {
        $(this).css({
            opacity : 0.5,
            height  : '60px',
            width   : '60px',
        });
    });

    $(".score-panel .mini-icon").hover(function () {
        $(this).css({
            opacity: 1,
        });
    }, function () {
        $(this).css({
            opacity: 0.2,
        });
    });

    $(".game-icon").hover(function () {
        $(this).css({
            opacity: 1,
        });
    }, function () {
        $(this).css({
            opacity: 0.2,
        });
    });
}

// Test if the player has enough points;
// if so the power is colored in green.
// Else the power is red
function PowerCansbeActivated(jQueryObject) {
    if (_myState.activePlayers.score >= jQueryObject.attr("price")) {
        jQueryObject.css({
            background : '#2ecc71',
        });
    }
    else {
        jQueryObject.css({
            background : '#e74c3c',
        });
    }
}

// Starts automatically the game
function AutoStartGame() {
    screenGoStart(_myState);
    ChangePlayer(_myState);
}

// Pause the game
function EventGamePause(button) {
    // Change to Resume
    button.off('click');
    button.attr("src", "../icons/icon_pause.png");
    button.attr('isGlowing', 'false');
    button.click(function () {
        // Pause function in
        // /game/js/main.js
        ScreenPause(_myState);
        EventGameResume(button);
    });
}

// Resume the game
function EventGameResume(button) {
    // Change to Resume
    button.off('click');
    button.attr("src", "../icons/icon_play2.png");
    button.attr('isGlowing', 'true');
    button.click(function () {
        // Pause function in
        // /game/js/main.js
        ScreenResume(_myState);
        EventGamePause(button);
    });
}

function AddTooltipOnPower(jQueryObject, power) {
    jQueryObject.qtip({
        style: {
            classes: 'qtip-dark',
            fontSize: '22px',
        },
        position: {
            my: 'CenterLeft',
            at: 'CenterRight',
            adjust:{ method : 'none'},
        },
        content: {
            title: power.title,
            text: "<strong>Effect: </strong>" + power.desc + "<br/><br/>" +
             "<strong> Cost: </strong>" + "<span class='power-price'>" + power.price +"</span>" + " points",
        },
        show: {
            event: "click",
            effect: function () {
                $(this).fadeTo(500, 1);
            }
        },
        hide: {
            event: "click",
            effect: function () {
                $(this).fadeTo(500, 0);
            }
        }
    });
}
