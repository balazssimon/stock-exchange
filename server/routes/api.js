var express = require('express');
var router = express.Router();
var playService = require('../services/play-service');
var newsService = require('../services/news-service');
var rateService = require('../services/rate-service');
var stockService = require('../services/stock-service');
var gameService = require('../services/game-service');
router.use('/play', playService);
router.use('/news', newsService);
router.use('/rates', rateService);
router.use('/stocks', stockService);
router.use('/games', gameService);
module.exports = router;
//# sourceMappingURL=api.js.map