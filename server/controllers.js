const models = require('./models');

module.exports = {
  getList: (req, res) => {
    models.getList(req.query)
    .then((result) => {res.status(200).send({results: result.rows})})
    .catch((err) => {res.status(500).send('ERROR get reviews')})
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