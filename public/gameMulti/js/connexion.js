/****************************************************


Classe : Connexion

    La classe connexion est un module qui permet de réaliser les mêmes fonctionnalitées que la socket mais qui rajoute un évènement par défaut qui une fois liée au code coté server permettra d'avoir une réactivité au "Temps réel", c'est à dire maintenir une connexion au server.

Toutes les fonctions présentent font uniquement du Traitement.
***************************************************/
/*
    On rentre les informations relatives à la connexion, l'adresse du serveur "@adresse" et le port d'écoute "@port"
*/
function Connexion(port, adresse){

    this.port = port;
    this.address = adresse;

    /* la socket qui sera initialisé plus tard grâce à la fonction start */
    this.socket = null;

    /* liaison est la variable qui stockera l'évènement répété qui maintient les connexions */
    this.liaison = null;

    /* l'id de la socket de communication, qui sert aussi d'identification pour le server */
    this.idSocketOnServer = -1;

    /* la fréquence à laquelle le client met à jour son état coté serveur*/
    this.frequence = 5000;

    _myConnexion = this;


}

/*
 function start qui connect le client au server identifié par le port et l'adresse renseigné.

*/
Connexion.prototype.start = function(){
    this.socket = io.connect("http://"+this.address+":"+this.port);
};

/*
    on rajoute les listeners nécessaires au déroulement du jeu
*/
Connexion.prototype.listener = function(name, callback){

    this.socket.on(name,callback);
};


/*
    une fois la connexion au serveur établie précédement on peut lancer cette fonction qui périodiquement envoie un message au serveur pour lui signaler son activité .
*/
Connexion.prototype.listenToStartSession = function (){

    if(this.liaison === null && this.socket !== null){
         this.socket.on('startSync', function (idSocketOnServer) {
                        _myConnexion.idSocketOnServer = idSocketOnServer;
                        this.liaison = setInterval(function(){
                            _myConnexion.socket.emit('Sync');
                        }, _myConnexion.frequence);
        });
    }
};
