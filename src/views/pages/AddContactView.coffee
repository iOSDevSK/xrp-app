Surface = require "famous/core/Surface"
Modifier = require "famous/core/Modifier"
Transform = require "famous/core/Transform"
PageView = require "./PageView"

class AddContactView extends PageView
    constructor: ->
        super
        background = new Surface
            classes: ["add-contact-view-background"]

        backgroundPositioningModifier = new Modifier
            transform: =>
                x = @progress.get()
                x *= -@options.xOffset
                return Transform.translate x, 0, 10

        @node = @add backgroundPositioningModifier
        @node.add background

        @label = new Surface
            content: "Add Contact View"
            classes: ["add-contact-view-label"]

        @node.add @label

        @subscribe background
        @subscribe @label
        @listen "click", => @broadcast "openHomeView"

AddContactView.DEFAULT_OPTIONS =
    xOffset: innerWidth

module.exports = AddContactView

