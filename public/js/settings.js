// ----------------------------
// SETTINGS.JS (ROCKFALL)
// ----------------------------
// This file contains game's
// settings
// ----------------------------
// ----------------------------

var _settings = null;

// Fire when settings icon is clicked
// remember(arg) = save the previous content
// --------------------------------
function ClickSettings(remember, name, password, email) {

    // save side panel's content
    var sidepanel = $('#side-panel');

    // if(remember) {
    //     // if the variable is true,
    //     // it saves the content of the side-panel
    //     sidePanelMainContent = sidepanel.html();
    // }
    if(sidePanelMainContent === null) {
        sidePanelMainContent = $('#side-panel-main-content');
    }


    // empty side panel
    sidepanel.html('');

    if(_settings === null) {
      // create & show settings
      _settings = $('<div>', {
          class: 'settings',
          html: "<h1>settings</h1>",

      }).appendTo('#side-panel');

      // create a settings form
      // ----------------------
      var form = null;
      form = CreateFormSettings();
      // if(name || password || email) {
      //     form = CreateFormSettings(name, password, email);
      // }
      // else form = CreateFormSettings();

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
    }
    else {
      sidepanel.append(_settings);
    }


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
            $('#form_settings').css({
				display: 'block',
				opacity: '0',
			}).animate({
				opacity: '1',
			});
            $('span.edit-info').css({
				display: 'block',
				opacity: '0',
			}).animate({
				opacity: '1',
			});

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

			// BUTTONS ANIMATIONS
			$('.button-rectangle').css({
				opacity: '0',
			}).animate({
				opacity: '0.5',
			});


            $('.button-rectangle').click(function() {
                if($(this).html() === 'save') {
                    // save the content
                    // var new_name = $("input[name='name']")[0].value;
                    // var new_password = $("input[name='password']")[0].value;
                    // var new_email = $("input[name='email']")[0].value;
                }

                $('.settings').children().each(function() {
                    $(this).fadeIn();
                });

				$('#form_settings').css({
					opacity: '0'
				}).animate({
					opacity: '1'
				});

                $('span.edit-info').css('display', 'none');
                $('.button-rectangle').css('display', 'none');
                $('.color-visualiser').css('display', 'inline-block');
                $('.label').css('display', 'block');
                $('#color1').css('display', 'inline-block');
                $('#color2').css('display', 'inline-block');
            });

			$('.button-rectangle').hover(function(){
				$(this).css({
					opacity: '0.5',
				}).animate({
					opacity: '1',
				}, 20);
			}, function() {
				$(this).css({
					opacity: '1',
				}).animate({
					opacity: '0.5',
				}, 20);
			});
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
        UpdateColorVisualiser(1);
    });
    $('#color2').change(function() {
        UpdateColorVisualiser(2);
    });


    // add click event on back button
    // > save preferences
    // ------------------------------
    $('.icon-back').click(function() {
        AnimateOutSettings();

        Delay(function () {
            AnimateInSidePanelMainContent();
            LoadSidePanel();
        });

        // save user's settings
        SaveSettings();
    });

    AnimateInSettings();
}


// Create a settings form
// ----------------------------
function CreateFormSettings(name, password, email) {
    var form = document.createElement('form');
    form.title = 'form_settings';
    form.id = 'form_settings';

    var editButton = document.createElement('h2');
    editButton.className ='edit-info';
    editButton.innerHTML = "user info <span class='edit-button'>edit</span>";


    // labels
    // ------
    var labelName = document.createElement('span');
    labelName.className = 'edit-info';
    labelName.name = 'name-title';
    labelName.innerHTML = "<br> Name <span class='edit-button'>edit</span> <br>";

    var labelPassword = document.createElement('span');
    labelPassword.className = 'edit-info';
    labelPassword.name = 'password-title';
    labelPassword.innerHTML = "Password <span class='edit-button'>edit</span> <br>";

    var labelEmail = document.createElement('span');
    labelEmail.className = 'edit-info';
    labelEmail.name = 'email-title';
    labelEmail.innerHTML = "Email <span class='edit-button'>edit</span> <br>";

    var labelColor1 = document.createElement('span');
    labelColor1.className = 'label';
    labelColor1.innerHTML = "<br>First class color<br>";

    var labelColor2 = document.createElement('span');
    labelColor2.className = 'label';
    labelColor2.innerHTML = "<br>Second class color<br>";


    // inputs
    // ------
    var inputName = document.createElement('input');
    inputName.type = 'text';
    inputName.name = 'name';
    inputName.placeholder = 'Enter your new name';

    var inputPasswordOld = document.createElement('input');
    inputPasswordOld.type = 'text';
    inputPasswordOld.name = 'old_password';
    inputPasswordOld.placeholder = 'Enter your old password';

    var inputPassword = document.createElement('input');
    inputPassword.type = 'text';
    inputPassword.name = 'password';
    inputPassword.placeholder = 'Enter your new password';

    var inputEmail = document.createElement('input');
    inputEmail.type = 'text';
    inputEmail.name = 'email';
    inputEmail.placeholder = 'Enter your new mail';


    // selects
    // -------
    var selectColor1 = document.createElement('select');
    selectColor1.form = 'form_settings';
    selectColor1.name = 'color1';
    selectColor1.id = 'color1';

    var selectColor2 = document.createElement('select');
    selectColor2.form = 'form_settings';
    selectColor2.name = 'color2';
    selectColor2.id = 'color2';


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

        selectColor1.appendChild(option[0]);
        selectColor2.appendChild(o[0]);
    }


    // colors visualisers
    var colorVisualiser1 = document.createElement('span');
    colorVisualiser1.className = 'color-visualiser';
    colorVisualiser1.setAttribute('name', 'color_visualiser1');
    colorVisualiser1.style.background = array_colors_values[0];

    var colorVisualiser2 = document.createElement('span');
    colorVisualiser2.className = 'color-visualiser';
    colorVisualiser2.setAttribute('name', 'color_visualiser2');
    colorVisualiser2.style.background = array_colors_values[1];

    // add elements to the form
    // form's title
    form.appendChild(editButton);

    // labels + inputs
    form.appendChild(labelName);
    form.appendChild(inputName);

    form.appendChild(labelPassword);
    form.appendChild(inputPasswordOld);
    form.appendChild(inputPassword);

    form.appendChild(labelEmail);
    form.appendChild(inputEmail);

    form.appendChild(labelColor1);
    form.appendChild(selectColor1);
    form.appendChild(colorVisualiser1);

    form.appendChild(labelColor2);
    form.appendChild(selectColor2);
    form.appendChild(colorVisualiser2);

    // fill name, email, password
    // if available
    if(name) labelName.innerHTML = labelName.innerHTML.replace('Name', name);
    if(password) labelPassword.innerHTML = labelPassword.innerHTML.replace('Password', password);
    if(email) labelEmail.innerHTML = labelEmail.innerHTML.replace('Email', email);

    // return the form
    return form;
}


// Update the color visualisers
// ----------------------------
function UpdateColorVisualiser(number) {
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
        var selectColor = $('#color' + number)[0];

        // get the selected index, and go to the next one
        var index  = selectColor.selectedIndex;
        index += 1;
        index = index % 12;
        selectColor.selectedIndex = index;

        // now update the color visualiser
        var colorVisualiser = $(".color-visualiser[name='color_visualiser" + number + "']");
        colorVisualiser.css('background-color', selectColor[index].value);
    }
    else {
        $(".color-visualiser[name='color_visualiser" + number + "']").css('background-color', color);
    }
}


// Save user's settings
// --------------------
function SaveSettings() {
    // send to the server
    // create a ajax request
    // get the form inputs
}


// EVENTS
// ------

// Hide/Show #header & #footer
// --------------------
function Fullscreen() {
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
function AutoFullscreen() {
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
