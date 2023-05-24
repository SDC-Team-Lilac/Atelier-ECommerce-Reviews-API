const db = require('.././database/db.js');

module.exports = {
  getList: async (query) => {
    const product_id = query.product_id;
    const page = query.page || 1;
    const count = query.count || 5;
    const offset = (page - 1) * count;
    const params = [product_id, count, offset];
    const result = await db.query('SELECT * FROM reviews WHERE product_id = $1 ORDER BY date LIMIT $2 OFFSET $3;', params);

    for (var i = 0; i < result.rows.length; i++) {
      var date = new Date(Number(result.rows[i].date));
      result.rows[i].date = date.toISOString();
    }

    for (var j = 0; j < result.rows.length; j++) {
      var photoResult = await db.query('SELECT * FROM photos WHERE review_id = $1;', [result.rows[j].review_id]);
      result.rows[j].photos = photoResult.rows;
    }

    return result;
  },

  getMeta: async (query) => {
    const product_id = query.product_id;

    async function getRatings() {
      // get ratings
      var data = await db.query('SELECT rating FROM reviews WHERE product_id = $1;', [product_id]);
      var productRatings = data.rows;
      var ratings = {};
      for (var i = 0; i < productRatings.length; i++) {
        if (ratings[productRatings[i].rating] === undefined) {
          ratings[productRatings[i].rating] = 1;
        } else {
          ratings[productRatings[i].rating]++;
        }
      }
      return ratings;
    };

    async function getRecommended() {
      // get recommended
      var data = await db.query('SELECT recommend FROM reviews WHERE product_id = $1;', [product_id]);
      var recommendRatings = data.rows;
      var recommended = {false: 0, true: 0};
      for (var i = 0; i < recommendRatings.length; i++) {
        if (recommendRatings[i].recommend === false) {
          recommended.false++;
        } else {
          recommended.true++;
        }
      }
      return recommended;
    };

    async function getCharacteristics() {
      // get characteristic reviews
      var reviewData = await db.query('SELECT review_id FROM reviews WHERE product_id = $1;', [product_id]);
      var review_ids = reviewData.rows;
      var characteristicReviewsArr = [];
      var characteristicReviews = {};
      if (reviewData.rows.length !== 0) {
        var review_idsArr = [];
        for (var i = 0; i < review_ids.length; i++) {
          review_idsArr.push(review_ids[i].review_id);
        }
        var charRevQuery = 'SELECT * FROM "characteristicReviews" WHERE (review_id = ' + review_idsArr[0];
        for (var i = 1; i < review_idsArr.length; i++) {
          charRevQuery += ' OR review_id = ' + review_idsArr[i];
        }
        charRevQuery += ');'

        var characteristicReviewsData = await db.query(charRevQuery);
        for (var j = 0; j < characteristicReviewsData.rows.length; j++) {
          if (characteristicReviews[characteristicReviewsData.rows[j].characteristic_id] === undefined) {
            characteristicReviews[characteristicReviewsData.rows[j].characteristic_id] = [];
            characteristicReviews[characteristicReviewsData.rows[j].characteristic_id].push(characteristicReviewsData.rows[j].value);
          } else {
            characteristicReviews[characteristicReviewsData.rows[j].characteristic_id].push(characteristicReviewsData.rows[j].value);
          }
        }
        const average = array => array.reduce((a, b) => a + b) / array.length;
        // get characteristics
        var characteristics = {};
        for (var key in characteristicReviews) {
          var characteristicData = await db.query('SELECT name FROM characteristics WHERE characteristic_id = $1;', [key]);
          characteristics[characteristicData.rows[0].name] = {id: Number(key), value: average(characteristicReviews[key]).toFixed(5)};
        }
        return characteristics;
      } else {
        return {};
      }
    }

    const ratings = await getRatings();
    const recommended = await getRecommended();
    const characteristics = await getCharacteristics();

    var meta = {
      product_id: product_id,
      ratings: ratings,
      recommended: recommended,
      characteristics: characteristics
    }

    return meta;
  },

  postReview: async (query) => {
    const reviewCount = await db.query('SELECT COUNT(*) FROM reviews');
    const review_id = Number(reviewCount.rows[0].count) + 1;
    const product_id = query.product_id;
    const rating = query.rating;
    const summary = query.summary;
    const body = query.body;
    const recommend = query.recommend;
    const date = Math.floor(Date.now() / 1000);
    const name = query.name;
    const email = query.email;
    const photos = query.photos;
    const characteristics = query.characteristics;
    const reviewParams = [product_id, review_id, rating, summary, body, recommend, date, name, email, null, false, 0];
    // submit product_id, rating, summary, body, recommend, name, email
    await db.query(`
    INSERT INTO reviews
    (product_id,
      review_id,
      rating,
      summary,
      body,
      recommend,
      date,
      reviewer_name,
      reviewer_email,
      response,
      reported,
      helpfulness)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`
    , reviewParams);

    // submit photos
    const photoCount = await db.query('SELECT COUNT(*) FROM photos');
    const photo_id = Number(photoCount.rows[0].count) + 1;
    const photoParams = [review_id, photo_id, photos];
    await db.query('INSERT INTO photos(review_id, photo_id, url) VALUES($1, $2, $3)', photoParams);

    // submit characteristics
    for (var key in characteristics) {
      const characteristicCount = await db.query('SELECT COUNT(*) FROM "characteristicReviews"');
      const characteristic_id = Number(characteristicCount.rows[0].count) + 1;
      const characteristicParams = [characteristic_id, key, review_id, characteristics[key]];
      await db.query('INSERT INTO "characteristicReviews"(characteristic_review_id, characteristic_id, review_id, value) VALUES($1, $2, $3, $4)', characteristicParams);
    }
    return;
  },

  putHelpful: async (query) => {
    const review_id = query.review_id;
    await db.query('UPDATE reviews SET helpfulness = helpfulness + 1 WHERE review_id = $1', [review_id]);
    return;
  },

  putReport: async (query) => {
    const review_id = query.review_id;
    await db.query('UPDATE reviews SET reported = true WHERE review_id = $1', [review_id]);
    return;
  }
}