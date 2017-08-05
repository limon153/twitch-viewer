$(function() {

  var btnChecked = 'all';
  var favouriteStreams = ['c_a_k_e', 'lasqa', 'mehvsgame',
                          'mob5ter', 'tysegall', 'relaxbeats'];



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
        var streamerName = streamers[i].display_name;
        var streamerLogo = streamers[i].logo;
        displayStreamInfo(streamerName, streamerLogo);
        console.log(streamerName);
        console.log(streamerLogo);
       }

     }
  });

  function displayStreamInfo(name, logo) {
    $('.stream-container').append(
      '<div class="stream">' +
        '<img class="stream-logo" src="' + logo + '" alt="stream-logo">' +
        '<div class="stream-data">' +
          '<a target="_blank" href="https://twitch.tv/' + name + '" class="streamer">' + name + '</a>' +
          '<p class="stream-info">Offline</p>' +
        '</div>' +
      '</div>'
    );
  }

  $('.nav-btn').on('click', function(e) {
    btnChecked = e.target.id;
    $('.nav-btn').removeClass('checked');
    $('#' + btnChecked).addClass('checked');
  });

});
