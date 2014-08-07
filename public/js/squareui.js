// SQUAREUI.JS
// ------------
// ------------
// GLOBALS VARS
// ------------
// Allow to cancel the setInterval
var _messageGlowID = null;

// User's mail box
var _box = {
    "count"             : 0,
    "page"              : 0,
    "maxPages"          : 0,
    "messagesPerPage"   : 6,
    "messages"          : [],
};


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
        ShowSquareUIContent();
        ShowSquareUIGame();
    }
}

// Hide the square-ui's content
// ----------------------------
function HideSquareUIContent() {
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
function ShowSquareUIContent() {
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
        right: '60px',
    }).appendTo("#square-ui");

    // settings icon
    // ---------
    $("<img>", {
        class   : 'mini-icon',
        src     : '../icons/icon_settingswrench.png',
        function: 'settings'
    }).css({
        position: 'absolute',
        right: '20px',
    }).appendTo("#square-ui");

}


// ---------------
// MiniIcon Events
// ---------------
function MiniIconEvent() {
    // close event
    // -----------
    $(".mini-icon[function='close']").click(function () {
        HideSquareUIContent();
        SquareUIBackToNormal();
        MinimizeMainUI();
    });

    // messages event
    // --------------
    $(".mini-icon[function='messages']").click(function () {
            // Create the second panel
            CreateSecondPanel();


            if ($("div.message-panel").css("opacity") == "1") {
                HideMessagePanel();
                HideSecondPanel();
                // console.log("hide msg");
            }
            else {
                // and hide all sub-panels
                // before showing one
                HideAllSubPanels();

                ShowSecondPanel();
                CreateMessagePanel();
                ShowMessagePanel();
                // console.log("show msg");
            }

    });

    // settings event
    // --------------
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

// Hide all sub-panels of .second-panel
// --------------------------
function HideAllSubPanels() {
    // HideMessagePanel();
    // HideSettingsPanel();

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
                HideMessagePanel();
                HideSettingsPanel();
                HideSecondPanelIcons();
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

function CreateSettingsPanel() {
    // Exit if we've already created this object
    if($(".settings-panel").length > 0) return;


    // Create the settings panel
    // -------------------------
    $("<div>", {
        class: "settings-panel",
        html: "<div class='second-panel-title'> <span> Settings </span> </div>",
    }).css({
        opacity: "0",
    }).appendTo(".second-panel");


    // Icons
    $("<div>", {
        class: "settings-section",
        html: "<span> Connexion </span>",
    }).css({
        opacity: "0",
    }).appendTo(".settings-panel");

    $("<div>", {
        class: "settings-section",
        html: "<span> Personal Area </span>",
    }).css({
        opacity: "0",
    }).appendTo(".settings-panel");

    $("<div>", {
        class: "settings-section",
        html: "<span> About </span>",
    }).css({
        opacity: "0",
    }).appendTo(".settings-panel");
}

// Show Settings panel with style
// --------------------------
function ShowSettingsPanel() {
    // Show the .message-panel content
    $(".settings-panel").css({
        opacity: "0",
        display:"block",
    }).animate({
        opacity: "1",
    });


    // Change the Color's second-panel
    $(".second-panel").css({
        background: "#27ae60",
    });

    // ICONS
    ShowSettingsPanelIcons();

    // Animate content
    var delay = 200;
    $(".settings-section").each(function () {
        $(this).animate({
            opacity: "0.5",
            left: "0",
        }, {
            duration: delay,
            queue   : true,
        });

        delay += 200;
    });
}

function ShowSettingsPanelIcons() {
    $(".mini-icon[function='collapse']").css({
    }).animate({
        opacity: '0.2',
        height: '30px',
        width: '30px',
    });
}

// Hide Message panel with style
// --------------------------
function HideSettingsPanel() {
    if ($(".settings-panel").css("opacity") === "0")
        return;

    // Hide the settings panel
    $(".settings-panel").css({
        opacity: "1",
    }).animate({
        opacity: "0",
    });

    Delay(function () {
        $(".settings-panel").css("display", "none");
    });

    HideSecondPanelIcons();
}

// Create message container
// ------------------------
function CreateMessagePanel() {
    // Exit if we've already created this object
    if($(".message-panel").length > 0) return;

    // Add icons to the message-panel
    // -------------
    // Inbox icon
    $("<img>", {
        src: "../icons/icon_filledbox.png",
        class: "mini-icon",
        function: "inbox",
    }).appendTo(".second-panel");

    // messages counter
    $("<span>", {
        class: "messages-counter",
    }).appendTo(".second-panel");

    // page number
    $("<div>", {
        class: "rectangle-pagination",
        html: "page 1/1",
    }).appendTo(".second-panel");


    // Create the message-panel-title
    // ---------
    $("<div>", {
        class: "message-panel",
        html : "<div class='second-panel-title'> <span> Messages </span> </div>",
    }).css({
        opacity: "0",
    }).appendTo(".second-panel");

    $("<img>", {
        src: "../icons/icon_plus.png",
        class: "mini-icon",
        function: "new-message",
    }).appendTo(".second-panel-title");

    // EVENTS
    MessagePanelEvents();
}

// Show Message panel with style
// --------------------------
function ShowMessagePanel() {
    // Show the .message-panel content
    $(".message-panel").css({
        opacity: "0",
        display:"block",
    }).animate({
        opacity: "1",
    });

    // Change the Color's second-panel
    $(".second-panel").css({
        background: "#e74c3c",
    });

    ShowMessagePanelIcons();
}

function ShowMessagePanelIcons() {
    // Show the inbox icon
    // and the pagination info
    // outside the .message-panel
    $(".mini-icon[function='inbox']").css({
    }).animate({
        opacity: '0.2',
        height: '30px',
        width: '30px',
    });

    $(".mini-icon[function='collapse']").css({
    }).animate({
        opacity: '0.2',
        height: '30px',
        width: '30px',
    });

    $(".mini-icon[function='new-message']").css({
    }).animate({
        opacity: '0.2',
        height: '30px',
        width: '30px',
    });

    $(".messages-counter").animate({
        opacity: '0.2',
        height: '30px',
        width: '30px',
    });
}

// Hide Message panel with style
// --------------------------
function HideMessagePanel() {
    if ($(".message-panel").css("opacity") === "0") return;

    // Hide the message panel
    $(".message-panel").css({
        opacity: "1",
    }).animate({
        opacity: "0",
    });


    Delay(function () {
        $(".message-panel").css("display", "none");
    });

    // Hide the inbox icon
    // outside the message panel
    // $(".mini-icon[function='inbox']").css({
    // }).animate({
    //     opacity: '0',
    //     height: '0px',
    //     width: '0px',
    // });
    HideSecondPanelIcons();
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

            }
            else if ($(".full-message").length > 0) {
                CloseFullMessage();
                Delay(function () {
                    ShowInboxMessages();
                });
            }
            else  {
                ShowInboxMessages(); // show instantly
                // RefreshInboxMessages();
                ReceiveNewMessage();
            }

    });

    // Hover
    // on .messages-counter
    HoverMessagesCounter();
}

// Event fired when the cursor
// is over the messages counter
// > show on which page we are
// ----------------------------
function HoverMessagesCounter() {
    $(".messages-counter").hover(function () {
        $(".rectangle-pagination").css({
            opacity: "1",
            marginLeft: "5px",
        });
    }, function () {
        $(".rectangle-pagination").css({
            opacity: "0",
            marginLeft: "-5px",
        });
    })
}

// Show the current messsages page
// ---------------------------------------------
function RefreshAndShowPagination(currentPage) {
    currentPage++;

    $(".rectangle-pagination")
        .html("page " + currentPage + "/" + _box.maxPages)
        .css({
            opacity     : "1",
            marginLeft  : "5px",
            });

    Delay(function () {
        $(".rectangle-pagination")
            .css({
                opacity: "0",
                marginLeft: "-5px",
                });
    }, 3000);
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

    RefreshBoxMaxPages();
    UpdatePagination();

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
        AnimateMessagesOutPage('left');
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
                GetInboxMessages(i);
            }

            // Animate
            AnimateMessagesInPage("right");

            // Add hover event on all .messages
            HoverInboxMessages();

            // Add click event on all .messages
            ClickInboxMessages();

            // Show previous page button
            // now that we're not on 1st page
            ShowPreviousPageInboxMessagesButton();

            // Auto hide next page button
            AutoHideNextPageMessagesButton();

            // Show pagination
            RefreshAndShowPagination(_box.page, maxPages);

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
        AnimateMessagesOutPage('right');
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
                GetInboxMessages(i);
            }

            // Animate
            AnimateMessagesInPage("left");

            // Add hover event on all .messages
            HoverInboxMessages();

            // Add click event on all .messages
            ClickInboxMessages();

            // Show next page button
            // now that we're on 1st page
            ShowNextPageInboxMessagesButton();

            // Auto hide previous page button
            AutoHidePreviousPageMessagesButton();

            // Show pagination
            RefreshAndShowPagination(_box.page, maxPages);

        }, 1000);
    });
}



function UpdatePagination() {
    var p = _box.page + 1;
    $(".rectangle-pagination")
        .html("page " + p + "/" + _box.maxPages);
}


function AutoHideNextPageMessagesButton() {
    if (_box.maxPages === (_box.page + 1) ) {
            HideNextPageInboxMessagesButton();
        }
}

function AutoHidePreviousPageMessagesButton() {
    if (_box.page === 0) {
            HidePreviousPageInboxMessagesButton();
        }
}

// Refresh the max pages available
// which contains all messages
// --------------------------
function RefreshBoxMaxPages() {
    _box.maxPages = _box.count / _box.messagesPerPage;

    if (_box.count % _box.messagesPerPage !== 0) {
        _box.maxPages++;
    }

    _box.maxPages = parseInt(_box.maxPages);
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
    }).off('mouseenter mouseleave');
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
}

function RefreshInboxMessages() {
    if ($(".message").length === _box.count) return;

    var newAdded = _box.count - $(".message").length;

    for (var i = 0; i < newAdded; i++) {
        ReceiveNewMessage();
    }
}

function GetInboxMessages(number) {
    var messageObject = _box.messages[number];
    ReceiveNewMessage(messageObject);
}

// Add a new message to the
// .inbox-center-section
// ------------------------
function ReceiveNewMessage(messageParameter) {
    var oldMessage = false;
    var messageObject = null;

    // Test if the message we're going to receive
    // already exists or if we've to generate a new one
    if (    messageParameter === undefined
        ||  messageParameter === null      ) {

        // Create a new message object
        messageObject = GenerateRandomMessage();
        AddMessageInbox(messageObject);
    }
    else {
        messageObject = messageParameter;
        oldMessage = true;
    }

    var message = $("<div>", {
        class       : "message",
    })
        .attr("index", messageObject.id)
        .css( { opacity: "0", top: "-10px", } )
        .appendTo(".inbox-center-section");


    $("<img>", {
        class       : "message-icon",
        src         : "../icons/icon_envelope.png",
    }).appendTo(message);

    // Expeditor
    message.append("<span class='message-expeditor'> " + messageObject.expeditor + " </span>");
    // Date
    message.append("<span class='message-date'> " + messageObject.date.toLocaleDateString() + " </span>");

    if (oldMessage) {
        message.css({
            top     : '0',
        });
    }
    else {
        // Animate the new message
        message.animate({
            top         : "0",
            opacity     : "0.5",
        });


        // EVENTS
        // ------
        // Hover event
        message.hover(function () {
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

        // Click event
        message.click(
            function () {
                var id = $(this).attr("index");
                // if inbox messages are displayed
                // we hide them first (inbox messages)
                HideInboxMessages();

                Delay(function () {
                    DisplayFullMessage(id);
                }, 1000);
            }
        )
    }
}

function HoverInboxMessages() {
    $(".message").each(
        function () {
            $(this).hover(function () {
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
    )
}

function ClickInboxMessages() {
    $(".message").each(
        function () {
            $(this).off("click");
            $(this).click(
                function () {
                    var id = $(this).attr("index");
                    // if inbox messages are displayed
                    // we hide them first (inbox messages)
                    HideInboxMessages();

                    Delay(function () {
                        DisplayFullMessage(id);
                    }, 1000);
                }
            )
        }
    )
}

function GenerateRandomMessage() {
    var types       = ["Information", "Friend"] ;
    var expeditors  = ["John", "Root", "Shaw", "Finch", "NameTooooooloooooong"];
    var bodies      = ["Hellow World!", "This is a test", "Open Me", "2048", "Welcome!"];

    var t = types[getRandomInt(0, types.length)];
    var e = expeditors[getRandomInt(0, expeditors.length)];
    var b = bodies[getRandomInt(0, bodies.length)];

    return new Message(t, e, b);
}

function AddMessageInbox(message) {
    _box.messages.push(message);
}

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
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

    // Add hover event on all .messages
    HoverInboxMessages();
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

function AnimateMessagesOutPage(direction) {
    var delay = 100;

    if (direction === "left") {
        $(".message").each(function () {
            $(this).css({
            })
            .animate({
                opacity : "0",
                left     : "-10px",
            },{
                duration: delay,
                queue   : true,
            })
                .off('mouseenter mouseleave');

            delay += 100;
        });
    }
    else if (direction === "right") {
        $(".message").each(function () {
            $(this).css({
            })
            .animate({
                opacity : "0",
                right     : "-10px",
            },{
                duration: delay,
                queue   : true,
            })
                .off('mouseenter mouseleave');

            delay += 100;
        });
    }
}

function AnimateMessagesInPage(direction) {
    var delay = 100;

    if (direction === "left") {
        $(".message").each(function () {
            $(this).css({
                left     : "-10px",
            })
            .animate({
                opacity : "0.5",
                left     : "0px",
            },{
                duration: delay,
                queue   : true,
            })
                .off('mouseenter mouseleave');

            delay += 100;
        });
    }
    else if (direction === "right") {
        $(".message").each(function () {
            $(this).css({
                right     : "-10px",
            })
            .animate({
                opacity : "0.5",
                right     : "0px",
            },{
                duration: delay,
                queue   : true,
            })
                .off('mouseenter mouseleave');

            delay += 100;
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


function DisplayFullMessage(messageID) {
    // create/show full message box
    // Get the message from the box array
    var messageObject = _box.messages[messageID];

    // Container
    $("<div>", {
        class: "full-message",
    }).css({
        opacity: "0",
        // display: "none",
    }).appendTo(".message-panel");

    // Icons
    var closeButton = $("<img>", {
        class: "mini-icon",
        function: "close",
        src: "../icons/icon_miniclose.png",
    }).appendTo(".full-message");


    // Header (expeditor & date)
    var header = $("<div>", {
        class: "full-message-header",
    }).css({
    }).appendTo(".full-message");

    var headerExpeditor = $("<span>", {
        class: "header-expeditor",
    }).appendTo(header);

    var headerDate = $("<span>", {
        class: "header-date",
    }).appendTo(header);

    // Content
    var content = $("<div>", {
        class: "full-message-content",
    }).css({
    }).appendTo(".full-message");


    // Fill controls
    headerExpeditor.html(messageObject.expeditor);
    headerDate.html(messageObject.date.toLocaleDateString());

    content.html(messageObject.body);


    // Animations
    $(".full-message").css({
        // display: "block",
        top : "-10px",
    }).animate({
        opacity: "0.5",
        top : "0",
    });

    // EVENTS
    closeButton.click(function () {
        CloseFullMessage();
    })
}

function CloseFullMessage() {
    if ($(".full-message").length < 1) return;

    // Animations
    $(".full-message").css({
        // display: "block",
        top : "0px",
        opacity: "0.5",
    }).animate({
        opacity: "0",
        top : "10",
    });

    // Remove the object
    Delay(function () {
        $(".full-message").remove();
    }, 1000);

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
