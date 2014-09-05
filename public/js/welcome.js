// -----------
// WELCOME.JS
// -----------

// Add mouse's events on icons
function WelcomeIconsMouseEvents() {
    MouseHoverEvent();
    MouseClickEvent();

    // Remove scroll bar to the page
    RemoveScrollFromHTML();
}

// Mouse hover event
function MouseHoverEvent() {
    $(".square").hover(
        function () {
            // fill in the tile infos
            var text = $(this).attr('function');
            $("div.square-infos .square-text").html(text);
            $("div.square-infos").css({
                color: 'black',
                display: 'inline-block',
            });

            // Shadow effect
            $(this).css("box-shadow", "0 0 20px #000000");
            $(this).css("-moz-box-shadow", "0 0 20px #000000");
            $(this).css("-webkit-box-shadow", "0 0 20px #000000");
        },

        function () {
            // hide the text diplayed on the tile info
            $("div.square-infos").css({
                color: 'transparent',
                display: 'none',
            });

            // Shadow effect
            $(this).css("box-shadow", "0 0 0px #000000");
            $(this).css("-moz-box-shadow", "0 0 0px #000000");
            $(this).css("-webkit-box-shadow", "0 0 0px #000000");
        }
    )
}

// Mouse click event
function MouseClickEvent() {
    $(".square[function='play']").click(function (event) {
        // expend main-ui
        ExpendSquareui();
    });

    $(".square[function='connect']").click(function (event) {
        // hide the square infos
        $(".square-infos").css({
            display : 'none',
        });

        $(".square-group").css({
            width: "600px",
        });

        // Expend the connect square
        $(this).animate({
            height  : "200px",
            width   : "300px",
        });

        // Add some icons
        // close icon
        // $("<img>", {
        //     class   : 'mini-icon',
        //     src     : '../icons/icon_miniclose.png',
        //     function: 'close',
        // }).css({
        //     position: 'absolute',
        //     right: '0',
        // }).appendTo($(this));
    });

    $(".square[function='about']").click(function (event) {
        // hide the square infos
        $(".square-infos").css({
            display: 'none',
        });
    });
}

// Maximize the main ui when the user click on a square
function ExpendSquareui() {
    // Add scroll bar to the page
    AddScrollToHMTL();

    var squareui = $("#square-ui");

    $(".square-group").animate({
        width: "800px",
    });

    $("#square-ui .img-square").css({
        display: 'none',
    });

    squareui.animate({
        minWidth    : '450px',
        width       : '100%',
        height      : '400px',
        borderRadius: '5px',
    });

    // Remove hover() event
    squareui.off("mouseenter mouseleave click");

    squareui.css({
        overflow        : "hidden",
        opacity         : 1,
        backgroundImage : "-ms-radial-gradient(center, circle farthest-side, #3B536A 0%, #12191F 100%)",
    });


    Delay(PopulateSquareUI, 1000);
}

function DestroyAndRecreateSquareui() {
    $("#square-ui").remove();
    $("<div>", {
        id : "square-ui",
        class: "square",
        function: "play",
        html: "<img class='img-square' src='../icons/icon_play.png' />"
    }).insertBefore(".square[function='connect']");
}

// Minimize the main ui
// and show the welcome screen
function MinimizeMainUI() {
    var squareui = $("#square-ui");

    // Save the content
    // console.log(_squareuiContent);

    $("#square-ui .img-square").css({
        display: 'block',
    });
    squareui.animate({
        minWidth    : '0px',
        width       : '100px',
        height      : '100px',
        borderRadius: '0px',
    }, {
        complete:function () {
            $(".square-group").css({
                width: "300px",
            });

            Delay(function () {
                DestroyAndRecreateSquareui();

                $(".square").off("mouseenter mouseleave click");
                WelcomeIconsMouseEvents();
            }, 500);
        }
    });
}

function AddScrollToHMTL() {
    $("html").toggleClass("html-no-scrollable");
    $(".square-group").css({
        height: 'auto',
    });
}

function RemoveScrollFromHTML() {
    $("html").addClass("html-no-scrollable");
    $(".square-group").css({
        height: '290px',
    });
}

// Hide all squares
function FadeOutSquares() {
    $(".square").css({
        opacity     : '0',
        top         : '0px',
    }).animate({
        opacity     : '0',
        top         : '-40px',
    });

    // info square
    // is a div not an img
    $(".square-infos").css({
        display     : 'none',
    });
}

// Show all squares
function FadeInSquares() {
    // Display squares with style
    $(".square").css({
        opacity     : '0',
        top         : '-40px',
        display     : 'inline-block',
    }).animate({
        opacity     : '0.8',
        top         : '0px',
    });

    // info square
    // is a div not an img
    // -------------------
    $(".square-infos").css({
        display     : 'inline-block',
    });

    // Up the about square
    // -----------------
    Delay( function () {
        // adjustments
        $(".square[function='about']").css({

        }).animate({
            top         : '-3.5px',
        });
    }, 1000);


    // completly hide square ui
    $("#square-ui").css({
        display     : 'none',
        zIndex      : '-1',
    });
}

// Show the square UI
// which contains the game
function ShowSquareUI() {
    // quick hide others squares
    $(".square").css({
        display     : 'none',
    });

    // animate the squaure ui
    $("#square-ui").css({
        zIndex      : '1',
        top         : '-50px',
        opacity     : '0',
        display     : 'inline-block',
    }).animate({
        opacity     : '1',
        top         : '0px',
    });
}


// Expend square UI
function EnlargeSquareUI() {
    $("#square-ui").css({
    }).animate({
        minWidth    : '450px',
        width       : '100%',
        height      : '400px',
        borderRadius: '5px',
    });
}

// Reduce square UI
function ReduceSquareUI() {
    $("#square-ui").css({

    }).animate({
        minWidth    : '0px',
        width       : '100px',
        height      : '100px',
        borderRadius: '0px',
    });
}

// Expend square UI's container
// (allow to center the ui)
function EnlargeSquaresContainer() {
    $(".square-group").css({
        width: "800px",
    });
}

// Reduce square UI's container
// (allow to center the ui)
function ReduceSquaresContainer() {
    $(".square-group").css({
        width: "300px",
    });
}

// Hide square UI
function FadeOutSquareUI() {
    $("#square-ui").css({
        opacity     : '1'
    }).animate({
        opacity     : '0',
        top         : '50px',
    });
}

// Animate the scroll vertically
function ScrollVerticallyTo(vertical) {
    var ten  = 10;
    if (vertical < 0) ten = -ten;
    vertical = Math.abs(vertical);

    for (var i = 0; i < vertical; i += 10) {
        Delay(function () {
            window.scrollBy(0, ten);
        }, 100);
    }
}
