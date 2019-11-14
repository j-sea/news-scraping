const express = require('express');
const db = require('../../../models');
const router = express.Router();

// Route for saving/updating an Article's associated Note
router.delete("/articles/:articleId/:noteId", function(req, res) {
	db.Article.findOneAndUpdate(
		{
			_id: req.params.articleId,
		},
		{
			$pull: {
				notes: req.params.noteId,
			},
		}
	)
	.then(function (dbArticle) {
		// If we were able to successfully update the Article, delete the note
		return db.Note.findOneAndDelete({
			_id: req.params.noteId,
		})
		.then(function () {
			// Return the article with its updated notes
			dbArticle.populate('notes');
			res.status(200).json(dbArticle);
		})
	})
	.catch(function (err) {
		// If an error occurred, send it to the client
		res.status(500).json(err);
	});
});

module.exports = router;