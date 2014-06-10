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

    // create settings
    $('<div>', {
        class: 'notifications',
        html: "<h1>notifications</h1>",

    }).appendTo('#side-panel');

    // TEST : Add a dummy message
    $('.notifications').append("<div class='add-dummy-message'>Add dummy message </div>");

    // Add Informations & Mssages sections to Notifications
    // ------------------------
    $('.notifications').append(
                  "<div class='informations'>"+
                      " <h2>informations</h2>" +
                  "</div>" +

                  "<div class='messages'>"+
                      " <h2>messages</h2>" +
                  "</div>")


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

    // Add a click event to add dummy message
    // ---------------------------------------
    $('.add-dummy-message').click(function () {
        var types = ['informations', 'messages'];
        var rand = getRandomInt(0, 1);
        notify_me('This is a dummy message', types[rand]);
    })
}


// Add a notification
// --------------------------------
function notify_me(message, type) {
    if(!(message && type)) return;

    // create a box message
    var box = $("<div class='box-message'>");
    // add the message content
    box.append("<span class='text-message'>" + message + '</span>');

    // add ok button
    var ok = $("<div class='ok-button'>");
        ok.html('ok');
    box.append(ok);


    // EVENTS
    // -------------------------
    box.click(function (event) {
        // console.log('full screen');
    });
    ok.click(function (event) {
        event.stopPropagation();
        $(this).parent().remove();
    });

    // place the message in the right section
    // --------------------------
    if(type === 'informations') {
        $('.informations').append(box);
    }
    else if (type === 'messages') {
        $('.messages').append(box);
    }
}


// Returns a random integer between min and max
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
