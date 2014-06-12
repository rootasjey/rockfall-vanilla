// JAVASCRIPT FILE - SIDEPANEL.JS
// ROCKFALL
// --------------------------
// --------------------------


// initial side-panel's content
// ---------------------------
var sidePanelMainContent = '';

function load_side_panel() {
    events_sidePanelIcons();
    show_login_ui();
}

// Add click events on icons' side-panel
// -------------------------------
function events_sidePanelIcons() {
    $('.user-panel-icon').each(function() {
        $(this).click(function() {
            var action = $(this).attr('action');

            if (action === 'settings') {
                click_settings(true);
            }

            else if (action === 'message') {
                click_notifications();
            }

            else if (action === 'trophy') {

            }
        });
    });
}

function show_login_ui() {
    $('.user-avatar').click(function () {
        if(($('#game-panel').html() === '') || ($('#game-panel').html().length < 1)) {
            var login_ui = $('<div>');
            login_ui.addClass('login-ui');

            login_ui.append('<span>You can connect to play online and save your personal settings.</span> <br> <br>');

            var button_login = $('<div>');
            button_login.addClass('button');
            button_login.attr('function', 'login');
            button_login.html("connexion");

            var button_logout = $('<div>');
            button_logout.addClass('button');
            button_logout.attr('function', 'logout');
            button_logout.html('logout');

            var button_cancel = $('<div>');
            button_cancel.addClass('button');
            button_cancel.attr('function', 'cancel');
            button_cancel.html('cancel');

            var button_signup = $('<div>');
            button_signup.addClass('button');
            button_signup.attr('function', 'signup');
            button_signup.html('signup');
            button_signup.css('width', '80%');

            login_ui.append(button_login);
            login_ui.append(button_cancel);
            login_ui.append(button_signup);

            // var game_board = $('#game-ui');

            // $('#game-ui').html('');
            $('#game-panel').append(login_ui);
        }
        $('#game-panel').css('display', 'block');
        $('#canvas').css('display', 'none');

        // EVENTS
        // ------
        $(".button[function='login']").click(function () {
            // unbound the click event
    		// > avoid having multiple
    		// > events on the same button
    		// $(this).off('click');

            // hide connexion/cancel/signup buttons
            $(".button").css('display', 'none');

            // create login form
            var form = make_form('login');
            $('.login-ui').append(form);

            // events on form's button
            $(".button[function='cancel']").click(function () {
                $(this).off('click');
                // show connexion/cancel/signup buttons
                $(".button").css('display', 'inline-block');
                $('.form').remove();
            });
        });


        $(".button[function='cancel']").click(function () {
            $('#game-panel').css('display', 'none');
            $('#canvas').css('display', 'block');
            $(this).off('click');

            $(".button[function='login']").off('click');
        });

        $(".button[function='signup']").click(function () {
            $(this).off('click');
        });
    });
}

function make_form(type) {

    var form = document.createElement('form');
    form.title = 'form_' + type;
    form.className = 'form';
    form.id = 'form_' + type;

    var title_edit_ids = document.createElement('h2');
    // title_edit_ids.className ='edit-info';
    title_edit_ids.innerHTML = "LOGGIN";


    // labels
    // ------
    var label_name = document.createElement('span');
    label_name.className = 'edit-info';
    label_name.name = 'name-title';
    label_name.innerHTML = "Login/Name";

    var label_password = document.createElement('span');
    label_password.className = 'edit-info';
    label_password.name = 'password-title';
    label_password.innerHTML = "Password ";


    // inputs
    // ------
    var input_name = document.createElement('input');
    input_name.type = 'text';
    input_name.name = 'name';
    input_name.placeholder = 'Enter your new name';

    var input_password1 = document.createElement('input');
    input_password1.type = 'text';
    input_password1.name = 'old_password';
    input_password1.placeholder = 'Enter your old password';



    // add elements to the form
    // form's title
    form.appendChild(title_edit_ids);

    // labels + inputs
    form.appendChild(label_name);
    form.appendChild(input_name);

    form.appendChild(label_password);
    form.appendChild(input_password1);


    // Add these extra inputs
    // if signup,
    if(type === 'signup') {
        var label_email = document.createElement('span');
        label_email.className = 'edit-info';
        label_email.name = 'email-title';
        label_email.innerHTML = "Email <span class='edit-button'>edit</span> <br>";

        var label_color1 = document.createElement('span');
        label_color1.className = 'label';
        label_color1.innerHTML = "<br>First class color<br>";

        var label_color2 = document.createElement('span');
        label_color2.className = 'label';
        label_color2.innerHTML = "<br>Second class color<br>";

        var input_password2 = document.createElement('input');
        input_password2.type = 'text';
        input_password2.name = 'password';
        input_password2.placeholder = 'Enter your new password';

        var input_email = document.createElement('input');
        input_email.type = 'text';
        input_email.name = 'email';
        input_email.placeholder = 'Enter your new mail';

        // selects
        // -------
        var select_color1 = document.createElement('select');
        select_color1.form = 'form_' + type;
        select_color1.name = 'color1';
        select_color1.id = 'color1';

        var select_color2 = document.createElement('select');
        select_color2.form = 'form_' + type;
        select_color2.name = 'color2';
        select_color2.id = 'color2';


        // array of colors values
        var array_colors_values =
            ['#c0392b', '#3498db', '#f1c40f',
            '#2ecc71','#34495e','#8e44ad',
            '#bdc3c7','#19B5FE','#e67e22',
            '#049372','#67809F','#1F3A93'];

        // array of colors names
        var array_colors_names =
            ['Pomegranate','Peter Silver','Sun Flower',
            'Emerald','Wet Asphalt','Wisteria',
            'Silver','Dodger Blue','Carrot',
            'Observatory','Hoki','Jacksons'];

        // add colors to the select element
        for (var i = 0; i < array_colors_values.length; i++) {
            var option = $('<option>', {
                value: array_colors_values[i],
                html: array_colors_names[i],
            });
            var o = option.clone();

            if(i==1) o[0].setAttribute('selected', 'true');

            select_color1.appendChild(option[0]);
            select_color2.appendChild(o[0]);
        }


        // colors visualisers
        var color_visualiser1 = document.createElement('span');
        color_visualiser1.className = 'color-visualiser';
        color_visualiser1.setAttribute('name', 'color_visualiser1');
        color_visualiser1.style.background = array_colors_values[0];

        var color_visualiser2 = document.createElement('span');
        color_visualiser2.className = 'color-visualiser';
        color_visualiser2.setAttribute('name', 'color_visualiser2');
        color_visualiser2.style.background = array_colors_values[1];

        // re-enter password
        form.appendChild(input_password2);

        // mail
        form.appendChild(label_email);
        form.appendChild(input_email);

        // prefered color 1
        form.appendChild(label_color1);
        form.appendChild(select_color1);
        form.appendChild(color_visualiser1);

        // prefered color 2
        form.appendChild(label_color2);
        form.appendChild(select_color2);
        form.appendChild(color_visualiser2);
    }

    var button_go = $('<div>');
    button_go.addClass('button');
    button_go.attr('function', 'go');
    button_go.html('go');

    var button_cancel = $('<div>');
    button_cancel.addClass('button');
    button_cancel.attr('function', 'cancel');
    button_cancel.html('cancel');

    form.appendChild(button_go[0]);
    form.appendChild(button_cancel[0]);

    // return the form
    return form;
}


function anime_rollup_main_sidebar() {
    $('.user-avatar').slideUp();
    $('.power-up-panel').slideUp();
    $('.user-score').slideUp();
    $('.user-panel').slideUp();
}
