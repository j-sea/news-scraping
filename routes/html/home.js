const express = require('express');
const axios = require('axios');
const db = require('../../models');
const router = express.Router();

// When the client visits the base URL route
router.get('/', function (req, res) {

	// Retrieve all the articles and related notes
	db.Article.find().populate('notes')
	.then(function (dbResults) {
		// If there are articles
		if (dbResults.length !== 0) {
			// Render the home view with relevant articles and JavaScript includes
			res.status(200).render('home', {
				articles: dbResults,
				scripts: [
					{
						partial: 'scripts/includes/materialize-init',
					},
					{
						partial: 'scripts/forPage/home',
					},
				],
			});
		}
		// If there are no articles
		else {
			// Scrape the articles now before rendering the page
			axios.post(`http://${req.headers.host}/api/scrape-articles`) 
			.then (function (scrapeResults) {
				// Render the home view with relevant articles and JavaScript includes
				res.status(200).render('home', {
					articles: scrapeResults.data,
					scripts: [
						{
							partial: 'scripts/includes/materialize-init',
						},
						{
							partial: 'scripts/forPage/home',
						},
					],
				});
			})
			// Otherwise, send the error to the requester
			.catch(function (error) {
				console.log(error);
				res.status(500).end();
			});
		}
	})
	// Otherwise, send the error to the requester
	.catch(function (error) {
		console.log(error);
		res.status(500).end();
	});
});

module.exports = router;