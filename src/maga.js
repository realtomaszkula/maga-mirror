const Twitter = require('twitter');
const ENV = require('../env');
const {consumer_key, consumer_secret, access_token_key, access_token_secret} = ENV;

const client = new Twitter({
  consumer_key,
  consumer_secret,
  access_token_key,
  access_token_secret
})

function getResponse(endpoint, params) {
  return client.get(endpoint, params);
}

function parseTweet(tweet) {
  const { text, favorite_count, created_at, retweet_count} = tweet;
  return {
    text, favorite_count, created_at, retweet_count
  }
}

function parseResponse(response) {
  return Array.isArray(response) 
          ? response.map(tweet => parseTweet(tweet))
          : response.statuses.map(tweet => parseTweet(tweet));
}

let recentMentions = {
  endpoint: 'search/tweets',
  params: {
    q: '@realDonaldTrump',
    result_type: 'recent'
  }
}

let donaldTimeline = {
  endpoint: 'statuses/user_timeline',
  params: {
    screen_name: 'realDonaldTrump',
    count: 5,
    trim_user: true,
    exclude_replies: true,
    include_rts: false
  }
}

const handleResults = (response) => console.log(parseResponse(response));
const handleError = (error) => console.error(error);

getResponse(recentMentions.endpoint, recentMentions.params)
   .then(handleResults, handleError);

getResponse(donaldTimeline.endpoint, donaldTimeline.params)
  .then(handleResults, handleError);