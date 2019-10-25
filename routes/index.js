var express = require('express');
var router = express.Router();

router.use(require('./api/scrape.js'));
router.use(require('./html/home.js'));

module.exports = router;
