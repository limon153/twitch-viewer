$(function() {

  var btnChecked = 'all';
  var favouriteStreams = ['c_a_k_e', 'lasqa', 'mehvsgame',
                          'mob5ter', 'tysegall', 'relaxbeats', 'freecodecamp'];

  var streams = [];
  $.ajax({
   type: 'GET',
   url: 'https://api.twitch.tv/kraken/users?login=' + favouriteStreams.join(','),
   headers: {
     'Accept': 'application/vnd.twitchtv.v5+json',
     'Client-ID': 'axjhfp777tflhy0yjb5sftsil'
   },
   success: function(data) {
     console.log(data);
     var streamers = data.users;
     for (var i = 0; i < streamers.length; i++) {

      streams.push({
        name: streamers[i].display_name,
        logo: streamers[i].logo,
        online: false,
        status: '',
        game: ''
      });

     }
     console.log(streams);

   }
  });

  $.ajax({
    type: 'GET',
    url: 'https://api.twitch.tv/kraken/streams?channel=' + favouriteStreams.join(','),
    headers: {
      // 'Accept': 'application/vnd.twitchtv.v5+json',
      'Client-ID': 'axjhfp777tflhy0yjb5sftsil',
    },
    success: function(data) {
      console.log(data);
      for (var i = 0; i < streams.length; i++) {
        for (var j = 0; j < data.streams.length; j++) {
          if (data.streams[j].channel.display_name == streams[i].name) {
            streams[i].online = true;
            streams[i].status = data.streams[j].channel.status;
            streams[i].game = data.streams[j].game;
          }
        }
        displayStreamInfo(streams[i], i);
      }
      console.log(streams);
    }
  });

  function displayStreamInfo(stream, id) {
    var streamStatus = (stream.online) ? stream.status : 'Offline';
    var streamGame = (stream.online) ? stream.game + ' | ' : '';
    $('.stream-container').append(
      '<div class="stream">' +
        '<img class="stream-logo" src="' + stream.logo + '" alt="stream-logo">' +
        '<div class="stream-data">' +
          '<a target="_blank" href="https://twitch.tv/' + stream.name + '" class="streamer">' + stream.name + '</a>' +
          '<p class="stream-info">' + streamGame + streamStatus + '</p>' +
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
          displayStreamInfo(streams[i], i);
        }
        break;
      case 'online':
        $('.stream-container').empty();
        for (var i = 0; i < streams.length; i++) {
          if (streams[i].online) {
            displayStreamInfo(streams[i], i);
          }
        }
        break;
      case 'offline':
        $('.stream-container').empty();
        for (var i = 0; i < streams.length; i++) {
          if (!streams[i].online) {
            displayStreamInfo(streams[i], i);
          }
        }
        break;
      default:
        break;
    }
  });
});
