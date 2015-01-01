SliderLabel = require "../../SliderLabel"
Modifier = require "famous/core/Modifier"
Surface = require "famous/core/Surface"
Transform = require "famous/core/Transform"

class QueryAccountLabel extends SliderLabel
    constructor: ->
        super

        label =  new Surface
            content: "Query Account"
            classes: ["query-account-label-text"]

        rotationModifier = new Modifier
            origin: [0.5, 0.5]
            align: [1, 1]
            size: [100, 100]
            transform: =>
                displacement = @progress.get()
                # a = k_c * (1/2 * (sin(k_t * t))) + k_o
                displacement = @options.offset +
                    @options.coefficient * 0.5 *
                    Math.sin @options.timeCoefficient * displacement
                Transform.rotateZ displacement

        queryAccountSprite = new Surface
            content: "SGSS"
            classes: ["query-account-label-sprite"]

        @add rotationModifier
        .add queryAccountSprite

        @add label

        @subscribe label
        @subscribe queryAccountSprite

QueryAccountLabel.DEFAULT_OPTIONS =
    coefficient: Math.PI / 4
    offset: -Math.PI / 7
    timeCoefficient: 0.02

module.exports = QueryAccountLabel

