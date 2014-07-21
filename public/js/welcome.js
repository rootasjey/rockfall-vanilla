
// Add mouse's events on icons
// ---------------------------
function WelcomeIconsMouseEvents() {
    MouseHoverEvent();
    MouseClickEvent();
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

function ExpandMainUI() {
    DropDownSquareUI();
    HideImagesSquares();
    Delay(EnlargeSquareUI, 1000);
}

function DropDownSquareUI() {
    $("div.square").css({
        background: 'black',
    }).animate({
        background: 'red',
        top : '-59px',
    });
}

function HideImagesSquares() {
    $("img.square").css({
        opacity : '0.8',
    }).animate({
        opacity : '0',
    });
}

function EnlargeSquareUI() {
    $(".square-group").css({
        // width: '600px',
    }).animate({
        width: '600px',
    });
    $("div.square").css({
        // height: '300px',
        // width: '500px',
    }).animate({
        height: '300px',
        width: '500px',
    });
}
