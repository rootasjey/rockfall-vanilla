
// GLABAL VARS
// -----------
var _messageGlowID = null;

// Add elements which compose main UI
// --------------------------
function PopulateSquareUI() {
    // if #square-ui is empty
    if($("#square-ui").html() === '')    {
        AddMiniIcons();
        MiniIconEvent();

        // add game modes
        // with a little delay
        // for a better animation smooth
        Delay(GameModes, 500);
    }
    else {
        ShowSuareUIContent();
        ShowSquareUIGame();
    }
}

// Hide the square-ui's content
// ----------------------------
function HideSuareUIContent() {
    HideMiniIcons();
    HideSquareUIGame();
}

// Hide mini icons in square-ui
// -----------------------
function HideMiniIcons() {
    // hide mini icons
    $(".mini-icon").css({

    }).animate({
        height: '0px',
        width: '0px',
    });
}

function HideSquareUIGame() {
    $(".square-ui-game").css({

    }).animate({
        marginTop: '50px',
        opacity: '0',
    });
}

function ShowSquareUIGame() {
    $(".square-ui-game").css({

    }).animate({
        marginTop: '0px',
        opacity: '1',
    });
}


// Show the square-ui's content
// ----------------------------
function ShowSuareUIContent() {
    ShowMiniIcons();
}

// Show mini icons in square-ui
// -----------------------
function ShowMiniIcons() {
    // show mini icons
    $(".mini-icon").css({

    }).animate({
        height: '30px',
        width: '30px',
    });
}

// Add icons to the square-ui
// ----------------------
function AddMiniIcons() {
    // close icon
    // ---------
    $("<img>", {
        class   : 'mini-icon',
        src     : '../icons/icon_miniclose.png',
        function: 'close',
    }).appendTo("#square-ui");

    // message icon
    // ---------
    $("<img>", {
        class   : 'mini-icon',
        src     : '../icons/icon_minispeechbubble.png',
        function: 'messages',
        isGlowing: 'false',
    }).css({
        position: 'absolute',
        right: '50px',
    }).appendTo("#square-ui");

    // settings icon
    // ---------
    $("<img>", {
        class   : 'mini-icon',
        src     : '../icons/icon_settingswrench.png',
        function: 'settings'
    }).css({
        position: 'absolute',
        right: '10px',
    }).appendTo("#square-ui");

}


// ---------------
// MiniIcon Events
// ---------------
function MiniIconEvent() {
    // close event
    // -----------
    $(".mini-icon[function='close']").click(function () {
        HideSuareUIContent();
        SquareUIBackToNormal();
        MinimizeMainUI();
    });

    // messages event
    // --------------
    $(".mini-icon[function='messages']").click(function () {

            CreateSecondPanel();

            if ($("div.second-panel").css("opacity") == "1") {
                HideMessagePanel();
                HideSecondPanel();
            }
            else {
                ShowSecondPanel();
                CreateMessagePanel();
                ShowMessagePanel();
            }

    });

    // settings event
    // --------------
    $(".mini-icon[function='settings']").click(function () {

    });
}

// Add games modes panes
// to the square-ui-game
// and create square-ui-game
// than add it to square-ui
// -------------------
function GameModes() {
    // Create the container
    // and apply css rules
    // for animations (end of this block)
    // ---------
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
    $("<div>", {
        html: "<img src='../icons/icon_circuit.png'></img> <span> VS CPU </span>" +
                "<span class='text-info'>Battle against the computer</span>",
        class: "vertiacal-pan",
    }).appendTo(".square-ui-game");

    $("<div>", {
        html: "<img src='../icons/icon_meeting.png'></img> <span> 2 Players </span>" +
                "<span class='text-info'>2 players on the same computer</span>",
        class: "vertiacal-pan",
    }).appendTo(".square-ui-game");

    $("<div>", {
        html: "<img src='../icons/icon_globe.png'></img> <span> Online </span>" +
                "<span class='text-info'>Challenge players around the world</span>",
        class: "vertiacal-pan",
    }).appendTo(".square-ui-game");


    // Animate square-ui-game
    ShowSquareUIGame();
}

// Create the second-panel
// which contains
// others functions
// like messages, setings
// --------------------------
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

// Add events on
// second-panel's objects
// --------------------------
function SecondPanelEvents() {
    $(".second-panel .mini-icon[function='collapse']").click(
        function () {
            if ($("div.second-panel").css("opacity") == "1") {
                HideSecondPanel();
            }
    });
}

// Show second-panel with style
// ------------------------
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
}

// Hide second-panel with style
// ------------------------
function HideSecondPanel() {
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
}

// Create message container
// ------------------------
function CreateMessagePanel() {
    // Exit if we've already created this object
    if($(".message-panel").length > 0) return;

    // Create the message-panel
    // ---------
    $("<div>", {
        class: "message-panel",
        html : "<div class='second-panel-title'> <span> Messages </span> </div>",
    }).css({
        opacity: "0",
    }).appendTo(".second-panel");

    // Add icons to the message-panel
    $("<img>", {
        src: "../icons/icon_plus.png",
        class: "mini-icon",
    }).appendTo(".second-panel-title");
}

function ShowMessagePanel() {
    $(".message-panel").appendTo(".second-panel").css({
        opacity: "0",
    }).animate({
        opacity: "1",
    });
}

function HideMessagePanel() {
    $(".message-panel").appendTo(".second-panel").css({
        opacity: "1",
    }).animate({
        opacity: "0",
    });
}

// Animate messages' icon
// to notify of new messages
// >use css attribute
// --------------------------------
function NewMessage() {
    $(".mini-icon[function='messages']").attr('isGlowing', 'true');
}

// Set messages' icon to default
// ---------------------------------
function NoNewMessage() {
    $(".mini-icon[function='messages']").attr('isGlowing', 'false');
}

// Put everything to default to
// minimize processor resources
// -----------------------------
function SquareUIBackToNormal() {
    $(".mini-icon[function='messages']").attr('isGlowing', 'false');
}
