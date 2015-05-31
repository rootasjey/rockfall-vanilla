// Test

// Run the multiplayers test
function testMultilpayers() {
    // Click on play
    var square = FindSuperSquare("play");
    square.Expend();

    // Click on multiplayers game
    square.GameOnlineMode();
    $(".message-confirmation").remove();
    square.GameUnfriendlyOnlineMode();

    // Click on settings
    window.setTimeout(function () {
        square.SettingsToggleVisibility();
    }, 1000);



    // Open login panel

    // Fill login input

    // Click on enter

}
