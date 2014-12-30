PageView = require "./PageView"
Surface = require "famous/core/Surface"
Modifier = require "famous/core/Modifier"
Transform = require "famous/core/Transform"

class SendPaymentView extends PageView
    constructor: ->
        super
        content = new Surface content: "go home", properties: backgroundColor: 'purple'
        contentModifier = new Modifier
            transform: =>
                x =  @progress.get()
                x *= @options.xOffset
                Transform.translate x, 0, 10

        @add contentModifier
        .add content

        content.on "click", => @broadcast "openHomeView"

SendPaymentView.DEFAULT_OPTIONS =
    xOffset: innerWidth

module.exports = SendPaymentView


