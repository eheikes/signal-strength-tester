var WifiTester = (function() {
  function WifiTester() {
    this.httpType = 'GET';
    this.testUrl  = 'http://192.168.0.1/test-payload.txt';
    this.useJsonP = false;
    this.timeout  = 1000; // request timeout, in millisecs
    this.interval = 1000; // polling frequency, in millisecs

    this.reset();
  }

  WifiTester.prototype.calc = function() {
    this.percentSuccessful = this.numResponses / this.numRequests;

    if (this.numResponses === 0) {
      this.strength = 'No Signal';
    } else if (this.percentSuccessful >= 4/5) {
      this.strength = 'Strong';
    } else if (this.percentSuccessful >= 2/5) {
      this.strength = 'Medium';
    } else {
      this.strength = 'Weak';
    }
  };

  WifiTester.prototype.reset = function() {
    this.numRequests       = 0;
    this.numResponses      = 0;
    this.percentSuccessful = 0;
    this.strength          = '';
  };

  WifiTester.prototype.restart = function() {
    this.stop();
    this.reset();
    this.start();
  };

  WifiTester.prototype.set = function(prop, val) {
    var accepted = ['httpType', 'testUrl', 'useJsonP', 'timeout', 'interval'];
    if (accepted.indexOf(prop) > -1) { // is this an accepted property?
      this[prop] = val;
      return true;
    }
    return false;
  };

  WifiTester.prototype.start = function() {
    var tester = this;
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
    var currentIntervalID = tester.intervalID; // track the current polling period

    tester.numRequests++;

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
      }
    });

    ajax.fail(function(jqXHR, textStatus, errorThrown) {
      if (currentIntervalID === tester.intervalID) {
        if (textStatus === 'parsererror') { // JSONP parse errors are acceptable
          tester.numResponses++;
        } else {
          console.log(textStatus);
          console.log(errorThrown);
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