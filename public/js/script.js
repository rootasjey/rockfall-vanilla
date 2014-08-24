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

// Starts a function with a delay
function Delay(func, delay) {
    var _delay = delay
    if (_delay === 'undefined' || _delay === null)
        _delay = 500;

    window.setTimeout(function () {
        func();
    }, delay);
}
