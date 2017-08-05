$(function() {
  
  var btnChecked = 'all';

  function checkButton() {
    $('#' + btnChecked).addClass('checked');
  }



  $('.nav-btn').on('click', function(e) {

    btnChecked = e.target.id;
    $('.nav-btn').removeClass('checked');
    checkButton();
  });

});
