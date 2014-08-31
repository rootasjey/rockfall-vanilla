// ----------------------
// MESSAGE PANEL (.JS)
// ----------------------

// Create message container
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
    // HoverSecondPanelIcons();
    HoverMessageIcons();

    AddTooltipToMessagePanel();
}

function HoverMessageIcons() {
    $(".mini-icon[function='inbox']").hover(
        function () {
        $(this).css({
            opacity: "1",
        });
    }, function () {
        $(this).css({
            opacity: "0.2",
        });
    });

    $(".mini-icon[function='new-message']").hover(
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

// Add tooltips to the message panel's icons
function AddTooltipToMessagePanel() {
    ApplyTooltipCenterRight($(".mini-icon[function='inbox']"), "Show inbox's messages");
    ApplyTooltipCenterRight($(".mini-icon[function='new-message']"), "Send a new message");
}

// Show Message panel with style
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

// Show Message panel's icons
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

    HideSecondPanelIcons();
}

// Add events on .message-panel
function MessagePanelEvents() {
    // Click event on new messge icon
    // ----------------------------------
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

// Event fired when the cursor is over the messages counter
// > show on which page we are
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
    });
}

// Show the current messsages page
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

        // Click events on these icons
        NextInboxPage();
        PreviousInboxPage();

    }
}

// Go to the next messages pages
function NextInboxPage() {
    // Assure that we do not duplicate
    // the click event
    $(".inbox-right-section").off('click');

    // Click event
    $(".inbox-right-section").click(function () {
        // Check that we haven't reached out
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
function PreviousInboxPage() {
    // Assure that we do not duplicate
    // the click event
    $(".inbox-left-section").off('click');

    // Click event
    $(".inbox-left-section").click(function () {
        // Check that we haven't reached out
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

// Update the page number of the messages box
function UpdatePagination() {
    var p = _box.page + 1;
    $(".rectangle-pagination")
        .html("page " + p + "/" + _box.maxPages);
}

// Check if the Next button must be displayed
function AutoHideNextPageMessagesButton() {
    if (_box.maxPages === (_box.page + 1) ) {
            HideNextPageInboxMessagesButton();
        }
}

// Check if the Previous button must be displayed
function AutoHidePreviousPageMessagesButton() {
    if (_box.page === 0) {
            HidePreviousPageInboxMessagesButton();
        }
}

// Refresh the max pages available which contains all messages
function RefreshBoxMaxPages() {
    _box.maxPages = _box.count / _box.messagesPerPage;

    if (_box.count % _box.messagesPerPage !== 0) {
        _box.maxPages++;
    }

    _box.maxPages = parseInt(_box.maxPages);
}

// Display the Next Page Button of message panel
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

// Hide the Next Page Button of message panel
function HideNextPageInboxMessagesButton() {
    $(".inbox-right-section").css({
        opacity     : "0",
        cursor      : "default",
    }).off('mouseenter mouseleave');
}

// Display the Previous Page Button of message panel
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

// Hide the Previous Page Button of message panel
function HidePreviousPageInboxMessagesButton() {
    $(".inbox-left-section").css({
        opacity     : "0",
        cursor      : "default",
    }).off('mouseenter mouseleave');
}

// Create the panel wich contains
// individuals messages
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

// Add new messages according to the message counter (to check)
function RefreshInboxMessages() {
    if ($(".message").length === _box.count) return;

    var newAdded = _box.count - $(".message").length;
    for (var i = 0; i < newAdded; i++) {
        ReceiveNewMessage();
    }
}

// Retrieve the demanded messages
// identified by its ID
function GetInboxMessages(number) {
    var messageObject = _box.messages[number];
    ReceiveNewMessage(messageObject);
}

// Add a new message to the .inbox-center-section
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

// Event when the cursor is hover a message
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

// Event when a message is clicked
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

// Get a random message
function GenerateRandomMessage() {
    var types       = ["Information", "Friend"] ;
    var expeditors  = ["John", "Root", "Shaw", "Finch", "NameTooooooloooooong"];
    var bodies      = ["Hellow World!", "This is a test", "Open Me", "2048", "Welcome!"];

    var t = types[getRandomInt(0, types.length)];
    var e = expeditors[getRandomInt(0, expeditors.length)];
    var b = bodies[getRandomInt(0, bodies.length)];

    return new Message(t, e, b);
}

// Add a message from the server to the local box messages
function AddMessageInbox(message) {
    _box.messages.push(message);
}

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Display the message section
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

// Hide the message section
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

// Hide all messages with style
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

// Hide messages displayed with style according to a direction
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

// Show messages displayed with style according to a direction
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

// Display New Message's close icon
function ShowCloseNewMessageIcon() {
    // Animate the icon with css
    $(".mini-icon[function='new-message']")
    .css('-webkit-transform', 'rotate(45deg)')
    .css('-moz-transform', 'rotate(45deg)')
    .css('-ms-transform', 'rotate(45deg)')
    .css('-o-transform', 'rotate(45deg)')
    .css('transform', 'rotate(45deg)');;
}

// Display New Message's new icon
function ShowNewMessageIcon() {
    // Animate the icon with css
    $(".mini-icon[function='new-message']")
    .css('-webkit-transform', 'rotate(0deg)')
    .css('-moz-transform', 'rotate(0deg)')
    .css('-ms-transform', 'rotate(0deg)')
    .css('-o-transform', 'rotate(0deg)')
    .css('transform', 'rotate(0deg)');;
}

// Get the message (from ID) and show its full content
function DisplayFullMessage(messageID) {
    // create/show full message box
    // Get the message from the box array
    var messageObject = _box.messages[messageID];

    // Container
    $("<div>", {
        class: "full-message",
    }).css({
        opacity: "0",
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

// Hide the full screen message's content
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
function CloseNewMessage() {
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

    // Remove the form after the animation
    Delay(function () {
        $("form[class='new-message']").remove();
    }, 1000);
}

// Animate messages' icon
// to notify of new messages
// >use css attribute
function NewMessageAlert() {
    $(".mini-icon[function='messages']").attr('isGlowing', 'true');
}

// Set messages' icon to default
function NoNewMessageAlert() {
    $(".mini-icon[function='messages']").attr('isGlowing', 'false');
}
