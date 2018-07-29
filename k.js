const Koa = require('koa');
const Router = require('koa-router'); // Provide routing based on URL
const serve = require('koa-static'); // server static HTML, Images, JS and CSS
const app = new Koa();
const router = new Router();
const request = require('request-promise');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
let count = 0;

router.get('/paul', async (ctx, next) => {
  const rand = Math.floor(Math.random()*10000);

  console.log('Got request', rand, ++count, new Date());

  // Get the result from a slow express service on 3000
  const data = await request('http://localhost:3000/paul');
  ctx.set('Content-Type', 'application/json');
  ctx.body = data;

  console.log('Returned request', rand, count, new Date());

  // Content type is assumed as object returned
  //const response = await request('http://localhost:3000/paul');
  //ctx.body = JSON.parse(response);
});


router.get('/data', async (ctx, next) => {

  console.log('Got request', new Date());

  const start = new Date();

  // Very bad idea
  await sleep(5000);

  ctx.body = {
        status: 'great',
        message: "Hello Paul",
        start_date: start,
        end_date:   new Date(),
        count: ++count
    };

  console.log('Returned request', new Date());

});

try {
  app
    .use(router.routes())
    .use(router.allowedMethods())
    .use(serve('.'))
    .listen(3200);
  console.log('Koa listening at http://localhost:3200');
} catch (error) {
  console.log('Koa did not start', error);
}