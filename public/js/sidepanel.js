// -----------------------------
// SIDEPANEL.JS (ROCKFALL)
// -----------------------------
// This file contains
// the main mecanisms of
// the sidepanel
// -----------------------------
// -----------------------------


// Initial side-panel's content
// ----------------------------
var sidePanelMainContent = null;
var loginUI = null;

function LoadSidePanel() {
    EventsSidePanelIcons();
    EventLoginUI();
}

// Add click events on icons'
// side-panel
// -------------------------------
function EventsSidePanelIcons() {
    $('.user-panel-icon').each(function() {
        $(this).click(function() {
            var action = $(this).attr('action');

            if (action === 'settings') {
              AnimateOutSidePanelMainContent();
              Delay(ClickSettings);
            }

            else if (action === 'message') {
              AnimateOutSidePanelMainContent();
              Delay(ClickNotifications);
            }

            else if (action === 'trophy') {

            }
        });
    });
}

// Start a function
// with a delay
// ----------------------------
function Delay(func, options) {
  window.setTimeout( function() {
    func(options);
  }, 500);
}


// Create the user
// interface to login
// -----------------------
function CreateLoginUI() {
    loginUI = $('<div>');
    loginUI.addClass('login-ui');
    loginUI.append("<span class='text-hint'>You can connect to play online and save your personal settings.</span> <br> <br>");

    var buttonLogin = $('<div>');
    buttonLogin.addClass('button');
    buttonLogin.attr('function', 'login');
    buttonLogin.html("connexion");

    // var buttonLogout = $('<div>');
    // buttonLogout.addClass('button');
    // buttonLogout.attr('function', 'logout');
    // buttonLogout.html('logout');

    var buttonCancel = $('<div>');
    buttonCancel.addClass('button');
    buttonCancel.attr('function', 'cancel');
    buttonCancel.html('cancel');

    var buttonSignup = $('<div>');
    buttonSignup.addClass('button');
    buttonSignup.attr('function', 'signup');
    buttonSignup.html('signup');
    buttonSignup.css('width', '80%');

    loginUI.append(buttonLogin);
    loginUI.append(buttonCancel);
    loginUI.append(buttonSignup);

    $('#game-panel').append(loginUI);
}


// Add events on login ui
// ----------------------
function EventLoginUI() {
    // click event
    // -----------
    $('.user-avatar').click(function () {
        if($('#canvas').css('display') === 'block') {
            if(loginUI === null) {
                // create login ui
                // if it's not already created
                CreateLoginUI();
            }


            // Show login ui & hide the game
    		    AnimateInLoginUI();

            // ---------------
            // LOGIN -> click
            // ---------------
            $(".button[function='login']").click(function () {
                ClickLogin();
            });

            // ---------------
            // SIGNUP -> click
            // ---------------
            $(".button[function='signup']").click(function () {
                ClickSignup();
            });


            // CANCEL BUTTON
            // event on login/signup ui
            // >action: back to the game
            $(".button[function='cancel']").click(function () {
                AnimateOutLoginUI();
                $(this).off('click');
            });
        }

        else {
            // If login ui is already displayed
            // hide it
            AnimateOutLoginUI();
        }
    });
}


// Click event on login
// form's button
// --------------------
function ClickLogin() {
    // create login form
    var form = MakeForm('login');
    $('.login-ui').append(form);

    // validation button
    $("button[function='enter']").click(function () {
        // send ajax request
        SubmitLogin();
    });


    // click event on CANCEL form's button
    // >action: back to login/signup ui
    $("button[function='cancel']").click(function () {
        $(this).off('click');
        AnimateOutLoginForm();
    });

    // show login form
    AnimateInLoginForm();
}


// Click event on signup
// form's button
// ----------------------
function ClickSignup() {
    // create login form
    // -----------------
    var form = MakeForm('signup');
    $('.login-ui').append(form);


    // add events on select
    // to update colors visualisers
    // when a different color is
    // selected
    // -----------------------------
    $('#color1').change(function() {
        UpdateColorVisualiser(1);
    });
    $('#color2').change(function() {
        UpdateColorVisualiser(2);
    });


    // send signup form event
    // ----------------------
    $("button[function='enter']").click(function () {
        SubmitSignup();
    });


    // events on login/signup form's button
    // >action: back to login/signup ui
    $("button[function='cancel']").click(function (event) {
        $(this).off('click');
        AnimateOutSignupForm();
    });

    AnimateInSignupForm();
}


// Submit ajax request
// to server.js
// >send login form
// ---------------------
function SubmitLogin() {
    $('#form_login').submit(function () {
        $.ajax({
            type: 'POST',
            url: '/login/',
            data: $('#form_login').serialize(),
            success: function (data) {
                if (data !== 'wrong password' && data !== 'wrong login') {
                    LoginSuccess();
                }
                else {

                }
            },
            error: function (data) {
                LoginFail(data);
            }
        });
        return false;
    });
}


// Notify the success
// ----------------------
function LoginSuccess() {
    var newMessage = "You're now connected"
    DisplayGamePanelMessage(newMessage);
}

function LoginFail(message) {
    var newMessage = message;
    DisplayGamePanelMessage(newMessage);
}

// Display a message in the game-panel
// ----------------------------------------
function DisplayGamePanelMessage(message) {
    var successMessage = $('<div>');
    var content = "<div>" + message + "</div>";
    var button = "<div class='button-form'> ok </div>";

    successMessage.attr('class', 'login-ui-message');
    successMessage.html(content + button);

    var previousContent = $('#game-panel').html();
    $('#game-panel').html(successMessage);


    // button events
    // -------------
    $(".login-ui-message .button-form").click(function () {
        // remove the message
        AnimateOutLoginUI();
        $('#game-panel').html(previousContent);
      });
}

// Submit ajax request
// to server.js
// >send signup form
// ----------------------
function SubmitSignup() {
    $('#form_signup').submit(function () {
        $.ajax({
            type: 'POST',
            url: '/signup/',
            data: $('#form_signup').serialize(),
            success: function (data) {
                console.log(data);
                if (data == 'OK') {
                    console.log('OK');
                }
                else {
                    console.log('NOT OK');
                }
            },
            error: function () {
                console.log('NOT OK2');
            }
        });
        return false;
    });
}


// Create a form (login/signup)
// -----------------------
function MakeForm(type) {
    var form       = document.createElement('form');
    form.name      = 'login_form';
    form.id        = 'form_' + type;
    form.className = 'form';

    var formTitle = document.createElement('h2');
        if(type === 'login') {
            formTitle.innerHTML = "LOGGIN";
        }
        else {
            formTitle.innerHTML = "SIGNUP";
        }


    // labels
    // ------
    var labelName = document.createElement('span');
    labelName.className = 'edit-info';
    labelName.name = 'name-title';
    labelName.innerHTML = "Login/Name";

    var labelPassword = document.createElement('span');
    labelPassword.className = 'edit-info';
    labelPassword.name = 'password-title';
    labelPassword.innerHTML = "Password ";


    // inputs
    // ------
    var inputName = document.createElement('input');
    inputName.type = 'text';
    inputName.name = 'user';
    inputName.className = 'input';
    inputName.placeholder = 'Enter your new name';

    var inputPassword1 = document.createElement('input');
    inputPassword1.type = 'password';
    inputPassword1.name = 'password';
    inputPassword1.className = 'input';
    inputPassword1.placeholder = 'Enter your password';



    // add elements to the form
    // form's title
    form.appendChild(formTitle);

    // labels + inputs
    form.appendChild(labelName);
    form.appendChild(inputName);

    form.appendChild(labelPassword);
    form.appendChild(inputPassword1);


    // Add these extra inputs
    // if signup,
    if(type === 'signup') {
        // password confirmation
        var inputPassword2 = document.createElement('input');
        inputPassword2.type = 'password';
        inputPassword2.name = 'password2';
        inputPassword2.className = 'input';
        inputPassword2.placeholder = 'Re-Enter your password';

        // email
        var labelEmail = document.createElement('span');
        labelEmail.className = 'edit-info';
        labelEmail.name = 'email-title';
        labelEmail.innerHTML = "Email";

        var inputEmail = document.createElement('input');
        inputEmail.type = 'text';
        inputEmail.name = 'email';
        inputEmail.className = 'input';
        inputEmail.placeholder = 'Enter your mail';


        // favorites colors
        var labelColor1 = document.createElement('span');
        labelColor1.className = 'edit-info';
        labelColor1.innerHTML = "Favorites colors <br/>";


        // selects
        // -------
        var selectColor1 = document.createElement('select');
        selectColor1.form = 'form_' + type;
        selectColor1.name = 'color1';
        selectColor1.id = 'color1';

        var selectColor2 = document.createElement('select');
        selectColor2.form = 'form_' + type;
        selectColor2.name = 'color2';
        selectColor2.id = 'color2';


        // array of colors values
        var ColorsValues =
            ['#c0392b', '#3498db', '#f1c40f',
            '#2ecc71','#34495e','#8e44ad',
            '#bdc3c7','#19B5FE','#e67e22',
            '#049372','#67809F','#1F3A93'];

        // array of colors names
        var ColorsNames =
            ['Pomegranate','Peter Silver','Sun Flower',
            'Emerald','Wet Asphalt','Wisteria',
            'Silver','Dodger Blue','Carrot',
            'Observatory','Hoki','Jacksons'];

        // add colors to the select element
        for (var i = 0; i < ColorsValues.length; i++) {
            var option = $('<option>', {
                value: ColorsValues[i],
                html: ColorsNames[i],
            });
            var o = option.clone();

            if(i==1) o[0].setAttribute('selected', 'true');

            selectColor1.appendChild(option[0]);
            selectColor2.appendChild(o[0]);
        }


        // colors visualisers
        var colorVisualiser1 = document.createElement('span');
        colorVisualiser1.className = 'color-visualiser';
        colorVisualiser1.setAttribute('name', 'color_visualiser1');
        colorVisualiser1.style.background = ColorsValues[0];

        var colorVisualiser2 = document.createElement('span');
        colorVisualiser2.className = 'color-visualiser';
        colorVisualiser2.setAttribute('name', 'color_visualiser2');
        colorVisualiser2.style.background = ColorsValues[1];



        // create an array of div elements
        // -----------------
        var arrayBlock = [];
        for (var i = 0; i < 4; i++) {
            var block = $('<div>');
            block.attr('class', 'form-block');
            arrayBlock.push(block);
        }

        // add couples of elements
        // inside blocks
        arrayBlock[0].append(labelName);
        arrayBlock[0].append(inputName);

        arrayBlock[1].append(labelPassword);
        arrayBlock[1].append(inputPassword1);
        arrayBlock[1].append(inputPassword2);

        arrayBlock[2].append(labelEmail);
        arrayBlock[2].append(inputEmail);

        arrayBlock[3].append(labelColor1);
        arrayBlock[3].append(selectColor1);
        arrayBlock[3].append(colorVisualiser1);
        arrayBlock[3].append(selectColor2);
        arrayBlock[3].append(colorVisualiser2);

        for (var i = 0; i < arrayBlock.length; i++) {
            form.appendChild(arrayBlock[i][0]);
        }


        // change the form's style
        // -----------------------
        form.style.width = '100%';
        form.style.marginLeft = '0';

        $('.login-ui').css({
            width: '90%',
            margin: '0',
            textAlign: 'left',
        });
        $('.form').css({
            width: '90%',
            margin: '0'
        });
    }
    else {
        // if we asked for
        // LOGIN FORM
        // -----------------
        $('.login-ui').css({
            width: '50%',
            margin: 'auto',
            textAlign: 'center',
        });
        $('.form').css({
            width: '200px',
            margin: 'auto',
        });
    }

    // validation / cancel buttons
    // ----------------------
    var buttonSubmit = document.createElement('button');
    buttonSubmit.className = 'button-form';
    buttonSubmit.type = 'submit';
    buttonSubmit.setAttribute('function', 'enter');
    buttonSubmit.innerHTML = 'start';

    var buttonCancel = document.createElement('button');
    buttonCancel.className = 'button-form';
    buttonCancel.type = 'button';
    buttonCancel.setAttribute('function', 'cancel');
    buttonCancel.innerHTML = 'cancel';

    form.appendChild(buttonSubmit);
    form.appendChild(buttonCancel);


    return form;
}
