// -------------
// MESSAGE CLASS
// -------------
var _messageID = 0;

function GetNextMessageId() {
    return _messageID++;
}
// Clase's constructor
// -------------------
function Message(type, expeditor, body) {
    this.id         = GetNextMessageId();
    this.type       = type;
    this.date       = new Date();
    this.expeditor  = expeditor;
    this.body       = body;
}

// Prototype methods
// -----------------
Message.prototype.getType = function () {
    return this.type.toString();
};
