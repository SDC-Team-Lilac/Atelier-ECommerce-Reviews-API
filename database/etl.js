const fs = require("fs");
const Pool = require("pg").Pool;
const fastcsv = require("fast-csv");

let stream = fs.createReadStream("././data/reviews.csv");
let csvData = [];
let csvStream = fastcsv
  .parse()
  .on("data", function(data) {
    csvData.push(data);
  })
  .on("end", function() {
    // remove the first line: header
    csvData.shift();

    debugger

    // create a new connection to the database
    const pool = new Pool({
      host: "localhost",
      user: "jccode",
      database: "reviews",
      password: "",
      port: 5432,
      max: 10, // max number of clients in the pool
      idleTimeoutMillis: 10000000 // how long a client is allowed to remain idle before being closed
    });

    //const query =
    //  "INSERT INTO products (product_id, name, slogan, description, category, default_price) VALUES ($1, $2, $3, $4, $5, $6)";

    //const query =
    //  "INSERT INTO reviews (review_id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)";

    const query =
        "INSERT INTO photos (product_id, review_id, url)"

    pool.connect((err, client, done) => {
      if (err) throw err;

      try {
        csvData.forEach(row => {
          client.query(query, row, (err, res) => {
            if (err) {
              console.log(err.stack);
            } else {
              //console.log("inserted " + res.rowCount + " row:", row);
            }
          });
        });
      } finally {
        done();
      }
    });
  });

stream.pipe(csvStream);

/*

COPY reviews(review_id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
FROM '/Users/jccode/HR/rpp2210-sdc-lilac-reviews/data/reviews.csv'
DELIMITER ','
CSV HEADER;

*/