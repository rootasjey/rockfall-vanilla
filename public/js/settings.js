// JAVASCRIPT FILE - SETTINGS.JS
// ROCKFALL
// --------------------------
// --------------------------


// Fire when settings icon is clicked
// ------------------------
function click_settings() {

    // save side panel's content
    var sidePanel = $('#side-panel');
    sidePanelMainContent = sidePanel.html();

    // empty side panel
    sidePanel.html('');

    // create & show settings
    $('<div>', {
        class: 'settings',
        html: "<h1>settings</h1>" +
              "<div> <h2>background color</h2>" +
              "<div class='background-color' style='background-color: white;'></div>"+
              "<div class='background-color' style='background-color: #2c3e50;'></div>"+
              "</div>",

    }).appendTo('#side-panel');


    // create a settings form
    // ----------------------
    var form = make_settings_form();
    $('.settings').append(form);


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
    // to edit information
    $('.edit-info').click(function() {
        // get labels and compare inputs' style
        var label = $(this)[0];
        var input = label.nextElementSibling;

        if(getComputedStyle(input, null).display != 'block') {
            input.style.display = 'block';
        } else input.style.display = 'none';
    });

    $('.toggle').click(function() {
        var toggle = $(this);
        toggle.html(toggle.html().toggleStr('on', 'off'));
        // toggle.html().toggleStr('on', 'off');
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
        sidePanel.html(sidePanelMainContent);
        events_sidePanelIcons();

        // save user's settings
        save_settings();
    });
}


// Create a settings form
// ----------------------------
function make_settings_form() {
    var form = document.createElement('form');
    form.title = 'form_settings';
    form.id = 'form_settings';

    var label_formTitle = document.createElement('span');
    label_formTitle.innerHTML = '<h2>user info</h2>';


    // labels
    // ------
    var label_name = document.createElement('span');
    label_name.className = 'edit-info';
    label_name.innerHTML = "Name <span class='edit-button'>edit</span> <br>";

    var label_password = document.createElement('span');
    label_password.className = 'edit-info';
    label_password.innerHTML = "Password <span class='edit-button'>edit</span> <br>";

    var label_email = document.createElement('span');
    label_email.className = 'edit-info';
    label_email.innerHTML = "Email <span class='edit-button'>edit</span> <br>";

    var label_color1 = document.createElement('span');
    label_color1.innerHTML = "<br>First class color<br>";

    var label_color2 = document.createElement('span');
    label_color2.innerHTML = "<br>Second class color<br>";


    // inputs
    // ------
    var input_name = document.createElement('input');
    input_name.type = 'text';
    input_name.name = 'name';
    input_name.placeholder = '';

    var input_password = document.createElement('input');
    input_password.type = 'text';
    input_password.name = 'password';
    input_password.placeholder = '';

    var input_email = document.createElement('input');
    input_email.type = 'text';
    input_email.name = 'email';
    input_email.placeholder = '';


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
    form.appendChild(label_formTitle);
    // labels + inputs
    form.appendChild(label_name);
    form.appendChild(input_name);
    form.appendChild(label_password);
    form.appendChild(input_password);
    form.appendChild(label_email);
    form.appendChild(input_email);

    form.appendChild(label_color1);
    form.appendChild(select_color1);
    form.appendChild(color_visualiser1);

    form.appendChild(label_color2);
    form.appendChild(select_color2);
    form.appendChild(color_visualiser2);


    // return the form
    return form;
}


// Update the color visualisers
// ----------------------------
function update_color_visualiser(number) {
    // get the color value
    var color = $('#color'+ number).attr('value');

    var n = (number % 2) + 1; // find the other #color(1/2) number

    // test that the two prefered colors
    // are diffrents
    if(color == $('#color'+ n).attr('value')) {
        // if the two colors are the same
        // we select the next color in the list
        var select_color = $('#color' + number)[0];

        // get the selected index, and go to the next one
        var index  = select_color.selectedIndex;
        index += 1;
        select_color.selectedIndex = index % 12;

        // noew update the color visualiser
        $(".color-visualiser[name='color_visualiser" + number + "']")
            .css('background', $('#color'+ number).attr('value'));
    }
    else $(".color-visualiser[name='color_visualiser" + number + "']").css('background', color);
}


// Save user's settings
// --------------------
function save_settings() {
    // send to the server
    // create a ajax request
    // get the form inputs
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
