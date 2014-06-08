// JAVASCRIPT FILE - SIDEPANEL.JS
// ROCKFALL
// --------------------------
// --------------------------


// initial side-panel's content
// ---------------------------
var sidePanelMainContent = '';


// Add click events on icons' side-panel
// -------------------------------
function events_sidePanelIcons() {
    $('.user-panel-icon').each(function() {
        $(this).click(function() {
            var action = $(this).attr('action');

            if (action === 'settings') {
                click_settings();
            }

            else if (action === 'message') {
                click_notifications();
            }

            else if (action === 'trophy') {

            }
        });
    });
}

function anime_rollup_main_sidebar() {
    $('.user-avatar').slideUp();
    $('.power-up-panel').slideUp();
    $('.user-score').slideUp();
    $('.user-panel').slideUp();
}
