// -----------------------------
// NOTIFICATIONS.JS (ROCKFALL)
// -----------------------------
// This file contains
// notifications' system
// -----------------------------
// -----------------------------

// Notifications object
var _notifications = null;

function ClickNotifications() {
    // save side panel's content
    var sidePanel = $('#side-panel');
    sidePanelMainContent = $('#side-panel-main-content');

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

        // Add Informations & Messages sections to Notifications
        // ------------------------
        $('.notifications').append(
            "<div class='notifications-body'>"+
            "</div>");

        // add back button to the side panel
        // ---------------------------------
        $('.notifications').append("<img class='icon-back' src='/icons/icon_arrow.png'/>");
    }
    else {
        $('#side-panel').append(_notifications);
    }



    // EVENTS
    // add click event on back button
    // > save preferences
    // -------------------------------
    $('.icon-back').click(function () {
        AnimateOutNotifications();

        Delay(function () {
            AnimateInSidePanelMainContent();
            LoadSidePanel();
        });
    });

    // Add a click event to add dummy message
    // ---------------------------------------
    $('.add-dummy-message').click(function () {
        var types = ['informations', 'messages'];
        var rand = getRandomInt(0, 1);
        NotifyMe('This is a dummy message', types[rand]);
    });

    // Add click event on ok-button
    $(".ok-button").click(function (event) {
        event.stopPropagation();
        $(this).parent().remove();
    });

    AnimateInNotifications();
}


function RemakeSidepanelIE() {
  $("<div>", {
    class: 'user-avatar',
    html: "<img class='user-avatar-img' src='../icons/icon_key.png'/>" +
     "<span id='user-avatar-name-id' class='user-avatar-name'> Visitor</span>"
  }).appendTo(sidePanelMainContent);

  $("<div>", {
    class: 'power-up-panel',
    html: "<span class='title'> Power-Up </span>" + "<div> <p class='subtitle'> No Power-Up </p> </div>" +
    "<img class='power-up' src='../icons/icon_cross.png' tip='Get 30pts to unlock a level 1 power'/>" +
    "<img class='power-up' src='../icons/icon_cross.png' tip='Get 60pts to unlock a level 1 power'/>" +
    "<img class='power-up' src='../icons/icon_cross.png' tip='Get 120pts to unlock a level 1 power'/>"
  }).appendTo(sidePanelMainContent);

  $("<div>", {
    class: 'user-score',
    html: "<p id='user-sore-points'> 0 </p>",
  }).appendTo(sidePanelMainContent);

  $("<div>", {
    class: 'user-panel',
    html: "<img class='user-panel-icon' src='../icons/icon_settings.png' action='settings' />" +
    "<img class='user-panel-icon' src='../icons/icon_message.png' action='message' />" +
    "<img class='user-panel-icon' src='../icons/icon_trophy.png' action='trophy' />"
  }).appendTo(sidePanelMainContent);
}



// Add a notification
// --------------------------------
function NotifyMe(message, type) {
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
        FullscreenNotification($(this).parent());
    });
    ok.click(function (event) {
        event.stopPropagation();
        $(this).parent().remove();
    });


    // place the message in the right section
    // --------------------------
    if(type === 'informations') {
        $('.notifications-body').append(box);
        ExpandNotifications(box.outerHeight(true));
    }
    else if (type === 'messages') {
        $('.notifications-body').append(box);
        ExpandNotifications(box.outerHeight(true));
    }
}

function ExpandNotifications(height) {
    var old_height = $('.notifications-body').height() + 'px';
    var new_height = '+=' + height + 'px';

    $('.notifications-body').css({
        height: old_height,
    })
    .animate({
        height: new_height,
    });
}



// Open notification message in the game-ui
function FullscreenNotification(notification) {
    // console.log(notification);
}

// Returns a random integer between min and max
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
