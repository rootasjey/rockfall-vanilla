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

    // load the board
    LoadBoard();
    
    //
    Connexion();
    
    // toggle fullscreen
    Fullscreen();

    WelcomeIconsMouseEvents();
    // window.setTimeout(AutoFullscreen, 2000);
};
