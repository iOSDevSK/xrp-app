XView = require "./XView"
Engine = require "famous/core/Engine"
Transitionable = require "famous/transitions/Transitionable"

class SliderLabel extends XView
    constructor: ->
        super
        @progress = new Transitionable 0
        Engine.on "prerender", =>
            p = @progress.get()
            p++
            @progress.set p

        @pipeThroughTouchEvents()
            
module.exports = SliderLabel

