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
        class: "vertical-pan",
    }).appendTo(".square-ui-game");

    // 2 LOCAL PLAYERS
    var local = $("<div>", {
        html: "<img src='../icons/icon_meeting.png'></img> <span> 2 Players </span>" +
                "<span class='text-info'>2 players on the same computer</span>",
        class: "vertical-pan",
    }).appendTo(".square-ui-game");

    // ONLINE
    var online = $("<div>", {
        html: "<img src='../icons/icon_globe.png'></img> <span> Online </span>" +
                "<span class='text-info'>Challenge players around the world</span>",
        class: "vertical-pan",
    }).appendTo(".square-ui-game");


    // Animate square-ui-game
    ShowSquareUIGame();

    // Event
    HoverGamesMode();

    solo.click(function () {
        // Start a Solo game
    });

    local.click(function () {
        TwoPlayersMode();
    });

    online.click(function () {
        // Start an online party
        OnlineMode();
    });
}

function ShowGameModes() {
    // Display the game's modes
    $(".vertical-pan").css({
        display: 'inline-block',
        top: "10px",
    }).animate({
        opacity: "0.5",
        top: "0",
    });
}

// Start a game with two local players
function TwoPlayersMode() {
    HideGameModes();
    ExpendSquareUI('300');
    LoadPowers();
    ShowGameIcons();


    Delay(function () {
        var squareuiGame = $(".square-ui-game").css({
            width: "90%",
            opacity: 1,
        });

        // Start a 2 local players game
        var board = $('#canvas');
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

        }, 500);
    }, 1000);

    // Indicated the user's already started a game
    _settings.gameStarted = true;
}

// Start an online game
// (Ask against a friend or random?)
function OnlineMode() {
    HideGameModes();

    // The user choose which sub-mode
    var choice = $("<div>", {
        class: "message-confirmation",
        html: "<span> Against who do you want to compete? </span>",
    }).css({
        opacity: 0,
        position: 'relative',
        top: '100px',
        width: '500px',
    }).appendTo(".square-ui-game");

    var friendlyButton = $("<div>", {
        class: 'button',
        html: "<span> A friend </span>",
    }).appendTo(choice);

    var unfriendlyButton = $("<div>", {
        class: 'button',
        html: "<span> Anyone! </span>",
    }).appendTo(choice);

    var cancelButton = $("<div>", {
        class: 'button',
        html: "<span> Cancel </span>",
    }).css({
        display: 'block',
        width: '240px',
        margin: 'auto'
    }).appendTo(choice);

    // Hover events
    $(".message-confirmation .button").hover(function () {
        $(this).css({
            opacity: 1,
            background: '#3498db',
        });
    }, function () {
        $(this).css({
            opacity: 0.5,
            background: 'black',
        });
    });
    cancelButton.hover(function () {
        $(this).css({
            opacity: 1,
            background: '#e74c3c',
            boxShadow: "0 0 20px #000000",
        });
    }, function () {
        $(this).css({
            opacity: 0.5,
            background: 'black',
            boxShadow: "0 0 0px #000000",
        });
    });

    // CLICK EVENTS
    friendlyButton.click(function () {
        FriendlyOnlineMode();
    });
    unfriendlyButton.click(function () {
        UnfriendlyOnlineMode
    });
    cancelButton.click(function () {
        var parent = $(this).parent();
        parent.remove();
        ShowGameModes();
    });

    choice.animate({
        opacity: 1,
        top: '90px',
    });
}

// Battle with a friend
function FriendlyOnlineMode() {

}

// Compete against a total stranger
function UnfriendlyOnlineMode() {

}

// This function is explicit
function HideGameModes() {
    $(".vertical-pan").animate({
        opacity: "0",
        top: "+=20px",
    }, {
        complete: function () {
            $(this).css({
                display: 'none',
            })
        }
    });
}

function ShowGameIcons() {
    // First create objects if they're don't exist
    if ($(".user-profil").length < 1) {
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
    }

    if ($(".score-panel").length < 1) {
        // Score
        var score = $("<div>", {
            class: 'score-panel',
        }).appendTo("#square-ui");

        if ($("#user-score-points").length < 1) {
            var userScorePoints = $("<span>", {
                html: "0",
                class: "score",
                id : "user-score-points",
            }).css({
                opacity: '0',
            }).appendTo(".score-panel");
        }

        if ($(".score-panel .mini-icon[action='scoreIcon']").length < 1) {
            var userScoreIcon = $("<img>", {
                src : "../icons/icon_award.png",
                class: "mini-icon",
                action: "scoreIcon",
            }).css({
                opacity: '0',
            }).appendTo(".score-panel");

            // Add tooltip on points
            ApplyTooltipCenterRight(userScoreIcon, "your points");
        }
    }

    if ($(".user-pan .buttons-pan").length < 1) {
        // Game buttons
        $("<div>", {
            class: "buttons-pan",
        }).appendTo(".user-pan");

        if ($("#button-pause").length < 1) {
            // Play/Pause Icon
            var pause = $("<img>", {
                id      : 'button-pause',
                class   : 'game-icon',
                src     : '../icons/icon_pause.png',
                function: 'pause'
            }).css({
                opacity: '0',
            }).appendTo(".buttons-pan");

            // EVENTS
            // Pause event
            EventGamePause(pause);
        }

        if ($("#button-skip").length < 1) {
            // Skip icon
            var skip = $("<img>", {
                id      : 'button-skip',
                class   : 'game-icon',
                src     : '../icons/icon_end.png',
                function: 'skip'
            }).css({
                opacity: '0',
            }).appendTo(".buttons-pan");

            // Skip event
            skip.click(function () {
                PasseTour(_myState);
            });
        }

        if ($("#button-stop").length < 1) {
            var stop = $("<img>", {
                id      : 'button-stop',
                class   : 'game-icon',
                src     : '../icons/icon_stop.png',
                function: 'stop'
            }).css({
                opacity: '0',
            }).appendTo(".buttons-pan");

            // Stop event
            stop.click(function () {
                EndTheParty();
            });
        }
    }



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

    HoverGameIcons();
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

function RemoveGameIcons() {
    HideGameIcons();

    Delay(function () {
        $(".powers-panel").remove();
        $(".score-panel").remove();
        $(".user-pan").remove();
    }, 1000);
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
        opacity: 0.9,
        height: '30px',
        width: '30px',
    }, {
        delay: 500,
    });

    two.animate({
        opacity: 0.9,
        height: '30px',
        width: '30px',
    }, {
        delay: 2000,
    });

    three.animate({
        opacity: 0.9,
        height: '30px',
        width: '30px',
    }, {
        delay: 3000,
    });

    HoverPowersIcons();
}

// Event activated when the mouse is over a power icon
function HoverPowersIcons() {
    $(".power").hover(function () {
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
            opacity: 0.9,
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

function HoverGamesMode() {
    $(".vertical-pan").hover(function () {
        $(this).css({
            opacity: 1,
            width: "155px",
        });
    }, function () {
        $(this).css({
            opacity: 0.5,
            width: "140px",
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
        ScreenPauseFadeOut();
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
        ScreenResumeFadeIn();
        EventGamePause(button);
    });
}

// End the game
function EndTheParty() {
    if($(".message-confirmation").length > 0) return;

    // Fade out the game board
    $("#canvas").animate({
        opacity: 0,
        height: "485px",
        width: "760px",
    }, {
        complete: function () {
            $(this).css({
                display: 'none',
            });

            // Pause the game
            EventGameResume($("#button-pause"));
            ScreenPause(_myState);

            // deactivate the resume button
            $("#button-pause").unbind("click");
        }
    });

    // Show confirmation
    var message = $("<div>", {
        class: 'message-confirmation',
        html: "<span> You're going to end this party</span> <br>"
    }).css({
        opacity: 0,
        position: 'absolute',
        top: '220px',
        left: '200px',
    }).appendTo(".square-ui-game");

    var confirm = $("<div>", {
        class: 'button',
        html: "<span> quit </span>",
    }).appendTo(".message-confirmation");

    var cancel = $("<div>", {
        class: 'button',
        html: "<span> cancel </span>",
    }).appendTo(".message-confirmation");

    // ANIMATIONS
    message.css({
        height: '190px',
        width: '280px',
    }).animate({
        opacity: 1,
        height: '140px',
        width: '400px',
    }, {
        delay: 1000,
    });

    // EVENTS
    // Hover event
    confirm.hover(function () {
        $(this).css({
            opacity: 1,
            background: '#2ecc71',
        });
    }, function () {
        $(this).css({
            opacity: 0.5,
            background: 'black',
        });
    });

    // Hover event
    cancel.hover(function () {
        $(this).css({
            opacity: 1,
            background: '#e74c3c',
        });
    }, function () {
        $(this).css({
            opacity: 0.5,
            background: 'black',
        });
    });

    // Confirm the quiting
    confirm.click(function () {
        // Delete the message confirmation
        $(this).parent().remove();

        // Clean the game board
        _settings.gameStarted = false;
        EventGameEndGame();

        RemoveGameIcons();

        ShrinkSquareUI('300');

        // Resize the square ui game
        $(".square-ui-game").css({
            width: "67%",
        });

        ShowGameModes();
    });

    // Cancel the quiting
    cancel.click(function () {
        // Delete the message confirmation
        $(this).parent().remove();
        // Display the game board
        $("#canvas").animate({
            opacity: 1,
            height: "515px",
            width: "800px",
        });

        // Reactivate the pause button &
        // Resume the game
        EventGamePause($("#button-pause"));
        ScreenResume(_myState);
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
