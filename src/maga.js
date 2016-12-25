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

function parseProfileInfo(response) {
  const { description, followers_count, location, name, 
      profile_banner_url, profile_image_url_https, statuses_count} = response;
  return {
    description,
    followers_count,
    location,
    profile_banner_url,
    profile_image_url_https,
    statuses_count
  }
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

let profileStyles = {
  endpoint: 'users/show',
  params: {
    screen_name: 'realDonaldTrump'
  }
}

const handleResults = (response) => console.log(parseResponse(response));
const handleError = (error) => console.error(error);

getResponse(recentMentions.endpoint, recentMentions.params)
   .then(handleResults, handleError);

getResponse(donaldTimeline.endpoint, donaldTimeline.params)
  .then(handleResults, handleError);

getResponse(profileStyles.endpoint, profileStyles.params)
  .then((resp) => console.log(parseProfileInfo(resp)), handleError);


// render
const whois = {
  name: document.querySelector('.whois__name'),
  at: document.querySelector('.whois__at'),
  timeAgo: document.querySelector('.whois__timeago')
}


const statistics = {
  reply:  document.querySelector('.statistics__reply'),
  retweet: document.querySelector('.statistics__retweet'),
  heart: document.querySelector('.statistics__like'),
}


console.log(whois);
console.log(statistics);