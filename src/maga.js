const Twitter = require('twitter');
const ENV = require('../env');
const timeAgo = require('../lib/timeAgo');

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
  console.log(response);
  return response.map(tweet => parseTweet(tweet))
}

function parseProfileInfo(response) {
  const { description, followers_count, location, name, 
      profile_banner_url, profile_image_url, statuses_count} = response;
  return {
    description,
    followers_count,
    location,
    profile_banner_url,
    profile_image_url,
    statuses_count
  }
}

let donaldTimeline = {
  endpoint: 'statuses/user_timeline',
  params: {
    screen_name: 'realDonaldTrump',
    count: 1,
    trim_user: true,
    include_rts: false
  }
}

let profileStyles = {
  endpoint: 'users/show',
  params: {
    screen_name: 'realDonaldTrump'
  }
}

// target dom
const whois = {
  name: document.querySelector('.whois__name'),
  at: document.querySelector('.whois__at'),
  timeAgo: document.querySelector('.whois__timeago')
}

const statistics = {
  reply:  document.querySelector('.statistics__reply'),
  retweet_count: document.querySelector('.statistics__retweet'),
  favorite_count: document.querySelector('.statistics__like'),
}

const profile = {
  avatar: document.querySelector('.avatar')
}

const tweetContent = document.querySelector('.tweet-text');

// render
function formatDisplayedStatistics(value) {
  return (value > 1000)
    ? `${(value/1000).toFixed(1)}K`
    : value
}

function formatDisplayedTweet(tweet) {
  return tweet;
}


function formatDate(dateString) {
  return timeAgo(new Date(dateString).getTime());
}

// hit api
const handleResults = (response) => console.log(parseResponse(response));
const handleError = (error) => console.error(error);

getResponse(donaldTimeline.endpoint, donaldTimeline.params)
  .then((resp) => {
    const currentTweet = parseResponse(resp)[0];

    // statistics
    statistics.retweet_count.textContent = formatDisplayedStatistics(currentTweet.retweet_count);
    statistics.favorite_count.textContent = formatDisplayedStatistics(currentTweet.favorite_count);
    whois.timeAgo.textContent = formatDate(currentTweet.created_at); 
      
    // tweet content
   tweetContent.textContent = formatDisplayedTweet(currentTweet.text); 

  }, handleError);

getResponse(profileStyles.endpoint, profileStyles.params)
  .then((resp) => {
    const profileInfo = parseProfileInfo(resp);
    
    profile.avatar.setAttribute('src', profileInfo.profile_image_url);

  }, handleError);