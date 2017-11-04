console.log('Success: keys loaded');
const Twitter = require("twitter");

const client = new Twitter ({
  consumer_key: 'FWxBpoI9qPLsHhm5hfbqu8RCy',
  consumer_secret: 'rxru7lyOyP4OneBm2Pq3FnsFlrbckDd7w1UybpjQ7127CjrIVi',
  access_token_key: '3788026639-RhJ0aMwdzIwgYJ0VRsgiBk0mmK13svCtxBidDGX',
  access_token_secret: 'CbBm0eGuBxTPLBPjHuPr9QzUKq3wuz5N55XJ1hfXTowKN'
});

module.exports = client;