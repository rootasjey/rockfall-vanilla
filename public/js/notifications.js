// JAVASCRIPT FILE - NOTIFICATION.JS
// ROCKFALL
// --------------------------
// --------------------------

// Notifications element
var _notifications = null;

function click_notifications() {
    // save side panel's content
    var sidePanel = $('#side-panel');
    side_panel_main_content = $('#side-panel-main-content');
    // console.log(side_panel_main_content);

    // empty side panel
    sidePanel.html('');

    if(_notifications == null) {
        // create notifications
        _notifications = $('<div>', {
            class: 'notifications',
            html: "<h1>notifications</h1>",

        });
        $('#side-panel').append(_notifications);

        // TEST : Add a dummy message
        $('.notifications').append("<div class='add-dummy-message'>Add dummy message </div>");

        // Add Informations & Mssages sections to Notifications
        // ------------------------
        $('.notifications').append(
                      "<div class='notifications-body'>"+
                      "</div>");


        // add back button to the side panel
        // ---------------------------------
        $('.notifications').append("<img class='icon-back' src='/icons/icon_arrow.png'/>");


        // Add click event on notifications/messages
        // ---------------------------------------------
        // $('.notifications-subtitle').click(function () {
        //     // maximize/reduce subpanel
        //     var type = $(this).html();
        //     maximize_subpanel(type);
        // });
    }
    else {
        $('#side-panel').append(_notifications);
    }



    // EVENTS
    // add click event on back button
    // > save preferences
    // ------------------------------
    $('.icon-back').click(function(callback) {
        // ANIMATION
        // ---------
        // fading out
        $('.notifications').css({
            opacity: '1',
            marginLeft: '0',
        }).animate({
            opacity: '0',
            marginLeft: '100px',
        });

        // fading in
        // with a delayed start
        window.setTimeout(function() {
          // remplace the html content of side-panel
          // and add events on icons
          _notifications.remove();
          $('#side-panel').append(side_panel_main_content);

          // code for ie ----------------------------
          if(side_panel_main_content.html() === '') {
            remake_sidepanel_content_ie();
          }

          // fading in of the side panel main content
          side_panel_main_content.css({
            opacity: '0',
            marginLeft: '100px',
          }).animate({
            opacity: '1',
            marginLeft: '0',
          });

          // add events handler on side panel
          load_side_panel();
        }, 500);

    });


    // Add a click event to add dummy message
    // ---------------------------------------
    $('.add-dummy-message').click(function () {
        var types = ['informations', 'messages'];
        var rand = getRandomInt(0, 1);
        notify_me('This is a dummy message', types[rand]);
    });

    // Add click event on ok-button
    $(".ok-button").click(function (event) {
        event.stopPropagation();
        $(this).parent().remove();
    });

    // ANIMATION
    // ---------
    $('.notifications').css({
        opacity: '0',
        marginLeft: '100px',
    }).animate({
        opacity: '1',
        marginLeft: '0',
    });
}


function remake_sidepanel_content_ie() {
  $("<div>", {
    class: 'user-avatar',
    html: "<img class='user-avatar-img' src='../icons/icon_key.png'/>" + "<span id='user-avatar-name-id' class='user-avatar-name'> Visitor</span>"
  }).appendTo(side_panel_main_content);

  $("<div>", {
    class: 'power-up-panel',
    html: "<span class='title'> Power-Up </span>" + "<div> <p class='subtitle'> No Power-Up </p> </div>" +
    "<img class='power-up' src='../icons/icon_cross.png' tip='Get 30pts to unlock a level 1 power'/>" +
    "<img class='power-up' src='../icons/icon_cross.png' tip='Get 60pts to unlock a level 1 power'/>" +
    "<img class='power-up' src='../icons/icon_cross.png' tip='Get 120pts to unlock a level 1 power'/>"
  }).appendTo(side_panel_main_content);

  $("<div>", {
    class: 'user-score',
    html: "<p id='user-sore-points'> 0 </p>",
  }).appendTo(side_panel_main_content);

  $("<div>", {
    class: 'user-panel',
    html: "<img class='user-panel-icon' src='../icons/icon_settings.png' action='settings' />" +
    "<img class='user-panel-icon' src='../icons/icon_message.png' action='message' />" +
    "<img class='user-panel-icon' src='../icons/icon_trophy.png' action='trophy' />"
  }).appendTo(side_panel_main_content);
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
        fullscreen_notification($(this).parent());
    });
    ok.click(function (event) {
        event.stopPropagation();

        // var type_message = $(this).parent().attr('type');
        // if(type === 'informations') {
        //     // reduce the panel if it's empty
        //     var parent = $(this).parent().parent();
        //     var children = parent.children().length;
        //     if(children < 2) {
        //         shrink_informations();
        //     }
        // }
        // else if(type === 'messages') {
        //     // reduce the panel if it's empty
        //     var parent = $(this).parent().parent();
        //     var children = parent.children().length;
        //     if(children < 2) {
        //         shrink_messages();
        //     }
        // }

        $(this).parent().remove();
    });


    // place the message in the right section
    // --------------------------
    if(type === 'informations') {
        $('.notifications-body').append(box);
        expand_notifications(box.outerHeight(true));
    }
    else if (type === 'messages') {
        $('.notifications-body').append(box);
        expand_notifications(box.outerHeight(true));
    }
}

function expand_notifications(height) {
    var old_height = $('.notifications-body').height() + 'px';
    var new_height = '+=' + height + 'px';

    $('.notifications-body').css({
        height: old_height,
    })
    .animate({
        height: new_height,
    });
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

// Maximize notifications' subpanel
// -------------------------------
function maximize_subpanel(type) {
    // the other subpanel
    var other_type = '';
    if(type === 'informations') other_type = 'messages';
    else if (type === 'messages') other_type = 'informations';

    // height of the clicked subpanel
    var height = null;
    var height_start = '';
    var height_end = '';
    height = $("." + type).css('height');

    // height of the other subpanel
    var height_b = null;
    var height_b_start = null;
    var height_b_end = null;


    if(height === '300px') {
        height_start = '300px';
        height_end = '160px';
        height_b_end = '160px';
    }
    else {
        height_start = height;
        height_end = '300px';
        height_b_end = '0';
    }


    // animation of the clicked subpanel
    $('.' + type).css({
        height: height_start,
        maxHeight: height_end,
    })
    .animate({
        height: height_end,
    });

    // animation of the other subpanel
    $('.' + other_type).css({
        height: $('.' + other_type).css('height'),
    })
    .animate({
        height: height_b_end,
    });
}

// Open notification message in the game-ui
function fullscreen_notification(notification) {
    // console.log(notification);
}

// Returns a random integer between min and max
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
