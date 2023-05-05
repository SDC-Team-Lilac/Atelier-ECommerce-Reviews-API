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
    //console.log('Query submitted', { text, params })
    return pool.query(text, params)
  }
}