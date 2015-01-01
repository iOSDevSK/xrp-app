SliderLabel = require "../../SliderLabel"
Modifier = require "famous/core/Modifier"
Surface = require "famous/core/Surface"
Transform = require "famous/core/Transform"

class SendPaymentLabel extends SliderLabel
    constructor: ->
        super

        label =  new Surface
            content: "Send Payment"
            classes: ["send-payment-label-text"]

        rotationModifier = new Modifier
            origin: [0.5, 0.5]
            align: [1, 0]
            size: [100, 100]
            transform: =>
                displacement = @progress.get()
                displacement = @options.coefficient * displacement
                Transform.rotateZ displacement, 0 , 1

        sentPaymentSprite = new Surface
            content: "SPMT"
            classes: ["send-payment-label-sprite"]

        @add rotationModifier
        .add sentPaymentSprite

        @add label

        @subscribe label
        @subscribe sentPaymentSprite

SendPaymentLabel.DEFAULT_OPTIONS =
    coefficient: 0.002

module.exports = SendPaymentLabel

