const db = require('.././database/db.js');

module.exports = {
  getList: (query) => {
    const product_id = query.product_id;
    const page = query.page || 1;
    const count = query.count || 5;
    const offset = (page - 1) * count;
    const params = [product_id, count, offset];
    return db.query('SELECT * FROM reviews WHERE product_id = $1 ORDER BY date LIMIT $2 OFFSET $3;', params)
  },

  getMeta: (query) => {
    //return db.query('SELECT * FROM reviews WHERE product_id = $1 ORDER BY date LIMIT $2 OFFSET $3;', params)
  },

  postReview: (query) => {

  },

  putHelpful: (query) => {

  },

  putReport: (query) => {

  }
}