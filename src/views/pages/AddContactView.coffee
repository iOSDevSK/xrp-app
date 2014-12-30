Surface = require "famous/core/Surface"
Modifier = require "famous/core/Modifier"
Transform = require "famous/core/Transform"
PageView = require "./PageView"

class AddContactView extends PageView
    constructor: ->
        super
        background = new Surface
            classes: ["add-contact-view-background"]
            properties: backgroundColor: 'blue'

        backgroundPositioningModifier = new Modifier
            transform: =>
                x = @progress.get()
                x *= -@options.xOffset
                return Transform.translate x, 0, 10

        @add backgroundPositioningModifier
        .add background

        @label = new Surface
            classes: ["add-contact-view-label"]
            content: "Add Contact View"

        background.on "click", => @broadcast "openHomeView"

AddContactView.DEFAULT_OPTIONS =
    xOffset: innerWidth

module.exports = AddContactView

