XView = require "./XView"
Surface = require "famous/core/Surface"
ImageSurface = require "famous/surfaces/ImageSurface"
Modifier = require "famous/core/Modifier"

class XButton extends XView
  constructor: (options) ->
    super options

    surfaceType = if @options.ImageSurface then ImageSurface else Surface
    @content = new surfaceType @options
    @content.on "click", (e) =>
      @_eventOutput.emit @options.eventName, @options.eventPayload or e
    @contentModifier = new Modifier @options.modifier
    @add @contentModifier
    .add @content

    @subscribe @content

XButton.DEFAULT_OPTIONS =
  content: "Button"
  classes: ["eb-button"]
  eventName: "eb-button-clicked"
  ImageSurface: no

module.exports = XButton

