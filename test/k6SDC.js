import http from 'k6/http';

const dbURL = 'http://localhost:9800/course/item?courseId=';

export let options = {
  scenarios: {
    // eslint-disable-next-line camelcase
    Constant_Rate: {
      executor: 'constant-arrival-rate',
      rate: 1000,
      timeUnit: '1s',
      duration: '90s',
      preAllocatedVUs: 100,
      maxVUs: 220,
    }
  },
};

const getRandom = (max) => {
  return (Math.floor(Math.random() * max));
};

export default function () {
  const id = getRandom(10000000);
  http.get(dbURL + id);
}
