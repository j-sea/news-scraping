const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const db = require('../../models');
const router = express.Router();

router.post('/api/scrape-articles', function (req, res) {
	// Attempt to grab the front page of NPR
	axios.get("https://www.npr.org/")
	.then(function (response) {
		// Scrape all of the front-page articles utilizing the cheerio package
		const articles = [];
		const $ = cheerio.load(response.data);

		// Loop through all elements containing the 'story-text' class names
		$('.story-text').each(function(i, element) {
			// Attempt to grab the headline, summary, and url from each article
			const article = {
				headline: $(element).find('.title').text(),
				summary: $(element).find('.teaser').text(),
				url: $(element).find('> a').attr('href'),
			};

			// Only if we actually retrieved all three should we add it to our collected articles. Some articles are formatted differently and don't include all info
			if (article.headline && article.summary && article.url) {
				articles.push(article);
			}
		});

		// Create entries for all of the articles in our Mongo DB using Mongoose
		db.Article.create(articles)
		// Then send the results to the requester
		.then(function (results) {
			console.log(results);
			res.status(200).json(results);
		})
		// Otherwise, send the error to the requester
		.catch(function (error) {
			console.log(error);
			res.status(500).json(error);
		})
	})
	// Otherwise, send the error to the requester
	.catch(function (error) {
		console.log(error);
		res.status(500).json(error);
	});

});

module.exports = router;