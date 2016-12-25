const Twitter = require('twitter');
const ENV = require('../env');
const {consumer_key, consumer_secret, access_token_key, access_token_secret} = ENV;


const client = new Twitter({
  consumer_key,
  consumer_secret,
  access_token_key,
  access_token_secret
})


const params = {
  q: '@realDonaldTrump'
}

client.get('search/tweets', params, function(error, tweets, response) {
  if (error) console.error(error);
  console.log(tweets);
  console.log(response);
})