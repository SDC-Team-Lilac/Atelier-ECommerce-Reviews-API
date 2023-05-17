import supertest from 'supertest';
const request = require('supertest');
import app from './server/index.js';

/*
describe('Random test examples', () => {

  test('adds 1 + 2 to equal 3', () => {
    expect(1 + 2).toBe(3);
  });

  it('Should fail test', () => {
    var array = [1,2,3,4];
    expect(array.pop()).toEqual(3)
  })

  //test and it works interchangeably
})
*/

describe("GET /reviews", () => {

  test("should get reviews", async () => {
    const response = await request(app).get("/reviews").query({
        page: 1,
        count: 5,
        sort: 'new',
        product_id: 71698
    })
    expect(response.statusCode).toBe(200)
    expect(response.body.results.length).toBeGreaterThanOrEqual(0)
  }, 10000)

})

describe("GET /meta", () => {

  test("should get reviews meta", async () => {
    const response = await request(app).get("/reviews/meta").query({
        product_id: 71698
    })
    expect(response.statusCode).toBe(200)
    expect(response.body.product_id).toBe('71698')
  }, 100000)

})
