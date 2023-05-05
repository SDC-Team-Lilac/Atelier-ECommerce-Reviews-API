const express = require('express');
const router = express.Router();
const controllers = require('./controllers.js');

router.get('/reviews/:product_id/page/:page/count/:count', controllers.getList);

router.get('/reviews/meta/:product_id', controllers.getMeta);

router.post('/reviews', controllers.postReview);

router.put('/reviews/:review_id/helpful', controllers.putHelpful);

router.put('/reviews/:review_id/report', controllers.putReport);

module.exports = router;