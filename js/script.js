$(function() {

  var btnChecked = 'all';
  var favouriteStreams = ['c_a_k_e', 'lasqa', 'mehvsgame',
                          'mob5ter', 'tysegall', 'relaxbeats'];

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
        status: ''
      });
      // console.log(streamerName);
      // console.log(streamerLogo);
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
          }
        }
        displayStreamInfo(streams[i], i);
      }
      console.log(streams);
    }
  });

  function displayStreamInfo(stream, id) {
    var streamStatus = (stream.online) ? stream.status : 'Offline';
    $('.stream-container').append(
      '<div class="stream">' +
        '<img class="stream-logo" src="' + stream.logo + '" alt="stream-logo">' +
        '<div class="stream-data">' +
          '<a target="_blank" href="https://twitch.tv/' + stream.name + '" class="streamer">' + stream.name + '</a>' +
          '<p class="stream-info">' + streamStatus + '</p>' +
        '</div>' +
      '</div>'
    );
    if (stream.online) {
      $('.stream:nth-child(' + (id + 1) + ') .streamer').addClass('online');
    }
  }

  $('.nav-btn').on('click', function(e) {
    btnChecked = e.target.id;
    $('.nav-btn').removeClass('checked');
    $('#' + btnChecked).addClass('checked');
  });

});
