# Signal Strength Tester

A simple webpage tool for testing network signal strength, using client-side Ajax requests.

![ScreenShot](https://raw.github.com/eheikes/signal-strength-tester/screenshots/images/strength.png)

## Usage

Open the [dist/index.html file](dist/index.html) in a browser, or serve it using the software of your choice (see the Development->Running section below).

The app should work in any somewhat-modern browser (Chrome, Safari, Firefox, Opera, IE7+), but older browsers may not display correctly (IE9+ recommended). Formatted to fit on any desktop or mobile device.

### Settings

![ScreenShot](https://raw.github.com/eheikes/signal-strength-tester/screenshots/images/settings.png)

Some options require the tester to be paused or restarted for changes to take effect. Other changes take effect immediately.

* Polling Interval -- How frequently the tester polls the URL. Note that browsers usually have a minimum interval of ~5ms. Defaults to 1 second.
* # of Requests in Running Total -- The tester looks at the X most recent requests to determine the current signal strength (the number of bars and quality). Defaults to 5 requests.
* Request URL -- The URL to check against. Default is [time.jsontest.com](http://time.jsontest.com/).
* HTTP Type -- The type of HTTP request to perform. Default is GET; HEAD and GET should normally be used, depending on the URL.
* Request Timeout -- How long to wait for response from the server before timing out. Default is 1 second.
* Use JSONP -- If the Request URL does not allow Ajax requests (because of the [same-origin policy](http://en.wikipedia.org/wiki/Same-origin_policy#JSONP)), you can try using this option. Default is off.

## Development

Source code is in the [app](app) folder.

### Setup

1. Install [Node & npm](http://nodejs.org/), [Grunt](http://gruntjs.com/), and [Bower](http://bower.io/) on your machine.
1. Run `npm install && bower install` on the command line, in the app directory, to install its dependencies.

### Running

Use grunt to build or serve the app.

* `grunt` by itself will build the app
* `grunt serve` will serve the development files (no build necessary)
* `grunt serve:dist` will build and serve the app

## FAQ

**Isn't the recommended practice to load JS near the bottom of the page?**

Because of the original purpose of this project, we want to minimize the rendering of the page before it is functionally ready, so the JS is loaded first (in `<head>`) rather than at the end (before `</body>`). Page responsiveness during loading is not a priority.

**Are Ajax requests a great way to judge signal strength?**

No, but it provides a simple indicator of whether a signal is getting through.

## TODO

* Track error types from failures?
* Use low-level XHR rather than jQuery Ajax to make it not download entire response?
