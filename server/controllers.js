const models = require('./models');

module.exports = {
  getList: (req, res) => {
    models.getList(req.params)
    .then((result) => {res.status(200).send(result.rows)})
    .catch((err) => {res.status(500).send('ERROR getting reviews')})
  },

  getMeta: (req, res) => {
    models.getMeta(req.params)
    .then((result) => {res.status(200).send(result.rows)})
    .catch((err) => {res.status(500).send('ERROR getting meta')})
  },

  postReview: (req, res) => {
    models.postReview(req.params)
    .then((result) => {res.status(200).send(result)})
    .catch((err) => {res.status(500).send('ERROR getting meta')})
  },

  putHelpful: (req, res) => {
    models.putHelpful(req.params)
    .then((result) => {res.status(200).send(result)})
    .catch((err) => {res.status(500).send('ERROR getting meta')})
  },

  putReport: (req, res) => {
    models.putReport(req.params)
    .then((result) => {res.status(200).send(result)})
    .catch((err) => {res.status(500).send('ERROR getting meta')})
  }
}

//    .then((result) => {res.status(200).send(result.rows)})