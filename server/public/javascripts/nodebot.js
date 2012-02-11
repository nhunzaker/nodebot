$(document).ready(function() {

    var socket = io.connect('http://localhost');
    
    socket.on("output", function (data) {
        $("<p/>").html("<strong>Nodebot:</strong> " + data).prependTo("#feed");
    });

    
    $("form").submit(function(e) {
        e.preventDefault();
        socket.emit("input", $("#question").val());
    });

});