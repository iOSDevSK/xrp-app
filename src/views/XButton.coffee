XView = require "./XView"
Surface = require "famous/core/Surface"
ImageSurface = require "famous/surfaces/ImageSurface"
Modifier = require "famous/core/Modifier"

class XButton extends XView
  constructor: (options) ->
    super options

    @options.classes.push "button"

    surfaceType = if @options.ImageSurface then ImageSurface else Surface
    @content = new surfaceType @options

    @content.on "click", (e) => @onClick e
    @content.on "touchstart", (e) => @onPressDown e
    @content.on "touchend", (e) => @onPressUp e

    @contentModifier = new Modifier @options.modifier
    @add @contentModifier
    .add @content

    @subscribe @content

  onPressDown: () -> console.log 'press down', @, Date.now()
  onPressUp: () -> console.log 'press up', @, Date.now()
  onClick: (e) ->
    @_emit e
    console.log 'click', @, Date.now()

  _emit: (e) ->
    @broadcast @options.eventName, @options.eventPayload or e

XButton.DEFAULT_OPTIONS =
  content: ""
  classes: [] #default CSS class added on ln#10
  eventName: "button-clicked"
  ImageSurface: no

module.exports = XButton

