// -----------------------------
// SCRIPT.JS (ROCKFALL)
// -----------------------------
// This file is the main script
// -----------------------------
// -----------------------------

// Enter point
// > launch main functions here
// > jquery can be used
// --------------------------
window.onload = function () {
    // load settings function
    LoadSidePanel();

    // load the game's board
    // LoadBoard();

    // toggle fullscreen
    Fullscreen();

    WelcomeIconsMouseEvents();
    // window.setTimeout(AutoFullscreen, 2000);
};


// JS PROTOTYPES
// ----------
String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};
