$(document).ready(function() {

    var socket = io.connect(window.location.origin),
        $feed  = $("#feed");
    
    socket.on("output", function (data) {
        $("<p/>").html("<strong>Nodebot:</strong> " + data)
            .css("opacity", 0)
            .appendTo($feed)
            .animate({ opacity : 1 });

        $feed.animate({scrollTop : $feed.height() });
    });

    
    $("form").submit(function(e) {
        e.preventDefault();
        socket.emit("input", $("#question").val());
        
        $("#question").val("").focus();
    });

});