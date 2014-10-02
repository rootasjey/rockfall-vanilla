// ---------------------
// SUPERSQUARE-GAME.JS
// ---------------------

// Show/Hide game's modes
SuperSquare.prototype.GameModesToggleVisbility = function () {
    // If the player was playing previously, so restore the game
    if (this.settings.gameStarted) {
        this.GameShowGameBoard();
        return;
    }

    // If game modes panels are non-existent, create them
    if ($(".game-ui").length < 1) {
        var gameui = $("<div>", {
                        class: "game-ui",
                    }).css({
                        opacity: '1',
                    }).appendTo($(this.selector));

        // Create 3 game modes
        // SOLO
        $("<div>", {
            html: "<img src='../icons/icon_circuit.png'></img> <span> VS CPU </span>" +
                    "<span class='text-info'>Battle against the computer</span>",
            class: "vertical-pan",
            function: "cpu-mode",
        }).css({
            opacity: 0,
            display: "none",
        }).appendTo(gameui);

        // 2 LOCAL PLAYERS
        $("<div>", {
            html: "<img src='../icons/icon_meeting.png'></img> <span> 2 Players </span>" +
                    "<span class='text-info'>2 players on the same computer</span>",
            class: "vertical-pan",
            function: "twoplayers-mode",
        }).css({
            opacity: 0,
            display: "none",
        }).appendTo(gameui);

        // ONLINE
        $("<div>", {
            html: "<img src='../icons/icon_globe.png'></img> <span> Online </span>" +
                    "<span class='text-info'>Challenge players around the world</span>",
            class: "vertical-pan",
            function: "online-mode",
        }).css({
            opacity: 0,
            display: "none",
        }).appendTo(gameui);

        this.GameGameModesEvents(); // Events
    }

    // Hide or Show
    if ($(".vertical-pan").css("display") === "none") {
        var time = 500;
        $(".vertical-pan").each(function () {
            $(this).css({
                top     : "20px",
                opacity : 0,
                display : "inline-block",
            }).animate({
                top     : "0px",
                opacity : 0.5,
            }, {
                duration: time,
            });
            time += 250;
        });
    }
    else {
        var time = 0;
        $(".vertical-pan").each(function () {
            $(this).css({
                top     : "0",
                opacity : 0.5,
            }).animate({
                top     : "20px",
                opacity : 0,
            }, {
                duration: time,
            });
            time += 250;

            window.setTimeout(function (verticalPan) {
                verticalPan.css({ display : "none" });
            }, 500, $(this))
        });
    }
};

// Events on game's modes panels
SuperSquare.prototype.GameGameModesEvents = function () {
    this.GameHoverGameModes();
    this.GameClickGameModes();
};

// Event : Hover on game's mode panels
SuperSquare.prototype.GameHoverGameModes = function () {
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
};

// Event : Click on game's modes panels
SuperSquare.prototype.GameClickGameModes = function () {
    var ss = FindSuperSquare("play");

    $(".vertical-pan[function='cpu-mode']").click(function () {
        // Starts a Solo game
        ss.GameCPUMode();
    });

    $(".vertical-pan[function='twoplayers-mode']").click(function () {
        // Starts a 2 local players
        ss.GameTwoPlayersMode();
    });

    $(".vertical-pan[function='online-mode']").click(function () {
        // Starts an online party
        ss.GameOnlineMode();
    });
};

// Hover & Click events on game buttons (play, pause, skip)
SuperSquare.prototype.GameEventsGameButtonsControl = function () {
    var ss = FindSuperSquare("play");

    var pause = $("#button-pause");
    this.GameEventGamePause(pause);

    // Skip event
    var skip = $("#button-skip");
    skip.click(function () {
        PasseTour(_myState);
    });

    // Stop event
    var stop = $("#button-stop");
    stop.click(function () {
        ss.GameEndTheParty();
    });
};

// Load powers
SuperSquare.prototype.GameLoadPowers = function () {
    if ( $(".powers-panel").length < 1 ) {
        $("<div>", {
            class: 'powers-panel',
        }).appendTo(".game-ui");

        $("<img>", {
            id: 'power-one',
            class: 'power',
        }).css({
            opacity: 0,
            height: '20px',
            width: '20px',
        }).appendTo(".powers-panel");

        $("<img>", {
            id: 'power-two',
            class: 'power',
        }).css({
            opacity: 0,
            height: '20px',
            width: '20px',
        }).appendTo(".powers-panel");

        $("<img>", {
            id: 'power-three',
            class: 'power',
        }).css({
            opacity: 0,
            height: '20px',
            width: '20px',
        }).appendTo(".powers-panel");
    }


    // ANIMATIONS
    $("#power-one").animate({
        opacity: 0.9,
        height: '30px',
        width: '30px',
    }, {
        delay: 500,
    });

    $("#power-two").animate({
        opacity: 0.9,
        height: '30px',
        width: '30px',
    }, {
        delay: 2000,
    });

    $("#power-three").animate({
        opacity: 0.9,
        height: '30px',
        width: '30px',
    }, {
        delay: 3000,
    });

    this.GameHoverPowersIcons();
};

// Event activated when the mouse is over a power icon
SuperSquare.prototype.GameHoverPowersIcons = function () {
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
};

// Event activated when the mouse is game's icon
SuperSquare.prototype.GameHoverGameIcons = function () {
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
};


// Test if the player has enough points;
// If so the power is colored in green, Else the power is red
SuperSquare.prototype.GamePowerCansBeActivated = function (jQueryObject) {
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
};

// Starts automatically the game
SuperSquare.prototype.GameAutoStartGame = function () {
    screenGoStart(_myState);
    ChangePlayer(_myState);
};

// Pause the game
SuperSquare.prototype.GameEventGamePause = function (button) {
    var ss = FindSuperSquare("play");

    // Change the button to Pause
    button.off('click');
    button.attr("src", "../icons/icon_pause.png");
    button.attr('isGlowing', 'false');
    button.click(function () {
        // Pause function in '/game/js/main.js'
        ScreenPauseFadeOut();
        ss.settings.stats = "pause";
        ss.GameEventGameResume(button);
    });
};

// Resume the game
SuperSquare.prototype.GameEventGameResume = function (button) {
    var ss = FindSuperSquare("play");

    // Change the button to Resume
    button.off('click');
    button.attr("src", "../icons/icon_play2.png");
    button.attr('isGlowing', 'true');
    button.click(function () {
        // Pause function in '/game/js/main.js'
        ScreenResumeFadeIn();
        ss.settings.stats = "playing";
        ss.GameEventGamePause(button);
    });
};

// End the game
SuperSquare.prototype.GameEndTheParty = function () {
    if($(".message-confirmation").length > 0) return;

    var ss = FindSuperSquare("play");
    var gameui = ".game-ui";

    ss.settings.stats = "pause"; // set the game's status to pause

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
            ss.GameEventGameResume($("#button-pause"));
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
    }).appendTo(gameui);

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
        duration: 1000,
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
        ss.settings.gameStarted = false;
        ss.settings.stats = "none";
        EventGameEndGame();

        ss.GameRemoveGameIcons();
        ss.Reduce('300');

        // Resize the square ui game
        $(gameui).css({
            width: "67%",
        });

        ss.GameModesToggleVisbility();
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
        ScreenResume(_myState);
        ss.settings.stats = "playing";
        ss.GameEventGamePause($("#button-pause"));
    });
};

// Show game's icons
SuperSquare.prototype.GameShowGameIcons = function () {
    var gameui = ".game-ui";

    // First create objects if they're don't exist
    if ($(".user-profil").length < 1) {
        // Container for game avatars & user's names
        $("<div>", {
            class: "user-pan",
        }).insertBefore(gameui);

        // PLAYER 1 : avatar
        var p1 = $("<div>", {
            player: "1",
            active: false,
            class: "player-panel"
        }).appendTo(".user-pan");

        // Avatar
        $("<div>", {
            class: "user-profil",
        }).css({
            opacity: '0',
        })
        .appendTo(p1);

        // Name
        $("<span>", {
            class: "user-name",
            html: "Visitor",
        }).css({
            opacity: '0',
        }).appendTo(p1);


        // PLAYER 2 : avatar
        var p2 = $("<div>", {
            player: "2",
            acitve: false,
            class: "player-panel"
        }).appendTo(".user-pan");

        // Avatar
        $("<div>", {
            class: "user-profil",
        }).css({
            opacity: '0',
        })
        .appendTo(p2);

        // Name
        $("<span>", {
            class: "user-name",
            html: "CPU",
        }).css({
            opacity: '0',
        }).appendTo(p2);
    }

    if ($(".score-panel").length < 1) {
        // Score
        var score = $("<div>", {
            class: 'score-panel',
        }).appendTo(this.selector);

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
            AddTooltipCenterRight(userScoreIcon, "your points");
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
        }

        this.GameEventsGameButtonsControl();
        this.GameHoverGameIcons();
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

    // Check the user's authentification
    if (this.settings.connected) {
        $(".user-name").html(this.user.name);
    }
};

// Remove the game's icons (play, pause, powers, ...)
SuperSquare.prototype.GameHideGameIcons = function () {
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
};

// Remove the game's icons (play, pause, powers, ...)
SuperSquare.prototype.GameRemoveGameIcons = function () {
    this.GameHideGameIcons();

    window.setTimeout(function () {
        $(".powers-panel").remove();
        $(".score-panel").remove();
        $(".user-pan").remove();
    }, 1000);
};

// Add tooltips on game powers
SuperSquare.prototype.GameAddTooltipOnPower = function (jQueryObject, power) {
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
};

// Start a game with two local players
SuperSquare.prototype.GameTwoPlayersMode = function () {
    this.settings.stats = "playing";

    this.GameModesToggleVisbility();
    this.ExpendVertically('300');
    this.GameLoadPowers();
    this.GameShowGameIcons();


    window.setTimeout(function () {
        var gameui = $(".game-ui").css({
            width: "90%",
            opacity: 1,
        });

        // Start a 2 local players game
        var board = $('#canvas');
        board.appendTo(gameui);


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
        window.setTimeout(function () {
            var ss = FindSuperSquare("play");
            ss.GameAutoStartGame();
        }, 2000);

    }, 1000);

    // Indicated the user's already started a game
    this.settings.gameStarted = true;
};

SuperSquare.prototype.GameHideGameBoard = function () {
    $("#canvas").css({
        display: "none"
    });
    $(".game-ui").css({ width: "760px" });

    // Hide game's icons
    this.GameHideGameIcons();

    // Pause the game if the user is playing
    if (this.settings.stats === "playing") {
        // Pause the game
        ScreenPause();
        this.settings.stats = "pause";
        // Change the button to resume
        this.GameEventGameResume($("#button-pause"));
    }
};

SuperSquare.prototype.GameShowGameBoard = function () {
    // Check that the Super Square has the right size
    if ($(this.selector).css("height") < "700px") {
        this.ExpendVertically('600');
    }

    $("#canvas").css({  display: "block" });
    $(".game-ui").css({ width: "90%" });

    // Show game's icons
    this.GameShowGameIcons();
};

// Start an online game
// (Ask against a friend or random?)
SuperSquare.prototype.GameOnlineMode = function () {
    this.settings.stats = "playing";
    this.GameModesToggleVisbility();
    var ss = this;

    // The user choose which sub-mode
    var choice = $("<div>", {
        class: "message-confirmation",
        html: "<span> Against who do you want to compete? </span>",
    }).css({
        opacity: 0,
        position: 'relative',
        top: '100px',
        width: '500px',
    }).appendTo(".game-ui");

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
            boxShadow: "0 0 20px #000000",
        });
    }, function () {
        $(this).css({
            opacity: 0.5,
            background: 'black',
            boxShadow: "0 0 0px #000000",
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
        ss.GameFriendlyOnlineMode();
    });
    unfriendlyButton.click(function () {
        ss.GameUnfriendlyOnlineMode();
    });
    cancelButton.click(function () {
        var parent = $(this).parent();
        parent.remove();
        ss.GameModesToggleVisbility();
    });

    choice.animate({
        opacity: 1,
        top: '90px',
    });
};

// Battle with a friend
SuperSquare.prototype.GameFriendlyOnlineMode = function () {
    // Enter your friend's name    
};

// Compete against a total stranger
SuperSquare.prototype.GameUnfriendlyOnlineMode = function () {
    // Please waiting while matching
};

// Fight against the CPU
SuperSquare.prototype.GameCPUMode = function () {
    this.settings.stats = "playing";
    this.GameModesToggleVisbility();
    var ss = this;

    // The user choose which sub-mode
    var choice = $("<div>", {
        class: "message-confirmation",
        html: "<span> Which CPU level do you want to fight? </span>",
    }).css({
        opacity: 0,
        position: 'relative',
        top: '100px',
        width: '500px',
    }).appendTo(".game-ui");

    var easyCPUButton = $("<div>", {
        class: 'button',
        html: "<span> Easy </span>",
    }).appendTo(choice);

    var hardCPUButton = $("<div>", {
        class: 'button',
        html: "<span> Hard </span>",
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
    easyCPUButton.hover(function () {
        $(this).css({
            opacity: 1,
            background: '#2ecc71',
            boxShadow: "0 0 20px #000000",
        });
    }, function () {
        $(this).css({
            opacity: 0.5,
            background: 'black',
            boxShadow: "0 0 0px #000000",
        });
    });
    hardCPUButton.hover(function () {
        $(this).css({
            opacity: 1,
            background: '#ecf0f1',
            boxShadow: "0 0 20px #000000",
        });
    }, function () {
        $(this).css({
            opacity: 0.5,
            background: 'black',
            boxShadow: "0 0 0px #000000",
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
    easyCPUButton.click(function () {
    });
    hardCPUButton.click(function () {
    });
    cancelButton.click(function () {
        var parent = $(this).parent();
        parent.remove();
        ss.GameModesToggleVisbility();
    });

    choice.animate({
        opacity: 1,
        top: '90px',
    });
};
