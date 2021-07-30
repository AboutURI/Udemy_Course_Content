import http from 'k6/http';

const url = 'http://localhost:9800/?courseId=15';

export let options = {
  scenarios: {
    // eslint-disable-next-line camelcase
    Constant_Rate: {
      executor: 'constant-arrival-rate',
      rate: 7000,
      timeUnit: '1s',
      duration: '30s',
      preAllocatedVUs: 100,
      maxVUs: 200,
    }
  },
};

export default function () {
  http.get(`${url}`);
}

