// ----------------------------------
// SCRIPT.JS (ROCKFALL - Main script)
// ----------------------------------

// Enter point
// > launch main functions here
// > jquery can be used
// --------------------------
window.onload = function () {
    WelcomeIconsMouseEvents();
};


// -------------
// JS PROTOTYPES
// -------------

// Return true if the string ends with the suffix
String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

// Starts a function with a delay
function Delay(func, delay) {
    var _delay = delay
    if (_delay === 'undefined' || _delay === null)
        _delay = 500;

    window.setTimeout(function () {
        func();
    }, delay);
}
