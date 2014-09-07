// ----------------------
// SUPERSQUARE-MESSAGE.JS
// ----------------------

// Show/Hide the message panel control
SuperSquare.prototype.MessageToggleVisibility = function () {
    var sp = ".second-panel";
    var mp = ".message-panel";

    // If the control exists
    if($(mp).length < 1) {
        // Icons
        // -----
        // Inbox icon
        $("<img>", {
            src: "../icons/icon_filledbox.png",
            class: "mini-icon",
            function: "inbox",
        }).css({
            height: "0",
            width : "0",
        }).appendTo(sp);

        // messages counter
        $("<span>", {
            class: "messages-counter",
        }).css({
            height: "0",
            width : "0",
        }).appendTo(sp);

        // page number
        $("<div>", {
            class: "rectangle-pagination",
            html: "page 1/1",
        }).appendTo(sp);


        $("<div>", { // Message Panel Container
            class: "message-panel",
            html : "<div class='second-panel-title'> <span> Messages </span> </div>",
        }).css({
            opacity: "0",
        }).appendTo(sp);


        // New message icon
        $("<img>", {
            src: "../icons/icon_plus.png",
            class: "mini-icon",
            function: "new-message",
        }).css({
            height: "0",
            width : "0",
        }).appendTo(".second-panel-title");


        this.MessageEvents(sp, mp);
    }

    // Show OR Hide
    if ($(mp).css("opacity") === "0") {
        var time = 500;
        $(sp + " .mini-icon").each(
            function () {
                $(this).css({
                    position: "relative",
                    top     : "-10px",
                    height  : "30px",
                    width   : "30px",

                }).animate({
                    top     : "0",
                    opacity : 0.2,
                }, {
                    duration: time,
                });
                time += 250;
        });

        $(mp).css({
            display: "block",
            top    : "-10px",
            opacity: 0,
        })
        .animate({
            top    : "0",
            opacity: 1,
        }, {
            duration: time,
        });
    }
    else {
        $(mp).animate({
            opacity: 0,
        }, {
            complete: function () {
                $(this).css({ opacity : "none", });
            }
        });

        var time = 1000;
        $(sp + " .mini-icon").each(
            function () {
                $(this).animate({
                    top     : "-10px",
                    opacity : 0,
                }, {
                    duration: time,
                });
                time += 500;
        });
    }
};

// Add events on second panel objects
SuperSquare.prototype.MessageEvents = function (sp, mp) {
    var nm = ".new-message";

    // Event : hover
    $(sp + " .mini-icon").off("mouseenter mouseleave");
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

    // Event : Click
    // Override Collapse Icon's Click Event on second panel
    $(sp + " .mini-icon[function='collapse']").off("click");
    $(sp + " .mini-icon[function='collapse']").click(
        function () {
            var ss = FindSuperSquare("play");
            ss.SecondPanelToggleVisibility("messages");
    });


    // Click event on new messge icon
    $(".mini-icon[function='new-message']").click(function () {
        var ss = FindSuperSquare("play");

        // This test decides whether we show or hide the new message control
        if ($(nm).length > 0 && $(nm).css("display") === "block") {
            // Hide new message form if displayed
            // CloseNewMessage();
            ss.MessageCloseNewMessage();
        }
        else {
            // Show the new message control
            if ($(".inbox-messages").css("display") !== "block") {
                // NewMessage(); // just display new message control
                ss.MessageOpenNewMessage();
            }
            else {
                // if inbox messages are displayed
                // we hide them first (inbox messages)
                ss.MessageHideInboxMessage();
                // Show new message's form
                window.setTimeout(ss.MessageOpenNewMessage, 1500);

            }
        }
    });

    // Click event on inbox icon
    $(".mini-icon[function='inbox']").click(function () {
            var ss = FindSuperSquare("play");   // get the super square
            ss.box.count++;                     // add +1 to the counter

            ss.MessageRefreshMessagesCounter(ss.box.count);// Refresh the mesages counter
            ss.MessageCreateInboxMessages();              // Show inbox messages if it's not displayed

            // This test decides whether we must
            // hide the new message control
            // before showing inbox messages
            if ($(".new-message").css("display") == "block") {
                // If .new-message is displayed
                // we hide it first,
                // then we show .inbox-messages
                ss.MessageCloseNewMessage();
                window.setTimeout(function (ss) {
                    ss.MessageShowInboxMessages();
                }, 500, ss);

            }
            else if ($(".full-message").length > 0) {
                ss.MessageCloseFullMessage();
                window.setTimeout(function (ss) {
                    ss.MessageShowInboxMessages();
                }, 1000, ss);
            }
            else  {
                ss.MessageShowInboxMessages(); // show instantly
                ss.MessageReceiveNewMessage();
            }
    });


    // Event : Tooltips
    AddTooltipCenterRight($(".mini-icon[function='inbox']"), "Show inbox's messages");
    AddTooltipCenterRight($(".mini-icon[function='new-message']"), "Send a new message");
};

// Show the new message form
SuperSquare.prototype.MessageOpenNewMessage = function () {
    // Create the form
    var nm = ".new-message";
    if ($(nm).length < 1) {
        var form = document.createElement('form');
        form.className = "new-message";
        form.style.opacity = '1';

        // Add the form to the page
        $(".message-panel").append(form);

        // Form's title
        $("<span>", {
            class: "form-title",
            html: "New message",
        }).css({ opacity : 0 }).appendTo(nm);

        // To
        $("<input>", {
            class: "new-message-to",
            placeholder : "send to..."
        }).css({ opacity : 0 }).appendTo(nm);

        // Body
        $("<textarea>", {
            class: "new-message-body",
            placeholder : "message..."
        }).css({ opacity : 0 }).appendTo(nm);

        // Submit Button
        $("<input>", {
            type: "submit",
            value: "send",
        }).css({ opacity : 0 }).appendTo(nm);

        // EVENTS
        // Event : Hover
        $(nm).children().each(function () {
            $(this).hover(function () {
                $(this).css({ opacity: 0.7 });
            }, function () {
                $(this).css({ opacity: 0.5 });
            });
        });

        // Event : Focus
        $(nm).children().each(function () {
            $(this).focus(function () {
                $(this).css({ opacity: 0.8 });
            });
        });
    }


    $(nm).css({ display : "block" });

    // Animate form show with style
    var delay = 0;
    $(nm).children().each(function () {
        $(this).css({
            opacity: 0,
            top: "-10px",
        }).animate({
            opacity: 0.5,
            top: "0",
        }, {
            duration: delay,
        });
        delay += 200;
    });

    // Animate icon button
    // (open => close)
    // Animate the icon with css
    $(".mini-icon[function='new-message']")
    .css('-webkit-transform', 'rotate(45deg)')
    .css('-moz-transform', 'rotate(45deg)')
    .css('-ms-transform', 'rotate(45deg)')
    .css('-o-transform', 'rotate(45deg)')
    .css('transform', 'rotate(45deg)');
};

// Hide the new message form
SuperSquare.prototype.MessageCloseNewMessage = function () {
    var nm = ".new-message";
    // Animate form show with style
    var delay = 0;
    $(nm).children().each(function () {
        $(this).css({
            opacity: 0.5,
            top: "0",
        }).animate({
            opacity: 0,
            top: "-10px",
        }, {
            duration: delay,
        });
        delay += 200;
    });

    // Animate icon button
    // (close => open)
    // Animate the icon with css
    $(".mini-icon[function='new-message']")
    .css('-webkit-transform', 'rotate(0deg)')
    .css('-moz-transform', 'rotate(0deg)')
    .css('-ms-transform', 'rotate(0deg)')
    .css('-o-transform', 'rotate(0deg)')
    .css('transform', 'rotate(0deg)');

    window.setTimeout(function () {
        $(nm).css({ display : "none" });
    }, 1000);
};

// Create the panel wich contains individuals messages
SuperSquare.prototype.MessageCreateInboxMessages = function () {
    // Verify that this object hasn't been created yet
    if($(".inbox-messages").length > 0) return;

    var ibm = ".inbox-messages";
    // Messages Panel Container
    $("<div>", { class: "inbox-messages" })
        .css({ opacity: "0", })
        .appendTo(".message-panel");

    // Sub-section containing left arrow
    $("<div>", { class: "inbox-left-section" })
        .appendTo(ibm);

    // Sub-section containing messages
    $("<div>", { class: "inbox-center-section" })
        .appendTo(ibm);

    // Sub-section containing right arrow
    $("<div>", { class: "inbox-right-section" })
        .appendTo(ibm);


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
};

// Hide all inbox messages
SuperSquare.prototype.MessageHideInboxMessage = function () {
    if ($(".inbox-messages").css("display") === "none")
        return;

    // Hide all messaes
    this.MessageHideEachMessage()

    // Hide the messages container
    window.setTimeout(function () {
        $(".inbox-messages").css({
            display : "none",
        }).animate({
            opacity : "0",
        });
    }, 1000);
};

// Hide one-to-one each message
SuperSquare.prototype.MessageHideEachMessage = function () {
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
};

// Update the messages counter
SuperSquare.prototype.MessageRefreshMessageCounter = function (count) {
    var mc = ".messages-counter";

    $(mc).css({     opacity     : '0' }) // css
         .animate({ opacity     : '1' }) // animation
         .html(count);                   // html content

    this.MessageRefreshBoxMaxPages();
    this.MessageUpdatePagination();

    // Check if we have > 6 messages to display prev./next icon
    if (this.box.count < 7)
        return;
    else if ($(".inbox-right-section").css("opacity") === "0.5")
        return;

    else if (this.box.count > 6) {
        // If there're more than 6 messages
        // that means that we cannont display all
        // so we've to use pagination
        this.MessageShowNextPageInboxMessagesButton();

        // Click events on these icons
        this.MessageNextInboxPage();
        this.MessagePreviousInboxPage();

    }
};

// Refresh the max pages available which contains all messages
SuperSquare.prototype.MessageRefreshBoxMaxPages = function () {
    this.box.maxPages = this.box.count / this.box.messagesPerPage;

    if (this.box.count % this.box.messagesPerPage !== 0) {
        this.box.maxPages++;
    }

    this.box.maxPages = parseInt(this.box.maxPages);
};

// Update the page number of the messages box
SuperSquare.prototype.MessageUpdatePagination = function () {
    var p = this.box.page + 1;
    $(".rectangle-pagination")
        .html("page " + p + "/" + this.box.maxPages);
};

// Display the Next Page Button of message panel
SuperSquare.prototype.MessageShowNextPageInboxMessagesButton = function () {
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
};

// Go to the next messages pages
SuperSquare.prototype.MessageNextInboxPage = function () {
    var irs = ".inbox-right-section";

    // Assure that we do not duplicate
    // the click event
    $(irs).off('click');

    // Click event
    $(irs).click(function () {
        var ss = FindSuperSquare("play");

        // Check that we haven't reached out
        var maxPages    = ss.box.count / ss.box.messagesPerPage;

        if (ss.box.page   >= maxPages - 1) {
            ss.MessageHideNextPageInboxMessagesButton();
            return;
        }

        // If not,
        // Empty the messages panel
        // --------------
        ss.MessageAnimateMessagesOutPage('left');
        window.setTimeout(function () {
            $(".inbox-center-section").html("");

            // Insert next messages
            // --------------------
            // +1 for the page we're viewing
            if (ss.box.page < maxPages) ss.box.page++;

            // counter start & end
            var start   = ss.box.page * ss.box.messagesPerPage;
            var end     = start + ss.box.messagesPerPage;

            // Check if we don't go too far
            if (end > ss.box.count) {
                end = ss.box.count % ss.box.messagesPerPage;
                end += start;
            }

            for (var i = start; i < end; i++) {
                ss.MessageGetInboxMessages(i);
            }

            // Animate
            ss.MessageAnimateMessagesInPage("right");

            // Add hover event on all .messages
            ss.MessageHoverInboxMessages();

            // Add click event on all .messages
            ss.MessageClickInboxMessages();

            // Show previous page button
            // now that we're not on 1st page
            ss.MessageShowPreviousPageInboxMessagesButton();

            // Auto hide next page button
            ss.MessageAutoHideNextPageMessagesButton();

            // Show pagination
            ss.MessageRefreshAndShowPagination(ss.box.page, maxPages);

        }, 1000);
    });
};

// Hide the Next Page Button of message panel
SuperSquare.prototype.MessageHideNextPageInboxMessagesButton = function () {
    $(".inbox-right-section").css({
        opacity     : "0",
        cursor      : "default",
    }).off('mouseenter mouseleave');
};

// Hide messages displayed with style according to a direction
SuperSquare.prototype.MessageAnimateMessagesOutPage = function (direction) {
    var delay = 100;
    var msg = ".message";

    if (direction === "left") {
        $(msg).each(function () {
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
        $(msg).each(function () {
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
};

// Retrieve the demanded messages identified by its ID
SuperSquare.prototype.MessageGetInboxMessages = function (number) {
    var messageObject = this.box.messages[number];
    ReceiveNewMessage(messageObject);
};

// Add a new message to the .inbox-center-section
SuperSquare.prototype.MessageReceiveNewMessage = function (messageParameter) {
    var oldMessage = false;
    var messageObject = null;

    // Test if the message we're going to receive
    // already exists or if we've to generate a new one
    if (    messageParameter === undefined
        ||  messageParameter === null      ) {

        // Create a new message object
        messageObject = this.MessageGenerateRandomMessage();
        this.MessageAddMessageInbox(messageObject);
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
                var ss = FindSuperSquare("play");
                ss.MessageHideInboxMessages();

                window.setTimeout(function (ss) {
                    ss.MessageDisplayFullMessage(id);
                }, 1000, ss);
            }
        );
    }
};

// Add a message from the server to the local box messages
SuperSquare.prototype.MessageAddMessageInbox = function (message) {
    this.box.messages.push(message);
};

// Get a random message
SuperSquare.prototype.MessageGenerateRandomMessage = function () {
    var types       = ["Information", "Friend"] ;
    var expeditors  = ["John", "Root", "Shaw", "Finch", "NameTooooooloooooong"];
    var bodies      = ["Hellow World!", "This is a test", "Open Me", "2048", "Welcome!"];

    var t = types[getRandomInt(0, types.length)];
    var e = expeditors[getRandomInt(0, expeditors.length)];
    var b = bodies[getRandomInt(0, bodies.length)];

    return new Message(t, e, b);
};

// Hide the message section
SuperSquare.prototype.MessageHideInboxMessages = function () {
    var ibm = ".inbox-messages";
    if ($(ibm).css("display") === "none")
        return;

    // Hide all messaes
    this.MessageHideEachMessage();

    // Hide the messages container
    window.setTimeout(function (ibm) {
        $(ibm).css({
            display : "none",
        }).animate({
            opacity : "0",
        });
    }, 1000, ibm);
};

// Get the message (from ID) and show its full content
SuperSquare.prototype.MessageDisplayFullMessage = function (messageID) {
    var fm = ".full-message";

    // Create/show full message box
    // Get the message from the box array
    var messageObject = this.box.messages[messageID];

    // Container
    $("<div>", { class: "full-message" })
        .css({ opacity: "0" })
        .appendTo(".message-panel");

    // Icons
    var closeButton = $("<img>", {
        class: "mini-icon",
        function: "close",
        src: "../icons/icon_miniclose.png",
    }).appendTo(fm);


    // Header (expeditor & date)
    var header          = $("<div>",  {class: "full-message-header" }).appendTo(fm);
    var headerExpeditor = $("<span>", {class: "header-expeditor"}).appendTo(header);
    var headerDate      = $("<span>", {class: "header-date"}).appendTo(header);
    // Content
    var content         = $("<div>",  {class: "full-message-content",}).appendTo(fm);


    // Fill controls
    headerExpeditor.html(messageObject.expeditor);
    headerDate.html(messageObject.date.toLocaleDateString());
    content.html(messageObject.body);

    // Animations
    $(fm).css({ top : "-10px" }).animate({
                opacity: "0.5",
                top : "0",
    });

    // EVENTS
    closeButton.click(function () {
        var ss = FindSuperSquare("play");
        ss.MessageCloseFullMessage();
    })
};

// Hide the full screen message's content
SuperSquare.prototype.MessageCloseFullMessage = function () {
    var fm = ".full-message";
    if ($(fm).length < 1) return;

    // Animations
    $(fm).css({
        top : "0px",
        opacity: "0.5",
    }).animate({
        opacity: "0",
        top : "10",
    });

    // Remove the object
    window.setTimeout(function (fm) {
        $(fm).remove();
    }, 1000, fm);
};

// Display the message section
SuperSquare.prototype.MessageShowInboxMessages = function () {
    var ibm = ".inbox-messages";
    if ($(ibm).css("opacity") === "1")
        return;

    $(ibm).css({
        display: "block",
    }).animate({
        opacity: "1",
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
    this.MessageHoverInboxMessages();
};

// Event when the cursor is hover a message
SuperSquare.prototype.MessageHoverInboxMessages = function () {
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
    );
};

// Show messages displayed with style according to a direction
SuperSquare.prototype.MessageAnimateMessagesInPage = function (direction) {
    var msg = ".message";
    var delay = 100;

    if (direction === "left") {
        $(msg).each(function () {
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
        $(msg).each(function () {
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
};

// Event when a message is clicked
SuperSquare.prototype.MessageClickInboxMessages = function () {
    $(".message").each(
        function () {
            $(this).off("click");
            $(this).click(
                function () {
                    var id = $(this).attr("index");
                    // if inbox messages are displayed
                    // we hide them first (inbox messages)
                    var ss = FindSuperSquare("play");
                    ss.MessageHideInboxMessages();

                    window.setTimeout(function (ss) {
                        ss.MessageDisplayFullMessage(id);
                    }, 1000, ss);
                }
            );
        }
    );
};

// Display the Previous Page Button of message panel
SuperSquare.prototype.MessageShowPreviousPageInboxMessagesButton = function () {
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
};

// Check if the Next button must be displayed
SuperSquare.prototype.MessageAutoHideNextPageMessagesButton = function () {
    if (this.box.maxPages === (this.box.page + 1) ) {
            this.MessageHideNextPageInboxMessagesButton();
        }
};

// Show the current messsages page
SuperSquare.prototype.MessageRefreshAndShowPagination = function (currentPage) {
    var rp = ".rectangle-pagination";

    currentPage++;
    $(rp)
        .html("page " + currentPage + "/" + this.box.maxPages)
        .css({
            opacity     : "1",
            marginLeft  : "5px",
            });

    window.setTimeout(function () {
        $(rp)
            .css({
                opacity: "0",
                marginLeft: "-5px",
                });
    }, 3000);
};

// Update the messages counter
SuperSquare.prototype.MessageRefreshMessagesCounter = function (count) {
    var mc = ".messages-counter";
    $(mc).css({
        opacity     : '0',
    }).animate({
        opacity     : '1',
    });
    $(mc).html(count);

    this.MessageRefreshBoxMaxPages();
    this.MessageUpdatePagination();

    // Check if we have > 6 messages
    // to display prev./next icon
    if (this.box.count < 7)
        return;
    else if ($(".inbox-right-section").css("opacity") === "0.5")
        return;

    else if (this.box.count > 6) {
        // If there're more than 6 messages
        // that means that we cannont display all
        // so we've to use pagination
        this.MessageShowNextPageInboxMessagesButton();

        // Click events on these icons
        this.MessageNextInboxPage();
        this.MessagePreviousInboxPage();

    }
};

// Go to the previous messages pages
SuperSquare.prototype.MessagePreviousInboxPage = function () {
    var ibl = ".inbox-left-section";
    // Assure that we do not duplicate the click event
    $(ibl).off('click');

    // Click event
    $(ibl).click(function () {
        var ss = FindSuperSquare("play");

        // Check that we haven't reached out
        var maxPages    = ss.box.count / ss.box.messagesPerPage;
        if (ss.box.page <= 0) {
            ss.MessageHidePreviousPageInboxMessagesButton();
            return;
        }

        // If not,
        // Empty the messages panel
        // --------------
        ss.MessageAnimateMessagesOutPage('right');
        window.setTimeout(function () {
            $(".inbox-center-section").html("");

            // Insert next messages
            // +1 for the page we're viewing
            ss.box.page--;

            // counter start & end
            var start   = ss.box.page * ss.box.messagesPerPage;
            var end     = start + ss.box.messagesPerPage;

            // Check if we don't go too far
            if (end > ss.box.count) {
                end = ss.box.count % ss.box.messagesPerPage;
                end += start;
            }

            for (var i = start; i < end; i++) {
                ss.MessageGetInboxMessages(i);
            }

            // Animate
            ss.MessageAnimateMessagesInPage("left");

            // Add hover event on all .messages
            ss.MessageHoverInboxMessages();

            // Add click event on all .messages
            ss.MessageClickInboxMessages();

            // Show next page button
            // now that we're on 1st page
            ss.MessageShowNextPageInboxMessagesButton();

            // Auto hide previous page button
            ss.MessageAutoHidePreviousPageMessagesButton();

            // Show pagination
            ss.MessageRefreshAndShowPagination(ss.box.page, maxPages);

        }, 1000);
    });
};

// Hide the Previous Page Button of message panel
SuperSquare.prototype.MessageHidePreviousPageInboxMessagesButton = function () {
    $(".inbox-left-section").css({
        opacity     : "0",
        cursor      : "default",
    }).off('mouseenter mouseleave');
};

// Check if the Previous button must be displayed
SuperSquare.prototype.MessageAutoHidePreviousPageMessagesButton = function () {
    if (this.box.page === 0) {
            this.MessageHidePreviousPageInboxMessagesButton();
        }
};

// Animate messages' icon to notify of new messages
SuperSquare.prototype.MessageNewMessageAlert = function () {
    $(".mini-icon[function='messages']").attr('isGlowing', 'true');
};

// Set messages' icon to default
SuperSquare.prototype.MessageNoNewMessageAlert = function () {
    $(".mini-icon[function='messages']").attr('isGlowing', 'false');
};
