View = require "famous/core/view"

class XView extends View
  constructor: (options) ->
    super options

XView::addSubView = (subView) ->
    @add subView
    @subscribe subView

XView::listen = (eventName, callback) ->
    @_eventInput.on eventName, callback.bind @

XView::broadcast = (eventName, payload) ->
    @_eventOutput.emit eventName, payload

XView::pipeThrough = (events) ->
  if Array.isArray events then @pipeThrough event for event in events
  else @_eventInput.on events, (e) => @_eventOutput.emit events, e

XView::pipeThroughTouchEvents = ->
  @pipeThrough ["touchstart", "touchmove", "touchend"]

XView::Error = class XViewError extends Error
  constructor: (@message) ->
    @name = "XViewError"
    Error.captureStackTrace(this, XViewError)

XView::error = (err) ->
  throw new XView::Error err

module.exports = XView

