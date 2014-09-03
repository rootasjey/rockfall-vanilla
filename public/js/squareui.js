// ---------------
// SQUAREUI.JS
// ---------------

// Add elements which compose main UI
function PopulateSquareUI() {
    // if #square-ui is empty
    if($("#square-ui").html() === '')    {
        AddMiniIcons();
        MiniIconEvent();
        AddTooltipToMiniIcons();

        // add game modes
        // with a little delay
        // for a better animation smooth
        GameModes();
    }
    else {
        ShowSquareUIContent();
        ShowSquareUIGame();
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
    $("<div>", {
        class: 'mini-icon-panel',
    }).appendTo("#square-ui");

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
        delay: 500,
        complete: function () {
            // completly hide these icons
            // $(this).css('display', 'none');
            // $(".mini-icon[function='messages']").css('display', 'none');
        },
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
        delay: 500,
    });
}

// Add tooltip to the squereui's icons
function AddTooltipToMiniIcons() {
    ApplyTooltipCenterRight($(".mini-icon[function='close']"), "Close this panel");
    ApplyTooltipCenterRight($(".mini-icon[function='messages']"), "Messages");
    ApplyTooltipCenterRight($(".mini-icon[function='settings']"), "Settings");
}

// Add a pre-defined tooltip (style) to a jquery object
function ApplyTooltipCenterRight(jqueryObject, qtipText) {
    jqueryObject.qtip({
        style: {
            classes: 'qtip-light',
            fontSize: '22px',
        },
        position: {
            my: 'CenterLeft',
            at: 'CenterRight',
        },
        content: {
            text: qtipText,
        },
        show: {
            effect: function () {
                $(this).fadeTo(500, 1);
            }
        },
        hide: {
            effect: function () {
                $(this).fadeTo(500, 0);
            }
        }
    });
}

// Show the game board
function ShowSquareUIGame() {
    $(".square-ui-game").animate({
        marginTop: '0px',
        opacity: '1',
    });
}

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
    $("#square-ui").scroll();
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
    }).appendTo(".square-group");

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
    ApplyTooltipCenterRight($(".mini-icon[function='collapse']"), "Collapse this panel");
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
