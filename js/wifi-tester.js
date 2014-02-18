var WifiTester = (function() {
  function WifiTester() {
    this.httpType = 'HEAD';
    this.testUrl  = 'http://ajax.googleapis.com/ajax/services/search/web?v=1.0&q=test';
    this.useJsonP = true;
    this.timeout  = 1000; // request timeout, in millisecs
    this.interval = 1000; // polling frequency, in millisecs

    this.reset();
  }

  WifiTester.prototype.calc = function() {
    this.percentSuccessful = this.numRequests / this.numResponses * 100;

    if (this.numResponses === 0) {
      this.strength = 'No Signal';
    } else if (this.percentSuccessful >= 4/5 * 100) {
      this.strength = 'Strong';
    } else if (this.percentSuccessful >= 2/5 * 100) {
      this.strength = 'Medium';
    } else {
      this.strength = 'Weak';
    }
  };

  WifiTester.prototype.reset = function() {
    this.isRunning         = false;
    this.numRequests       = 0;
    this.numResponses      = 0;
    this.percentSuccessful = 0;
    this.strength          = '';

    if (this.intervalID) {
      window.clearInterval(this.intervalID);
      this.intervalID = null;
    }
  };

  WifiTester.prototype.restart = function() {
    this.reset();
    this.start();
  };

  WifiTester.prototype.start = function() {
    var tester = this;
    tester.isRunning = true;
    tester.intervalID = window.setInterval(function() {
      tester.test();
    }, tester.interval);
  };

  WifiTester.prototype.test = function() {
    var tester = this;

    tester.numRequests++;

    var ajax = $.ajax({
      url:      tester.testUrl,
      type:     tester.httpType,
      timeout:  tester.timeout,
      dataType: tester.useJsonP ? 'jsonp' : 'text',
      cache:    false
    });

    ajax.done(function(data, textStatus, jqXHR) {
      tester.numResponses++;
      tester.calc();
    });

    ajax.fail(function(jqXHR, textStatus, errorThrown) {
      tester.calc();
      console.log(textStatus);
      console.log(errorThrown);
    });
  };

  return WifiTester;
})();

var tester = new WifiTester();
