// -------------
// MESSAGE CLASS
// -------------
var _ID = 0;

function GetID() {
    return _ID++;
}
// Clase's constructor
// -------------------
function Message(type, expeditor, body) {
    this.id         = GetID();
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
