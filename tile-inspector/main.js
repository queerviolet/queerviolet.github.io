#!/usr/bin/env node

"use strict";

// Runs reports on some blob exemplars.
//
// If you give it a number at the command line, it will test
// that many random blobs.
//
// ./main.js 500
//
// It'll crash if any of the find algorithms generate an incorrect
// answer.

var process = require('process');
var blob = require('./blob.js');

function reportFunc(tile, allBlobs, func) {
  var log = tile.record();
  var results = func(log);
  if (!results) {
    console.log('  no blobs found.');
    return;
  }
  console.log(func.name + ':', results.blob);

  console.log('  reads:', log.reads.length);
  console.log('  cache:', results.cache.hits,
    'hits', results.cache.misses, '; misses')

  var correct = false;
  var b = allBlobs.length; while(--b >= 0) {
    var answer = allBlobs[b];
    if (results.blob.top === answer.top &&
        results.blob.left === answer.left &&
        results.blob.right === answer.right &&
        results.blob.bottom === answer.bottom) {
      correct = true;
      break;
    }
  }

  if (correct) {
    console.log('  [found blob ' + b + ']');
  } else {
    console.error('  ** incorrect results **  ');
  }
  console.assert(correct);  
}

function report(tile) {
  console.log(tile.toString());
  var allBlobs = blob.analyze(tile);
  console.log('Analysis,', allBlobs.length, 'blobs:');
  for (var b = 0; b != allBlobs.length; ++b) {
    console.log('  Blob', b);
    for (var prop in {top: 1, left: 1, right: 1, bottom: 1}) {
      console.log('    ', prop + ':', allBlobs[b][prop]);
    }
  }

  for (var algo in blob.find) {
    reportFunc(tile, allBlobs, blob.find[algo]);
  }
}

var TEST_CASES =  {
  example: blob.Tile(`0000000000
                 0011100000
                 0011111000
                 0010001000
                 0011111000
                 0000101000
                 0000101000
                 0000111000
                 0000000000
                 0000000000`),


  pier: blob.Tile(`1100000000
              1100000000
              1111111100
              1100000000
              0100000000
              0111000000
              0011100000
              1011100000
              1110000000
              1110000000`),

  random: blob.Tile.random(),
};

for (var testCase in TEST_CASES) {
  console.log('=== ' + testCase + ' ===');
  report(TEST_CASES[testCase]);
}

if (process.argv.length > 2) {
  var tests = 1 * process.argv[2];
  for (var i = 0; i != tests; ++i) {
    console.log('=== random[' + i + '] ===');
    report(blob.Tile.random());
  }
}