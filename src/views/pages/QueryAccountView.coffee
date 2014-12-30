PageView = require "./PageView"
Surface = require "famous/core/Surface"
Modifier = require "famous/core/Modifier"
Transform = require "famous/core/Transform"

class QueryAccountView extends PageView
    constructor: ->
        super
        content = new Surface
            classes: ['query-account-background']
        contentModifier = new Modifier
            transform: =>
                x =  @progress.get()
                x *= @options.xOffset
                Transform.translate x, 0, 10

        @add contentModifier
        .add content

        content.on "click", => @broadcast "openHomeView"

QueryAccountView.DEFAULT_OPTIONS =
    xOffset: innerWidth

module.exports = QueryAccountView


