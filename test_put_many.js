'use strict';
 
const AWS = require('aws-sdk');
AWS.config.update({region: process.env['AWS_REGION'] || 'us-east-1'});
const s3 = new AWS.S3();
 
const async = require('vasync');

const slr = require('./slr');

const params = {Bucket: process.env['AWS_S3_BUCKET'] || 'foo', Key: '', Body: ''};

const samples = [];

function putOne(arg, callback) {
  params.Key = arg.key;
  params.Body = arg.buf;
  console.info('Start ' + params.Key);
  let start_time = new Date().getTime();
  s3.putObject(params, function (err, data) {
    let end_time = new Date().getTime();
    if (err) {
      console.error('Error putting ' + params.Key + ': ' + err);
    } else {
      console.info('Done ' + params.Key + ' (' + (end_time - start_time) + 'ms)');
      samples.push({x: params.Body.length, y: (end_time - start_time) /1000.0})
    }
    callback(err, data);
  });
}

const key_bufs = [
  {key: 'test/30mb', buf: new Buffer(30000000)},
  {key: 'test/10mb', buf: new Buffer(10000000)},
  {key: 'test/6mb', buf: new Buffer(6000000)},
  {key: 'test/3mb', buf: new Buffer(3000000)},
  {key: 'test/1mb', buf: new Buffer(1000000)},
  {key: 'test/600kb', buf: new Buffer(600000)},
  {key: 'test/300kb', buf: new Buffer(300000)}
];

const inputs = [];
key_bufs.forEach((key_buf) => {
  for (var i = 0; i < 16; i++) {
    inputs.push({key: key_buf.key + '-' + i, buf: key_buf.buf});
  }
});

async.forEachPipeline({
  'func': putOne,
  'inputs': inputs
}, (err, results) => {
  if (err) {
    console.error('Error: ' + err);
  } else {
    console.dir(results);
    let fit = slr.slr(samples);
    console.info('latency (secs): ' + fit.intercept + ' transfer rate (bytes/sec): ' + (1 / fit.slope));
  }
});
