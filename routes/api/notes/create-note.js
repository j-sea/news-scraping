const express = require('express');
const db = require('../../../models');
const router = express.Router();

// Route for saving/updating an Article's associated Note
router.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate(
				{
					_id: req.params.id,
				},
				{
					$push: {
						notes: dbNote._id,
					},
				},
				{
					new: true,
				}
			);
    })
    .then(function(dbArticle) {
			// If we were able to successfully update an Article, send it back to the client
			dbArticle.populate('notes');
      res.status(200).json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.status(500).json(err);
    });
});

module.exports = router;