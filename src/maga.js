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

const handleResults = (tweet) => console.log(tweet);
const handleError = (error) => console.error(error);

getResponse(recentMentions.endpoint, recentMentions.params)
  .then(handleResults, handleError);

getResponse(donaldTimeline.endpoint, donaldTimeline.params)
  .then(handleResults, handleError);