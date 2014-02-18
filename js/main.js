$(document).ready(function() {

  // Hide the no-JS alert.
  $('#no-js-msg').addClass('hidden');

  // Set up the start/restart button.
  $('button#start').click(function() {
    tester.restart();
    $(this).text('Clear Data & Restart');
  });

  // Update the screen periodically.
  window.setInterval(function() {
    var table = $('table#data');

    if (!tester.isRunning) { return; }

    $('.requests',   table).text(tester.numRequests);
    $('.responses',  table).text(tester.numResponses);
    $('.percentage', table).text(tester.percentSuccessful);

    $('#strength').removeClass('hidden');

  }, 500); // every half second

});
