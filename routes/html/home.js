const express = require('express');
const axios = require('axios');
const db = require('../../models');
const router = express.Router();

router.get('/', function (req, res) {

    db.Article.find().populate('notes')
    .then(function (dbResults) {
        if (dbResults.length !== 0) {
            res.render('home', {
                articles: dbResults
            });
        }
        else {
            axios.post(`http://${req.headers.host}/api/scrape`)
            .then (function (scrapeResults) {
                res.render('home', {
                    articles: scrapeResults.data
                });
            })
            .catch(function (error) {
                console.log(error);
                res.end();
            });
        }
    })
    .catch(function (error) {
        console.log(error);
        res.end();
    });
});

module.exports = router;