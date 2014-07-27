
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
        if($(this).attr('isGlowing') == 'false'){
            NewMessage($(this));
        }
        else {
            NoNewMessage($(this));
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

// Animate messages' icon
// to notify of new messages
// >use css attribute
// --------------------------------
function NewMessage(iconMessages) {
    iconMessages.attr('isGlowing', 'true');
}

// Set messages' icon to default
// ---------------------------------
function NoNewMessage(iconMessages) {
    iconMessages.attr('isGlowing', 'false');
}

// Put everything to default to
// minimize processor resources
// -----------------------------
function SquareUIBackToNormal() {
    $(".mini-icon[function='messages']").attr('isGlowing', 'false');
}
