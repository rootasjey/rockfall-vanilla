
var Personne = function(id, pseudo){

    this.id = id;
    this.pseudo = pseudo;
    this.propriete = "personne";
    return this;
}

var Client = function(id, pseudo, socket, time){

    Personne.call(this, id, pseudo);
    this.socket = socket;
    this.timeLife = time;
    this.almostLeave = false;
    this.propriete = "personne";
}

Client.prototype = Object.create(Personne.prototype);

module.exports.Personne = Personne;
module.exports.Client = Client;

var Tableau = function() {

    /*-- Tableau qui contient les informations du joueur --*/
    this.element = new Array();

    /*-- fonction supprimer qui supprime un joueur selon son id --*/
    (function () { 
        this.supprimer = function (idJoueur) {
            var element = null;
            var i = 0;
            while(i<this.element.length && element == null){
                if(this.element[i].id == idJoueur){
                    element = this.element[i];
                    this.element.splice(i,1);
                }
                i++;
            }
            return element;
        } 
    }).call(this);

    /*-- fonction supprimer qui supprime un joueur selon son id --*/
    (function () { 
        this.exist = function (newElement) {
            var is_exist = false;
            for(var i =0; i<this.element.length;i++){
                if(this.element[i].id == newElement.id){
                    is_exist = true;
                }
            }
            return is_exist;
        } 
    }).call(this);

    /*-- fonction ajout qui ajoute une nouvelle élément --*/
    (function () { 
        this.ajout = function (newElement) {
            var valide = false;
            if(newElement.propriete == (new Personne()).propriete && !this.exist(newElement)){
                this.element.push(newElement);
                valide = true;
            }
            return valide;
        } 
    }).call(this);

    /*-- fonction vérifie la validité d'un élément --*/
    (function () { 
        this.isBientotHorsConnexion = function (element_a_verifier) {
            var valide = true;
            if(typeof(element_a_verifier) != undefined ){
                if(element_a_verifier != null){
                    if(!element_a_verifier.almostLeave){
                        valide = false;
                    }
                }
            }
            return valide;
        } 
    }).call(this);

    return this;
}

/*-- Spécialisation du tableau pour les joueurs en attente --*/

var Tableau_EnAttente = function() {
    Tableau.call(this);
}


/*-- Spécialisation du tableau pour les joueurs en attente a envoyer--*/

var Tableau_EnAttente_Affichage = function() {
    Tableau.call(this);
}

/*-- Spécialisation du tableau pour les joueurs en attente --*/

var Tableau_EnJeu = function() {
    Tableau.call(this);
}



/*-- on fait hériter les fonctions du Tableau --*/

Tableau_EnAttente.prototype = Object.create(Tableau.prototype);

Tableau_EnAttente_Affichage.prototype = Object.create(Tableau.prototype);


Tableau_EnAttente_Affichage.prototype.getJoueurById = function(idJoueur){

    var element = null;
    var i = 0;
    while(i<this.element.length && element == null){
        if(this.element[i].id == idJoueur){
            element = this.element[i];
        }
        i++;
    }
    return element;

}

Tableau_EnAttente.prototype.timeLifeSynchronisation = function(idJoueur){

    var valide = false;
    var i = 0;
    while(i<this.element.length && !valide){
        if(this.element[i].id == idJoueur){
            this.element[i].timeLife = new Date().getTime();
            valide = true;
        }
        i++;
    }
    return valide;

}

Tableau_EnAttente.prototype.getJoueurById = function(idJoueur){

    var element = null;
    var i = 0;
    while(i<this.element.length && element == null){
        if(this.element[i].id == idJoueur){
            element = this.element[i];
        }
        i++;
    }
    return element;

}

Tableau_EnJeu.prototype = Object.create(Tableau_EnAttente.prototype);

module.exports.Tableau = Tableau;
module.exports.Tableau_EnAttente = Tableau_EnAttente;
module.exports.Tableau_EnAttente_Affichage = Tableau_EnAttente_Affichage;
module.exports.Tableau_EnJeu = Tableau_EnJeu;