const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const db = require('../../models');
const router = express.Router();

router.delete('/api/clear-articles', function (req, res) {
	// Delete all articles
	db.Article.deleteMany()
	// Then delete all notes
	.then(() => db.Note.deleteMany())
	// Then return the results to the requester
	.then(function (results) {
		res.status(200).json(results);
	})
	// Otherwise, return the error to the requester
	.catch(function (error) {
		res.status(500).json(error);
	});
});

module.exports = router;