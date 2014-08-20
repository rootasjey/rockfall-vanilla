
// Add mouse's events on icons
// ---------------------------
function WelcomeIconsMouseEvents() {
    MouseHoverEvent();
    MouseClickEvent();

    // Remove scroll bar to the page
    // to simulate full screen
    RemoveScrollFromHTML();

    // Scroll to the top of screen
    ScrollVerticallyTo(-500);
}

// Mouse hover event
// -------------------------
function MouseHoverEvent() {
    $("img.square").hover(
        function () {
            // fill in the tile infos
            var text = $(this).attr('function');
            $("div.square[function='infos'] .square-text").html(text);
            $("div.square[function='infos']").css('color', 'black');

            // rotate the image icon
            $(this).css('-webkit-transform', 'rotate(45deg)');
            $(this).css('-moz-transform', 'rotate(45deg)');
            $(this).css('-ms-transform', 'rotate(45deg)');
            $(this).css('-o-transform', 'rotate(45deg)');
            $(this).css('transform', 'rotate(45deg)');
        },

        function () {
            // hide the text diplayed on the tile info
            $("div.square[function='infos']").css('color', 'transparent');

            // rotate the image icon
            $(this).css('-webkit-transform', 'rotate(0deg)');
            $(this).css('-moz-transform', 'rotate(0deg)');
            $(this).css('-ms-transform', 'rotate(0deg)');
            $(this).css('-o-transform', 'rotate(0deg)');
            $(this).css('transform', 'rotate(0deg)');
        }
    )
}

// Mouse click event
// -------------------------
function MouseClickEvent() {
    $("img.square").click(function (event) {
        // expend main-ui
        ExpandMainUI();
    });
}

// Maximize the main ui (hide welcome screen)
// when the user click on a square
// ----------------------
function ExpandMainUI() {
    // Add scroll bar to the page
    AddScrollToHMTL();

    FadeOutSquares();
    Delay(EnlargeSquaresContainer, 800);
    Delay(ShowSquareUI, 1000);
    Delay(EnlargeSquareUI, 1500);

    // add elements to the ui
    Delay(PopulateSquareUI, 2000);
}


// Minimize the main ui
// and show the welcome screen
// ----------------------
function MinimizeMainUI() {
    ReduceSquareUI();
    Delay(ReduceSquaresContainer, 500);
    Delay(FadeOutSquareUI, 1000);
    Delay(FadeInSquares, 1500);

    RemoveScrollFromHTML();
}

function AddScrollToHMTL() {
    $("html").toggleClass("html-no-scrollable");
}

function RemoveScrollFromHTML() {
    $("html").addClass("html-no-scrollable");
}

// Hide all squares
// ------------------------
function FadeOutSquares() {
    $("img.square").css({
        opacity     : '0',
        top         : '0px',
    }).animate({
        opacity     : '0',
        top         : '-40px',
    });

    // info square
    // is a div not an img
    // -------------------
    $("div.square[function='infos']").css({
        display     : 'none',
    });
}

// Show all squares
// -----------------------
function FadeInSquares() {
    // Display squares with style
    $("img.square").css({
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
    $("div.square[function='infos']").css({
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
// ----------------------
function ShowSquareUI() {
    // quick hide others squares
    $("img.square").css({
        display     : 'none',
    });

    $("div.square").css({
        display     : 'none',
    });

    // animate the squaure ui
    $("div.square[function='ui']").css({
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
// ------------------------
function EnlargeSquareUI() {
    $("div.square[function='ui']").css({

    }).animate({
        minWidth    : '450px',
        width       : '100%',
        height      : '400px',
        borderRadius: '5px',
    });
}

// Expend square UI's container
// (allow to center the ui)
// ----------------------------
function EnlargeSquaresContainer() {
    $(".square-group").css({
        width: "800px",
    });
}

// Reduce square UI's container
// (allow to center the ui)
// ----------------------------
function ReduceSquaresContainer() {
    $(".square-group").css({
        width: "300px",
    });
}

// Reduce square UI
// ----------------------------
function ReduceSquareUI() {
    $("#square-ui").css({

    }).animate({
        minWidth    : '0px',
        width       : '100px',
        height      : '100px',
        borderRadius: '0px',
    });
}

// Hide square UI
// -------------------------
function FadeOutSquareUI() {
    $("#square-ui").css({
        opacity     : '1'
    }).animate({
        opacity     : '0',
        top         : '50px',
    });
}
