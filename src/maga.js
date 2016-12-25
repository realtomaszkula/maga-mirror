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
  const { name, screen_name, friends_count, favourites_count, description, followers_count, location,  
      profile_banner_url, profile_image_url, statuses_count} = response;
  return {
    name,
    screen_name,
    description,
    followers_count,
    location,
    profile_banner_url,
    profile_image_url,
    statuses_count,
    friends_count,
    favourites_count
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
  name: document.querySelector('.whois__item--name'),
  handle: document.querySelector('.whois__item--handle'),
}

const statistics = {
  timeAgo: document.querySelector('#time'),
  retweet_count: document.querySelector('#retweet'),
  favorite_count: document.querySelector('#heart'),
}

const profile = {
  avatar: document.querySelector('.avatar')
}

const meta = {
  tweets: document.querySelector('#tweets'),
  following: document.querySelector('#following'),
  followers: document.querySelector('#followers'),
  likes: document.querySelector('#likes'),
}
const tweetContent = document.querySelector('.tweet-text');

// render
function formatDisplayedStatistics(value) {
  if (value > 1000000) {
    return (value / 1000000).toFixed(1) + 'M'
  }
  if (value > 1000) {
    return (value / 10000).toFixed(1) + 'K'
  }
  return value
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
    console.log(currentTweet);

    // tweet statistics
    statistics.retweet_count.textContent = formatDisplayedStatistics(currentTweet.retweet_count);
    statistics.favorite_count.textContent = formatDisplayedStatistics(currentTweet.favorite_count);
    statistics.timeAgo.textContent = formatDate(currentTweet.created_at);
      
    // tweet content
   tweetContent.textContent = formatDisplayedTweet(currentTweet.text); 

  }, handleError);

getResponse(profileStyles.endpoint, profileStyles.params)
  .then((resp) => {
    const profileInfo = parseProfileInfo(resp);
    
    profile.avatar.setAttribute('src', profileInfo.profile_image_url);

    // meta data
    meta.tweets.textContent = formatDisplayedStatistics(profileInfo.statuses_count);
    meta.following.textContent = formatDisplayedStatistics(profileInfo.friends_count);
    meta.followers.textContent = formatDisplayedStatistics(profileInfo.followers_count);
    meta.likes.textContent = formatDisplayedStatistics(profileInfo.favourites_count);

    // shois
    whois.handle.textContent = '@' + profileInfo.screen_name;
    whois.name.textContent = profileInfo.name;

  }, handleError);