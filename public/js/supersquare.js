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

// Generate a new color for the Super Square & animate it
SuperSquare.prototype.ReloadWithANewColor = function() {
    this.color = this.GetAFlatColor();

    if (!this.IsExpended())
        this.SquareEffect(); // Animate only if the square isn't expended
};

// Return true if the square is expended
SuperSquare.prototype.IsExpended = function() {
    if ($(this.selector).css("width") > "100px")
        return true;
    return false;
};

// Set settings according to the square's function
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
        // Retrieve Super Square object
        var purpose = this.getAttribute("function");
        var ss = FindSuperSquare(purpose);

        // Retrieve Super Square properties
        var img = $(ss.selector + " .img-square");
        var txt = $(ss.selector + " .text-square");

        // Animations
        img.animate({ top: "-30px" });
        txt.css({ display: "inline-block" })
           .animate({ top: "-20px" });

        // Shadow effect
        $(this).css("background", ss.color);
        $(this).css("box-shadow", "0 0 20px #000000");
        $(this).css("-moz-box-shadow", "0 0 20px #000000");
        $(this).css("-webkit-box-shadow", "0 0 20px #000000");

    }, function () {
        // Retrieve Super Square object
        var purpose = this.getAttribute("function");
        var ss = FindSuperSquare(purpose);

        // Retrieve Super Square properties
        var img = $(ss.selector + " .img-square");
        var txt = $(ss.selector + " .text-square");

        // Animations
        img.animate({ top: "0px" });
        txt.css({ display: "none" })
           .animate({ top: "30px" });

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
        // As we lose our 'this' object, we have to retrieve the ss
        var attr = this.getAttribute("function");
        var ss = FindSuperSquare(attr);

        // Depending of the Square's function, the size will be different
        if (attr === "connect") {
            ss.Expend('300px', '300px', null, '700');
        } else{ 
            ss.Expend(); 
        };
    });
};

// Expend Super Square with a height and a width
// -height > the desired height
// -width  > the desired width
SuperSquare.prototype.Expend = function (height, width, hContainer, wContainer) {
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

    // First expend the super container, Add scroll to the page
    var _hContainer = hContainer;
    var _wContainer = wContainer;

    if (this.NotDefined(_hContainer)) {
        _hContainer = 'auto';
    }
    if (this.NotDefined(_wContainer)) {
        _wContainer = '800px';
    };

    $(this.superContainer)
    .animate({ width: _wContainer })
    .css({ height: _hContainer });


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
    $(this.selector + " .text-square").css({
        display: "none",
    });

    // Remove hover, click events from the ss
    $(this.selector).off("mouseenter mouseleave click");

    if (this.purpose === "play") {
        // Apply inline CSS to the ss
        $(this.selector).css({
            opacity         : 1,
            background      : "radial-gradient(circle farthest-side, #3B536A 0%, #12191F 100%)",
            backgroundImage : "radial-gradient(circle farthest-side, #3B536A 0%, #12191F 100%)",
            backgroundImage : "-o-radial-gradient(center, circle farthest-side, #3B536A 0%, #12191F 100%)",
            backgroundImage : "-ms-radial-gradient(center, circle farthest-side, #3B536A 0%, #12191F 100%)",
            backgroundImage : "-moz-radial-gradient(center, circle farthest-side, #3B536A 0%, #12191F 100%)",
            backgroundImage : "-webkit-gradient(center, circle farthest-side, #3B536A 0%, #12191F 100%)",
            backgroundImage : "-webkit-radial-gradient(center, circle farthest-side, #3B536A 0%, #12191F 100%)",
        });
    }
    else if (this.purpose === "connect") {

    } 
    else if (this.purpose === "about") {

    }
    this.Populate(); // Add objects to this Super Square
};

// Minimize Super Square to a square
// ~Basically the same function than Expend() reversed~
// -height > the desired height
// -width  > the desired width
SuperSquare.prototype.Minimize = function (height, width) {
    this.Unpopulate(); // Remove objects to this Super Square
    ScrollVerticallyTo(-1000);

    window.setTimeout(function (ss) {
        // var ss = FindSuperSquare("play");
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

    }, 1000, this);
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
    else if (this.purpose === "connect") {
        this.PopulateConnect();
    }
};

SuperSquare.prototype.Unpopulate = function () {
    if (this.purpose === "play") {
        this.MiniIconPlayToggleVisibility(); // hide icons

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

    else if (this.purpose === "connect") {
        this.MiniIconConnectToggleVisibility(); // hide icons
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
    if ($(this.selector + " .mini-icon-panel").length < 1) {
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
        }).appendTo(this.selector + " .mini-icon-panel");

        // message icon
        $("<img>", {
            class   : 'mini-icon',
            src     : '../icons/icon_minispeechbubble.png',
            function: 'messages',
            isGlowing: 'false',
        }).css({
            height  : "0px",
            width   : "0px",
        }).appendTo(this.selector + " .mini-icon-panel");

        // settings icon
        $("<img>", {
            class   : 'mini-icon',
            src     : '../icons/icon_settingswrench.png',
            function: 'settings'
        }).css({
            height  : "0px",
            width   : "0px",
        }).appendTo(this.selector + " .mini-icon-panel");

        this.MiniIconPlayEvents();
    }

    // If the mini icons are hidden
    if ($(this.selector + " .mini-icon").css("height") === "0px") {
        $(this.selector + " .mini-icon").animate({ // Show them
            height: '30px',
            width: '30px',
        });
        return;
    }
    else { // Mini icons are displayed
        $(this.selector + " .mini-icon").animate({ // Hide them
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

    // Event : Click on messages' icon
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


// SUPERSQUARE - CONNECT
// ---------------------
SuperSquare.prototype.PopulateConnect = function() {
    this.MiniIconConnectToggleVisibility();
    this.ConnectFormToggleVisibility();
};

SuperSquare.prototype.MiniIconConnectToggleVisibility = function() {
    if ($(this.selector + " .mini-icon-panel").length < 1) {
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
        }).appendTo(this.selector + " .mini-icon-panel");

        this.MiniIconConnectEvents();
    }

    // If the mini icons are hidden
    if ($(this.selector + " .mini-icon").css("height") === "0px") {
        $(this.selector + " .mini-icon").animate({ // Show them
            height: '30px',
            width: '30px',
        });
        return;
    }
    else { // Mini icons are displayed
        $(this.selector + " .mini-icon").animate({ // Hide them
            height: '0px',
            width: '0px',
        });
        return;
    }
};

// Events for the mini icons (Super Square Play)
SuperSquare.prototype.MiniIconConnectEvents = function () {
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


    // Event : Click on panel's mini icon
    // close event
    $(this.selector + " .mini-icon[function='close']").click(function () {
        var ss = FindSuperSquare("connect");
        ss.ConnectFormToggleVisibility();
        ss.Minimize();
    });
};

// Show/Hide the connection's form
SuperSquare.prototype.ConnectFormToggleVisibility = function() {
    if ($(this.selector + " .connect-block").length < 1) {
        // Create a login form if it's non-existant
        // Form container
        $("<div>", { class: "connect-block", html: "<span class='block-title'> Connect </span>" })
        .css({ display : "none"})
        .appendTo(this.selector);

        // Form object
        var form = $("<form>", {
            class: "login-form",
            name: "login_form",
        }).appendTo(this.selector + " .connect-block");

        // Title
        var title = $("<span>", {
            class: "form-title",
            html: "<span class='text-button' stats='active'>login</span>"+
                  "<span class='text-button' stats='inactive'>signup</span>",
        }).css({
            opacity: "0",
        }).appendTo(form);

        // Login input
        var loginContainer = $("<div>", {
            class: "input-container",
        }).appendTo(form);

        // label icon
        $("<img>", {
            class: "img-input",
            src: "../icons/icon_miniuser_male.png",
        }).css({opacity: "0"})
          .appendTo(loginContainer);

        var login = $("<input>", {
            name: "login",
            type: "text",
            placeholder: "login",
            class: "form-login",

        }).css({ opacity: "0" })
          .appendTo(loginContainer);


        // Password input
        var passwordContainer = $("<div>", {
            class: "input-container",
        }).appendTo(form);

        // label icon
        $("<img>", {
            class: "img-input",
            src: "../icons/icon_minilock.png",
        }).css({opacity: "0"})
          .appendTo(passwordContainer);

        var password = $("<input>", {
            name: "password",
            type: "password",
            placeholder: "password",
            class: "form-password"

        }).css({ opacity: "0" })
          .appendTo(passwordContainer);

        // Validation button
        var ok = $("<img>", {
            class: "form-icon",
            src: "../icons/icon_miniok.png",
        }).css({ opacity: "0" })
        .appendTo(form);

        this.ConnectFormEvents(); // Add events on buttons & inputs
    };
            
    if ($(this.selector + " .connect-block").css("display") !== "block") {                                            
        // Animations
        $(this.selector + " .connect-block").css({
            display: "block"
        });

        $(this.selector + " .form-title")
        .css({ top: "10px" })
        .animate({
            opacity: "1",
            top: "0",
        }, { duration: 500 });

        $(this.selector + " .form-login")
        .css({ top: "10px" })
        .animate({
            opacity: "0.5",
            top: "0",
        }, { duration: 600 });

        $(this.selector + " .form-password")
        .css({ top: "10px" })
        .animate({
            opacity: "0.5",
            top: "0",
        }, { duration: 700 });

        $(this.selector + " .form-icon")
        .css({ top: "10px" })
        .animate({
            opacity: "1",
            top: "0",
        }, { duration: 800 });

        $(this.selector + " .img-input")
        .css({ right : "0" })
        .animate({ right: "10px", opacity: 1},
                 { duration: 1600});
    } 
    else{
        // Animations
        $(this.selector + " .img-input")
        .animate({ right: "0", opacity: 0});

        $(this.selector + " .form-title").animate({
            opacity: "0",
            top: "10px",
        }, { duration: 200 });

        $(this.selector + " .form-login").animate({
            opacity: "0",
            top: "10px",
        }, { duration: 300 });

        $(this.selector + " .form-password").animate({
            opacity: "0",
            top: "10px",
        }, { duration: 400 });

        $(this.selector + " .form-icon").animate({
            opacity: "0",
            top: "10px",
        }, { duration: 500 });

        window.setTimeout(function(ss) {
            $(ss.selector + " .connect-block").css({ display: "none" });
        }, 2000, this);
        
    };
};

// Events on connection's form
SuperSquare.prototype.ConnectFormEvents = function() {
    // Event: Hover on login input
    $("input[name='login")
        .hover(function () {
            $(this).css({
                opacity: "1",
            });
        }, function () {
            $(this).css({
                opacity: "0.5",
            });
        });

    // Event: Hover on password input
    $("input[name='password")
        .hover(function () {
            $(this).css({
                opacity: "1",
            });
        }, function () {
            $(this).css({
                opacity: "0.5",
            });
        });

    // Event: Click on text buttons
    var textButton = $(".text-button");
    textButton.click(function() {
        if ($(this).attr("stats") === "active") return;
        $(".text-button[stats='active']").attr("stats", "inactive");
        $(this).attr("stats", "active");

        var ss = FindSuperSquare("connect");
        ss.ConnectFormSignupToggleVisibility();
    });
};

SuperSquare.prototype.ConnectFormSignupToggleVisibility = function() {
    var form = $(".login-form");
    var sbclass = ".signup-block";

    if ($(sbclass).length < 1) {
        var sb = $("<div>", {
            class: "signup-block",
        }).css({ display: "none" })
        .insertBefore(".login-form .form-icon");

        // Password input
        var passwordContainer2nd = $("<div>", {
            class: "input-container",
        }).appendTo(sb);

        // label icon
        $("<img>", {
            class: "img-input",
            src: "../icons/icon_minilock.png",
        }).css({opacity: "0"})
          .appendTo(passwordContainer2nd);

        var password = $("<input>", {
            name: "passwordcheck",
            type: "password",
            placeholder: "re-enter your password",
            class: "form-password"

        }).css({ opacity: "0" })
          .appendTo(passwordContainer2nd);


        // Email input
        var emailContainer = $("<div>", {
            class: "input-container",
        }).appendTo(sb);

        // label icon
        $("<img>", {
            class: "img-input",
            src: "../icons/icon_minimail.png",
        }).css({opacity: "0"})
          .appendTo(emailContainer);

        var password = $("<input>", {
            name: "email",
            type: "email",
            placeholder: "email",
            class: "form-password"

        }).css({ opacity: "0" })
          .appendTo(emailContainer);
    }

    if ($(sbclass).css("display") !== "block") {
        // Extend the container
        $(this.selector)
        .animate({ height: "+=200px"});

        window.setTimeout(function() {
            $(sbclass).css({ display: "block" });
        }, 500);
        

        $("input[name='passwordcheck']")
        .css({ top: "10px"})
        .animate({
            opacity: 0.5,
            top: "0",
        }, {duration: 800});

        $("input[name='email']")
        .css({ top: "10px"})
        .animate({
            opacity: 0.5,
            top: "0",
        }, { duration: 1000});

        $(sbclass + " .img-input")
        .css({ right: "0" })
        .animate({ opacity: 1, right: "10px" }, {duration: 1400});
    }
    else {
        // Reduce the container
        $(this.selector).animate({ height: "-=200px"});

        $(sbclass + " .img-input")
        .animate({ opacity: 0, right: "10px" });

        $("input[name='passwordcheck']")
        .animate({
            opacity: 0,
            top: "10px",
        }, {duration: 500});

        $("input[name='email']")
        .animate({
            opacity: 0,
            top: "10px",
        }, { duration: 800});

        window.setTimeout(function(sbclass) {
            $(sbclass).css({ display: "none" });
        }, 500, sbclass);
    }
};


// ------------
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
    else {
        // If the second panel is already displayed, hide the second panel
        // except if the user wants to show another panel
        if (purpose === "messages" && $(mp).css("opacity") === "0") {
            this.SettingsToggleVisibility();

            var ss = this;
            window.setTimeout(function (ss) {
                ss.MessageToggleVisibility();
            }, 1000, this);

            return;
        }
        else if (purpose === "settings" && $(tp).css("opacity") === "0") {
            this.MessageToggleVisibility();

            var ss = this;
            window.setTimeout(function (ss) {
                ss.SettingsToggleVisibility();
            }, 1000, this);

            return;
        }

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
        $(this.selector).animate({
            borderBottomLeftRadius: '5px',
            borderBottomRightRadius: '5px',
        });

        ScrollVerticallyTo(-500); // Scroll up

        if ($(mp).css("opacity") === "1") {
            this.MessageToggleVisibility();
        }
        else if ($(tp).css("opacity") === "1") {
            this.SettingsToggleVisibility();
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
