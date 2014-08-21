// ---------------
// SQUAREUI.JS
// ---------------

// GLOBALS VARS
// ------------
// Allow to cancel the messageGlow's setInterval
var _messageGlowID = null;
var socket = null;
var scheduleCo = null;

// User's mail box
var _box = {
    "count"             : 0,
    "page"              : 0,
    "maxPages"          : 0,
    "messagesPerPage"   : 6,
    "messages"          : [],
};


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
        Delay(GameModes, 500);
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

function AddTooltipToMiniIcons() {
    $(".mini-icon[function='close']").qtip({
        style: {
            classes: 'qtip-light'
        },
        content: {
            text: "close this panel"
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
}

// Hide mini icons in square-ui
function HideMiniIcons() {
    // hide mini icons
    $(".mini-icon").css({

    }).animate({
        height: '0px',
        width: '0px',
    });
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
        MinimizeMainUI();
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

    $(".square-ui-game").css({

    }).animate({
        marginTop: '50px',
        opacity: '0',
    });
}

// Show the square-ui's content
function ShowSquareUIContent() {
    // Scroll to the top
    $("#square-ui").scroll();
    ShowMiniIcons();
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
    // with 0 opacity for animation
    // and add it to #welcome-ui
    // ---------
    $("<div>", {
        class: "second-panel",
    }).css({
        opacity: '0',
    }).appendTo("#welcome-ui");

    // Add composants to the
    // .second-panel
    // -------------
    // collapse icon
    // ---------
    $("<img>", {
        class   : 'mini-icon',
        src     : '../icons/icon_arrowup.png',
        function: 'collapse',
    }).appendTo(".second-panel");

    // Add events on .second-panel
    SecondPanelEvents();
}

// Add events on second-panel's objects
function SecondPanelEvents() {
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

// Show second-panel with style
function ShowSecondPanel() {
    $("div.second-panel").css({
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
