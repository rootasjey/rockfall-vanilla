// JAVASCRIPT FILE - SETTINGS.JS
// ROCKFALL
// --------------------------
// --------------------------

// global var : user
// --------
var _user = {
    'name': 'visitor',
    'password' : 'none',
    'email' : 'none',
    'logged' : false,
};


// Fire when settings icon is clicked
// remember(arg) = save the previous content
// --------------------------------
function click_settings(remember, name, password, email) {

    // save side panel's content
    var sidePanel = $('#side-panel');

    if(remember) {
        // if the variable is true,
        // it saves the content of the side-panel
        side_panel_main_content = sidePanel.html();
    }

    // empty side panel
    sidePanel.html('');

    // create & show settings
    $('<div>', {
        class: 'settings',
        html: "<h1>settings</h1>",

    }).appendTo('#side-panel');


    // create a settings form
    // ----------------------
    var form = null;
    if(name || password || email) {
        form = make_settings_form(name, password, email);
    }
    else form = make_settings_form();

    $('.settings').append(form);
    $('.settings').append("<br>");

    $('.settings').append("<div class='background-color-section'> <h2>background color</h2>" +
    "<div class='background-color' style='background-color: white;'></div>"+
    "<div class='background-color' style='background-color: #2c3e50;'></div>"+
    "</div>");

    // add sounds/music options
    // ----------
    $('<span>', {
        class: 'toggle',
        html: 'music: on',
    }).appendTo('.settings');
    $('<span>', {
        class: 'toggle',
        html: 'sounds: on',
    }).appendTo('.settings');


    // add back button to the side panel
    // ---------------------------------
    $('.settings').append("<img class='icon-back' src='/icons/icon_arrow.png'/>");


    // animation
    // ---------
    $('.settings').css({
        opacity: '0',
        marginLeft: '100px',
    }).animate({
        opacity: '1',
        marginLeft: '0',
    });


    // EVENTS
    // ------
    // add click events on background color
    // change the background
    // -------------------------------------
    $('.background-color').each(function() {
        $(this).click(function() {
            // get the color
            var color = $(this).css('background-color');

            // apply the color
            $('#container').css('background', color);
        });
    });


    // add events on labels
    // to edit informations
    // --------------------
    $('h2.edit-info').click(function() {
            var children = $('.settings').children();

            for (var i = 1; i < children.length; i++) {
                children[i].style.display = 'none';
            }

            // hide others form's contents
            $('#form_settings').css('display', 'block');
            $('span.edit-info').css('display', 'block');
            $('.color-visualiser').css('display', 'none');

            $('.label').css('display', 'none');
            $('#color1').css('display', 'none');
            $('#color2').css('display', 'none');

            // save button
            $('<div>', {
                class: 'button-rectangle',
                html: 'save'
            }).appendTo('.settings');
            // cancel button
            $('<div>', {
                class: 'button-rectangle',
                html: 'cancel'
            }).appendTo('.settings');

            $('.button-rectangle').click(function() {
                if($(this).html() === 'save') {
                    // save the content
                    var new_name = $("input[name='name']")[0].value;
                    var new_password = $("input[name='password']")[0].value;
                    var new_email = $("input[name='email']")[0].value;
                }

                click_settings(false, new_name, new_password, new_email);

            })
        });


    // Edit single info
    // (name, password, email)
    $('span.edit-info').click(function() {
        // get labels and compare inputs' style
        var label = $(this)[0];
        var input = label.nextElementSibling;

        if(getComputedStyle(input, null).display != 'block') {
            input.style.display = 'block';

            if(input.name === 'old_password') {
                // show 2 fieds for passwords
                $("input[name='password']").css('display', 'block');
            }
        }
        else {
            // this input is already displayed
            // so we hide it
            input.style.display = 'none';
            if(input.name === 'old_password') {
                $("input[name='password']").css('display', 'none');
            }
        }


    });

    $('.toggle').click(function() {
        var toggle = $(this);
        toggle.html(toggle.html().toggleStr('on', 'off'));
    });


    // add events on select
    // to update colors visualisers
    // when a different color is selected
    $('#color1').change(function() {
        update_color_visualiser(1);
    });
    $('#color2').change(function() {
        update_color_visualiser(2);
    });


    // add click event on back button
    // > save preferences
    // ------------------------------
    $('.icon-back').click(function() {
        // remplace the html content of side-panel
        // and add events on icons
        sidePanel.html(side_panel_main_content);
        load_side_panel();

        // save user's settings
        save_settings();
    });
}


// Create a settings form
// ----------------------------
function make_settings_form(name, password, email) {
    var form = document.createElement('form');
    form.title = 'form_settings';
    form.id = 'form_settings';

    var title_edit_ids = document.createElement('h2');
    title_edit_ids.className ='edit-info';
    title_edit_ids.innerHTML = "user info <span class='edit-button'>edit</span>";


    // labels
    // ------
    var label_name = document.createElement('span');
    label_name.className = 'edit-info';
    label_name.name = 'name-title';
    label_name.innerHTML = "<br> Name <span class='edit-button'>edit</span> <br>";

    var label_password = document.createElement('span');
    label_password.className = 'edit-info';
    label_password.name = 'password-title';
    label_password.innerHTML = "Password <span class='edit-button'>edit</span> <br>";

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


    // inputs
    // ------
    var input_name = document.createElement('input');
    input_name.type = 'text';
    input_name.name = 'name';
    input_name.placeholder = 'Enter your new name';

    var input_password_old = document.createElement('input');
    input_password_old.type = 'text';
    input_password_old.name = 'old_password';
    input_password_old.placeholder = 'Enter your old password';

    var input_password = document.createElement('input');
    input_password.type = 'text';
    input_password.name = 'password';
    input_password.placeholder = 'Enter your new password';

    var input_email = document.createElement('input');
    input_email.type = 'text';
    input_email.name = 'email';
    input_email.placeholder = 'Enter your new mail';


    // selects
    // -------
    var select_color1 = document.createElement('select');
    select_color1.form = 'form_settings';
    select_color1.name = 'color1';
    select_color1.id = 'color1';

    var select_color2 = document.createElement('select');
    select_color2.form = 'form_settings';
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
        // var option = document.createElement('option');
        // option.value = array_colors_values[i];
        // option.innerHTML = array_colors_names[i];
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

    // add elements to the form
    // form's title
    form.appendChild(title_edit_ids);

    // labels + inputs
    form.appendChild(label_name);
    form.appendChild(input_name);

    form.appendChild(label_password);
    form.appendChild(input_password_old);
    form.appendChild(input_password);

    form.appendChild(label_email);
    form.appendChild(input_email);

    form.appendChild(label_color1);
    form.appendChild(select_color1);
    form.appendChild(color_visualiser1);

    form.appendChild(label_color2);
    form.appendChild(select_color2);
    form.appendChild(color_visualiser2);

    // fill name, email, password
    // if available
    if(name) label_name.innerHTML = label_name.innerHTML.replace('Name', name);
    if(password) label_password.innerHTML = label_password.innerHTML.replace('Password', password);
    if(email) label_email.innerHTML = label_email.innerHTML.replace('Email', email);

    // return the form
    return form;
}


// Update the color visualisers
// ----------------------------
function update_color_visualiser(number) {
    // get the color value
    // -----------------------------------------
    var color = $('#color'+ number)[0].value;
    var n = (number % 2) + 1; // find the other #color(1/2) number

    // test if the two prefered colors
    // are diffrents
    // ---------------------------------------
    if(color == $('#color'+ n)[0].value) {
        // console.log('same color');
        // if the two colors are the same
        // we select the next color in the list
        var select_color = $('#color' + number)[0];

        // get the selected index, and go to the next one
        var index  = select_color.selectedIndex;
        index += 1;
        index = index % 12;
        select_color.selectedIndex = index;

        // now update the color visualiser
        var color_visualiser = $(".color-visualiser[name='color_visualiser" + number + "']");
        color_visualiser.css('background-color', select_color[index].value);
    }
    else {
        $(".color-visualiser[name='color_visualiser" + number + "']").css('background-color', color);
    }
}


// Save user's settings
// --------------------
function save_settings() {
    // send to the server
    // create a ajax request
    // get the form inputs
}


// EVENTS
// ------

// Hide/Show #header & #footer
// --------------------
function fullscreen() {
    // add click event on the image
    $('.icon-fullscreen').click(function() {
        if ($('#header-top').css('height') == '120px') {
            // reduce the #header & #footer
            $('#header-top').css('height', '0');

            // rotate the image icon
            $('.icon-fullscreen').css('-webkit-transform', 'rotate(180deg)');
            $('.icon-fullscreen').css('-moz-transform', 'rotate(180deg)');
            $('.icon-fullscreen').css('-ms-transform', 'rotate(180deg)');
            $('.icon-fullscreen').css('-o-transform', 'rotate(180deg)');
            $('.icon-fullscreen').css('transform', 'rotate(180deg)');
        }
        else {
            // expend the #header & #footer
            $('#header-top').css('height','120px');

            // rotate the image icon
            $('.icon-fullscreen').css('-webkit-transform', 'rotate(0deg)');
            $('.icon-fullscreen').css('-moz-transform', 'rotate(0deg)');
            $('.icon-fullscreen').css('-ms-transform', 'rotate(0deg)');
            $('.icon-fullscreen').css('-o-transform', 'rotate(0deg)');
            $('.icon-fullscreen').css('transform', 'rotate(0deg)');
        }
    });
}

// Auto Fullscreen
// ---------------
function auto_fullscreen() {
    // Auto-hide
    if ($('#header-top').css('height') == '120px') {
        // reduce the #header & #footer
        $('#header-top').css('height', '0');

        // rotate the image icon
        $('.icon-fullscreen').css('-webkit-transform', 'rotate(180deg)');
        $('.icon-fullscreen').css('-moz-transform', 'rotate(180deg)');
        $('.icon-fullscreen').css('-ms-transform', 'rotate(180deg)');
        $('.icon-fullscreen').css('-o-transform', 'rotate(180deg)');
        $('.icon-fullscreen').css('transform', 'rotate(180deg)');
    }
}

// PROTOTYPES
// ----------
String.prototype.toggleStr = function(str1, str2) {
    if(this.indexOf(str1) !== -1) {
        return this.replace(str1, str2);
    }
    else if (this.indexOf(str2) !== -1) {
        return this.replace(str2, str1);
    }
};
