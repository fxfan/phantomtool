
module.exports.create = (page) -> 
  new PhantomTool page

PhantomTool = (page) ->
  this.page = page
  this.$ = require './lib/jquery-1.11.3.min.js'
  this.logger = new DefaultLogger()
  return

PhantomTool.prototype =

  begin: ->
    this.$.Deferred().resolve().promise()

  visit: (url) ->
    =>
      dfd = this.$.Deferred()
      this.page.open url, (status) ->
        if status == 'success'
          dfd.resolve()
        else
          dfd.reject "Visiting #{url} failed with status: #{status}"
      dfd.promise()

  tryVisiting: (url) ->
    =>
      this.page.open url, (status) ->
      this.$.Deferred().resolve().promise()

  checkCurrentUrl: (regex) ->
    =>
      dfd = this.$.Deferred()
      if !!this.page.url.match regex
        dfd.resolve()
      else
        dfd.reject "The current URL doesn't match #{regex}"

  eval: ->
    args = Array.prototype.slice.call arguments
    => this.page.evaluate.apply this.page, args
  
  sleep: (ms) ->
    =>
      this.logger.debug "Wait #{ms}ms"
      dfd = this.$.Deferred()
      setTimeout (-> dfd.resolve()), ms
      dfd.promise()

  wait: (ms) ->
    for: =>
      args = Array.prototype.slice.call arguments
      first = args[0]
      =>
        this.logger.debug "Wait #{ms}ms for #{first}"
        dfd = this.$.Deferred()

        evaluate = 
        if typeof first == 'function' then =>
          this.page.evaluate.apply this.page, args
        else =>
          this.page.evaluate (selector) ->
            document.querySelector selector
          , String first

        maxTry = Math.floor ms / 500
        i = 0
        lastUrl = null

        test = =>
          if i++ >= maxTry
            t = new Date().getTime()
            this.page.render "fail_to_wait_#{t}.jpg", { format: 'jpeg' }
            dfd.reject "Can't find the element: #{first}"
            return
          if lastUrl != this.page.url
            this.logger.debug "  waiting... #{this.page.url}"
            lastUrl = this.page.url
          if evaluate()
            dfd.resolve()
          else
            setTimeout test, 500

        test()
        dfd.promise()

  wait30sec: ->
    w = this.wait 30 * 1000
    w.for.apply w, arguments

  injectLibraries: ->
    =>
      this.logger.debug 'Inject JS libraries'
      dfd = this.$.Deferred()
      this.page.injectJs 'lib/jquery-1.11.3.min.js'
      this.page.injectJs 'lib/bililiteRange.min.js'
      this.page.injectJs 'lib/jquery.sendkeys.min.js'
      this.page.injectJs 'lib/tool.js'
      this.page.evaluate -> jQuery.noConflict()
      dfd.resolve().promise()


  debugTitle: ->
    => this.logger.debug "document.title: #{this.page.evaluate ->document.title}"

  debugEval: ->
    args = Array.prototype.slice.call arguments
    =>
      v = this.page.evaluate.apply this.page, args
      this.logger.debug v if v

  logDebug: (msg) -> => this.logger.debug msg
  logInfo:  (msg) -> => this.logger.info  msg
  logWarn:  (msg) -> => this.logger.warn  msg
  logError: (msg) -> => this.logger.error msg
  logFatal: (msg) -> => this.logger.fatal msg

DefaultLogger = ->
DefaultLogger.prototype =
  debug: (msg) -> console.log "[DEBUG] #{msg}"
  info:  (msg) -> console.log "[INFO] #{msg}"
  warn:  (msg) -> console.log "[WARN] #{msg}"
  error: (msg) -> console.log "[ERROR] #{msg}"
  fatal: (msg) -> console.log "[FATAL] #{msg}"
