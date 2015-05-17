// ------------------
// GLOBALS.JS
// Globals variables
// ------------------
//
// A simple socket object
var socket = null;
// A simple connection socket object
var scheduleCo = null;
console.log("3DE");
// An array containing all SuperSquare object
var _SSBOX = [];

// Delete all super squares
function EmptySSBOX () {
	for (var i = 0; i < _SSBOX.length; i++) {
		$(_SSBOX[i].selector).off("mouseenter mouseleave click");
	}
	_SSBOX.remove(0, _SSBOX.length);
}
