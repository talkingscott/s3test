'use strict';
 
const AWS = require('aws-sdk');
AWS.config.update({region: process.env['AWS_REGION'] || 'us-east-1'});
const s3 = new AWS.S3();
 
const async = require('vasync');

const slr = require('./slr');

const params = {Bucket: process.env['AWS_S3_BUCKET'] || 'your-bucket-name', Key: ''};
 
const samples = [];

function getOne(arg, callback) {
  params.Key = arg.key;
  console.info('Start ' + params.Key);
  let start_time = new Date().getTime();
  s3.getObject(params, function (err, data) {
    let end_time = new Date().getTime();
    if (err) {
      console.error('Error getting ' + params.Key + ': ' + err);
    } else {
      console.info('Done ' + params.Key + ' (' + (end_time - start_time) + 'ms) length=' + data.Body.length);
      samples.push({x: data.Body.length, y: (end_time - start_time) /1000.0});
      delete data.Body;
    }
    callback(err, data);
  });
}

const keys = [
  {key: 'test/30mb'},
  {key: 'test/10mb'},
  {key: 'test/6mb'},
  {key: 'test/3mb'},
  {key: 'test/1mb'},
  {key: 'test/600kb'},
  {key: 'test/300kb'}
];

const inputs = [];
keys.forEach((key) => {
  for (var i = 0; i < 16; i++) {
    inputs.push({key: key.key + '-' + i});
  }
});

async.forEachPipeline({
  'func': getOne,
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
