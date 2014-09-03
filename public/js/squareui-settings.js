// -----------------------
// SQUAREUI-SETTINGS.JS
// -----------------------

// Create the Settings panel
function CreateSettingsPanel() {
    // Exit if we've already created this object
    if($(".settings-panel").length > 0) return;


    // Create the settings panel
    $("<div>", {
        class: "settings-panel",
        html: "<div class='second-panel-title'> <span> Settings </span> </div>",
    }).css({
        opacity: "0",
    }).appendTo(".second-panel");

    // settins content
    $("<div>", {
        class: "settings-content",
    }).appendTo(".settings-panel");


    // Sections
    $("<div>", {
        class: "settings-section",
        function: "connection",
        html: "<div class='side-side'><span> Connexion </span> <img src='../icons/icon_key.png' alt='connexion'/></div>",
    }).css({
        opacity: "0",
        top: "-10px",
    }).appendTo(".settings-content");

    $("<div>", {
        class: "settings-section",
        function: "preferences",
        html: "<div class='side-side'><span> Preferences </span> <img src='../icons/icon_like.png' alt='like'/></div>",
    }).css({
        opacity: "0",
        top: "-10px",
    }).appendTo(".settings-content");

    $("<div>", {
        class: "settings-section",
        function: "about",
        html: "<div class='side-side'><span> About </span> <img src='../icons/icon_about.png' alt='about'/></div>",
    }).css({
        opacity: "0",
        top: "-10px",
    }).appendTo(".settings-content");


    // EVENTS
    HoverSettingsSection();
    ClickSettingsSection();
}

// Show Settings panel with style
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
    var delay = 800;
    $(".settings-section").each(function () {
        $(this).css({
            opacity: "0",
            top: "-10px"
        }).animate({
            opacity: "0.5",
            top: "0",
        }, {
            duration: delay,
            queue   : true,
        });

        delay += 200;
    });
}

// Display Settings icons
function ShowSettingsPanelIcons() {
    $(".mini-icon[function='collapse']").css({
    }).animate({
        opacity: '0.2',
        height: '30px',
        width: '30px',
    });
}

// Hide Message panel with style
function HideSettingsPanel() {
    if ($(".settings-panel").css("opacity") === "0")
        return;

    // Animate content
    var delay = 200;
    $(".settings-section").each(function () {
        $(this).css({
            // opacity: "0",
            // top: "-10px"
        }).animate({
            opacity: "0",
            top: "-10px",
        }, {
            duration: delay,
            queue   : true,
        });

        delay += 200;
    });

    Delay(function () {
        // Hide the settings panel
        $(".settings-panel").css({
            opacity: "1",
        }).animate({
            opacity: "0",
        });
    });


    Delay(function () {
        $(".settings-panel").css("display", "none");
    }, 1000);

    HideSecondPanelIcons();
}

// Hover event on settings section
function HoverSettingsSection() {
    $(".settings-section").hover(function () {
        $(this).css({
            top: "-5px",
        });
    }, function () {
        $(this).css({
            top: "0",
        });
    });
}

// Click event when the user select settings
function ClickSettingsSection() {
    $(".settings-section").click(function () {
        var fun = $(this).attr("function");

        if (fun === "connection") {
            ClickConnection();
        }
        else if (fun === "preferences") {
            ClickPreferencesSection();
        }
        else if (fun === "about") {
            ClickAboutSection();
        }
    });
}


// -----------------------
// CONNECTION SECTION
// -----------------------
// Click Event on Connection sction to show this section
function ClickConnection() {
    // Get off the initial click event
    // => We do not want to expend this object again
    $(".settings-section[function='connection']").off("click");

    // Animate others sections out
    $(".settings-section[function='preferences']").animate({
        left: "10px",
        opacity: "0",
    });
    $(".settings-section[function='about']").animate({
        left: "10px",
        opacity: "0",
    });


    // Starts a few secs later
    Delay(function () {
        // Hide others section (display=none)
        // -----------------------------------
        $(".settings-section[function='preferences']").css({
            display: "none",
        });
        $(".settings-section[function='about']").css({
            display: "none",
        });

        // Put the section's title (& the image) on the left side
        // ------------------------------------------------------
        $(".settings-section[function='connection'] .side-side").css({
            marginLeft: "0",
            width: "160px",
            top: "-20px",
        });

        // Expend the connection section
        var conn = $(".settings-section[function='connection']").css({
        }).animate({
            width: "550px",
        });

        // Create th content of the connection section
        var sc = $("<div>", {
            class: "side-content",
        }).css({
            width: "300px",
        }).appendTo(conn)

        Delay(function () {
            // Add buttons
            // Login
            $("<div>", {
                class: "rectangle-button",
                function: "login",
                html: "<span> login </span>",
            })
                .css({
                    opacity: "0",
                })
                .animate({
                    opacity: "0.5",
                })
                .hover(function () {
                    $(this).css("opacity", "1");
                }, function () {
                    $(this).css("opacity", "0.5");
                })
                .appendTo(sc);

            // Signup
            $("<div>", {
                class: "rectangle-button",
                function: "signup",
                html: "<span> signup </span>",
            })
                .css({
                    opacity: "0",
                })
                .animate({
                    opacity: "0.5",
                })
                .hover(function () {
                    $(this).css("opacity", "1");
                }, function () {
                    $(this).css("opacity", "0.5");
                })
                .appendTo(sc);

            // Close button
            // -------------
            AddCloseRectangleToSetingsSection();

            // Add others events on this section
            EventConnection();

        }, 1000);
    });
}

// Click Event to close this section
function CloseConnectionPanel() {
        $(".side-content").remove();
        RemoveCloseRectangle();
        RemoveLoginForm();


        // Put the section's title (& the image) on the left side
        // ------------------------------------------------------
        $(".settings-section[function='connection'] .side-side").css({
            margin: "auto",
            width: "auto",
            top: "0",
        });

        // Reduce the connection section
        var conn = $(".settings-section[function='connection']").css({
            left: "10px",
        }).animate({
            height: "160px",
            width: "160px",
        });

        Delay(function () {
            // Display others sections
            $(".settings-section").css({
                display: "inline-block",
            }).animate({
                opacity: "0.5",
            });

            // Put back the click event on the connection square
            $(".settings-section[function='connection']").click(function () {
                ClickConnection();
            });

            // Reduce the second panel if its height is greater than 440px
            CheckSecondPanelInitialSize();

        }, 1000);
}

// Add a close button on Settings section
function AddCloseRectangleToSetingsSection() {
    $("<div>", {
        class: "close-rectangle-text",
        function: "close-section",
        html: "<span> close </span>",
    })
    .css({
    })
    .animate({
    })
    .hover(function () {
        $(".close-rectangle").css({
            width: "50px",
        });

        $(this).css({
            opacity: "1",
        });
    }, function () {
        $(".close-rectangle").css({
            width: "30px",
        });

        $(this).css({
            opacity: "1",
        });
    })
    .appendTo(".settings-section");

    $("<div>", {
        class: "close-rectangle",
    })
        .css({
        })
        .hover(function () {
            $(this).css("width", "40px");
        }, function () {
            $(this).css("width", "30px");
        })
        .appendTo(".settings-section");
}

// Events of Connection section
function EventConnection() {

    EventLoginSignupButtons();

    // Add click event on close button
    $(".close-rectangle-text[function='close-section']").click(function () {
        CloseConnectionPanel();
    });

    $(".close-rectangle").click(function () {
        CloseConnectionPanel();
    });
}

function EventCloseButton() {

}

// Add events on login & signup buttons
function EventLoginSignupButtons() {
    $(".rectangle-button[function='login']").click(function () {
        ShowLoginForm();
    });

    $(".rectangle-button[function='signup']").click(function () {
        console.log('popo');
    });
}

// Remove events on connection button
function RemoveEventsConnection() {
    $(".rectangle-button[function='login']").off("click");

    $(".rectangle-button[function='signup']").off("click");
}

// Expends the connection section
function ExpendConnectionSection(pixels) {
    var marge = pixels;
    var regex = /px/g;

    marge = marge.replace(regex, "");
    marge = marge/2;
    marge = marge + "px";

    $(".settings-section[function='connection']").css({
        height: "+=" + pixels,
    });

    $(".settings-section[function='connection'] .close-rectangle-text").css({
        top: "+=" + marge,
    });

    $(".second-panel").animate({
        height: "+=" + pixels,
    });
}

// Reduces the connection section
function ReduceConnectionSection(pixels) {
    var marge = pixels;
    var regex = /px/g;

    marge = marge.replace(regex, "");
    marge = marge/2;
    marge = marge + "px";

    $(".settings-section[function='connection']").css({
        height: "-=" + pixels,
    });

    $(".settings-section[function='connection'] .close-rectangle-text").css({
        top: "-=" + marge,
    });

    ReduceSecondPanel(pixels);
}

// Create and show the login form
function ShowLoginForm() {
    // Prevent double click bug
    // => multiple forms
    RemoveEventsConnection();

    // Verify if a login form is already there
    if($(".login-block").length > 0) {
        RemoveLoginForm(); // Remove the form

        // Reduce the panel + section
        ReduceConnectionSection("200px");

        // Put back the click events
        // (we removed at the beggining of this function)
        EventLoginSignupButtons();

        return;
    }

    // Expend connection section
    ExpendConnectionSection("200px");

    // Starts with a delay
    Delay(function () {

        // Form container
        $("<div>", {
            class: "login-block",

        }).appendTo(".settings-section");

        // Form object
        $("<form>", {
            class: "login-form",
            name: "login_form",
        }).appendTo(".login-block");

        // Title
        var title = $("<span>", {
            class: "form-title",
            html: "login",
        }).css({
            opacity: "0",
            marginTop: "10px",
        }).appendTo(".login-form");

        // Login input
        var login = $("<input>", {
            name: "login",
            placeholder: "login",
            type: "text",
        })
            .css({
                opacity: "0",
                marginTop: "10px",
            })
            .hover(function () {
                $(this).css({
                    opacity: "1",
                });
            }, function () {
                $(this).css({
                    opacity: "0.5",
                });
            })
            .appendTo(".login-form");

        // Password input
        var password = $("<input>", {
            name: "password",
            placeholder: "password",
            type: "password",
        })
            .css({
                opacity: "0",
                marginTop: "10px",
            })
            .hover(function () {
                $(this).css({
                    opacity: "1",
                });
            }, function () {
                $(this).css({
                    opacity: "0.5",
                });
            })
            .appendTo(".login-form");

        // Validation button
        var ok = $("<img>", {
            class: "icon",
            src: "../icons/icon_checkmark.png",
        }).css({
            opacity: "0",
            marginTop: "10px"
        })
        .hover(function () {
            $(this).css({
                background: "red",
            });
        }, function () {
            $(this).css({
                background: "transparent",
            });
        }).click(function(){

                var pseudo = $("input[name='login']" ).val();

                var infoPartyLocal = null;
                var idSocketClient = null;



                socket = io.connect('http://127.0.0.1:3000');

                socket.on('newListe', function (tab) {

                    console.log("detected client side with ");
                    var liste = "";
                    for(var i in tab){
                        liste += "  "+i+" => "+tab[i];
                    }
                    console.log(liste);
                });


                socket.on('startSync', function (idClient) {
                    console.log("detected startS");
                    if(scheduleCo == null){
                        idSocketClient = idClient;
                        scheduleCo = setInterval(function(){
                            socket.emit('Sync');
                        }, 5000);
                    }
                });

                socket.on("SyncPlayer",function(){
                    socket.emit('Sync');
                });


                socket.on("majEtatPlayer",function(infoParty){

                    //{'id':tableauP.length,'idPF':idF,'idPS':idS,'room':'room-'+idF+'-'+idS,'active':true,'idPFReady':false,'idPSReady':false}
                    infoPartyLocal = infoParty;
                    console.log(infoPartyLocal);
                    if(infoParty.idPF == socket.id){
                        idJoueur = infoParty.idPF;
                    }else if(infoParty.idPS == socket.id){
                        idJoueur = infoParty.idPS;
                    }else{
                        idJoueur = -1;
                        // {'idParty':infoParty.id,'idPlayer':socket.id};
                        var idParty = {
                            'infoParty' :infoParty.id,
                            'idPlayer'  :socket.id,
                        };
                    }

                    console.log("je suis prêt!!");
                    // alert("ddd :)");
                    socket.emit("etatPlayersOk",{'idParty':infoParty.id,'idPlayer':idSocketClient});


                });





                console.log(pseudo);
                socket.emit('newUser',pseudo);


        })
        .appendTo(".login-form");


        // Animations
        title.animate({
            opacity: "1",
            marginTop: "0",
        }, {
            duration: 200,
            queue   : true,
        });

        login.animate({
            opacity: "0.5",
            marginTop: "0",
        }, {
            duration: 300,
            queue   : true,
        });

        password.animate({
            opacity: "0.5",
            marginTop: "5px",
        }, {
            duration: 400,
            queue   : true,
        });

        ok.animate({
            opacity: "1",
            marginTop: "10px",
        }, {
            duration: 500,
            queue   : true,
        })

        // Put back the click event
        // on connection-section
        EventLoginSignupButtons();
    });
}

// Remove the login form
function RemoveLoginForm() {
    $(".login-block").remove();
}

// Remove the close rectangle
function RemoveCloseRectangle() {
    $(".close-rectangle-text").remove();
    $(".close-rectangle").remove();
}


// -----------------------
// PREFERENCES SECTION
// -----------------------

// Click event on preferences
function ClickPreferencesSection() {
    // Get off the initial click event
    // => We do not want to expend this object again
    $(".settings-section[function='preferences']").off("click");

    // Animate others sections out
    $(".settings-section[function='connection']").animate({
        opacity : "0",
        // width   : "0px",
    });
    $(".settings-section[function='about']").animate({
        opacity : "0",
        // width   : "0px",
    });

    Delay(function () {
        // Hide others section (display=none)
        // ---------------------------------
        $(".settings-section[function='connection']").css({
            display: "none",
        });
        $(".settings-section[function='about']").css({
            display: "none",
        });

        // Put the section's title (& the image) on the left side
        // ------------------------------------------------------
        $(".settings-section[function='preferences'] .side-side").css({
            marginLeft: "0",
            width: "160px",
            top: "-20px",
        });

        // Expend the connection section
        var prefs = $(".settings-section[function='preferences']").css({
        }).animate({
            width: "550px",
        });

        // Create th content of the connection section
        var sc = $("<div>", {
            class: "side-content",
        }).css({
            width: "300px",
        }).appendTo(prefs)

        Delay(function () {
            // Add buttons
            $("<div>", {
                class: "rectangle-button",
                function: "audio",
                html: "<span> audio </span>",
            })
                .css({
                    opacity: "0",
                })
                .animate({
                    opacity: "0.5",
                })
                .hover(function () {
                    $(this).css("opacity", "1");
                }, function () {
                    $(this).css("opacity", "0.5");
                })
                .appendTo(sc);

            $("<div>", {
                class: "rectangle-button",
                function: "user",
                html: "<span> user </span>",
            })
                .css({
                    opacity: "0",
                })
                .animate({
                    opacity: "0.5",
                })
                .hover(function () {
                    $(this).css("opacity", "1");
                }, function () {
                    $(this).css("opacity", "0.5");
                })
                .appendTo(sc);

            // Close button
            // -------------
            AddCloseRectangleToSetingsSection();
            // EventCloseButton();

            // Add click event on close button
            // ClosePreferencesSection();

            // Events
            EventsPreferences()
        }, 1000);

    });

}

// Click Event to close this section
function ClosePreferencesSection() {
        $(".side-content").remove();
        RemoveCloseRectangle();
        RemoveBlock("audio-block");
        RemoveBlock("userSettings-block");

        // Put the section's title (& the image) on the left side
        // ------------------------------------------------------
        $(".settings-section[function='preferences'] .side-side").css({
            margin: "auto",
            width: "auto",
            top: "0",
        });

        // Reduce the preferences section
        var prefs = $(".settings-section[function='preferences']").css({
            left: "10px",
        }).animate({
            height: "160px",
            width: "160px",
        });

        Delay(function () {
            // Display others sections
            $(".settings-section").css({
                display: "inline-block",
                left: "0",
            }).animate({
                opacity: "0.5",
            });

            $(".settings-section[function='preferences']").click(function () {
                ClickPreferencesSection();
            });

            // Reduce the second panel if its height is greater than 440px
            CheckSecondPanelInitialSize();

        }, 1000);
}

// Add events on Preferences' buttons
function EventsPreferencesButtons() {
    $(".rectangle-button[function='audio']")
        .click(function () {
            // Check if others blocks are already displayed
            if ($(".userSettings-block").length > 0) {
                // Reduce the settings section
                // ReducePrefenrecesSection("200px");
                RemoveBlock("userSettings-block");
            }

            ShowAudioSettings();
    });

    $(".rectangle-button[function='user']")
        .click(function () {
            // Check if others blocks are already displayed
            if ($(".audio-block").length > 0) {
                // Reduce the settings section
                // ReducePrefenrecesSection("200px");
                RemoveBlock("audio-block");
            }

            ShowUserSettings();
    });
}

// Add events on Preferences' objects
function EventsPreferences() {
    EventsPreferencesButtons();

    // Add click event on close button
    $(".close-rectangle-text[function='close-section']").click(function () {
        ClosePreferencesSection();
    });

    $(".close-rectangle").click(function () {
        ClosePreferencesSection();
    });
}

// Remove events on the Preferences' block
function RemoveEventsPreferences() {
    $(".rectangle-button[function='audio']").off("click");

    $(".rectangle-button[function='user']").off("click");
}

// Show the block wich contains audio settings
function ShowAudioSettings() {
    // Prevent double click bug
    // => multiple click
    RemoveEventsPreferences();

    // Check if it isn't already displayed
    if ($(".audio-block").length > 0) {
        // Remove the audio block
        RemoveBlock("audio-block");

        // Reduce the settings section
        ReducePrefenrecesSection("200px");
        // put back the click event
        EventsPreferencesButtons();
        return;
    }

    // Expend the panel
    if($(".settings-section[function='preferences']").css('height') < '300px') {
        ExpendPreferencesSection("200px");
    }

    Delay(function () {
        // Form container
        $("<div>", {
            class: "audio-block",
        }).appendTo(".settings-section[function='preferences']");

        var musicSwitcher = $("<span>", {
            class: "switcher",
            html: "music : on",
        })
            .css({
                opacity: "0",
                marginTop: "10px",
            })
            .appendTo(".audio-block");

        var soundsSwitcher = $("<span>", {
            class: "switcher",
            html: "sounds : on",
        })
            .css({
                opacity: "0",
                marginTop: "10px",
            })
            .appendTo(".audio-block");

        // Animations
        musicSwitcher.animate({
            opacity: "0.5",
            marginTop: "0px",
        }, {
            duration: 200,
            queue   : true,
        });

        soundsSwitcher.animate({
            opacity: "0.5",
            marginTop: "0px",
        }, {
            duration: 400,
            queue   : true,
        });

        // Events
        musicSwitcher.hover(function () {
            $(this).css({
                opacity: "1",
            });
        }, function () {
            $(this).css({
                opacity: "0.5",
            });
        }).click(function () {
            EventSwitcher($(this));
        });

        soundsSwitcher.hover(function () {
            $(this).css({
                opacity: "1",
            });
        }, function () {
            $(this).css({
                opacity: "0.5",
            });
        }).click(function () {
            EventSwitcher($(this));
        });

        EventsPreferencesButtons();
    });
}

// Show the block wich contains user & game settings
function ShowUserSettings() {
    // Prevent multiple clicks
    RemoveEventsPreferences();

    // Check if it isn't already displayed
    if ($(".userSettings-block").length > 0) {
        RemoveBlock("userSettings-block");

        // Reduce the settings section
        ReducePrefenrecesSection("200px");
        // put back the click event
        EventsPreferencesButtons();
        return;
    }

    if($(".settings-section[function='preferences']").css('height') < '300px') {
        // Expend the panel
        ExpendPreferencesSection("200px");
    }

    Delay(function () {
        // Form container
        $("<div>", {
            class: "userSettings-block",
        }).appendTo(".settings-section[function='preferences']");

        var autoEndSwitcher = $("<span>", {
            class: "switcher",
            html: "auto end turn : off",
        })
            .css({
                opacity: "0",
                marginTop: "10px",
            })
            .appendTo(".userSettings-block");

        var backgroundChooser = $("<span>", {
            class: "transparentButton",
            html: "change background",
        })
            .css({
                opacity: "0",
                marginTop: "10px",
            })
            .appendTo(".userSettings-block");

        // Animations
        autoEndSwitcher.animate({
            opacity: "0.5",
            marginTop: "0px",
        }, {
            duration: 200,
            queue   : true,
        });

        backgroundChooser.animate({
            opacity: "0.5",
            marginTop: "0px",
        }, {
            duration: 400,
            queue   : true,
        });

        // Events
        autoEndSwitcher.hover(function () {
            $(this).css({
                opacity: "1",
            });
        }, function () {
            $(this).css({
                opacity: "0.5",
            });
        }).click(function () {
            // On click event
            // Toggle the on and off text
            EventSwitcher($(this));

            // Set the variable according to the choice
            if($(this).html().indexOf("on") !== -1) {
                _settings.autoEndTurn = true;
            } else _settings.autoEndTurn = false;
        });

        backgroundChooser.hover(function () {
            $(this).css({
                opacity: "1",
            });
        }, function () {
            $(this).css({
                opacity: "0.5",
            });
        }).click(function () {
            BackgroundChooser();
        });

        EventsPreferencesButtons();
    });
}

function ExpendPreferencesSection(pixels) {
    var marge = pixels;
    var regex = /px/g;

    marge = marge.replace(regex, "");
    marge = marge/2;
    marge = marge + "px";

    $(".settings-section[function='preferences']").css({
        height: "+=" + pixels,
    });

    $(".settings-section[function='preferences'] .close-rectangle-text").css({
        top: "+=" + marge,
    });

    $(".second-panel").animate({
        height: "+=" + pixels,
    });
}

function ReducePrefenrecesSection(pixels) {
    var marge = pixels;
    var regex = /px/g;

    marge = marge.replace(regex, "");
    marge = marge/2;
    marge = marge + "px";

    $(".settings-section[function='preferences']").css({
        height: "-=" + pixels,
    });

    $(".settings-section[function='preferences'] .close-rectangle-text").css({
        top: "-=" + marge,
    });

    ReduceSecondPanel(pixels);
}

function EventSwitcher(switcher) {
    if (switcher === undefined || switcher === null)
        return;

    // Modify the text's switcher
    var text = switcher.html();
    text = text.toggleStr("on", "off");
    switcher.html(text);
}

function BackgroundChooser() {

}

// -----------------------
// ABOUT SECTION
// -----------------------

// Click event on About section
function ClickAboutSection() {
    // Get off the initial click event
    // => We do not want to expend this object again
    $(".settings-section[function='about']").off("click");

    // Animate others sections out
    $(".settings-section[function='connection']").animate({
        opacity : "0",
    });
    $(".settings-section[function='preferences']").animate({
        opacity : "0",
    });

    Delay(function () {
        // Hide others section (display=none)
        // ---------------------------------
        $(".settings-section[function='connection']").css({
            display: "none",
        });
        $(".settings-section[function='preferences']").css({
            display: "none",
        });

        // Put the section's title (& the image) on the left side
        // ------------------------------------------------------
        $(".settings-section[function='about'] .side-side").css({
            marginLeft: "0",
            width: "160px",
            top: "-20px",
        });

        // Expend the connection section
        var about = $(".settings-section[function='about']").css({
        }).animate({
            width: "550px",
        });

        // Create th content of the connection section
        var sc = $("<div>", {
            class: "side-content",
        }).css({
            width: "300px",
        }).appendTo(about)

        Delay(function () {
            // Add buttons
            $("<div>", {
                class: "rectangle-button",
                function: "help",
                html: "<span> help </span>",
            })
                .css({
                    opacity: "0",
                })
                .animate({
                    opacity: "0.5",
                })
                .hover(function () {
                    $(this).css("opacity", "1");
                }, function () {
                    $(this).css("opacity", "0.5");
                })
                .appendTo(sc);

            $("<div>", {
                class: "rectangle-button",
                function: "informations",
                html: "<span> informations </span>",
            })
                .css({
                    opacity: "0",
                })
                .animate({
                    opacity: "0.5",
                })
                .hover(function () {
                    $(this).css("opacity", "1");
                }, function () {
                    $(this).css("opacity", "0.5");
                })
                .appendTo(sc);

            // Close button
            // -------------
            AddCloseRectangleToSetingsSection();

            // Add click event on close button
            // CloseAboutSection();

            // Events
            EventsAbout();
        }, 1000);

    });

}

// Click Event to close this section
function CloseAboutSection() {
        $(".side-content").remove();
        RemoveCloseRectangle();
        RemoveBlock("help-block");

        // Put the section's title (& the image) in the middle
        // ------------------------------------------------------
        $(".settings-section[function='about'] .side-side").css({
            margin: "auto",
            width: "auto",
            top: "0",
        });

        // Reduce the about section
        var about = $(".settings-section[function='about']").css({
            left: "10px",
        }).animate({
            height: "160px",
            width: "160px",
        });

        Delay(function () {
            // Display others sections
            $(".settings-section").css({
                display: "inline-block",
                left: "0",
            }).animate({
                opacity: "0.5",
                // width   : "160px",
            });

            $(".settings-section[function='about']").click(function () {
                ClickAboutSection();
            });

            // Reduce the second panel if its height is greater than 440px
            CheckSecondPanelInitialSize();

        }, 1000);
}

// Add event on about block's buttons
function EventsAboutButtons() {
    $(".rectangle-button[function='help']")
        .click(function () {
            ShowHelp();
    });

    $(".rectangle-button[function='informations']")
        .click(function () {
            ShowInformations();
    });
}

// Add events on About block
function EventsAbout() {
    EventsAboutButtons();

    // Add click event on close button
    $(".close-rectangle-text[function='close-section']").click(function () {
        CloseAboutSection();
    });

    $(".close-rectangle").click(function () {
        CloseAboutSection();
    });
}

// Remove events on About block
function RemoveEventsAbout() {
    $(".rectangle-button[function='help']")
        .off("click");

    $(".rectangle-button[function='informations']")
        .off("click");
}

// Remove a block class
// from a settings section
function RemoveBlock(name) {
    $("." + name).remove();
}

// Show the help manual
function ShowHelp() {
    // Prevent double click bug
    // => multiple click
    // $(".rectangle-button").off("click");
    RemoveEventsAbout();

    // Check if it isn't already displayed
    if ($(".help-block").length > 0) {
        // Remove the audio block
        RemoveBlock("help-block");
        // Reduce the settings section
        ReduceSettingsSection("about", "200px");
        // put back the click event
        EventsAboutButtons();
        return;
    }

    // Expend the panel
    ExpendSettingsSection( "about", "200px");

    Delay(function () {
        // Form container
        $("<div>", {
            class: "help-block",
        }).appendTo(".settings-section[function='about']");

        var sum = $("<div>", {
            class: "help-summary",
            html: "<hr /> <br />",
        })
            .appendTo(".help-block");


        // Events
        GetManualHelp();
        EventsAboutButtons();
    });
}

// Sends an ajax request to the server
// and get the game manual (.json)
function GetManualHelp() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/helpmanual/');

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var helpManual = xhr.response;

            if (helpManual) {
                var delay = 0;
                helpManual = JSON.parse(helpManual);

                for (var i = 0; i < helpManual[0].Chapters.length; i++) {
                    delay += 200;

                    // Create a title
                    var title = $("<span>", {
                        class: "summary-title",
                        html: helpManual[0].Chapters[i].name,
                    }).css({
                        opacity: "0",
                        marginTop: "10px",
                    }).appendTo(".help-summary");

                    // Animate
                    title.animate({
                        opacity: "0.5",
                        marginTop: "0",
                    }, {
                        queue: true,
                        duration: delay,
                    });

                    // Events
                    title.hover(function () {
                        $(this).css({
                            opacity: "1",
                        });
                    }, function () {
                        $(this).css({
                            opacity: "0.5",
                        });
                    });
                }
            }
        }
    };
    // Launch the request
    xhr.send();
}

// Show Project's informations
function ShowInformations() {

}

// Expends the Settigs section desired
function ExpendSettingsSection(sectionName, pixels) {
    var marge = pixels;
    var regex = /px/g;

    marge = marge.replace(regex, "");
    marge = marge/2;
    marge = marge + "px";

    $(".settings-section[function='" + sectionName + "']").css({
        height: "+=" + pixels,
    });

    $(".settings-section[function='" + sectionName + "'] .close-rectangle-text").css({
        top: "+=" + marge,
    });

    $(".second-panel").animate({
        height: "+=" + pixels,
    });
}

// Reduces the Settigs section desired
function ReduceSettingsSection(sectionName, pixels) {
    var marge = pixels;
    var regex = /px/g;

    marge = marge.replace(regex, "");
    marge = marge/2;
    marge = marge + "px";

    $(".settings-section[function='" + sectionName + "']").css({
        height: "-=" + pixels,
    });

    $(".settings-section[function='" + sectionName + "'] .close-rectangle-text").css({
        top: "-=" + marge,
    });

    ReduceSecondPanel(pixels);
}
