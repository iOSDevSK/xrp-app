SliderLabel = require "../../SliderLabel"
Modifier = require "famous/core/Modifier"
Surface = require "famous/core/Surface"
Transform = require "famous/core/Transform"

class AddContactLabel extends SliderLabel
    constructor: ->
        super

        label = new Surface
            content: "Add Contact"
            classes: ["add-contact-label-text"]

        rotationModifier = new Modifier
            origin: [0, 1]
            align: [0, 1]
            size: [50, 50]
            transform: =>
                displacement = @progress.get()
                displacement = Math.sin @options.coefficient * displacement
                Transform.translate displacement, 0, 1

        contactSprite = new Surface
            content: "CTCT"
            classes: ["add-contact-label-sprite"]

        @add rotationModifier
        .add contactSprite

        @add label

        @subscribe contactSprite
        @subscribe label

AddContactLabel.DEFAULT_OPTIONS =
    coefficient: 50

module.exports = AddContactLabel

