'use strict';
 
const AWS = require('aws-sdk');
AWS.config.update({region: process.env['AWS_REGION'] || 'us-east-1'});
const s3 = new AWS.S3();
 
const params = {Bucket: process.env['AWS_S3_BUCKET'] || 'your-bucket-name', Key: ''};

function log(msg) {
  console.info(new Date().toISOString() + ' ' + msg);
}

function getOne(key, callback) {
  params.Key = key;
  log('Start ' + params.Key);
  let start_time = new Date().getTime();
  s3.getObject(params, function (err, data) {
    let end_time = new Date().getTime();
    if (err) {
      log('Error getting ' + key + ': ' + err);
    } else {
      log('Done ' + key + ' (' + (end_time - start_time) + 'ms) length=' + data.Body.length);
    }
    callback(err, end_time - start_time);
  });
}

function getPeriodic(interval, key) {
  getOne(key, (err, elapsed) => {
    setTimeout(getPeriodic, interval > elapsed ? interval - elapsed : 0, interval, key);
  });
}

getPeriodic(30000, 'test/30mb-5');
