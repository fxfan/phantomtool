
var $wait = function(selector, callback) {

  var maxTry = 20;
  var i = 0;

  var tryToQuery = function() {
    if (i++ === maxTry) {
      throw "Can't find the element: " + selector;
    }
    var e = jQuery(selector);
    if (e.size() > 0) {
      callback(e);
    } else {
      setTimeout(tryToQuery, 200);
    }
  };

  tryToQuery();
};

