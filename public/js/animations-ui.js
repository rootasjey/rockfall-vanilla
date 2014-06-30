// -----------------------------
// ANIMATIONS-UI.JS (ROCKFALL)
// -----------------------------
// This file contains all user
// interface's animations
// -----------------------------
// -----------------------------


// Show login/signup ui with style
// ---------------------------
function AnimateInLoginUI() {
    // ANIMATIONS
    // fade in login ui
    $('#game-panel').css({
        display: 'block',
        opacity: '0',
        marginTop: '100px',
    }).animate({
        opacity: '1',
        marginTop: '0',
    });

    // hide the game
    $('#canvas').css('display', 'none');

    // pause the game
    // -------------?
}


// Hide login/signup ui with style
// ---------------------------
function AnimateOutLoginUI() {
    // ANIMATIONS
    // fade out login ui
    $('#game-panel').css({
        display: 'block',
        opacity: '1',
        marginTop: '0',
    }).animate({
        opacity: '0',
        marginTop: '100px',
    });

    // display the game board
    Delay(function() {
        $('#canvas').css('display', 'block');
        $('#game-panel').css('display', 'none');
    });

    $(".button[function='login']").off('click');
    $(".button[function='signup']").off('click');
}


// Show login form
// ---------------------------
function AnimateInLoginForm() {
    // hide connexion/cancel/signup buttons
    $(".button").css('display', 'none');
    $(".text-hint").css('display', 'none');

    // ANIMATION
    $('#form_login').css({
        opacity: '0',
    }).animate({
        opacity: '1',
    });
}


// Hide login form
// ----------------------------
function AnimateOutLoginForm() {
    // show connexion/cancel/signup buttons
    $(".button").css('display', 'inline-block');
    $(".text-hint").css('display', 'inline');
    $('.form').remove();


    // ANIMATIONS
    $('#game-panel').css({
        opacity: '0',
    }).animate({
        opacity: '1',
    });
}


// Show signup form
// -----------------------------
function AnimateInSignupForm() {
    // hide connexion/cancel/signup buttons
    $(".button").css('display', 'none');
    $(".text-hint").css('display', 'none');

    // ANIMATIONS
    $('#form_signup').css({
        opacity: '0',
    }).animate({
        opacity: '1',
    });
}


// Hide signup form
// ---------------------------
function AnimateOutSignupForm() {
    // show connexion/cancel/signup buttons
    $(".button").css('display', 'inline-block');
    $(".text-hint").css('display', 'inline');
    $('.form').remove();


    // set the default layout
    // (cause we changed it -> signup form)
    $('.login-ui').css({
        width: '50%',
        margin: 'auto',
        textAlign: 'center',
    });
    $('.form').css({
        width: '200px',
        margin: 'auto',
    });

    // change the style of edit-info
    $('.edit-info').css('display', 'block');
    $('input').css('display', 'block');

    // ANIMATIONS
    $('#game-panel').css({
        opacity: '0',
    }).animate({
        opacity: '1',
    });
}


// Show notifications
// ------------------------------
function AnimateInNotifications() {
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


// Hide notifications
// -------------------------------
function AnimateOutNotifications() {
    // ANIMATION
    // ---------
    // fading out
    $('.notifications').css({
        opacity: '1',
        marginLeft: '0',
    }).animate({
        opacity: '0',
        marginLeft: '60px',
    });
}


// Show settings
// ------------------------
function AnimateInSettings() {
    // animation
    // ---------
    $('.settings').css({
        opacity: '0',
        marginLeft: '100px',
    }).animate({
        opacity: '1',
        marginLeft: '0',
    });
}


// // Hide settings
// ------------------------
function AnimateOutSettings() {
    // ANIMATION
    // ---------
    // fading out
    $('.settings').css({
        opacity: '1',
        marginLeft: '0',
    }).animate({
        opacity: '0',
        marginLeft: '60px',
    });
}


// Show sidebar's main content with style
// ------------------------
function AnimateInSidePanelMainContent() {
    // remove panels in side panel
    if(_notifications) {
        _notifications.remove();
    }
    if(_settings) {
        _settings.remove();
    }

    // set the default content
    $('#side-panel').append(sidePanelMainContent);

    // code for ie ----------------------------
    if(sidePanelMainContent.html() === '') {
      RemakeSidepanelIE();
    }

    // fading in of the side panel main content
    sidePanelMainContent.css({
      opacity: '0',
      marginLeft: '60px',
    }).animate({
      opacity: '1',
      marginLeft: '0',
    });
}


// Hide sidebar's main content with style
// --------------------------------------
function AnimateOutSidePanelMainContent() {
    $('#side-panel-main-content').css({
          opacity: '1',
          marginLeft: '0',
      }).animate({
          opacity: '0',
          marginLeft: '60px',
      });
}
