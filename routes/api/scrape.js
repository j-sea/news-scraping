const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const db = require('../../models');
const router = express.Router();

router.post('/api/scrape', function (req, res) {
    const articles = [];
    axios.get("https://www.npr.org/")
    .then(function (response) {
        const $ = cheerio.load(response.data);
        $('.story-text').each(function(i, element) {
            const article = {
                headline: $(element).find('.title').text(),
                summary: $(element).find('.teaser').text(),
                url: $(element).find('> a').attr('href'),
            };

            if (article.headline && article.summary && article.url) {

                db.Article.create(article)
                .then(function (results) {
                    articles.push(article);
                    console.log(results);
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
        });

        res.json(articles);
    })
    .catch(function (error) {

        res.json(error);
    });

});

module.exports = router;