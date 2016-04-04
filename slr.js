'use strict';

exports.slr = slr;

/*
 *  Simple linear regression.
 *
 *  samples is an array of objects {x: x-value, y: y-value}
 *  returns an object {slope: slope, intercept: intercept}
 */
function slr(samples) {
  let sum_xy = 0
  let sum_x = 0
  let sum_y = 0
  let sum_x2 = 0

  samples.forEach((s) => {
    sum_xy += s.x * s.y;
    sum_x += s.x;
    sum_y += s.y;
    sum_x2 += s.x * s.x;
  });
  
  let slope = (sum_xy - ((sum_x * sum_y) / samples.length)) / (sum_x2 - ((sum_x * sum_x) / samples.length));
  let intercept = (sum_y / samples.length) - (slope * (sum_x / samples.length));

  return {slope: slope, intercept: intercept};
}
