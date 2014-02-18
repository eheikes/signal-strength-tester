$(document).ready(function() {

  // Hide the no-JS alert.
  $('#no-js-msg').addClass('hidden');

  // Fill out the Settings form.
  updateSettingsForm();

  // Set up the start/restart button.
  $('button#start').click(function() {
    tester.restart();
    $(this).text('Clear Data & Restart');
  });

  // Set up the Settings form.
  $('#settings').on('change', 'input', function() {
    var id   = $(this).attr('id');
    var prop = id.replace(/^setting-/, '');
    var val  = $(this).val();
    switch (prop) {
      case 'useJsonP':
        tester.set(prop, $(this).prop('checked'));
        break;
      case 'timeout':
      case 'interval':
        tester.set(prop, parseFloat(val));
        break;
      default:
        tester.set(prop, val);
        break;
    }
  });

  // Always keep one accordion panel open.
  // Adapted from http://stackoverflow.com/a/15725889/258076
  $('.panel-heading').on('click', function(event) {
    if ($(this).parents('.panel').children('.panel-collapse').hasClass('in')) {
      return false;
    }
  });

  // Update the screen periodically.
  window.setInterval(function() {
    updateData();
  }, 500); // every half second
});

function updateData() {
  if (!tester.isRunning) { return; }

  var table = $('table#data');
  $('.requests',   table).text(numeral(tester.numRequests).format('0,0'));
  $('.responses',  table).text(numeral(tester.numResponses).format('0,0'));
  $('.percentage', table).text(numeral(tester.percentSuccessful).format('0.0%'));

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
}

function updateSettingsForm() {
  var settings = $('#settings');

  $('#setting-httpType', settings).val(tester.httpType);
  $('#setting-testUrl',  settings).val(tester.testUrl);
  $('#setting-useJsonP', settings).prop('checked', tester.useJsonP);
  $('#setting-timeout',  settings).val(tester.timeout);
  $('#setting-interval', settings).val(tester.interval);
}
