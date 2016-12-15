module.exports.create = function(page) {
  return new PhantomTool(page);
};


var PhantomTool = function(page) {
  this.page = page;
  this.$ = require('jquery');
  this.logger = new DefaultLogger();
};

PhantomTool.prototype = {

  visit: function(url) {
    var self = this;
    return function() {
      var dfd = self.$.Deferred();
      self.page.open(url, function(status) {
        if (status === 'success') {
          dfd.resolve();
        } else {
          dfd.reject("Visiting " + url + " failed with status: " + status);
        }
      });
      return dfd.promise();
    };
  },

  // Visit the url and mark the deferred as resolved immediately
  // without waiting for the response.
  tryVisiting: function(url) {
    var self = this;
    return function() {
      self.page.open(url, function(status) {});
      return self.$.Deferred().resolve().promise();
    };
  },

  checkCurrentUrl: function(regex) {
    var self = this;
    return function() {
      var dfd = this.$.deferred();
      if (!!self.page.url.match(regex)) {

      } else {

      }
    }
  },

  eval: function() {
    var args = Array.prototype.slice.call(arguments);
    return function() {
      var v = this.page.evaluate.apply(this.page, args);
      if (v) {
        console.log('Evaluation result: ' + v);
      }
    };
  },

  debugTitle: function() {
    var self = this;
    return function() {
      var title = self.page.evaluate(function() {
        return document.title;
      });
      self.logger.debug("document.title: " + title);
    };
  },

  log: function(msg, level) {
    var self = this;
    return function() {
      self.logger[level](msg);
    };
  },

  logDebug: function(msg) {
    return this.log(msg, 'debug');
  },
  
  logInfo: function(msg) {
    return this.log(msg, 'info');
  },
  
  logWarn: function(msg) {
    return this.log(msg, 'warn');
  },
  
  logError: function(msg) {
    return this.log(msg, 'error');
  },

  logFatal: function(msg) {
    return this.log(msg, 'fatal');
  }
};

var DefaultLogger = function() {
};
DefaultLogger.prototype = {
  debug: function(msg) {
    console.log('[DEBUG] ' + msg);
  },
  info: function(msg) {
    console.log('[INFO] ' + msg);
  },
  warn: function(msg) {
    console.log('[WARN] ' + msg);
  },
  error: function(msg) {
    console.log('[ERROR] ' + msg);
  },
  fatal: function(msg) {
    console.log('[FATAL] ' + msg);
  }
};

