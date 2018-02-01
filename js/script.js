$(function() {

  var btnChecked = 'all';
  var favoriteStreams = ['c_a_k_e', 'lasqa', 'honeymad', 'adam13531', 'melharucos', 'mob5ter', 'tysegall', 'relaxbeats', 'freecodecamp'];

  var streams = [],
   liveStreams = [],
   games = [];

  var streamersRequestInfo = {
    type: 'GET',
    url: 'https://api.twitch.tv/helix/users?login=' + 
     favoriteStreams.join('&login='),
    headers: {
      'Client-ID': 'u3fx51xw96cb0hxlyltbytal62z21r'
    },
    success: function(data) {
      console.log(data.data);
      var streamers = data.data;
      for (var i = 0; i < streamers.length; i++) {
 
       streams.push({
         id: streamers[i].id,
         name: streamers[i].display_name,
         logo: streamers[i].profile_image_url,
         online: false,
         status: '',
         game: ''
       });
      }
      console.log(streams);
    }
  };

  var liveStreamsRequestInfo = {
    type: 'GET',
    url: 'https://api.twitch.tv/helix/streams?user_login=' +
      favoriteStreams.join('&user_login='),
    headers: {
      'Client-ID': 'u3fx51xw96cb0hxlyltbytal62z21r',
    },
    success: function(data) {
      var streamsData = data.data;
      console.log(streamsData);
      for (var j = 0; j < streamsData.length; j++) {
        liveStreams.push({
          userId: streamsData[j].user_id, 
          online: true,
          gameId: streamsData[j].game_id,
          viewers: streamsData[j].viewer_count
        });
        games.push(streamsData[j].game_id);
      }
      console.log(games);
      $.ajax(gameRequestInfo);
    }
  };

  var gameRequestInfo = {
    type: 'GET',
    url: 'https://api.twitch.tv/helix/games?id=' + games.join('&id='),
    headers: {
      'Client-ID': 'u3fx51xw96cb0hxlyltbytal62z21r',
    },
    success: function(data) {
      var gamesData = data.data;
      console.log(data);

      for (var k = 0; k < liveStreams.length; k++) {
        for (var f = 0; f < gamesData.length; f++) {

          if (liveStreams[k].gameId === gamesData[f].id) {
            liveStreams[k].game = gamesData[f].name;
          }
        }
      }
      console.log(liveStreams);
    }
  }

  // When the streamers and live streams requests are done sends game request
  // and then display info
  $.when($.ajax(streamersRequestInfo), $.ajax(liveStreamsRequestInfo))
  .then(
    function() {
      gameRequestInfo.url = 'https://api.twitch.tv/helix/games?id=' +
        games.join('&id=');
      return $.when($.ajax(gameRequestInfo));
    })
  .then(
    function() {
      console.log(liveStreams);
      for (var i = 0; i < streams.length; i++) {
        for (var j = 0; j < liveStreams.length; j++) {
          if (streams[i].id === liveStreams[j].userId) {
            streams[i].online = true;
            streams[i].game = liveStreams[j].game;
            streams[i].viewers = liveStreams[j].viewers;             
          }
        }
        displayStreamInfo(streams[i]);
      }
      console.log(streams);
    }
  );


  function displayStreamInfo(stream) {
    var streamGame = (stream.online) ? stream.game + ' | ' : 'Offline';
    var streamViewers = (stream.online) ? stream.viewers : '';
    $('.stream-container').append(
      '<div class="stream">' +
        '<img class="stream-logo" src="' + stream.logo + '" alt="stream-logo">'+
        '<div class="stream-data">' +
          '<a target="_blank" href="https://twitch.tv/' + stream.name +
            '" class="streamer">' + stream.name + '</a>' +
          '<p class="stream-info">' + streamGame + streamViewers + '</p>' +
        '</div>' +
      '</div>'
    );
    if (stream.online) {
      $('.streamer:contains("' + stream.name + '")').addClass('online');
    }
  }

  $('.nav-btn').on('click', function(e) {
    btnChecked = e.target.id;
    $('.nav-btn').removeClass('checked');
    $('#' + btnChecked).addClass('checked');
    switch (btnChecked) {
      case 'all':
        $('.stream-container').empty();
        for (var i = 0; i < streams.length; i++) {
          displayStreamInfo(streams[i]);
        }
        break;
      case 'online':
        $('.stream-container').empty();
        for (var i = 0; i < streams.length; i++) {
          if (streams[i].online) {
            displayStreamInfo(streams[i]);
          }
        }
        break;
      case 'offline':
        $('.stream-container').empty();
        for (var i = 0; i < streams.length; i++) {
          if (!streams[i].online) {
            displayStreamInfo(streams[i]);
          }
        }
        break;
    }
  });
});
