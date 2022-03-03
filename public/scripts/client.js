/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function () {
  
  const createTweetElement = function(tweetData) {
    const $tweet = `
    <article class="tweet">
    <header>
    <div class="user-info">
    <img src="${tweetData.user.avatars}">
    <span class="name">${tweetData.user.name}</span>
    </div>
    <span class="handle">${tweetData.user.handle}</span> 
    </header>
    <div class="tweet-body">
    <p class="tweet-content">${escape(tweetData.content.text)}</p>
    </div>
    <footer>
    <span>${timeago.format(tweetData.created_at)}</span>
    <div class="actions">
    <i class="fa-solid fa-flag"></i>
    <i class="fa-solid fa-retweet"></i>
    <i class="fa-solid fa-heart"></i>
    </div>
    </footer>
    </article>
    `
    return $tweet;
  }
  
  const renderTweets = function(tweets) {
    for (const article of tweets) {
      const $tweet = createTweetElement(article)
      $('#tweets-container').append($tweet)
    }
  }
  
  $('#tweet-form').on('submit', function(event) {
    event.preventDefault();
    $('#error-msg').slideUp(100);
    const formData = ($(this).serialize());
    const text = event.target[0].value;
    if (!text || text.length <= 0) {
      return $('#error-msg').text("⚠️ Warning: Tweet cannot be empty. ⚠️").slideDown();
    }
    if (text.length > 140) {
      return $('#error-msg').text("⚠️ Warning: Tweets cannot be over the maximum of 140 characters long. ⚠️").slideDown();
    }
    $.ajax({
      url: '/tweets',
      method: 'POST',
      data: formData,
    })
    .then(() => {
      $('#tweets-container').empty();
      loadTweets();
    })
  });
  
  const loadTweets = function() {
    $.ajax({
      url: '/tweets',
      method: 'GET'
    })
    .then((result) => {
      renderTweets(result);
    })
  };
  
  const escape = function (str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  $('#new-tweet-reveal').on('click', () => {
    if ($('.new-tweet').is(':visible')) {
      $('.new-tweet').slideUp();
      $('#error-msg').slideUp();
    } else {
      $('.new-tweet').slideDown();
      $('#tweet-text').focus();
    }
  });

  $(".scroll-up-button").hover(
    function() {
      $(this).addClass('fa-bounce');
    },
    function() {
      $(this).removeClass('fa-bounce');
    }
  )

  $(".scroll-up-button").on('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  })

  $('.scroll-up-button').slideUp();

  $(window).on('scroll', () => {
    if ($(window).scrollTop() === 0) {
      $('.newTweetPrompt').slideDown();
      $('.scroll-up-button').slideUp();
    } else {
      $('.newTweetPrompt').slideUp();
      $('.scroll-up-button').slideDown();
    }
  })

  loadTweets();
  
});