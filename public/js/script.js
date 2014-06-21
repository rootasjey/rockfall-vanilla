// JAVASCRIPT FILE
// ROCKFALL
// ---------------

// Enter point
// > launch main functions here
// > jquery can be used
// --------------------------
window.onload = function () {
    // load settings function
    load_side_panel();

    // load the board
    load_board();

    // toggle fullscreen
    fullscreen();
    window.setTimeout(auto_fullscreen, 2000);
};
