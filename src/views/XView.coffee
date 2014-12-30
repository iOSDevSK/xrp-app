View = require "famous/core/view"

class XView extends View
    constructor: (options) ->
        super options

        # Extend subscribe method from EventManager
        @_sub = @subscribe.bind @
        @subscribe = XView::subscribe
        @_thingsToListenTo = []

XView::onlyListenTo = (viewToListenTo) ->
    @_shushAll except: viewToListenTo

XView::_shushAll = ({except}) ->
    if except instanceof Array
        @_shushAll thing for thing in except
    else
        for thing in @_thingsToListenTo
            @shush thing if thing isnt except

XView::shush = (view) ->
    view.quiet?()
    @unsubscribe view

XView::unshush = (view) ->
    view.unquiet?()
    @_sub view

XView::subscribe = (view) ->
    @_sub view
                                  # if @_thingsToListenTo contains view
    @_thingsToListenTo.push view if !~(@_thingsToListenTo.indexOf view)

XView::subscribeAll = ->
    @unshush thing for thing in @_thingsToListenTo

XView::unsubscribeAll = ->
    @shush thing for thing in @_thingsToListenTo

XView::addSubView = (subView) ->
    @subscribe subView
    @add subView

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

