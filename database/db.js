const { Pool } = require('pg');
require('dotenv').config();

/*
const pool = new Pool ({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT
})
*/

const pool = new Pool({
  host: 'localhost',
  user: 'jccode',
  database: 'reviews',
  password: '',
  port: 5432
});

module.exports = {
  query: (text, params) => {
    //console.log(text)
    return pool.query(text, params);
  }
    //return pool.query(text, params)
  /*
  query: (text, params, callback) => {
    //console.log('Query submitted', { text, params })
    pool.query(text, params, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        callback(null, res)
      }
    });
    //return pool.query(text, params)
  }
  */
 /*
  query: async function connect(text, params) {
    const pool = new Pool(credentials);
    const now = await pool.query(text, params);
    await pool.end();
    return now;
  }
  */
}