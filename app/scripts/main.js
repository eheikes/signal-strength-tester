/* global tester, SignalBars */
var signalBars = null;

var strengths = {
  'Strong': {
    cssClass: 'text-success',
    color: '#3c763d'
  },
  'Medium': {
    cssClass: 'text-info',
    color: '#31708f'
  },
  'Weak': {
    cssClass: 'text-warning',
    color: '#8a6d3b'
  },
  'No Signal': {
    cssClass: 'text-danger',
    color: '#a94442'
  }
};

var updateData = function() {
  'use strict';

  if (!tester.hasRun) { return; }

  var table = $('table#data');
  $('.requests',   table).text(numeral(tester.numRequests).format('0,0'));
  $('.responses',  table).text(numeral(tester.numResponses).format('0,0'));
  $('.percentage', table).text(numeral(tester.percentSuccessful).format('0.0%'));

  if (tester.strength !== '') {
    var strengthInfo = strengths[tester.strength];
    var strength = $('#strength');
    strength.removeClass('hidden text-success text-info text-warning text-danger');
    strength.addClass(strengthInfo.cssClass);
    $('.text', strength).text(tester.strength);
    signalBars.opts.fillBackgroundColor = strengthInfo.color;
    signalBars.opts.fillBorderColor     = strengthInfo.color;
    signalBars.setStrength(tester.strengthPct);
  }
};

var updateSettingsForm = function() {
  'use strict';

  var settings = $('#settings');

  $('#setting-httpType',     settings).val(tester.httpType);
  $('#setting-testUrl',      settings).val(tester.testUrl);
  $('#setting-useJsonP',     settings).prop('checked', tester.useJsonP);
  $('#setting-timeout',      settings).val(tester.timeout);
  $('#setting-interval',     settings).val(tester.interval);
  $('#setting-numForRecent', settings).val(tester.numForRecent);
};

var setupPage = function() {
  'use strict';

  // Hide the no-JS alert.
  $('#no-js-msg').addClass('hidden');

  // Fill out the Settings form.
  updateSettingsForm();

  // Set up the start/pause button.
  $('button#start').click(function() {
    $('button#clear').removeClass('hidden');

    if (tester.isRunning) {
      tester.stop();
      $(this).text('Resume');
    } else {
      tester.start();
      $(this).text('Pause');
    }
  });

  // Set up the "Clear Data" button.
  $('button#clear').click(function() {
    if (tester.isRunning) {
      tester.restart(); // important to start a new polling period
    } else {
      tester.reset();
    }
    updateData();
  });

  // Set up the Settings form.
  $('#settings').on('change', 'input,select', function() {
    var id   = $(this).attr('id');
    var prop = id.replace(/^setting-/, '');
    var val  = $(this).val();
    switch (prop) {
      case 'useJsonP':
        tester.set(prop, $(this).prop('checked'));
        break;
      case 'timeout':
      case 'interval':
      case 'numForRecent':
        tester.set(prop, parseFloat(val));
        break;
      default:
        tester.set(prop, val);
        break;
    }
  });

  // Always keep one accordion panel open.
  // Adapted from http://stackoverflow.com/a/15725889/258076
  $('.panel-heading').on('click', function() {
    if ($(this).parents('.panel').children('.panel-collapse').hasClass('in')) {
      return false;
    }
  });

  // Create the signal bars graphic.
  signalBars = new SignalBars({
    unitSize: 4,
    emptyBackgroundColor: '#dddddd',
    emptyBorderColor: '#dddddd',
    fillBackgroundColor: '#666666',
    fillBorderColor: '#666666'
  }, 'signal-bars');

  // Update the screen periodically.
  window.setInterval(function() {
    updateData();
  }, 500); // every half second
};

$(document).ready(setupPage);
