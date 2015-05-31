// ENABLE SOCKET CONNECTION BETWEEN TWO PLAYERS
// --------------------------------------------

/**
* Variable pour enregistrer les informations globals servant
* au déroulement d'une partie
*/
var sock = null;
var pseudo = "";
var joueur_lite = null;

var testClick = 0;
var tamponPseudo = "";

function enableConnection() {
    if(testClick === 0){
        pseudo = $("input[name='login']" ).val();

        /* la liste des images que l'utilisateur téléchargera pour l'affichage sur le navigateur*/
        var sources = {
            "idPF"          : './images/rocks/rock-red.png',
            "idPS"          : './images/rocks/rock-ciel.png',
            "system_Neutre" : './images/rocks/rock-grey.png',
            "idPF_profile"  : './icons/icon_key.png',
            "idPS_profile"  : './icons/icon_key.png',
            "starA"         : './images/etoile_active.png',
            "starNA"        : './images/etoile_nonactive.png'
          };

        var main            = null,
            firstReceive    = 0,
            joueur          = null,
            adversaire      = null;

        /* on lance la connexion sur le serveur */
        // sock = new Connexion(80, "rockfall.azurewebsites.net");
        sock = new Connexion(7000, "localhost");
        sock.start();
        sock.listenToStartSession();

        /* puis on initialise tous les listeners d'évènement */

        /* Evenènement pour l'aarrivé de nouveau joueur */
        sock.listener("miseAJourDeLaListeJoueur", function (lobby_client_affichage) {

            var element = lobby_client_affichage.element;
            for(var i = 0; i< element.length; i++){
                console.log("  " + i + " => ");
                console.log(element[i]);
            }
        });

        /*
            on écoute la mise a jour venant du server et qui nous envoie les informations de la partie
            importante
        */
        sock.socket.on("MiseAJour", function (objet) {

            main.setFluxInfoServer(objet);
            main.valid = false;

            if(firstReceive === 0) {
                _myStateMulti.plateauOnlineObjet.initialisePlateau(objet);
                main.initInfo("profil_player", "profil_adversaire");
                firstReceive++;
            }

            if(objet.isChangeTurn === true) {
                main.desactiveBonus();
            }


            if(objet.currentPlayer == objet.idPF.id){
                main.currentPlayer = objet.idPF;

            } else if(objet.currentPlayer == objet.idPS.id){
                main.currentPlayer = objet.idPS;
            }

            /*****************modif************/
            $("#profil_" + objet.idPF.name).removeClass("profil_currentPlayer");
            $("#profil_" + objet.idPS.name).removeClass("profil_currentPlayer");
            $("#profil_" + main.currentPlayer.name).addClass("profil_currentPlayer");
            /********************************/

            if(objet.idPF.id == joueur_lite.id){
                main.player = objet.idPF;
                main.adversaire = objet.idPS;

            } else if(objet.idPS.id == joueur_lite.id){
                main.player = objet.idPS;
                main.adversaire = objet.idPF;
            }

            // main.infoPlayer();

            if(objet.action === true){
                main.canContinue = true;
            }
        });


        /*
            Lancer la synchronisation avec le server ici toutes les 1 secondes on envoie un message pour
            prévenir qu'on est toujours présent
         */
       sock.socket.on('start_synchronisation', function (joueur_info) {
            console.log(joueur_lite + " verification");

            joueur_lite = joueur_info;
            setInterval(function(){
                sock.socket.emit('synchronisation', joueur_lite.id);
            }, 1000);

        });


        /*
            pour gérer la fin d'une partie
        */
        sock.socket.on('finDePartie', function (idJoueurGagne) {

            main.stop();
            main = null;
            if(idJoueurGagne == joueur_lite.id){
                console.log("Bravo, vous avez Gagnez!");
            }else{
                console.log("Dommage, vous avez Perdu!");
            }
            firstReceive = 0;
        });

        /**
         * Si l'un des deux joueurs quitte la partie ( problème de connexion )
         */
        sock.socket.on('Interruption', function () {
            main.stop();
            main = null;
            firstReceive = 0;
            console.log("La partie à été interrompue à cause d'un problème de connexion!");
        });

        /**
         * Avec les informations de la partie on s'identifie avec l'id,
         * on initialise le jeu et on envoie ok au server pour lui prévenir que nous sommes prêt
         */
        sock.socket.on("majJoueurStatusParty", function(infoParty){
            if(infoParty.idPF.id == joueur_lite.id){
                joueur = infoParty.idPF;
                adversaire = infoParty.idPS;

            }else if(infoParty.idPS.id == joueur_lite.id){
                joueur = infoParty.idPS;
                adversaire = infoParty.idPF;

            }else{
                console.log('ERROR : supersquare-setting.js => !!majJoueurStatus');
                console.log(joueur_lite);
                joueur = null;

            }

            idParty = infoParty.id;

            loadImages(sources, function(images) {
                main = new Main(images, joueur, adversaire, sock.socket, infoParty.pointPourGagner);
                main.remplirPiecePlayer();
                main.initBonus();
                main.listener();
                main.startSoundGame();

                sock.socket.emit("etatJoueurOk", infoParty.id, joueur_lite.id);

            });

            $(".ghost-panel").css({display:"block" });
            // $("#canvas").css({display:"block", backgroundColor:"#bab8b8"});


            // var ss = FindSuperSquare("play");
            // ss.GameTwoPlayersMode();

            console.log("normalement le canvas devrait apparaitre");
        });

        /* on prévient qu'un nouveau joueur est apparu*/
        sock.socket.emit('nouveauJoueur', pseudo);
      //  console.log("test");
        testClick++;

    }else if(testClick > 0){
        /* on rejoint le matchmaking pour ensuite lancer une partie une fois trouver*/
        console.log(pseudo + " veut rejoindre le matchmaking");
        sock.socket.emit('entrerFileAttente', joueur_lite.id);
    }/*else{
      getPort();
      console.log("récupère port serveur");
    }*/
}
