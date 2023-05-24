import http from 'k6/http';
import { URL } from 'https://jslib.k6.io/url/1.0.0/index.js';
import { sleep, check } from 'k6';

/*
export const options = {
  vus: 100,
  duration: '5s',
};
*/

/*
export const options = {
  vus: 10,
  duration: '5s',
};
*/

/*
export const options = {
  vus: 1000,
  duration: '5s',
};
*/


export const options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 1000,
      timeUnit: '1s', // 1000 iterations per second, i.e. 1000 RPS
      duration: '30s',
      preAllocatedVUs: 1000, // how large the initial pool of VUs would be
      maxVUs: 2000, // if the preAllocatedVUs are not enough, we can initialize more
    },
  },
};



/*
export const options = {
  scenarios: {
    constant_request_rate_100: {
      executor: 'constant-arrival-rate',
      rate: 100,
      timeUnit: '1s', // 1000 iterations per second, i.e. 1000 RPS
      duration: '30s',
      preAllocatedVUs: 100, // how large the initial pool of VUs would be
      maxVUs: 200, // if the preAllocatedVUs are not enough, we can initialize more
    },
    constant_request_rate_1000: {
      executor: 'constant-arrival-rate',
      rate: 1000,
      timeUnit: '1s', // 1000 iterations per second, i.e. 1000 RPS
      duration: '30s',
      preAllocatedVUs: 100, // how large the initial pool of VUs would be
      maxVUs: 200, // if the preAllocatedVUs are not enough, we can initialize more
    },
  },
};
*/


export default function () {

  let min = 1;
  let max = 5774953;

  let id = Math.floor(Math.random() * (max - min + 1) + min);

  const url = new URL('http://localhost:3001/reviews/meta');

  url.searchParams.append('product_id', id);

  const res = http.get(url.toString());

  check(res, {
    'is status 200': (r) => r.status === 200,
  });

};