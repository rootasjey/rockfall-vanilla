
// GLOBALS VARS
// -----------
var _messageGlowID = null;
var _box = {
    'count' : 0,
    'page'  : 0,
    'messagesPerPage' : 6,
};

// Go to the next messages pages
// -----------------------
function NextInboxPage() {
    // Assure that we do not duplicate
    // the click event
    $(".inbox-right-section").off('click');

    // Click event
    $(".inbox-right-section").click(function () {
        // Check that we haven't reached out
        // ---------------------------------
        var maxPages    = _box.count / _box.messagesPerPage;

        if (_box.page   >= maxPages - 1) {
            HideNextPageInboxMessagesButton();
            return;
        }

        // If not,
        // Empty the messages panel
        // --------------
        HideEachMessage();
        Delay(function () {
            $(".inbox-center-section").html("");

            // Insert next messages
            // --------------------
            // +1 for the page we're viewing
            if (_box.page < maxPages) _box.page++;

            // counter start & end
            var start   = _box.page * _box.messagesPerPage;
            var end     = start + _box.messagesPerPage;

            // Check if we don't go too far
            if (end > _box.count) {
                end = _box.count % _box.messagesPerPage;
                end += start;
            }

            for (var i = start; i < end; i++) {
                ReceiveNewMessage();
            }

            // Show previous page button
            // now that we're not on 1st page
            ShowPreviousPageInboxMessagesButton();

        }, 1000);
    });
}

// Go to the previous messages pages
// -----------------------
function PreviousInboxPage() {
    // Assure that we do not duplicate
    // the click event
    $(".inbox-left-section").off('click');

    // Click event
    $(".inbox-left-section").click(function () {
        // Check that we haven't reached out
        // ---------------------------------
        var maxPages    = _box.count / _box.messagesPerPage;
        if (_box.page <= 0) {
            HidePreviousPageInboxMessagesButton();
            return;
        }

        // If not,
        // Empty the messages panel
        // --------------
        HideEachMessage();
        Delay(function () {
            $(".inbox-center-section").html("");

            // Insert next messages
            // --------------------
            // +1 for the page we're viewing
            _box.page--;

            // counter start & end
            var start   = _box.page * _box.messagesPerPage;
            var end     = start + _box.messagesPerPage;

            // Check if we don't go too far
            if (end > _box.count) {
                end = _box.count % _box.messagesPerPage;
                end += start;
            }

            for (var i = start; i < end; i++) {
                ReceiveNewMessage();
            }

            // Show next page button
            // now that we're on 1st page
            ShowNextPageInboxMessagesButton();

        }, 1000);
    });
}

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

        // This test decides whether we show or hide
        // the new message control
        if ($("form[class='new-message']").length) {
            // If the new message form is displayed
            // we hide it
            CloseNewMessage();
        }
        else {
            // Show the new message control
            if ($(".inbox-messages").css("display") !== "block") {
                NewMessage(); // just display new message control
            }
            else {
                // if inbox messages are displayed
                // we hide them first (inbox messages)
                HideInboxMessages();

                // Show new message's form
                Delay(function () {
                    NewMessage();
                }, 1500);
            }
        }
    });

    // Click event on inbox icon
    // -------------------------
    $(".mini-icon[function='inbox']").click(function () {

            // add +1 to the counter
            // ---------------------
            _box.count++;

            // Refresh the mesages counter
            RefreshMessagesCounter(_box.count);
            // Show inbox messages if it's not displayed
            CreateInboxMessages();

            // This test decides whether we must
            // hide the new message control
            // before showing inbox messages
            if ($(".new-message").css("display") == "block") {
                // If .new-message is displayed
                // we hide it first,
                // then we show .inbox-messages
                CloseNewMessage();
                Delay(function () {
                    ShowInboxMessages();
                });

            } else  {
                ShowInboxMessages(); // show instantly
                // RefreshInboxMessages();
                ReceiveNewMessage();
            }

    });
}


// Update the messages counter
// ------------------------------------
function RefreshMessagesCounter(count) {
    $(".messages-counter").css({
        opacity     : '0',
    }).animate({
        opacity     : '1',
    });
    $(".messages-counter").html(count);

    // Check if we have > 6 messages
    // to display prev./next icon
    if (_box.count < 7)
        return;
    else if ($(".inbox-right-section").css("opacity") === "0.5")
        return;

    else if (_box.count > 6) {
        // If there're more than 6 messages
        // that means that we cannont display all
        // so we've to use pagination
        ShowNextPageInboxMessagesButton();

        // ShowPreviousPageInboxMessagesButton();


        // Click events on these icons
        NextInboxPage();
        PreviousInboxPage();
    }
}

function ShowNextPageInboxMessagesButton() {
    $(".inbox-right-section").css({
        opacity     : "0.5",
        cursor      : "pointer",
    }).hover(function () {
        $(this).css({
            opacity : "1",
        });
    }, function () {
        $(this).css({
            opacity : "0.5",
        });
    });
}

function HideNextPageInboxMessagesButton() {
    $(".inbox-right-section").css({
        opacity     : "0",
        cursor      : "default",
    }).off('mouseenter mouseleave');
}

function ShowPreviousPageInboxMessagesButton() {
    $(".inbox-left-section").css({
        opacity     : "0.5",
        cursor      : "pointer",
    }).hover(function () {
        $(this).css({
            opacity : "1",
        });
    }, function () {
        $(this).css({
            opacity : "0.5",
        });
    });
}

function HidePreviousPageInboxMessagesButton() {
    $(".inbox-left-section").css({
        opacity     : "0",
        cursor      : "default",
    });
}

// Create the panel wich contains
// individuals messages
// -----------------------------
function CreateInboxMessages() {
    // Verify that this object hasn't been created yet
    if($(".inbox-messages").length > 0) return;

    // Messages Panel Container
    $("<div>", {
        class       : "inbox-messages",
    }).css({ opacity: "0", })
      .appendTo(".message-panel");

    // Sub-section containing left arrow
    $("<div>", {
        class       : "inbox-left-section",
    }).appendTo(".inbox-messages");

    // Sub-section containing messages
    $("<div>", {
        class       : "inbox-center-section",
    }).appendTo(".inbox-messages");

    // Sub-section containing right arrow
    $("<div>", {
        class       : "inbox-right-section",
    }).appendTo(".inbox-messages");


    // Add Left & Right Arrows
    // to sub-panels
    $("<img>", {
        src         : "../icons/icon_previous.png",
        class       : "previous-content",
    }).appendTo(".inbox-left-section");
    $("<img>", {
        src         : "../icons/icon_next.png",
        class       : "next-content",
    }).appendTo(".inbox-right-section");


    // Add individual message
    // to the inbox panel
    // for (var i = 0; i < _box.count; i++) {
    //     // get out if we reached the max msg
    //     // per page
    //     if (i >= _box.messagesPerPage) break;
    //     ReceiveNewMessage();
    // }
}

function RefreshInboxMessages() {
    if ($(".message").length === _box.count) return;

    var newAdded = _box.count - $(".message").length;

    for (var i = 0; i < newAdded; i++) {
        ReceiveNewMessage();
    }
}


// Add a new message to the
// .inbox-center-section
// ------------------------
function ReceiveNewMessage() {
    // Create a new message object
    var m = $("<div>", {
        class       : "message",
    })
        .css({opacity: "0", top: "-10px",})
        .appendTo(".inbox-center-section");

    $("<img>", {
        class       : "message-icon",
        src         : "../icons/icon_envelope.png",
    }).appendTo(m);

    // Expeditor
    m.append("<span> Informations </span>");

    // Animate the message
    m.animate({
        top         : "0",
        opacity     : "0.5",
    });


    // EVENTS
    // ------
    // Hover event
    m.hover(function () {
        $(this).css({
            opacity : "0.8",
            top     : "-10px",
        });
    }, function () {
        $(this).css({
            opacity : "0.5",
            top     : "0px",
        });
    });
}


function ShowInboxMessages() {
    if ($(".inbox-messages").css("opacity") === "1")
        return;

    $(".inbox-messages").css({
        display     : "block",
    }).animate({
        opacity     : "1",
    });


    var delay = 100;
    $(".message").each(function () {
        $(this).css({
        }).animate({
            opacity : "0.5",
            top     : "0",
        },{
            duration: delay,
            queue   : true,
        });
        delay += 100;
    });
}

function HideInboxMessages() {
    if ($(".inbox-messages").css("display") === "none")
        return;

    // Hide all messaes
    HideEachMessage();

    // Hide the messages container
    Delay(function () {
        $(".inbox-messages").css({
            display : "none",
        }).animate({
            opacity : "0",
        });
    }, 1000);
}

function HideEachMessage() {
    var delay = 100;
    $(".message").each(function () {
        $(this).css({
        })
        .animate({
            opacity : "0",
            top     : "-10px",
        },{
            duration: delay,
            queue   : true,
        })
            .off('mouseenter mouseleave');

        delay += 100;
    });
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


    // Animate icon button
    // (open => close)
    ShowCloseNewMessageIcon();
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

    // Animate icon button
    // (close => open)
    ShowNewMessageIcon();

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
