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

  /*
  getMeta: async (query) => {
    const product_id = query.product_id;
    // get ratings
    const getRatings = new Promise((resolve, reject) => {
      var ratings = {};
      db.query('SELECT rating FROM reviews WHERE product_id = $1;', [product_id])
      .then(ratingsData => {
        var productRatings = ratingsData.rows;
        for (var i = 0; i < productRatings.length; i++) {
          if (ratings[productRatings[i].rating] === undefined) {
            ratings[productRatings[i].rating] = 1;
          } else {
            ratings[productRatings[i].rating]++;
          }
        }
        resolve(ratings);
      })
    });
    // get recommended
    const getRecommend = new Promise((resolve, reject) => {
      console.log('getrec')
      var recommended = {false: 0, true: 0};
      //var recommendData = await db.query('SELECT recommend FROM reviews WHERE product_id = $1;', [product_id]);
      db.query('SELECT recommend FROM reviews WHERE product_id = $1;', [product_id])
      .then((recommendData) => {
        var recommendRatings = recommendData.rows;
        for (var i = 0; i < recommendRatings.length; i++) {
          if (recommendRatings[i].recommend === false) {
            recommended.false++;
          } else {
            recommended.true++;
          }
        }
        resolve(recommended);
      })
    });

    // get characteristic reviews
    const getCharacteristicRev = async function() {
      var reviewData = await db.query('SELECT review_id FROM reviews WHERE product_id = $1;', [product_id]);
      var review_ids = reviewData.rows;
      var characteristicReviewsArr = [];
      var characteristicReviews = {};

      for (var i = 0; i < review_ids.length; i++) {
        var characteristicReviewsData = await db.query('SELECT * FROM "characteristicReviews" WHERE review_id = $1;', [review_ids[i].review_id]);
        for (var j = 0; j < characteristicReviewsData.rows.length; j++) {
          if (characteristicReviews[characteristicReviewsData.rows[j].characteristic_id] === undefined) {
            characteristicReviews[characteristicReviewsData.rows[j].characteristic_id] = [];
            characteristicReviews[characteristicReviewsData.rows[j].characteristic_id].push(characteristicReviewsData.rows[j].value);
          } else {
            characteristicReviews[characteristicReviewsData.rows[j].characteristic_id].push(characteristicReviewsData.rows[j].value);
          }
        }
      }
      return characteristicReviews;
    }

    /*
    // get characteristic reviews
    const getCharacteristicRev = new Promise((resolve, reject) => {
      var characteristics = {};
      //var reviewData = await db.query('SELECT review_id FROM reviews WHERE product_id = $1;', [product_id]);
      db.query('SELECT review_id FROM reviews WHERE product_id = $1;', [product_id])
      .then((reviewData) => {
        var review_ids = reviewData.rows;
        var characteristicReviewsArr = [];
        var characteristicReviews = {};
        for (var i = 0; i < review_ids.length; i++) {
          var db.query('SELECT * FROM "characteristicReviews" WHERE review_id = $1;', [review_ids[i].review_id])
          .then(characteristicReviewsData => {
            for (var j = 0; j < characteristicReviewsData.rows.length; j++) {
              if (characteristicReviews[characteristicReviewsData.rows[j].characteristic_id] === undefined) {
                characteristicReviews[characteristicReviewsData.rows[j].characteristic_id] = [];
                characteristicReviews[characteristicReviewsData.rows[j].characteristic_id].push(characteristicReviewsData.rows[j].value);
              } else {
                characteristicReviews[characteristicReviewsData.rows[j].characteristic_id].push(characteristicReviewsData.rows[j].value);
              }
            }
            //console.log(characteristicReviews)
            return characteristicReviews;
          })
          .then(result => {
            characteristicReviews = result;
            console.log(characteristicReviews)
          })
        }
        console.log(characteristicReviews);
        //return characteristicReviews;
      })
      .then(characteristicReviews => {
        console.log(characteristicReviews)
        // get characteristics
        for (var key in characteristicReviews) {
          //var characteristicData = await db.query('SELECT name FROM characteristics WHERE characteristic_id = $1;', [key]);
          db.query('SELECT name FROM characteristics WHERE characteristic_id = $1;', [key])
          .then((characteristicData) => {
            console.log('chardata', characteristicData)
            characteristics[characteristicData.rows[0].name] = {id: Number(key), value: average(characteristicReviews[key]).toFixed(5)};
          })
        }
        console.log(characteristics)
        resolve(characteristics);
      })
    });

    const average = array => array.reduce((a, b) => a + b) / array.length;

    Promise.all([getRatings, getRecommend, getCharacteristicRev()])
    .then((results) => {

      var meta = {
        product_id: product_id,
        ratings: results[0],
        recommended: results[1],
        characteristics: results[2]
      }

     var meta = {
      product_id: { '1': 5, '2': 2, '3': 3, '4': 5, '5': 3 },
      recommended: { false: 5, true: 13 },
      ratings: {
        '10': [ 5 ]
      },
      characteristics: {
       '239716': [
         3, 4, 5, 5, 2, 1, 3,
         1, 4, 5, 1, 3, 2, 4,
         4, 4, 5
       ],
       '239717': [
         2, 5, 5, 1, 4, 3, 5,
         2, 1, 3, 5, 5, 5, 2,
         3, 1, 3
       ],
       '239718': [
         3, 3, 5, 3, 2, 3, 2,
         5, 3, 2, 3, 4, 4, 3,
         3, 3, 1
       ],
       '239719': [
         3, 5, 5, 2, 2, 3, 4,
         5, 2, 4, 1, 4, 5, 1,
         4, 3, 5
       ]
      }
     }
     console.log(meta)
      return meta;
    });

      var meta = {
        product_id: product_id,
        ratings: results[0],
        recommended: results[1],
        characteristics: {}
      }
      var charRev = results[2];
      return [meta, charRev()]
    })
    .then(result => {
      console.log(result)
    })


      .then(results => {
        var meta = {
          product_id: product_id,
          ratings: results[0],
          recommended: results[1],
          characteristics: characteristics
        }
      })
      .then(results => {
        console.log(meta)
        return meta;
      })
    })
    .catch((error) => {
      console.log(error)
    });

  },

  */

  getMeta: async (query) => {
    const product_id = query.product_id;
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
    // get characteristic reviews
    var reviewData = await db.query('SELECT review_id FROM reviews WHERE product_id = $1;', [product_id]);
    var review_ids = reviewData.rows;
    var characteristicReviewsArr = [];
    var characteristicReviews = {};

    for (var i = 0; i < review_ids.length; i++) {
      var characteristicReviewsData = await db.query('SELECT * FROM "characteristicReviews" WHERE review_id = $1;', [review_ids[i].review_id]);
      for (var j = 0; j < characteristicReviewsData.rows.length; j++) {
        if (characteristicReviews[characteristicReviewsData.rows[j].characteristic_id] === undefined) {
          characteristicReviews[characteristicReviewsData.rows[j].characteristic_id] = [];
          characteristicReviews[characteristicReviewsData.rows[j].characteristic_id].push(characteristicReviewsData.rows[j].value);
        } else {
          characteristicReviews[characteristicReviewsData.rows[j].characteristic_id].push(characteristicReviewsData.rows[j].value);
        }
      }
    }
    const average = array => array.reduce((a, b) => a + b) / array.length;
    // get characteristics
    var characteristics = {};
    for (var key in characteristicReviews) {
      var characteristicData = await db.query('SELECT name FROM characteristics WHERE characteristic_id = $1;', [key]);
      characteristics[characteristicData.rows[0].name] = {id: Number(key), value: average(characteristicReviews[key]).toFixed(5)};
    }
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