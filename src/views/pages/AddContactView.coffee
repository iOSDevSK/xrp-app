Surface = require "famous/core/Surface"
Modifier = require "famous/core/Modifier"
Transitionable = require "famous/transitions/Transitionable"
PageView = require "./PageView"

class AddContactView extends PageView
    name: "addContactView"
    constructor: ->
        super
        @background = new Surface
            classes: ["add-contact-view-background"]

        @positioningModifier = new Modifier
            transform: =>
                x = innerWidth * (@progress.get() - 1)
                return Transform.translate x, 0, 0

        @add @positioningModifier
        .add new Modifier transform: Transform.translate 0, 0, -1
        .add @background

        @label = new Surface
            classes: ["add-contact-view-label"]
            content: "Add Contact View"


module.exports = AddContactView

