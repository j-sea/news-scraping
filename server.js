// Import all necessary files
var express = require('express');
var expressHandlebars = require('express-handlebars');
var mongoose = require('mongoose');
var routes = require('./routes');

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsScraping";
var PORT = process.env.PORT || 8080;

// Create an instance of the express server
var app = express();

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// Parse application body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up handlebars
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Set up the routes
app.use(routes);

// Start up the database
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Start the server
app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}! Open link here: http://localhost:${PORT}`);
});