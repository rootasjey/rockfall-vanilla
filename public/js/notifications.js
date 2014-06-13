// JAVASCRIPT FILE - NOTIFICATION.JS
// ROCKFALL
// --------------------------
// --------------------------

function click_notifications() {
    // save side panel's content
    var sidePanel = $('#side-panel');
    side_panel_main_content = sidePanel.html();

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
                  " <h2 class='notifications-subtitle'>informations</h2>" +
                  "<div class='informations'>"+
                  "</div>" +

                  " <h2 class='notifications-subtitle'>messages</h2>" +
                  "<div class='messages'>"+
                  "</div>");


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
        sidePanel.html(side_panel_main_content);
        load_side_panel();
    });

    // Add a click event to add dummy message
    // ---------------------------------------
    $('.add-dummy-message').click(function () {
        var types = ['informations', 'messages'];
        var rand = getRandomInt(0, 1);
        notify_me('This is a dummy message', types[rand]);
    });

    // Add click event on notifications/messages
    // ----------------
    $('.notifications-subtitle').click(function () {
        var type = $(this).html();
        // console.log(type);

    });
}


// Add a notification
// --------------------------------
function notify_me(message, type) {
    if(!(message && type)) return;

    // create a box message
    var box = $("<div class='box-message'>");
    box.attr('type', type);

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

        var type_message = $(this).parent().attr('type');
        if(type === 'informations') {
            // var height = $(this).parent().outerHeight( true );

            // reduce the panel if it's empty
            var parent = $(this).parent().parent();
            var children = parent.children().length;
            if(children < 2) {
                shrink_informations();
            }
        }
        else if(type === 'messages') {
            // var height = $(this).parent().outerHeight( true );

            // reduce the panel if it's empty
            var parent = $(this).parent().parent();
            var children = parent.children().length;
            if(children < 2) {
                shrink_messages();
            }
        }

        $(this).parent().remove();
    });


    // place the message in the right section
    // --------------------------
    if(type === 'informations') {
        $('.informations').append(box);
        expand_informations(box.outerHeight(true));
    }
    else if (type === 'messages') {
        $('.messages').append(box);
        expand_messages(box.outerHeight(true));
    }
}

function expand_informations(height) {
    var old_height = $('.informations').height() + 'px';
    var new_height = '+=' + height + 'px';

    $('.informations').css({
        height: old_height,
    })
    .animate({
        height: new_height,
    });
}

function shrink_informations() {
    var old_height = $('.informations').height() + 'px';
    var new_height = '0px';

    $('.informations').css({
        height: old_height,
    })
    .animate({
        height: new_height,
    });
}

function expand_messages(height) {
    var old_height = $('.messages').height() + 'px';
    var new_height = '+=' + height + 'px';

    $('.messages').css({
        height: old_height,
    })
    .animate({
        height: new_height,
    });
}

function shrink_messages() {
    var old_height = $('.messages').height() + 'px';
    var new_height = '0px';

    $('.messages').css({
        height: old_height,
    })
    .animate({
        height: new_height,
    });
}


// Returns a random integer between min and max
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
