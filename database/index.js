const { Client } = require("pg");

const client = new Client({
  host: 'localhost',
  user: 'jccode',
  database: 'reviews',
  password: '',
  port: 5432,
});

const execute = async (query) => {
  try {
      await client.connect();     // gets connection
      await client.query(query);  // sends queries
      return true;
  } catch (error) {
      console.error(error.stack);
      return false;
  } finally {
      await client.end();         // closes connection
  }
};

var productsSchema = `
  CREATE TABLE "products" (
    "product_id" INTEGER NOT NULL,
    "name" TEXT,
    "slogan" TEXT,
    "description" TEXT,
    "category" TEXT,
    "default_price" INTEGER,
    PRIMARY KEY ("product_id")
);`;

var reviewsSchema = `
  CREATE TABLE IF NOT EXISTS "reviews" (
    "product_id" INTEGER NOT NULL,
    "review_id" INTEGER NOT NULL UNIQUE,
    "rating" INTEGER NOT NULL,
    "body" TEXT,
    "summary" TEXT,
    "recommend" BOOLEAN,
    "response" TEXT,
    "date" TEXT,
    "reported" BOOLEAN,
    "reviewer_name" TEXT,
    "reviewer_email" TEXT,
    "helpfulness" INTEGER,
    PRIMARY KEY ("review_id"),
    FOREIGN KEY ("product_id")
    REFERENCES products("product_id")
);`;


var characteristicsSchema = `
  CREATE TABLE "characteristics" (
    "characteristic_id" INTEGER,
    "product_id" INTEGER,
    "name" TEXT,
    FOREIGN KEY ("product_id")
    REFERENCES products("product_id")
);`;

var characteristicReviewsSchema = `
  CREATE TABLE "characteristicReviews" (
    "characteristic_review_id" INTEGER,
    "characteristic_id" INTEGER,
    "review_id" INTEGER,
    "value" INTEGER,
    FOREIGN KEY ("review_id")
    REFERENCES reviews("review_id")
);`;

var ratingsSchema = `
  CREATE TABLE "ratings" (
    "product_id" INTEGER NOT NULL,
    "1" INTEGER,
    "2" INTEGER,
    "3" INTEGER,
    "4" INTEGER,
    "5" INTEGER,
    FOREIGN KEY ("product_id")
    REFERENCES products("product_id")
);`;

var recommendedSchema = `
  CREATE TABLE "recommended" (
    "product_id" INTEGER NOT NULL,
    "recommended" BOOLEAN,
    FOREIGN KEY ("product_id")
    REFERENCES products("product_id")
);`;

var photosSchema = `
  CREATE TABLE "photos" (
    "review_id" INTEGER NOT NULL,
    "photo_id" INTEGER UNIQUE,
    "url" TEXT NOT NULL,
    FOREIGN KEY ("review_id")
    REFERENCES reviews("review_id")
);`;

var copyCharacteristics = `
  COPY characteristics(characteristic_id,product_id,name)
  FROM '/Users/jccode/HR/rpp2210-sdc-lilac-reviews/data/characteristics.csv'
  DELIMITER ','
  CSV HEADER;`

execute(characteristicReviewsSchema).then(result => {
  if (result) {
      console.log('Table created');
  }
});

/*

execute(reviewsSchema).then(result => {
  if (result) {
      console.log('Table created');
  }
});
*/

/*

const connectDb = async () => {
  try {
    const client = new Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT
    })
  await client.connect()
    const res = await client.query('SELECT * FROM test_table')
    console.log(res)
    await client.end()
  } catch (error) {
    console.log(error)
  }
}
connectDb()

*/

/*

const createTable = async () => {
  try {
    const client = new Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT
    })
  await client.connect()
    var table = `
      CREATE TABLE IF NOT EXISTS "reviews" (
        "product_id" INTEGER NOT NULL,
        "review_id" INTEGER NOT NULL UNIQUE,
        "rating" INTEGER NOT NULL,
        "body" TEXT,
        "summary" TEXT,
        "recommend" BOOLEAN,
        "response" TEXT,
        "date" DATE,
        "reviewer_name" TEXT,
        "helpfulness" INTEGER,
        PRIMARY KEY ("review_id"),
        FOREIGN KEY ("product_id")
    );`;
    const res = await client.query(table)
    console.log(res)
    await client.end()
  } catch (error) {
    console.log(error)
  }
}
createTable()

*/