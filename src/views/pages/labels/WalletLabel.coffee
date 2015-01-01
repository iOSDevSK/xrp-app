SliderLabel = require "../../SliderLabel"
Modifier = require "famous/core/Modifier"
Surface = require "famous/core/Surface"
Transform = require "famous/core/Transform"

class WalletLabel extends SliderLabel
    constructor: ->
        super

        label =  new Surface
            content: "XRP"
            classes: ["wallet-label-text"]

        rotationModifier = new Modifier
            origin: [0.5, 0.5]
            align: [0, 0]
            size: [100, 100]
            transform: =>
                displacement = @progress.get()
                displacement = @options.coefficient * displacement
                Transform.rotateZ displacement

        rippleSprite = new Surface
            content: "RPPL"
            classes: ["wallet-label-sprite"]

        @add rotationModifier
        .add rippleSprite

        @add label

        @subscribe label
        @subscribe rippleSprite

WalletLabel.DEFAULT_OPTIONS =
    coefficient: 0.002

module.exports = WalletLabel

