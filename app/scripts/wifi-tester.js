var WifiTester = (function() {
  'use strict';

  function WifiTester() {
    // Config
    this.httpType      = 'GET';
    this.testUrl       = 'http://time.jsontest.com/';
    this.useJsonP      = false;
    this.timeout       = 1000;  // request timeout, in millisecs
    this.interval      = 1000;  // polling frequency, in millisecs
    this.numForRecent  = 5;     // number of requests in recent period

    // One-time init
    this.intervalID    = null;
    this.hasRun        = false; // has the tester _ever_ run?
    this.nonce         = (new Date()).getTime();

    this.reset();
  }

  WifiTester.prototype.addToRecent = function(val) {
    this.recentRequests.push(val);

    var numToDelete = this.recentRequests.length - this.numForRecent;
    this.recentRequests.splice(0, numToDelete);
  };

  WifiTester.prototype.calc = function() {
    this.percentSuccessful = this.numResponses / this.numRequests;

    var numSuccess = this.numRecentSuccessful();
    var total = this.recentRequests.length;
    this.strengthPct = numSuccess / total * 100;
    if (numSuccess === 0) {
      this.strength = 'No Signal';
    } else if (numSuccess / total >= 4/5) {
      this.strength = 'Strong';
    } else if (numSuccess / total >= 2/5) {
      this.strength = 'Medium';
    } else {
      this.strength = 'Weak';
    }
  };

  WifiTester.prototype.markRecentSuccess = function(id, wasSuccessful) {
    for (var i = 0; i < this.recentRequests.length; i++) {
      if (this.recentRequests[i].id === id) {
        this.recentRequests[i].hasResponse = wasSuccessful;
      }
    }
  };

  WifiTester.prototype.numRecentSuccessful = function() {
    return this.recentRequests.filter(function(el) { return el.hasResponse; }).length;
  };

  WifiTester.prototype.reset = function() {
    this.numRequests       = 0;
    this.numResponses      = 0;
    this.percentSuccessful = 0;
    this.strength          = '';
    this.strengthPct       = 0;
    this.recentRequests    = [];
  };

  WifiTester.prototype.restart = function() {
    this.stop();
    this.reset();
    this.start();
  };

  WifiTester.prototype.set = function(prop, val) {
    var accepted = [
      'httpType',
      'testUrl',
      'useJsonP',
      'timeout',
      'interval',
      'numForRecent'
    ];

    if (accepted.indexOf(prop) > -1) { // is this an accepted property?
      this[prop] = val;
      return true;
    }
    return false;
  };

  WifiTester.prototype.start = function() {
    var tester = this;
    tester.hasRun = true;
    tester.isRunning = true;
    tester.intervalID = window.setInterval(function() {
      tester.test();
    }, tester.interval);
  };

  WifiTester.prototype.stop = function() {
    this.isRunning = false;

    if (this.intervalID) {
      window.clearInterval(this.intervalID);
      this.intervalID = null;
    }
  };

  WifiTester.prototype.test = function() {
    var tester = this;
    var id = tester.nonce++;
    var currentIntervalID = tester.intervalID; // track the current polling period

    tester.numRequests++;
    tester.addToRecent({
      id:          id,
      hasResponse: false
    });

    var ajax = $.ajax({
      url:      tester.testUrl,
      type:     tester.httpType,
      timeout:  tester.timeout,
      dataType: tester.useJsonP ? 'jsonp' : 'text',
      cache:    false
    });

    ajax.done(function(data, textStatus, jqXHR) {
      if (currentIntervalID === tester.intervalID) {
        tester.numResponses++;
        tester.markRecentSuccess(id, true);
      }
    });

    ajax.fail(function(jqXHR, textStatus, errorThrown) {
      if (currentIntervalID === tester.intervalID) {
        if (textStatus === 'parsererror') { // JSONP parse errors are acceptable
          tester.numResponses++;
          tester.markRecentSuccess(id, true);
        } else {
          // console.log(textStatus);
          // console.log(errorThrown);
        }
      }
    });

    ajax.always(function() {
      tester.calc();
    });
  };

  return WifiTester;
})();

var tester = new WifiTester();
