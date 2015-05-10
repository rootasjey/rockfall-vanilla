// -----------------------
// SUPERSQUARE-SETTINGS.JS
// -----------------------
_ServerPort = null;
SuperSquare.prototype.SettingsToggleVisibility = function () {
    var scp = ".second-panel";
    var stp = ".settings-panel";
    var stc = ".settings-content";
    var sts = "settings-section";

    // If the control doesn't exist
    if ($(stp).length < 1) {
        // Create the settings panel
        $("<div>", {
            class: "settings-panel",
            html: "<div class='second-panel-title'> <span> Settings </span> </div>",
        }).css({
            opacity: "0",
        }).appendTo(scp);

        // settins content
        $("<div>", {
            class: "settings-content",
        }).appendTo(stp);


        // Sections
        $("<div>", {
            class: sts,
            function: "connection",
            html: "<div class='side-side'><span> Connexion </span> <img src='../icons/icon_uservoid.png' alt='connexion'/></div>",
        }).css({
            opacity: "0",
            top: "-10px",
        }).appendTo(stc);

        $("<div>", {
            class: sts,
            function: "preferences",
            html: "<div class='side-side'><span> Preferences </span> <img src='../icons/icon_like.png' alt='like'/></div>",
        }).css({
            opacity: "0",
            top: "-10px",
        }).appendTo(stc);

        $("<div>", {
            class: sts,
            function: "about",
            html: "<div class='side-side'><span> About </span> <img src='../icons/icon_about.png' alt='about'/></div>",
        }).css({
            opacity: "0",
            top: "-10px",
        }).appendTo(stc);


        // EVENTS
        this.SettingsHoverSettingsSection();
        this.SettingsClickSettingsSection();
    }

    // Show OR Hide
    if ($(stp).css("opacity") === "0") {
        $(scp).css({ // Change the second panel's color
            background: "#27ae60",
        });

        // Show the .message-panel content
        $(stp).css({
            opacity: "0",
            display:"block",
        }).animate({
            opacity: "1",
        });


        // ICONS
        this.SettingsShowSettingsPanelIcons();

        // Animate content
        var delay = 800;
        $("." + sts).each(function () {
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
    else {
        var delay = 200;
        $("." + sts).each(function () {
            $(this).css({
            }).animate({
                opacity: "0",
                top: "-10px",
            }, {
                duration: delay,
            });

            delay += 200;
        });


        window.setTimeout(function (stp) {
            $(stp).css({ display: "none", opacity: 0});
        }, 1000, stp);
    }
};

// Display Settings icons
SuperSquare.prototype.SettingsShowSettingsPanelIcons = function () {
    $(".mini-icon[function='collapse']")
    .animate({
        opacity: '0.2',
        height: '30px',
        width: '30px',
    });

    // Hide inbox's message icon
    $(".mini-icon[function='inbox']").css({ display : "none" });
};

// Hover event on settings section
SuperSquare.prototype.SettingsHoverSettingsSection = function () {
    $(".settings-section").hover(function () {
        $(this).css({
            top: "-5px",
        });
    }, function () {
        $(this).css({
            top: "0",
        });
    });
};

// Click event when the user select settings
SuperSquare.prototype.SettingsClickSettingsSection = function () {
    $(".settings-section").click(function () {
        var ss = FindSuperSquare("play");

        var fun = $(this).attr("function");

        if (fun === "connection") {
            ss.SettingsClickConnection();
        }
        else if (fun === "preferences") {
            ss.SettingsClickPreferencesSection();
        }
        else if (fun === "about") {
            ss.SettingsClickAboutSection();
        }
    });
};


// ------------------
// CONNECTION SECTION
// ------------------
// Expends the connection section
SuperSquare.prototype.SettingsExpendConnectionSection = function (pixels) {
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
};

// Click Events on connection item
SuperSquare.prototype.SettingsClickConnection = function () {
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
    window.setTimeout(function () {
        // Hide others section (display=none)
        $(".settings-section[function='preferences']").css({
            display: "none",
        });
        $(".settings-section[function='about']").css({
            display: "none",
        });

        // Put the section's title (& the image) on the left side
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
        }).appendTo(conn);

        window.setTimeout(function () {
            var ss = FindSuperSquare("play");
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
            ss.SettingsAddCloseRectangleToSetingsSection();

            // Add others events on this section
            ss.SettingsEventConnection();

        }, 1000);
    }, 500);
};

// Click Event to close this section
SuperSquare.prototype.SettingsMinimizeConnectionSection = function () {
        $(".side-content").remove();
        this.SettingsRemoveCloseRectangle();
        this.RemoveBlock("login-block");


        // Put the section's title (& the image) on the left side
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

        window.setTimeout(function (ss) {
            // Display others sections
            $(".settings-section").css({
                display: "inline-block",
            }).animate({
                opacity: "0.5",
            });

            // Put back the click event on the connection square
            $(".settings-section[function='connection']").click(function () {
                ss.SettingsClickConnection();
            });

            // Reduce the second panel if its height is greater than 440px
            ss.SecondPanelCheckSecondPanelInitialSize();

        }, 1000, this);
};

// Add a close button on Settings section
SuperSquare.prototype.SettingsAddCloseRectangleToSetingsSection = function () {
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
};

// Events of Connection section
SuperSquare.prototype.SettingsEventConnection = function () {
    this.SettingsEventLoginSignupButtons();

    // Add click event on close button
    $(".close-rectangle-text[function='close-section']").click(function () {
        var ss = FindSuperSquare("play");
        ss.SettingsMinimizeConnectionSection();
    });

    $(".close-rectangle").click(function () {
        var ss = FindSuperSquare("play");
        ss.SettingsMinimizeConnectionSection();
    });
};

// Add events on login & signup buttons
SuperSquare.prototype.SettingsEventLoginSignupButtons = function () {
    $(".rectangle-button[function='login']").click(function () {
        var ss = FindSuperSquare("play");
        ss.SettingsShowLoginForm();
    });

    $(".rectangle-button[function='signup']").click(function () {
        console.log('popo');
    });
};


// Create and show the login form
SuperSquare.prototype.SettingsShowLoginForm = function () {
    // Prevent double click bug => multiple forms
    this.SettingsRemoveEventsConnection();

    /* variable pour enregistrer les informations globals servant au déroulement d'une partie */
    var sock = null;
    var pseudo = "";
    var joueur_lite = null;

    var testClick = 0;
    var tamponPseudo = "";

    var lfClass = ".second-panel" + " .login-form";
    var lbClass = ".second-panel" + " .login-block";

    // Verify if a login form is already there
    if($(lbClass).length > 0) {
        this.RemoveBlock("login-block"); // Remove the form

        // Reduce the panel + section
        this.SettingsReduceConnectionSection("200px");

        // Put back the click events
        // (we removed at the beggining of this function)
        this.SettingsEventLoginSignupButtons();

        return;
    }

    // Expend connection section
    this.SettingsExpendConnectionSection("200px");


    // Starts with a delay
    window.setTimeout(function (ss) {

        // Form container
        $("<div>", {
            class: "login-block"
        }).appendTo(".settings-section[function='connection']");

        // Form object
        $("<form>", {
            class: "login-form",
            name: "login_form",
        }).appendTo(lbClass);

        // Title
        var title = $("<span>", {
            class: "form-title",
            html: "login",
        }).css({
            opacity: "0",
            marginTop: "10px",
        }).appendTo(lfClass);

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
            .appendTo(lfClass);

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
            .appendTo(lfClass);

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

            if(_ServerPort != null && testClick == 0){

                pseudo = $("input[name='login']" ).val();

                /* la liste des images que l'utilisateur téléchargera pour l'affichage sur le navigateur*/
                var sources = {
                    "idPF": './images/rocks/rock-red.png',
                    "idPS": './images/rocks/rock-ciel.png',
                    "system_Neutre":"./images/rocks/rock-grey.png",
                    "idPF_profile":"./icons/icon_key.png",
                    "idPS_profile":"./icons/icon_key.png",
                    "starA":"./images/etoile_active.png",
                    "starNA":"./images/etoile_nonactive.png"
                  };

                var main = null;
                var firstReceive = 0;
                var joueur = null;
                var adversaire = null;

                /* on lance la connexion sur le serveur */
                sock = new Connexion(_ServerPort, "rockfall.azurewebsites.net");
                sock.start();
                sock.listenToStartSession();

                /* puis on initialise tous les listeners d'évènement */

                /* Evenènement pour l'aarrivé de nouveau joueur */
                sock.listener("miseAJourDeLaListeJoueur",function (lobby_client_affichage) {

                    var element = lobby_client_affichage.element;
                    for(var i = 0;i< element.length;i++){
                        console.log("  "+i+" => ");console.log(element[i]);
                    }
                });

                /*
                    on écoute la mise a jour venant du server et qui nous envoie les informations de la partie
                    importante
                */
                sock.socket.on("MiseAJour",function (objet) {

                    main.setFluxInfoServer(objet);
                    main.valid = false;

                    if(firstReceive == 0){
                        _myStateMulti.plateauOnlineObjet.initialisePlateau(objet);
                        main.initInfo("profil_player","profil_adversaire");
                        firstReceive++;
                    }

                    if(objet.isChangeTurn == true){
                        main.desactiveBonus();
                    }


                    if(objet.currentPlayer == objet.idPF.id){
                        main.currentPlayer = objet.idPF;
                    }else if(objet.currentPlayer == objet.idPS.id){
                        main.currentPlayer = objet.idPS;
                    }

                    /*****************modif************/
                    $("#profil_"+objet.idPF.name).removeClass("profil_currentPlayer");
                    $("#profil_"+objet.idPS.name).removeClass("profil_currentPlayer");
                    $("#profil_"+main.currentPlayer.name).addClass("profil_currentPlayer");
                    /********************************/

                    if(objet.idPF.id == joueur_lite.id){
                        main.player = objet.idPF;
                        main.adversaire = objet.idPS
                    }else if(objet.idPS.id == joueur_lite.id){
                        main.player = objet.idPS;
                        main.adversaire = objet.idPF;
                    }

                    main.infoPlayer();

                    if(objet.action == true){
                        main.canContinue = true;
                    }
                });


                /*
                    lancé la synchronisation avec le server ici toutes les 1 secondes on envoie un message pour
                    prévenir qu'on est toujours présent
                 */
               sock.socket.on('start_synchronisation', function (joueur_info) {
                 console.log(joueur_lite+" verification");
                    joueur_lite = joueur_info;
                    setInterval(function(){
                        sock.socket.emit('synchronisation',joueur_lite.id);
                    }, 1000);

                });


                /*
                    pour gérer la fin d'une partie
                */
                sock.socket.on('finDePartie', function (idJoueurGagne) {

                    main.stop();
                    main = null;
                    if(idJoueurGagne == joueur_lite.id){
                        console.log("Bravo, vous avez Gagnez!");
                    }else{
                        console.log("Dommage, vous avez Perdu!");
                    }
                    firstReceive = 0;
                });

                /*
                    Si l'un des deux joueurs quitte la partie ( problème de connexion )
                */
                sock.socket.on('Interruption', function () {
                    main.stop();
                    main = null;
                    firstReceive = 0;
                    console.log("La partie à été interrompu à cause d'un problème de connexion!");
                });

                /*
                    avec les informations de la partie on s'identifie avec l'id, on initialise le jeu et on envoie ok au server pour lui prévenir que nous sommes prêt
                */
                sock.socket.on("majJoueurStatusParty",function(infoParty){
                    if(infoParty.idPF.id == joueur_lite.id){
                        joueur = infoParty.idPF;
                        adversaire = infoParty.idPS;
                    }else if(infoParty.idPS.id == joueur_lite.id){
                        joueur = infoParty.idPS;
                        adversaire = infoParty.idPF;
                    }else{
                        console.log('ERROR : supersquare-setting.js => !!majJoueurStatus');
                        console.log(joueur_lite);
                        joueur = null;

                    }
                    idParty = infoParty.id;
                    loadImages(sources, function(images) {
                        main = new Main(images, joueur, adversaire, sock.socket, infoParty.pointPourGagner);
                        main.remplirPiecePlayer();
                        main.initBonus();
                        main.listener();
                        main.startSoundGame();

                        sock.socket.emit("etatJoueurOk",infoParty.id,joueur_lite.id);

                      });

                    $(".ghost-panel").css({display:"block" });
                    $("#canvas").css({display:"block",backgroundColor:"#bab8b8"});

                    console.log("normalement le canvas devrait apparaitre");
                });

                /* on prévient qu'un nouveau joueur est apparu*/
                sock.socket.emit('nouveauJoueur',pseudo);
              //  console.log("test");
                testClick++;

            }else if(testClick>0){
                /* on rejoint le matchmaking pour ensuite lancer une partie une fois trouver*/
                console.log(pseudo+" veut rejoindre le matchmaking");
                sock.socket.emit('entrerFileAttente',joueur_lite.id);
            }else{
              getPort();
              console.log("récupère port serveur");
            }


        })
       // .appendTo(".login-form");



        .appendTo(lfClass);




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
        });

        // Put back the click event
        // on connection-section
        ss.SettingsEventLoginSignupButtons();
    }, 500, this);
};

// Remove events on connection button
SuperSquare.prototype.SettingsRemoveEventsConnection = function () {
    $(".rectangle-button[function='login']").off("click");
    $(".rectangle-button[function='signup']").off("click");
};

// Reduces the connection section
SuperSquare.prototype.SettingsReduceConnectionSection = function (pixels) {
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

    this.SecondPanelReduceSecondPanel(pixels);
};

// Remove the close rectangle
SuperSquare.prototype.SettingsRemoveCloseRectangle = function () {
    $(".close-rectangle-text").remove();
    $(".close-rectangle").remove();
};

function getPort(){

  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/getPort');

  xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        _ServerPort = JSON.parse(xhr.response);
        console.log(_ServerPort.port);
      }
  };
  // Launch the request
  xhr.send();
}

// Click event on preferences
SuperSquare.prototype.SettingsClickPreferencesSection = function () {
    // Get off the initial click event
    // => We do not want to expend this object again
    $(".settings-section[function='preferences']").off("click");

    // Animate others sections out
    $(".settings-section[function='connection']").animate({
        opacity : "0",
    });
    $(".settings-section[function='about']").animate({
        opacity : "0",
    });

    window.setTimeout(function () {
        // Hide others section (display=none)
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

        window.setTimeout(function () {
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
            var ss = FindSuperSquare("play");
            ss.SettingsAddCloseRectangleToSetingsSection();
            // EventCloseButton();

            // Add click event on close button
            // ClosePreferencesSection();

            // Events
            ss.SettingsEventsPreferences()
        }, 1000);

    });

};

// Add events on Preferences' objects
SuperSquare.prototype.SettingsEventsPreferences = function () {
    this.SettingsEventsPreferencesButtons();

    // Add click event on close button
    $(".close-rectangle-text[function='close-section']").click(function () {
        var ss = FindSuperSquare("play");
        ss.SettingsClosePreferencesSection();
    });

    $(".close-rectangle").click(function () {
        var ss = FindSuperSquare("play");
        ss.SettingsClosePreferencesSection();
    });
};

// Remove events on the Preferences' block
SuperSquare.prototype.SettingsRemoveEventsPreferences = function () {
    $(".rectangle-button[function='audio']").off("click");
    $(".rectangle-button[function='user']").off("click");
};

// Add events on Preferences' buttons
SuperSquare.prototype.SettingsEventsPreferencesButtons = function () {
    $(".rectangle-button[function='audio']")
        .click(function () {
            var ss = FindSuperSquare("play");

            // Check if others blocks are already displayed
            if ($(".userSettings-block").length > 0) {
                // Reduce the settings section
                ss.RemoveBlock("userSettings-block");
            }

            ss.SettingsShowAudioSettings();
    });

    $(".rectangle-button[function='user']")
        .click(function () {
            var ss = FindSuperSquare("play");

            // Check if others blocks are already displayed
            if ($(".audio-block").length > 0) {
                // Reduce the settings section
                // ReducePrefenrecesSection("200px");
                ss.RemoveBlock("audio-block");
            }

            ss.SettingsShowUserSettings();
    });
};

// Show the block wich contains audio settings
SuperSquare.prototype.SettingsShowAudioSettings = function () {
    // Prevent double click bug => multiple click
    this.SettingsRemoveEventsPreferences();

    // Check if it isn't already displayed
    if ($(".audio-block").length > 0) {
        // Remove the audio block
        this.RemoveBlock("audio-block");

        // Reduce the settings section
        this.SettingsReducePrefenrecesSection("200px");
        // put back the click event
        this.SettingsEventsPreferencesButtons();
        return;
    }

    // Expend the panel
    if($(".settings-section[function='preferences']").css('height') < '300px') {
        this.SettingsExpendPreferencesSection("200px");
    }

    window.setTimeout(function (ss) {
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
            ss.EventSwitcher($(this));
        });

        soundsSwitcher.hover(function () {
            $(this).css({ opacity: "1"});
        }, function () {
            $(this).css({ opacity: "0.5" });
        }).click(function () {
            ss.EventSwitcher($(this));
        });

        ss.SettingsEventsPreferencesButtons();
    }, 500, this);
};

SuperSquare.prototype.SettingsReducePrefenrecesSection = function (pixels) {
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

    this.SecondPanelReduceSecondPanel(pixels);
};

SuperSquare.prototype.SettingsExpendPreferencesSection = function (pixels) {
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
};

// Show the block wich contains user & game settings
SuperSquare.prototype.SettingsShowUserSettings = function () {
    // Prevent multiple clicks
    this.SettingsRemoveEventsPreferences();

    // Check if it isn't already displayed
    if ($(".userSettings-block").length > 0) {
        this.RemoveBlock("userSettings-block");

        // Reduce the settings section
        this.SettingsReducePrefenrecesSection("200px");
        // put back the click event
        this.SettingsEventsPreferencesButtons();
        return;
    }

    if($(".settings-section[function='preferences']").css('height') < '300px') {
        // Expend the panel
        this.SettingsExpendPreferencesSection("200px");
    }

    window.setTimeout(function (ss) {
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
            ss.EventSwitcher($(this));

            // Set the variable according to the choice
            if($(this).html().indexOf("on") !== -1) {
                ss.settings.autoEndTurn = true;
            } else ss.settings.autoEndTurn = false;
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

        ss.SettingsEventsPreferencesButtons();
    }, 500, this);
};

// Click Event to close this section
SuperSquare.prototype.SettingsClosePreferencesSection = function () {
        $(".side-content").remove();
        this.SettingsRemoveCloseRectangle();
        this.RemoveBlock("audio-block");
        this.RemoveBlock("userSettings-block");

        // Put the section's title (& the image) on the left side
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

        window.setTimeout(function () {
            var ss = FindSuperSquare("play");
            // Display others sections
            $(".settings-section").css({
                display: "inline-block",
                left: "0",
            }).animate({
                opacity: "0.5",
            });

            $(".settings-section[function='preferences']").click(function () {
                // var ss = FindSuperSquare("play");
                ss.SettingsClickPreferencesSection();
            });

            // Reduce the second panel if its height is greater than 440px
            ss.SecondPanelCheckSecondPanelInitialSize();

        }, 1000);
};


// --------------
// ABOUT SECTION
// --------------
// Click event on About section
SuperSquare.prototype.SettingsClickAboutSection = function () {
    // Get off the initial click event => We do not want to expend this object again
    $(".settings-section[function='about']").off("click");

    // Animate others sections out
    $(".settings-section[function='connection']").animate({
        opacity : "0",
    });
    $(".settings-section[function='preferences']").animate({
        opacity : "0",
    });

    window.setTimeout(function () {
        // Hide others section (display=none)
        $(".settings-section[function='connection']").css({
            display: "none",
        });
        $(".settings-section[function='preferences']").css({
            display: "none",
        });

        // Put the section's title (& the image) on the left side
        $(".settings-section[function='about'] .side-side").css({
            marginLeft: "0",
            width: "160px",
            top: "-20px",
        });

        // Expend the connection section
        var about = $(".settings-section[function='about']")
                    .animate({ width: "550px" });

        // Create th content of the connection section
        var sc = $("<div>", { class: "side-content" })
            .css({ width: "300px" })
            .appendTo(about)

        window.setTimeout(function () {
            var ss = FindSuperSquare("play");

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

            ss.SettingsAddCloseRectangleToSetingsSection(); // Close button
            ss.SettingsEventsAbout(); // Events

        }, 1000);
    });
};

// Click Event to close this section
SuperSquare.prototype.SettingsCloseAboutSection = function () {
        $(".side-content").remove();
        this.SettingsRemoveCloseRectangle();
        this.RemoveBlock("help-block");

        // Put the section's title (& the image) in the middle
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

        window.setTimeout(function () {
            var ss = FindSuperSquare("play");

            // Display others sections
            $(".settings-section").css({
                display: "inline-block",
                left: "0",
            }).animate({
                opacity: "0.5",
            });

            $(".settings-section[function='about']").click(function () {
                var ss = FindSuperSquare("play");
                ss.SettingsClickAboutSection();
            });

            // Reduce the second panel if its height is greater than 440px
            ss.SecondPanelCheckSecondPanelInitialSize();

        }, 1000);
};

// Add event on about block's buttons
SuperSquare.prototype.SettingsEventsAboutButtons = function () {
    $(".rectangle-button[function='help']").click(
        function () {
            var ss = FindSuperSquare("play");
            ss.SettingsShowHelp();
        });

    $(".rectangle-button[function='informations']").click(
        function () {
            var ss = FindSuperSquare("play");
            ss.SettingsShowInformations();
        });
};

// Add events on About block
SuperSquare.prototype.SettingsEventsAbout = function () {
    this.SettingsEventsAboutButtons();

    // Add click event on close button
    $(".close-rectangle-text[function='close-section']").click(function () {
        var ss = FindSuperSquare("play");
        ss.SettingsCloseAboutSection();
    });

    $(".close-rectangle").click(function () {
        var ss = FindSuperSquare("play");
        ss.SettingsCloseAboutSection();
    });
};

// Remove events on About block
SuperSquare.prototype.SettingsRemoveEventsAbout = function () {
    $(".rectangle-button[function='help']")
        .off("click");

    $(".rectangle-button[function='informations']")
        .off("click");
};

// Show the help manual
SuperSquare.prototype.SettingsShowHelp = function () {
    // Prevent double click bug => multiple click
    this.SettingsRemoveEventsAbout();

    // Check if it isn't already displayed
    if ($(".help-block").length > 0) {
        // Remove the audio block
        this.RemoveBlock("help-block");
        // Reduce the settings section
        this.SettingsReduceSettingsSection("about", "200px");
        // put back the click event
        this.SettingsEventsAboutButtons();
        return;
    }

    // Expend the panel
    this.SettingsExpendSettingsSection( "about", "200px");

    window.setTimeout(function (ss) {
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
        ss.SettingsGetManualHelp();
        ss.SettingsEventsAboutButtons();
    }, 500, this);
};

// Sends an ajax request to the server
// and get the game manual (.json)
SuperSquare.prototype.SettingsGetManualHelp = function () {
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
};

// Show Project's informations
SuperSquare.prototype.SettingsShowInformations = function () {

};

// Expends the Settigs section desired
SuperSquare.prototype.SettingsExpendSettingsSection = function (sectionName, pixels) {
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
};

// Reduces the Settigs section desired
SuperSquare.prototype.SettingsReduceSettingsSection = function (sectionName, pixels) {
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

    this.SecondPanelReduceSecondPanel(pixels);
};
