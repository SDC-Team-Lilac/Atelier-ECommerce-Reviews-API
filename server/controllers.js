const models = require('./models');
const redis = require('redis');

module.exports = {
  getList: (req, res) => {

    function cache(req, res) {
      const request = JSON.stringify(req.query);
      client.get(request, (err, data) => {
        if (err) {
          console.log(err);
        };
        if (data) {
          res.status(200).send({results: JSON.parse(data)});
        } else {
          getReviews(req, res);
        };
      })
    }

    function getReviews(req, res) {
      models.getList(req.query)
      .then((result) => {
        res.status(200).send({results: result.rows});
        client.setex(JSON.stringify(req.query), 3600, JSON.stringify(result.rows));
      })
      .catch((err) => {res.status(500).send('ERROR get reviews')})
    }

    const client = redis.createClient({
      host: 'redis',
      port: 6379,
      legacyMode: true,
    });

    client.connect();
    client.on('connect', () => {
      cache(req, res);
    });
  },

  getMeta: (req, res) => {
    models.getMeta(req.query)
    .then((result) => {res.status(200).send(result)})
    .catch((err) => {res.status(500).send('ERROR get meta')})
  },

  postReview: (req, res) => {
    models.postReview(req.body)
    .then((result) => {res.status(200).send(result)})
    .catch((err) => {res.status(500).send('ERROR post review')})
  },

  putHelpful: (req, res) => {
    models.putHelpful(req.params)
    .then((result) => {res.status(200).send(result)})
    .catch((err) => {res.status(500).send('ERROR put help')})
  },

  putReport: (req, res) => {
    models.putReport(req.params)
    .then((result) => {res.status(200).send(result)})
    .catch((err) => {res.status(500).send('ERROR out report')})
  }
}