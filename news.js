sp = getSpotifyApi(1);
var models = sp.require('sp://import/scripts/api/models');
var player = models.player;
jQuery.ajaxSettings.traditional = true;


var launch = function() {

  getArtist();

  player.observe(models.EVENT.CHANGE, function (e) {
	  // Only update the page if the track changed
	    if (e.data.curtrack == true) {
		    getArtist();
	    }
  });
}    

function getArtist() {
  var playerTrackInfo = player.track;

  if (playerTrackInfo == null) {
  $("#info").text("Start playing something and I'll find you news from the artist.");
  } else {
          var track = playerTrackInfo.data;
          var artist = track.album.artist.name;
          console.log(artist)
          fetchNews(artist);
//          fetchFBNews(artist);
         };
}

function checkResponse(data) {
  if (data.response) {
        if (data.response.status.code != 0) {
          $("#info").text("Whoops... Unexpected error from server. " + data.response.status.message);
          log(JSON.stringify(data.response));
      } else {
          return true;
      }
  } else {
      $("#info").text("Unexpected response from server");
  }
  return false;
}

function fetchNews(artist) {
  var url = 'http://developer.echonest.com/api/v4/artist/news?api_key=P5UNONUVKBUYT1EIZ&callback=?';

  $.getJSON(url, { 'name': artist, 
                   'format':'jsonp',
                   'results': '1',
                   'start': '0',
                   'high_relevance': 'true'}, 
                   function(data) {
            if (checkResponse(data)) {
                $("#news").empty();
                var news = data.response.news;
                console.log(news[0]);
                $("#news").animate({opacity:0}, 500, function(){
                  $("#news").html('<h1><a href="'+news[0].url+'">'+news[0].name+'</a></h1>')
                });
                $("#news").animate({opacity:1}, 500);
            } else {
                $("#info").html("<h1>Sorry, I'm having trouble getting results</h1>");
                   }
  });
}

/*
function fetchFBNews(artist) {
  var url = 'http://developer.echonest.com/api/v4/artist/profile?api_key=P5UNONUVKBUYT1EIZ&callback=?';

  $.getJSON(url, { 'name': artist, 
                   'format':'jsonp',
                   'bucket': 'id:facebook'},
                   function(data) {
            if (checkResponse(data)) {
              var fbid = data.response.artist.foreign_ids[0].foreign_id;
              console.log(fbid);
              fbid = fbid.split(":")[2];
              console.log(fbid);
              fbFetch(fbid);
            } else {
              $("#info").html("<h1>Sorry, I'm having trouble getting results</h1>");
              }
  });
}

function fbFetch(facebookid) {
  //Set Url of JSON data from the facebook graph api. make sure callback is set with a '?' to overcome the cross domain problems with JSON
  var fburl = 'http://graph.facebook.com/'+facebookid+'/feed?limit=20&callback=?';
  console.log(fburl);
  //Use jQuery getJSON method to fetch the data from the url and then create our unordered list with the relevant data.
  $.getJSON(fburl, function(json) {
    var html = "<ul>";
    console.log(html);
    //loop through and within data array's retrieve the message variable.
    $.each(json.data, function(i,fb){
      if(fb.link){
          html += "<li><img src='"+fb.picture+"'/><a href='" +fb.link+"'>"+ fb.message + "</a></li>";
      } else {
          html += "<li>"+ fb.message + "</li>";
        }
  });
  html += "</ul>";
  //A little animation once fetched
  $('.facebookfeed').animate({opacity:0}, 500, function(){
    $('.facebookfeed').html(html);
  });
  $('.facebookfeed').animate({opacity:1}, 500);
  });
};

function fbGetToken() {
  var fbTokenURL = 'https://graph.facebook.com/oauth/access_token?client_id=184306878296854&client_secret=fe6b7514def61a7c01b9b4f7aae28235&grant_type=client_credentials'
  
  $.getJSON(fbTokenURL, function(data) {
    if (checResponse(data)) {
      var fbToken = data.response.
*/





