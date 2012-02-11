// Routes

var plates = require("plates"),
    fs     = require("fs");

module.exports = function(app) {

    app.router.get("/", function() {

        var req = this.req,
            res = this.res;

        fs.readFile(__dirname + '/index.html', function (err, data) {

		        if (err) {
		            res.writeHead(500);
		            return res.end('Error loading index.html');
		        }

            res.writeHead(200, { 'Content-Type': 'text/html' });

		        res.end(data);

	      });

    });

};