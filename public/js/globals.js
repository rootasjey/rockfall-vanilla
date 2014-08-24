// ------------------
// GLOBALS.JS
// Globals variables
// ------------------

// Allow to cancel the messageGlow's setInterval
var _messageGlowID = null;

var socket = null;
var scheduleCo = null;

// User's mail box
var _box = {
    "count"             : 0,
    "page"              : 0,
    "maxPages"          : 0,
    "messagesPerPage"   : 6,
    "messages"          : [],
};

// User's settings
var _settings = {
    "autoEndTurn"   : false,
    "background"    : "shattered.png",
}
