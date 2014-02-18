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
    if (!tester.isRunning) { return; }

    var table = $('table#data');
    $('.requests',   table).text(tester.numRequests);
    $('.responses',  table).text(tester.numResponses);
    $('.percentage', table).text(tester.percentSuccessful);

    var strength = $('#strength');
    var strengthClass = '';
    switch (tester.strength) {
      case 'Strong':    strengthClass = 'text-success'; break;
      case 'Medium':    strengthClass = 'text-info';    break;
      case 'Weak':      strengthClass = 'text-warning'; break;
      case 'No Signal': strengthClass = 'text-danger';  break;
    }
    strength.removeClass('hidden text-success text-info text-warning text-danger');
    strength.addClass(strengthClass);
    $('.text', strength).text(tester.strength);
  }, 500); // every half second

});
