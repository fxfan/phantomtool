var account = 'appdev@everforth.co.jp';
var password = 'EverJ3nk1nS';
var devAcc = null;

var page = require('webpage').create();
var tool = require('./index.js').create(page);

var loginUrl = 
  'https://accounts.google.com/ServiceLogin' +
  '?service=androiddeveloper&continue=https://play.google.com/apps/publish/';

var login = function() {
  return function() {
    return tool.begin()
      .then(tool.visit(loginUrl))
      .then(tool.checkCurrentUrl(/accounts\.google\.com\/ServiceLogin/))
      .then(tool.logInfo('Visited Google Account login page'))
      .then(tool.injectLibraries())
      .then(tool.eval(function(account) {
        jQuery('#Email').val(account);
        jQuery('#next').click();
      }, account))
      .then(tool.wait(30000).for('#Passwd'))
      .then(tool.logInfo('Input the account: ' + account))
      .then(tool.injectLibraries())
      .then(tool.eval(function(password) {
        jQuery('#Passwd').val(password);
        jQuery('#signIn').click();
      }, password))
      .then(tool.wait(30000).for('[href*="accounts/Logout"]'))
      .then(function() {
        devAcc = page.url.match(/dev_acc=(\d+)/)[1];
      })
      .then(tool.logInfo('Login OK'))
      .then(function() {
        tool.logger.info('Detected dev_acc: ' + devAcc);
      })
      .then(tool.injectLibraries());
  };
};

tool.begin()
  .then(login())
  .done(function() {
    phantom.exit();
  })
  .fail(function(e) {
    tool.logger.error(e);
    phantom.exit();
  })