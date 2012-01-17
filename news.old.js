var sp
  var models = sp.require('sp://import/scripts/api/models');
  var player = models.player;
  jQuery.ajaxSettings.traditional = true;

  exports.init = init;

  function init() {

    player.observe(models.EVENT.CHANGE, function (e) {

      // Only update the page if the track changed
      if (e.data.curtrack == true) {
        fetchNewsFromNowPlaying();
      }
    });

  function fetchNewsFromNowPlaying() {

    var header = document.getElementById("header");

    // This will be null if nothing is playing.
    var playerTrackInfo = player.track;

    if (playerTrackInfo == null) {
      header.innerText = "Start playing something and I'll find you news from the artist.";
    } else {
          var track = playerTrackInfo.track;
          var artist = track.artists[0].name;
          fetchNews(artist, 1);
    }
  }

  function fetchNews(artist, size) {
      info('Getting news for ' + artist);
      var url = 'http://developer.echonest.com/api/v4/artist/news?api_key=P5UNONUVKBUYT1EIZ&callback=?';

      $.getJSON(url, { 'name': artist, 'format':'jsonp', 
              'results': size, 'start':'0', 'high_relevance': 'true'}, function(data) {
          if (checkResponse(data)) {
              $("#results").empty();
              info("");
              var curTracks = []
              for (var i = 0; i < data.response.news.length; i++) {
                  var news = data.response.news[i];
                  var newsfeed = news.name + " on " + news.url;
      console.log(newsfeed);
                  var li = $("<li>").text("<a href="+news.url+">"+news.name+"</a>");
                  $("#results").append(li);
              }
          } else {
              info("trouble getting results");
          }
      });
  }
