// JAVASCRIPT FILE - NOTIFICATION.JS
// ROCKFALL
// --------------------------
// --------------------------

function click_notifications() {
    // save side panel's content
    var sidePanel = $('#side-panel');
    sidePanelMainContent = sidePanel.html();

    // empty side panel
    sidePanel.html('');

    // create & show settings
    $('<div>', {
        class: 'notifications',
        html: "<h1>notifications</h1>" +
              "<div> <h2>informations</h2>" +
              "</div>" +
              "<div> <h2>messages</h2>" +
              "</div>",

    }).appendTo('#side-panel');

    // add back button to the side panel
    // ---------------------------------
    $('.notifications').append("<img class='icon-back' src='/icons/icon_arrow.png'/>");


    // animation
    // ---------
    $('.notifications').css({
        opacity: '0',
        marginLeft: '100px',
    }).animate({
        opacity: '1',
        marginLeft: '0',
    });


    // EVENTS
    // add click event on back button
    // > save preferences
    // ------------------------------
    $('.icon-back').click(function() {
        // remplace the html content of side-panel
        // and add events on icons
        sidePanel.html(sidePanelMainContent);
        events_sidePanelIcons();
    });
}
