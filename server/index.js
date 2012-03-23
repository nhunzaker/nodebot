var flatiron = require('flatiron'),
    connect  = require("connect"),
    port     = process.env.port || 8080,
    app      = Nodebot.server = flatiron.app;

// Plugins
app.use(flatiron.plugins.log);
app.use(flatiron.plugins.http, {
    before: [connect.static(__dirname + '/public')]
});

// Routes
require("./routes")(app);

// Set the server to listen on port `8080`.
app.start(port);
app.log.info("Nodebot is listening on port", port);

// Install socket.io
Nodebot.io = require('socket.io').listen(app.server);

Nodebot.io.configure(function() {
    Nodebot.io.set('log level', 0);
});

Nodebot.io.sockets.on('connection', function(socket) {
    socket.emit('output', "Hello, master");
    socket.on("input", function(d) {
        Nodebot.analyze(d);
    });
});