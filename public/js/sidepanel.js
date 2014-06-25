// JAVASCRIPT FILE - SIDEPANEL.JS
// ROCKFALL
// --------------------------
// --------------------------


// initial side-panel's content
// ---------------------------
var side_panel_main_content = null;
var login_ui = null;

function load_side_panel() {
    events_side_panel_icons();
    show_login_ui();
}

// Add click events on icons' side-panel
// -------------------------------
function events_side_panel_icons() {
    $('.user-panel-icon').each(function() {
        $(this).click(function() {
            var action = $(this).attr('action');

            if (action === 'settings') {
              anime_sidebar();
              delay(click_settings);
              // click_settings(true);
            }

            else if (action === 'message') {
              anime_sidebar();
              delay(click_notifications);
            }

            else if (action === 'trophy') {

            }
        });
    });
}

function delay(func, options) {
  window.setTimeout( function() {
    func(options);
  }, 500);
}

function show_login_ui() {
    $('.user-avatar').click(function () {
        if(login_ui === null) {
            login_ui = $('<div>');
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

            $('#game-panel').append(login_ui);
        }

		
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

            // events on login/signup form's button
            // >action: back to login/signup ui
            $(".button[function='cancel']").click(function () {
                $(this).off('click');
                // show connexion/cancel/signup buttons
                $(".button").css('display', 'inline-block');
                $('.form').remove();
				
				
				// ANIMATIONS
				$('#game-panel').css({
					opacity: '0',
				}).animate({
					opacity: '1',
				});
            });
			
			// ANIMATION
			$('#form_login').css({
				opacity: '0',
			}).animate({
				opacity: '1',
			});
        });

        $(".button[function='signup']").click(function () {
            // hide connexion/cancel/signup buttons
            $(".button").css('display', 'none');

            // create login form
            var form = make_form('signup');
            $('.login-ui').append(form);

            // // change the style of edit-info
            $('.edit-info').css('display', 'inline-block');
            $('input').css('display', 'inline-block');

            // add events on select
            // to update colors visualisers
            // when a different color is selected
            $('#color1').change(function() {
                update_color_visualiser(1);
            });
            $('#color2').change(function() {
                update_color_visualiser(2);
            });

            // events on login/signup form's button
            // >action: back to login/signup ui
            $(".button[function='cancel']").click(function () {
                $(this).off('click');
                // show connexion/cancel/signup buttons
                $(".button").css('display', 'inline-block');
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
            });
			// ANIMATIONS
			$('#form_signup').css({
				opacity: '0',
			}).animate({
				opacity: '1',
			});
        });


        // event on login/signup ui
        // >action: back to the game
        $(".button[function='cancel']").click(function () {
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
			delay(function() {
				$('#canvas').css('display', 'block');
			});
            
            $(this).off('click');
            $(".button[function='login']").off('click');
            $(".button[function='signup']").off('click');
        });
    });
}

function make_form(type) {

    var form = document.createElement('form');
    form.title = 'form_' + type;
    form.className = 'form';
    form.id = 'form_' + type;

    var title_edit_ids = document.createElement('h2');
    if(type === 'login')
        title_edit_ids.innerHTML = "LOGGIN";
    else
        title_edit_ids.innerHTML = "SIGNUP";


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
    input_password1.name = 'password1';
    input_password1.placeholder = 'Enter your password';



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
        var input_password2 = document.createElement('input');
        input_password2.type = 'text';
        input_password2.name = 'password';
        input_password2.placeholder = 'Re-Enter your password';

        var input_email = document.createElement('input');
        input_email.type = 'text';
        input_email.name = 'email';
        input_email.placeholder = 'Enter your mail';


        var label_email = document.createElement('span');
        label_email.className = 'edit-info';
        label_email.name = 'email-title';
        label_email.innerHTML = "Email";

        var label_color1 = document.createElement('span');
        label_color1.className = 'label';
        label_color1.innerHTML = "Favorites colors  ";


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


        // change the form's style
        input_name.style.marginLeft = '10px';
        input_password1.style.marginLeft = '10px';
        input_password2.style.marginLeft = '10px';
        input_email.style.marginLeft = '10px';
        select_color1.style.marginLeft = '10px';
        select_color2.style.marginLeft = '10px';

        // create an array of div elements
        // -----------------
        var array_block = [];
        for (var i = 0; i < 4; i++) {
            var block = $('<div>');
            block.attr('class', 'form-block');
            array_block.push(block);
        }

        // add couples of elements
        // inside blocks
        array_block[0].append(label_name);
        array_block[0].append(input_name);

        array_block[1].append(label_password);
        array_block[1].append(input_password1);
        array_block[1].append(input_password2);

        array_block[2].append(label_email);
        array_block[2].append(input_email);

        array_block[3].append(label_color1);
        array_block[3].append(select_color1);
        array_block[3].append(color_visualiser1);
        array_block[3].append(select_color2);
        array_block[3].append(color_visualiser2);

        for (var i = 0; i < array_block.length; i++) {
            form.appendChild(array_block[i][0]);
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

        return form;
    }
    else {
        // if we asked for login form
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



function anime_sidebar() {
  $('#side-panel-main-content').css({
    opacity: '1',
    marginLeft: '0',
  }).animate({
    opacity: '0',
    marginLeft: '100px',
  })
}
