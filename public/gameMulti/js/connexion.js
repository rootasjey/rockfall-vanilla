function Connexion(){
    
    var conn = io.connect("/connexion");
    /*
    conn.on("nouveau_joueur", function (data) {
        
    });
    
    $("#searchMatch").on("click",function(){
        
        pseudo = $("#pseudo").html();
        
        conn.on("connect", function () {
            conn.emit("nouveau_joueur", {
                pseudo: pseudo
            });
        });
        
    });
    */
    
}