// ----------------------------------
// SCRIPT.JS (ROCKFALL - Main script)
// ----------------------------------

// Enter point
// > launch main functions here
window.onload = function () {
    GetSuper();
    ReloadSuperSquares();
};

// Transform square to Super Square
function GetSuper() {
    var SSPlay =  new SuperSquare(".square[function='play']", "play");
    var SSConnect =  new SuperSquare(".square[function='connect']", "connect");
    var SSAbout =  new SuperSquare(".square[function='leader']", "leader");
}

// Reload Super Squares on a title's click
function ReloadSuperSquares () {
    $("#container .title").click(function() {
        for (var i = 0; i < _SSBOX.length; i++) {
            _SSBOX[i].ReloadWithANewColor();
        };
    });
}

// ------------------------------
// PROTOTYPES & GLOBALS FUNCTIONS
// ------------------------------

// Return true if the string ends with the suffix
String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

// Replace str1 by str2 in a string
// or str2 by str1 according to what's find first
String.prototype.toggleStr = function (str1, str2) {
    if (this.indexOf(str1) !== -1) {
        return this.replace(str1, str2);
    }
    else {
        return this.replace(str2, str1);
    }
}

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Starts a function with a delay
function Delay(func, delay, arg) {
    var _delay = delay
    if (_delay === 'undefined' || _delay === null)
        _delay = 500;

    if (typeof arg !== "undefined" && arg !== null && arg !== "") {
        window.setTimeout(func(arg), 2000);
        return;
    }

    window.setTimeout(function () {
        func();
    }, delay);
}

// Animate the scroll vertically to the html page
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

// Add a pre-defined tooltip (style) to a jquery object
function AddTooltipCenterRight(jqueryObject, qtipText) {
    jqueryObject.qtip({
        style: {
            classes: 'qtip-light',
            fontSize: '22px',
        },
        position: {
            my: 'CenterLeft',
            at: 'CenterRight',
        },
        content: {
            text: qtipText,
        },
        show: {
            effect: function () {
                $(this).fadeTo(500, 1);
            }
        },
        hide: {
            effect: function () {
                $(this).fadeTo(500, 0);
            }
        }
    });
}

// The functions's name seems quite explicit
function AddScrollToHMTL() {
    $("html").toggleClass("html-no-scrollable");
    $(".square-group").css({
        height: 'auto',
    });
}

// The functions's name seems quite explicit
function RemoveScrollFromHTML() {
    $("html").toggleClass("html-no-scrollable");
    $(".square-group").css({
        height: '290px',
    });
}

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};
