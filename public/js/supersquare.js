// ------------------
// SUPERSQUARE.JS
// ------------------
// SuperSquare class!
// ------------------
// ~ All functions ending with 'ToggleVisibility' are built identically :    ~
// ~ 1 : Create the control if it's non-existent                             ~
// ~ 2 : If the control is hidden, show it OR if it's displayed, hide it     ~
// ------------------

// CONSTRUCTOR --->
// -selector > #id or .class (html object)
// -function > the purpose of the SuperSquare (play, connection, ...)
function SuperSquare(selector, purpose) {
    // Attributes
    this.selector       = selector;
    this.purpose        = purpose;
    this.superContainer = ".square-group";
    this.color = this.GetAFlatColor();

    // Fire up initial functions
    this.SquareEffect();
    this.DefaultEvents();
    this.AddSettingsToSuperSquare();

    // Add this object to the collection of SuperSquare
    _SSBOX.push(this);
}

// Static function which finds the specified Super Square
// ~This function is needed because sometimes we lose our 'this' object in prototypes~
// -purpose > the purpose super square's attribute
function FindSuperSquare(purpose) {
    for (var i = 0; i < _SSBOX.length; i++) {
        if (_SSBOX[i].purpose === purpose) {
            return _SSBOX[i];
        }
    }
}

// Animation effect on a super square
SuperSquare.prototype.SquareEffect = function () {
    $(this.selector).css({
        // Set the blur radius at 0
        "-moz-box-shadow": "0 0 20px #000000",
        "-webkit-box-shadow": "0 0 20px #000000",
        "box-shadow": "0 0 20px #000000",
        background : this.color,
        opacity: 1,
    });

    window.setTimeout(function (s) {
        $(s).css({
            // Set the blur radius at 0
            "-moz-box-shadow": "0 0 0px #000000",
            "-webkit-box-shadow": "0 0 0px #000000",
            "box-shadow": "0 0 0px #000000",
            background: "black",
            opacity: 0.8,
        });
    }, 1000, this.selector);
};

// Return a random flat color
SuperSquare.prototype.GetAFlatColor = function () {
    var colors = ["#1abc9c", "#2ecc71", "#3498db", "#3498db", "#34495e",
                  "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50",
                  "#f1c40f", "#e67e22", "#e74c3c", "#ecf0f1", "#95a5a6",
                  "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"];
                  //   credits to http://flatuicolors.com/

    var int = getRandomInt(0, colors.length);
    return colors[int];
};

SuperSquare.prototype.AddSettingsToSuperSquare = function () {
    if (this.purpose === "play") {
        this.settings = {
            "autoEndTurn"   : false,
            "background"    : "shattered.png",
            "gameStarted"   : false,
            "stats"         : "none",
        };

        // User's mail box
        this.box = {
            "count"             : 0,
            "page"              : 0,
            "maxPages"          : 0,
            "messagesPerPage"   : 6,
            "messages"          : [],
        };
    }
};

// Fire up initial events (hover, click)
SuperSquare.prototype.DefaultEvents = function () {
    this.EventMouseHover();
    this.EventMouseClick();
};

// Event : Mouse hover
SuperSquare.prototype.EventMouseHover = function () {
    $(this.selector).hover(function () {
        // Shadow effect
        var purpose = this.getAttribute("function");
        var ss = FindSuperSquare(purpose);
        $(this).css("background", ss.color);
        $(this).css("box-shadow", "0 0 20px #000000");
        $(this).css("-moz-box-shadow", "0 0 20px #000000");
        $(this).css("-webkit-box-shadow", "0 0 20px #000000");
    }, function () {
        // Set the blur radius at 0
        $(this).css("background", "black");
        $(this).css("box-shadow", "0 0 0px #000000");
        $(this).css("-moz-box-shadow", "0 0 0px #000000");
        $(this).css("-webkit-box-shadow", "0 0 0px #000000");
    });
};

// Event : Mouse click
SuperSquare.prototype.EventMouseClick = function () {
    $(this.selector).click(function () {
        // As we lose our 'this' object,
        // we have to use the global var (cf. globals.js)
        var attr = this.getAttribute("function");
        if (attr !== "play") return; // block others Super Square for now
        var ss = FindSuperSquare(attr);
        ss.Expend();
    });
};

// Expend Super Square with a height and a width
// -height > the desired height
// -width  > the desired width
SuperSquare.prototype.Expend = function (height, width) {
    // Check if the height and the width are specified,
    // if not, give a default value
    var h = height;
    var w = width;

    if (this.NotDefined(h)) {
        h = "400px"; // Default value
    }
    if (this.NotDefined(w)) {
        w = "100%"; // Default value
    }

    // First expend the super container
    $(this.superContainer).animate({
        width: "800px",
    });

    // Add scroll to the page
    $("html").toggleClass("html-no-scrollable");
    $(".square-group").css({
        height: 'auto',
    });

    // Expend the Super Square
    $(this.selector).animate({
        minWidth    : '450px',
        width       : w,
        height      : h,
        borderRadius: '5px',
    });

    // Hide the Super Square's image
    $(this.selector + " .img-square").css({
        display: "none",
    });

    // Remove hover, click events from the ss
    $(this.selector).off("mouseenter mouseleave click");

    // Apply inline CSS to the ss
    $(this.selector).css({
        opacity         : 1,
        // overflow        : "hidden",
        backgroundImage : "-ms-radial-gradient(center, circle farthest-side, #3B536A 0%, #12191F 100%)",
    });

    this.Populate(); // Add objects to this Super Square
};

// Minimize Super Square to a square
// ~Basically the same function than Expend() reversed~
// -height > the desired height
// -width  > the desired width
SuperSquare.prototype.Minimize = function (height, width) {
    this.Unpopulate(); // Remove objects to this Super Square
    ScrollVerticallyTo(-1000);

    window.setTimeout(function () {
        var ss = FindSuperSquare("play");
        // Check if the height and the width are specified,
        // if not, give a default value
        var h = height;
        var w = width;

        if (ss.NotDefined(h)) {
            h = "100px"; // Default value
        }
        if (ss.NotDefined(w)) {
            w = "100px"; // Default value
        }

        // First expend the super container
        $(ss.superContainer).css({
            width: "300px",
        });

        // Minimize the Super Square
        $(ss.selector).animate({
            minWidth    : '0px',
            width       : w,
            height      : h,
            borderRadius: '0px',

            opacity         : 0.8,
        }, {
            complete: function () {
                $(".square-group").css({
                    height: "290px",
                });
                // Remove scroll to the page
                $("html").toggleClass("html-no-scrollable");
            },
        });

        // Remove the custom background gradient
        $(ss.selector).css({
            backgroundImage : "",
        });

        // Display the Super Square's image
        $(ss.selector + " .img-square").css({
            display: "block",
        });


        // Add hover, click events to the ss
        ss.DefaultEvents();

    }, 1000);


};

// Check if a variable is defined (not eql to undefined or null)
// -arg > the variable which has to be tested
SuperSquare.prototype.NotDefined = function (arg) {
    if (typeof arg === "undefined" || arg === null) {
        return true;
    }
    return false;
};

// Fill the Super Square with objects
SuperSquare.prototype.Populate = function () {
    if (this.purpose === "play") {
        // We want to fill this ss with game elements
        this.PopulatePlay();
    }
};

SuperSquare.prototype.Unpopulate = function () {
    if (this.purpose === "play") {
        this.MiniIconPlayToggleVisibility(); // Hide icons

        // Test if game's modes are visible
        if ($(".vertical-pan").css("opacity") !== "0")
            this.GameModesToggleVisbility();

        // Test if the second panel is visible
        if ($(".second-panel").length > 0 && $(".second-panel").css("opacity") !== "0" )
            this.SecondPanelToggleVisibility();

        // Test if the user is playing
        if (this.settings.gameStarted) {
             // Hide board + game's icons
             this.GameHideGameBoard();
        }
    }
};

// Fill the ss with gaming objects (Super Square Play)
SuperSquare.prototype.PopulatePlay = function () {
    this.MiniIconPlayToggleVisibility();
    this.GameModesToggleVisbility();
};

// Show/Hide mini-icon class objects specially for Play Super Square
// Create them if they're non-existent
SuperSquare.prototype.MiniIconPlayToggleVisibility = function () {
    if ($(".mini-icon-panel").length < 1) {
        // If we're here, that means the panel's icons is non-existent
        // Let's create it!
        $("<div>", {
            class: 'mini-icon-panel',
        }).appendTo(this.selector);

        // close icon
        $("<img>", {
            class   : 'mini-icon',
            src     : '../icons/icon_miniclose.png',
            function: 'close',
        }).css({
            height  : "0px",
            width   : "0px",
        }).appendTo(".mini-icon-panel");

        // message icon
        $("<img>", {
            class   : 'mini-icon',
            src     : '../icons/icon_minispeechbubble.png',
            function: 'messages',
            isGlowing: 'false',
        }).css({
            height  : "0px",
            width   : "0px",
        }).appendTo(".mini-icon-panel");

        // settings icon
        $("<img>", {
            class   : 'mini-icon',
            src     : '../icons/icon_settingswrench.png',
            function: 'settings'
        }).css({
            height  : "0px",
            width   : "0px",
        }).appendTo(".mini-icon-panel");

        this.MiniIconPlayEvents();
    }

    // If the mini icons are hidden
    if ($(".mini-icon").css("height") === "0px") {
        $(".mini-icon").animate({ // Show them
            height: '30px',
            width: '30px',
        });

        // this.MiniIconPlayEvents();
        return;
    }
    else { // Mini icons are displayed
        $(".mini-icon").animate({ // Hide them
            height: '0px',
            width: '0px',
        });
        return;
    }
};

// Events for the mini icons (Super Square Play)
SuperSquare.prototype.MiniIconPlayEvents = function () {
    this.MiniIconPlayAutoHide(); // automatically hide some mini icons

    // Hover Event on mini icon
    $(this.selector + " .mini-icon").hover(function () {
        $(this).css({
            opacity: '1',
        });
    }, function () {
        $(this).css({
            opacity: '0.2',
        });
    });

    // Event : Hover on panel's mini icon
    $(this.selector + " .mini-icon-panel").hover(function () {
        var ss = FindSuperSquare("play");
        ss.MiniIconPlaySlideDownHidden();
    }, function () {
        var ss = FindSuperSquare("play");
        ss.MiniIconPlayAutoHide();
    });

    // Event : Click on panel's mini icon
    // close event
    $(this.selector + " .mini-icon[function='close']").click(function () {
        var ss = FindSuperSquare("play");
        ss.Minimize();
    });

    $(this.selector + " .mini-icon[function='messages']").click(function () {
        var ss = FindSuperSquare("play");
        ss.SecondPanelToggleVisibility("messages");
    });

    $(this.selector + " .mini-icon[function='settings']").click(function () {
        var ss = FindSuperSquare("play");
        ss.SecondPanelToggleVisibility("settings");
    });
};

// Automatically hide some icons (Super Square Play)
SuperSquare.prototype.MiniIconPlayAutoHide = function () {
    // Auto hide messages & setings icons
    $(this.selector + " .mini-icon[function='messages']").animate({
        top: '-10px',
        opacity: '0',
    });
    $(this.selector + " .mini-icon[function='settings']").animate({
        top: '-10px',
        opacity: '0',
    }, {
        duration: 500,
    });
};

// Animate with a slide down/fade in (Super Square Play)
SuperSquare.prototype.MiniIconPlaySlideDownHidden = function () {
    $(this.selector + " .mini-icon[function='settings']").css({
        display: 'inline-block',
    }).animate({
        top: '0',
        opacity: '0.2',
    });

    $(this.selector + " .mini-icon[function='messages']").css({
        display: 'inline-block',
    }).animate({
        top: '0',
        opacity: '0.2',
    }, {
        duration: 500,
    });
};

SuperSquare.prototype.Reduce = function (height) {
    $(this.selector).animate({
        height: "-=" + height + 'px',
    });
};

SuperSquare.prototype.ExpendVertically = function (height) {
    $(this.selector).animate({
        height: "+=" + height + 'px',
    });
};

// SECOND PANEL
// ------------
// Show/Hide second panel control
SuperSquare.prototype.SecondPanelToggleVisibility = function (purpose) {
    var sp = ".second-panel";
    var mp = ".message-panel";
    var tp = ".settings-panel";

    if($(sp).length < 1) {
        var secondpanel = $("<div>", {
            class: "second-panel",
        }).css({
            opacity: 0,
        }).insertAfter(this.selector);

        // Add collapse icon
        $("<img>", {
            class   : 'mini-icon',
            src     : '../icons/icon_arrowup.png',
            function: 'collapse',
        }).appendTo(secondpanel);


        // EVENTS
        $(sp + " .mini-icon").hover(
            function () {
            $(this).css({
                opacity: "1",
            });
        }, function () {
            $(this).css({
                opacity: "0.2",
            });
        });

        $(sp + " .mini-icon[function='collapse']").click(
            function () {
                var ss = FindSuperSquare("play");
                ss.SecondPanelToggleVisibility();
        });

        AddTooltipCenterRight($(".mini-icon[function='collapse']"), "Collapse this panel");
    }

    if ($(sp).css("opacity") === "0") {
        // Show the second panel
        $(sp).css({
            top     : '-50px',
            opacity : '0',
            display : "inline-block"
        }).animate({
            opacity : '1',
            top     : '0px',
        });

        // Remove border radius
        $(this.selector).animate({
            borderBottomLeftRadius: '0px',
            borderBottomRightRadius: '0px',
        });

        ScrollVerticallyTo(500); // Scroll down

        // Usually the user wants to display a specific panel
        if (purpose === "messages") {
            this.MessageToggleVisibility();
        }
        else if (purpose === "settings") {
            this.SettingsToggleVisibility();
        }
    }
    else { // Hide the second panel
        $(sp).css({
            top: '0px',
            opacity: '1',
        }).animate({
            opacity: '0',
            top: '-50px',
        }, {
            complete: function () {
                $(this).css({ display: "none", });
            }
        });

        // Set border radius
        $("#square-ui").animate({
            borderBottomLeftRadius: '5px',
            borderBottomRightRadius: '5px',
        });

        ScrollVerticallyTo(-500); // Scroll up

        if ($(mp).css("opacity") === "1") {
            this.MessageToggleVisibility();
        }
        else if ($(tp).css("opacity") === "1") {

        }
    }
};

// Remove a block class
SuperSquare.prototype.RemoveBlock = function (name) {
    $("." + name).remove();
};

// Reduce the second panel of a pixels' amount
SuperSquare.prototype.SecondPanelReduceSecondPanel = function (pixels) {
    $(".second-panel").animate({
        height: "-=" + pixels,
    });
};

// Check if the second panel height is above normal
SuperSquare.prototype.SecondPanelCheckSecondPanelInitialSize = function () {
    // Reduce the second panel if its height is greater than 440px
    if ($(".second-panel").css("height") !== "440px") {
        this.SecondPanelReduceSecondPanel("200px");
    }
};

SuperSquare.prototype.EventSwitcher = function (switcher) {
    if (switcher === undefined || switcher === null)
        return;

    // Modify the text's switcher
    var text = switcher.html();
    text = text.toggleStr("on", "off");
    switcher.html(text);
};

SuperSquare.prototype.PluginPart = function (part) {
    if (this.NotDefined(this.part)) {
        this.part.name = part;
    }
};


// ----------------------------------------
// OLD CODE
// DELETE WHEN CLASS HAS BEEN FULLY CREATED
// ----------------------------------------
// Add elements which compose main UI
function PopulateSquareUI() {
    _squareuiContent.appendTo("#square-ui");

    AddMiniIcons();
    ShowSquareUIGame();

    if (_settings.gameStarted) {
        ExpendSquareUI('300');
    }
    else {
        GameModes();
    }
}

// Hide the square-ui's content
function HideSquareUIContent() {
    HideMiniIcons();
    HideSquareUIGame();
    HideMessagePanel();
    HideSecondPanel();

    // Scroll down to indicate to the user
    ScrollVerticallyTo(-500);
}

// Add icons to the square-ui
function AddMiniIcons() {
    if( $(".mini-icon-panel").length > 0) {
        if ($(".mini-icon").css("height") === "0px") {
            ShowMiniIcons();
            AutoHideMiniIcons();
            MiniIconEvent();
            AddTooltipToMiniIcons();
            return;
        }
    }

    $("<div>", {
        class: 'mini-icon-panel',
    }).appendTo(_squareuiContent);

    // close icon
    $("<img>", {
        class   : 'mini-icon',
        src     : '../icons/icon_miniclose.png',
        function: 'close',
    }).appendTo(".mini-icon-panel");

    // message icon
    $("<img>", {
        class   : 'mini-icon',
        src     : '../icons/icon_minispeechbubble.png',
        function: 'messages',
        isGlowing: 'false',
    }).appendTo(".mini-icon-panel");

    // settings icon
    $("<img>", {
        class   : 'mini-icon',
        src     : '../icons/icon_settingswrench.png',
        function: 'settings'
    }).appendTo(".mini-icon-panel");


    // Hide mini icons execept the close button
    // after a matter of time
    AutoHideMiniIcons();

    MiniIconEvent();
    AddTooltipToMiniIcons();
}

// Show mini icons in square-ui
function ShowMiniIcons() {
    $(".mini-icon").animate({
        height: '30px',
        width: '30px',
    });

    // Test if the user had a game started
    if (_settings.gameStarted) {
        ShowGameIcons();
    }
}

// Hide mini icons in square-ui
function HideMiniIcons() {
    $(".mini-icon").animate({
        height: '0px',
        width: '0px',
    });

    // Test if the user had a game started
    if (_settings.gameStarted) {
        HideGameIcons();
    }
}

// Add Events on mini icons
function MiniIconEvent() {
    // hover event
    $(".mini-icon").hover(function () {
        $(this).css({
            opacity: '1',
        });
    }, function () {
        $(this).css({
            opacity: '0.2',
        });
    });

    $(".mini-icon-panel").hover(function () {
        SlideDownMiniIcons();
    }, function () {
        AutoHideMiniIcons();
    });

    // close event
    $(".mini-icon[function='close']").click(function () {
        HideSquareUIContent();
        SquareUIBackToNormal();
        Delay(function () {
            MinimizeMainUI();
        }, 1000);
    });


    // messages click  event
    $(".mini-icon[function='messages']").click(function () {
            // Create the second panel
            CreateSecondPanel();


            if ($("div.message-panel").css("opacity") == "1") {
                HideMessagePanel();
                HideSecondPanel();
            }
            else {
                // and hide all sub-panels
                // before showing one
                HideAllSubPanels();

                ShowSecondPanel();
                CreateMessagePanel();
                ShowMessagePanel();
            }

    });

    // settings click event
    $(".mini-icon[function='settings']").click(function () {
        // Create the second panel
        CreateSecondPanel();


        if($("div.settings-panel").css("opacity") == "1") {
            HideSettingsPanel();
            HideSecondPanel();
        }
        else {
            // and hide all sub-panels
            // before showing one
            HideAllSubPanels();

            ShowSecondPanel();
            CreateSettingsPanel();
            ShowSettingsPanel();
        }
    });
}

// Hide mini icons of square ui except the close button
// (game's icon are not included)
function AutoHideMiniIcons() {
    $(".mini-icon[function='messages']").animate({
        top: '-10px',
        opacity: '0',
    });

    $(".mini-icon[function='settings']").animate({
        top: '-10px',
        opacity: '0',
    }, {
        duration: 500,
    });
}

// Show mini icons (on second panel) with animation
function SlideDownMiniIcons() {
    $(".mini-icon[function='settings']").css({
        display: 'inline-block',
    }).animate({
        top: '0',
        opacity: '0.2',
    });

    $(".mini-icon[function='messages']").css({
        display: 'inline-block',
    }).animate({
        top: '0',
        opacity: '0.2',
    }, {
        duration: 500,
    });
}

// Add tooltip to the squereui's icons
function AddTooltipToMiniIcons() {
    AddTooltipCenterRight($(".mini-icon[function='close']"), "Close this panel");
    AddTooltipCenterRight($(".mini-icon[function='messages']"), "Messages");
    AddTooltipCenterRight($(".mini-icon[function='settings']"), "Settings");
}

// Add a pre-defined tooltip (style) to a jquery object
// function AddTooltipCenterRight(jqueryObject, qtipText) {
//     jqueryObject.qtip({
//         style: {
//             classes: 'qtip-light',
//             fontSize: '22px',
//         },
//         position: {
//             my: 'CenterLeft',
//             at: 'CenterRight',
//         },
//         content: {
//             text: qtipText,
//         },
//         show: {
//             effect: function () {
//                 $(this).fadeTo(500, 1);
//             }
//         },
//         hide: {
//             effect: function () {
//                 $(this).fadeTo(500, 0);
//             }
//         }
//     });
// }

// Hide the the game board
function HideSquareUIGame() {
    if($(".square-ui-game").css("opacity") === "0") return;

    $(".square-ui-game")
    .animate({
        marginTop: '50px',
        opacity: '0',
    });

    // Pause the game if started
    if(_settings.gameStarted) {
        EventGameResume($("#button-pause"));
        ScreenPause(_myState);
    }
}

// Show the square-ui's content
function ShowSquareUIContent() {
    // Scroll to the top
    // $("#square-ui").scroll();
    ShowMiniIcons();

    // Expend square ui if the game was started
    if (_settings.gameStarted) {
        ExpendSquareUI('300');
    }
}

// Hide all sub-panels of .second-panel
function HideAllSubPanels() {
    $(".message-panel").css({
        opacity: "0",
        display: "none",
    });

    $(".settings-panel").css({
        opacity: "0",
        display: "none",
    });
    HideSecondPanelIcons();
}

// Hide icons which belong to the second panel
function HideSecondPanelIcons() {
    $(".second-panel .mini-icon").css({
        height: "0",
        width: "0",
        opacity: "0",
    });

    $(".messages-counter").css({
        opacity: '0',
        height: '0',
        width: '0',
    });
}


// --------------------
// SECOND PANEL
// --------------------

// Create the second-panel which contains others functions (ie. messages, setings)
function CreateSecondPanel() {
    // exit if we've already created this object
    if($(".second-panel").length > 0) return;

    // Create the container
    $("<div>", {
        class: "second-panel",
    }).css({
        opacity: '0',
    }).insertAfter("#square-ui");

    // Add collapse icon
    $("<img>", {
        class   : 'mini-icon',
        src     : '../icons/icon_arrowup.png',
        function: 'collapse',
    }).appendTo(".second-panel");

    SecondPanelEvents(); // add events on .second-panel
    AddTooltipToSecondPanel();
}

// Add events on second-panel's objects
function SecondPanelEvents() {
    HoverSecondPanelIcons();

    $(".second-panel .mini-icon[function='collapse']").click(
        function () {
            if ($("div.second-panel").css("opacity") == "1") {
                HideSecondPanel();
                HideMessagePanel();
                HideSettingsPanel();
                HideSecondPanelIcons();
            }
    });
}

// Hover event on the second panel's icons
function HoverSecondPanelIcons() {
    $(".second-panel .mini-icon").hover(
        function () {
        $(this).css({
            opacity: "1",
        });
    }, function () {
        $(this).css({
            opacity: "0.2",
        });
    });
}

// Add tooltips to the second panel's icons
function AddTooltipToSecondPanel() {
    AddTooltipCenterRight($(".mini-icon[function='collapse']"), "Collapse this panel");
}

// Show second-panel with style
function ShowSecondPanel() {
    $(".second-panel").css({
        top: '-50px',
        opacity: '0',
    }).animate({
        opacity: '1',
        top: '0px',
    });

    // Remove border radius
    $("#square-ui").css({
    }).animate({
        borderBottomLeftRadius: '0px',
        borderBottomRightRadius: '0px',
    });

    // Scroll up
    ScrollVerticallyTo(500);
}

// Hide second-panel with style
function HideSecondPanel() {
    if($(".second-panel").css("opacity") === "0") return;

    $(".second-panel").css({
        top: '0px',
        opacity: '1',
    }).animate({
        opacity: '0',
        top: '-50px',
    });

    // Set border radius
    $("#square-ui").css({
    }).animate({
        borderBottomLeftRadius: '5px',
        borderBottomRightRadius: '5px',
    });

    // Scroll up
    ScrollVerticallyTo(-500);
}

function ExpendSquareUI(height) {
    $("#square-ui").animate({
        height: "+=" + height + 'px',
    });
}

function ShrinkSquareUI(height) {
    $("#square-ui").animate({
        height: "-=" + height + 'px',
    });
}

// Check if the second panel height is above normal
function CheckSecondPanelInitialSize() {
    // Reduce the second panel if its height is greater than 440px
    if ($(".second-panel").css("height") !== "440px") {
        ReduceSecondPanel("200px");
    }
}

// Reduce the second panel of a pixels' amount
function ReduceSecondPanel(pixels) {
    $(".second-panel").animate({
        height: "-=" + pixels,
    });
}

function keepSpeak(){

}


// Put everything to default to
// minimize processor resources
function SquareUIBackToNormal() {
    $(".mini-icon[function='messages']").attr('isGlowing', 'false');
}
