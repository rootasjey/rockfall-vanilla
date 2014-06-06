// JAVASCRIPT FILE
// ROCKFALL
// ---------------
var sidePanelMainContent = '';


// When the page is loaded
window.onload = function () {
    $('.user-panel-icon').each(function() {
        $(this).click(function() {
            var action = $(this).attr('action');

            // console.log(action);
            if (action === 'settings') {
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
                          "</div>" +
                          "<img class='icon-back' src='/icons/icon_arrow.png'/>",
                })
                .appendTo('#side-panel');

                // add click event on back button
                $('.icon-back').click(function() {
                    sidePanel.html('');
                    sidePanel.html(sidePanelMainContent);
                })
            }

            else if (action === 'message') {

            }

            else if (action === 'trophy') {

            }
        })
    })
};
