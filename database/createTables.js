const { Client } = require("pg");


const client = new Client({
  host: 'db',
  user: 'postgres',
  database: 'postgres',
  password: 'postgres',
  port: 5432
});


/*
const client = new Client({
  host: 'localhost',
  user: 'jccode',
  database: 'postgres',
  password: '',
  port: 5432
});
*/

const execute = async (queries) => {
  try {
      await client.connect();     // gets connection
      for (var i = 0; i < queries.length; i++) {
        await client.query(queries[i]);  // sends queries
      }
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

execute([productsSchema, reviewsSchema, characteristicsSchema,characteristicReviewsSchema, recommendedSchema, photosSchema]).then(result => {
  if (result) {
      console.log('Table created');
  }
});

/*
PRODUCTS

  COPY products(product_id,name,slogan,description,category,default_price)
  FROM '/Users/jccode/HR/rpp2210-sdc-lilac-reviews/data/product.csv'
  DELIMITER ','
  CSV HEADER;

  COPY products(product_id,name,slogan,description,category,default_price)
  FROM '/var/lib/postgresql/data/reviewdata/product.csv'
  DELIMITER ','
  CSV HEADER;
*/

/*
REVIEWS
  COPY reviews(review_id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
  FROM '/Users/jccode/HR/rpp2210-sdc-lilac-reviews/data/reviews.csv'
  DELIMITER ','
  CSV HEADER;

  COPY reviews(review_id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
  FROM '/var/lib/postgresql/data/reviewdata/reviews.csv'
  DELIMITER ','
  CSV HEADER;
*/

/*
CHARACTERISTICS
  COPY characteristics(characteristic_id,product_id,name)
  FROM '/Users/jccode/HR/rpp2210-sdc-lilac-reviews/data/characteristics.csv'
  DELIMITER ','
  CSV HEADER;

  COPY characteristics(characteristic_id,product_id,name)
  FROM '/var/lib/postgresql/data/reviewdata/characteristics.csv'
  DELIMITER ','
  CSV HEADER;
*/

/*
CHARACTERISTICS REVIEWS
  COPY "characteristicReviews"(characteristic_review_id,characteristic_id,review_id,value)
  FROM '/Users/jccode/HR/rpp2210-sdc-lilac-reviews/data/characteristic_reviews.csv'
  DELIMITER ','
  CSV HEADER;

  COPY "characteristicReviews"(characteristic_review_id,characteristic_id,review_id,value)
  FROM '/var/lib/postgresql/data/reviewdata/characteristic_reviews.csv'
  DELIMITER ','
  CSV HEADER;
*/

/*
PHOTOS REVIEWS
  COPY photos(photo_id,review_id,url)
  FROM '/Users/jccode/HR/rpp2210-sdc-lilac-reviews/data/reviews_photos.csv'
  DELIMITER ','
  CSV HEADER;

  COPY photos(photo_id,review_id,url)
  FROM '/var/lib/postgresql/data/reviewdata/reviews_photos.csv'
  DELIMITER ','
  CSV HEADER;
*/

/*
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

execute(reviewsSchema).then(result => {
  if (result) {
      console.log('Table created');
  }
});

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