
// GLOBALS VARS
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
    HideMessagePanel();
    HideSecondPanel();
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
    if($(".square-ui-game").css("opacity") === "0") return;

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
    // -------------
    // Collapse icon
    // ---------
    $("<img>", {
        src: "../icons/icon_plus.png",
        class: "mini-icon",
        function: "new-message",
    }).appendTo(".second-panel-title");

    // Inbox icon
    $("<img>", {
        src: "../icons/icon_filledbox.png",
        class: "mini-icon",
        function: "inbox",
    }).appendTo(".second-panel");

    $("<span>", {
        class: "messages-counter",
    }).appendTo(".second-panel");

    MessagePanelEvents();
}

// Add events on .message-panel
// ---------------------------
function MessagePanelEvents() {
    // Click event on new messge icon
    // ------------------------------
    $(".mini-icon[function='new-message']").click(function () {
        if ($("form[class='new-message']").length) {
            // If the new message form is displayed
            // we hide it
            CloseNewMessage();
            ShowNewMessageIcon();
        }
        else {
            // Show message's form
            NewMessage();

            // Show close icon
            ShowCloseNewMessageIcon();
        }
    });

    // Click event on inbox icon
    // -------------------------
    $(".mini-icon[function='inbox']").click(function () {

        // add +1 to the counter
        // ---------------------
        if($(".messages-counter").html() !== '') {
            var count = $(".messages-counter").html();
            count++;
            RefreshMessagesCounter(count);
            CreateInboxMessages();
            ShowInboxMessages();
        }
        else RefreshMessagesCounter('1');
    });
}


// Update the messages counter
// ------------------------------------
function RefreshMessagesCounter(count) {
    $(".messages-counter").css({
        opacity: '0',
    }).animate({
        opacity: '1',
    });
    $(".messages-counter").html(count);
}

// Create the panel wich contains
// individuals messages
// -----------------------------
function CreateInboxMessages() {
    // Verify that this object hasn't been created yet
    if($(".inbox-messages").length > 0) return;

    // Messages Panel Container
    $("<div>", {
        class: "inbox-messages",
    }).appendTo(".message-panel");

    // Sub-section containing left arrow
    $("<div>", {
        class: "inbox-left-section",
    }).appendTo(".inbox-messages");

    // Sub-section containing messages
    $("<div>", {
        class: "inbox-center-section",
    }).appendTo(".inbox-messages");

    // Sub-section containing right arrow
    $("<div>", {
        class: "inbox-right-section",
    }).appendTo(".inbox-messages");


    // Add Left & Right Arrows
    // to sub-panels
    $("<img>", {
        src: "../icons/previous-256.png",
        class: "previous-content",
    }).appendTo(".inbox-left-section");
    $("<img>", {
        src: "../icons/next-256.png",
        class: "next-content",
    }).appendTo(".inbox-right-section");


    // Add individual message
    for (var i = 0; i < 6; i++) {
        var m = $("<div>", {
            class: "message",
        }).appendTo(".inbox-center-section");

        $("<img>", {
            class: "message-icon",
            src: "../icons/icon_envelope.png",
        }).appendTo(m);
        m.append("<span> Informations </span>");
    }
}

function ShowInboxMessages() {
    var children = $(".message");

    for (var i = 0; i < children.length; i++) {
        children[i].css({
            opaciy: '0',
        }).animate({
            opaciy: '0.5',
        });
    }
}

// Display close icon
// -----------------------
function ShowCloseNewMessageIcon() {
    // Animate the icon with css
    $(".mini-icon[function='new-message']")
    .css('-webkit-transform', 'rotate(45deg)')
    .css('-moz-transform', 'rotate(45deg)')
    .css('-ms-transform', 'rotate(45deg)')
    .css('-o-transform', 'rotate(45deg)')
    .css('transform', 'rotate(45deg)');;
}

function ShowNewMessageIcon() {
    // Animate the icon with css
    $(".mini-icon[function='new-message']")
    .css('-webkit-transform', 'rotate(0deg)')
    .css('-moz-transform', 'rotate(0deg)')
    .css('-ms-transform', 'rotate(0deg)')
    .css('-o-transform', 'rotate(0deg)')
    .css('transform', 'rotate(0deg)');;
}

// Show Message panel with style
// --------------------------
function ShowMessagePanel() {
    // Show the .message-panel content
    $(".message-panel").appendTo(".second-panel").css({
        opacity: "0",
    }).animate({
        opacity: "1",
    });

    // Show the inbox icon
    // outside the .message-panel
    // $(".mini-icon[function='inbox']").css({
    // }).animate({
    //     opacity: '0.2',
    //     height: '30px',
    //     width: '30px',
    // });
}

// Hide Message panel with style
// --------------------------
function HideMessagePanel() {
    if($(".message-panel").css("opacity") === "0") return;

    // Hide the message panel
    $(".message-panel").appendTo(".second-panel").css({
        opacity: "1",
    }).animate({
        opacity: "0",
    });

    // Hide the inbox icon
    // outside the message panel
    // $(".mini-icon[function='inbox']").css({
    // }).animate({
    //     opacity: '0',
    //     height: '0px',
    //     width: '0px',
    // });
}

// Create a message form
// --------------------
function NewMessage() {
    // Create the form
    var form = document.createElement('form');
    form.className = "new-message";
    form.style.opacity = '0';

    // Add the form to the page
    $(".message-panel").append(form);

    // Form's title
    $("<span>", {
        class: "form-title",
        html: "New message",
    }).appendTo(".new-message");

    // To
    $("<input>", {
        class: "new-message-to",
        placeholder : "send to..."
    }).appendTo(".new-message");

    // Body
    $("<textarea>", {
        class: "new-message-body",
        placeholder : "message..."
    }).appendTo(".new-message");

    // Submit Button
    $("<input>", {
        type: "submit",
        value: "send",
    }).appendTo(".new-message");


    // Animate Form
    // show with style
    // ---------------
    $(".new-message").css({
        opacity: '0',
        marginTop: '-50px',
    }).animate({
        opacity: '1',
        marginTop: '0',
    });
}


// Remove the new message form
// -------------------------
function CloseNewMessage() {
    // Animate Form
    // hide with style
    // ---------------
    $(".new-message").css({
        opacity: '1',
        marginTop: '0',
    }).animate({
        opacity: '0',
        marginTop: '-50px',
    });

    // Remove the form
    // after the animation
    // (so with delay)
    // ----------------
    Delay(function () {
        $("form[class='new-message']").remove();
    });
}

// Animate messages' icon
// to notify of new messages
// >use css attribute
// --------------------------------
function NewMessageAlert() {
    $(".mini-icon[function='messages']").attr('isGlowing', 'true');
}

// Set messages' icon to default
// ---------------------------------
function NoNewMessageAlert() {
    $(".mini-icon[function='messages']").attr('isGlowing', 'false');
}

// Put everything to default to
// minimize processor resources
// -----------------------------
function SquareUIBackToNormal() {
    $(".mini-icon[function='messages']").attr('isGlowing', 'false');
}
