// ------------------
// GLOBALS.JS
// Globals variables
// ------------------

//var socket = null;
//var scheduleCo = null;



// An array containing all SuperSquare object
var _SSBOX = [];

//Identifiant de la partie du joueur
var idParty = null;


//-------------------
//Globals Function
//-------------------


/* 
    La fonction getMouse retourne la position en x et en y de la souris sur l'élément canvas en fesant attention aux propriétées tel que le border, margin, etc. 
*/

function getMouse(e,canvas) {

    /* This complicates things a little but but fixes mouse co-ordinate problems
	 when there's a border or padding.*/
    var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
    if (document.defaultView && document.defaultView.getComputedStyle) {
        stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
        stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
        styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
        styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
    }
    /* Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
   They will mess up mouse coordinates and this fixes that */
    var html = document.body.parentNode;
    htmlTop = html.offsetTop;
    htmlLeft = html.offsetLeft;


    var element = canvas, offsetX = 0, offsetY = 0, mx, my;

    /* Compute the total offset*/
    if (element.offsetParent !== undefined) {
        do {
            offsetX += element.offsetLeft;
            offsetY += element.offsetTop;
        } while ((element = element.offsetParent));
    }

    /* Add padding and border style widths to offset
   Also add the <html> offsets in case there's a position:fixed bar*/
    offsetX += stylePaddingLeft + styleBorderLeft + htmlLeft;
    offsetY += stylePaddingTop + styleBorderTop + htmlTop;

    mx = e.pageX - offsetX;
    my = e.pageY - offsetY;

    /* We return a simple javascript object (a hash) with x and y defined*/
    return {x: mx, y: my};

}


/* 
    Fonction qui permet d'écrire sur le context d'un canvas, avec comme paramètre
    le context en question "@ctx", le message qu'on souhaite afficher "@message", la couleur
    du message "@color", la position en x et y sur le canvas "@x","@y" ainsi que la profondeur
    du message ( donné un effet 3D ) "@dpth"
*/

function writeMessage (ctx, message, color, x, y, dpth){
    var cnt;

    ctx.shadowBlur = 4;


    ctx.fillStyle = color;

    for(cnt = 0;cnt < dpth;cnt++){
        ctx.fillText(message, x - cnt, y - cnt);
    }


    ctx.shadowColor = "black";
    ctx.shadowBlur = 4;
}

/*la fonction qui charge toutes les images et une fois terminé qui lance la fonction callback*/
function loadImages(sources, callback) {

    var images = {};
    var loadedImages = 0;
    var numImages = 0;

    for(var src in sources) {
        numImages++;
    }
    for(var src in sources) {
        images[src] = new Image();
        images[src].onload = function() {
            if(++loadedImages >= numImages) {
                callback(images);
            }
        };
        images[src].src = sources[src];
    }
}