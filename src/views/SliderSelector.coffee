XView = require "./XView"
XButton = require "./XButton"
TouchSync = require "famous/inputs/TouchSync"
Modifier = require "famous/core/Modifier"
Transform = require "famous/core/Transform"
Transitionable = require "famous/transitions/Transitionable"
RenderNode = require "famous/core/RenderNode"
GridLayout = require "famous/views/GridLayout"
Timer = require "famous/utilities/Timer"
Surface = require "famous/core/Surface"

class SliderSelector extends XView
    constructor: (options) ->
        super

        @offset = offset = new Transitionable 0

#@leftButton = new XButton options.leftButton
#@rightButton = new XButton options.rightButton
        @leftButton = new XButton properties: backgroundColor: "red"
        @rightButton = new XButton properties: backgroundColor: "blue"

        @subscribe leftSync = new TouchSync @options.sync
        @subscribe rightSync = new TouchSync @options.sync

        @leftButton.pipeThroughTouchEvents()
        @leftButton.pipe leftSync
        @rightButton.pipeThroughTouchEvents()
        @rightButton.pipe rightSync

        leftModifier = new Modifier
            size: [window.innerWidth / 2, undefined]
            align: [0, 0]
            origin: [0, 0]

        rightModifier = new Modifier
            size: [window.innerWidth / 2, undefined]
            align: [1, 0]
            origin: [1, 0]

        layoutModifier = new Modifier
            size: [undefined, @options.height]
            align: [0, options.placement]
            origin: [0, options.placement]
            transform: =>
                x = offset.get()
                if x > @options.sliding.offsetThreshold
                    @broadcast options.leftButton.event
                    @reset
                if x < -@options.sliding.offsetThreshold
                    @broadcast options.rightButton.event
                    @reset
                Transform.translate x, 0, 0

        leftSync.on "start", =>
            x = offset.get()
            x += @options.sliding.touchOffset
            offset.set x, @options.sliding.touchTransition

        rightSync.on "start", =>
            x = offset.get()
            x -= @options.sliding.touchOffset
            offset.set x, @options.sliding.touchTransition

        moveSlider = (event) ->
            x = offset.get()
            x += event.delta
            offset.set x

        leftSync.on "update", moveSlider
        rightSync.on "update", moveSlider

        leftSync.on "end", (e) =>
            if @checkVelocity e then @broadcast options.leftButton.event

        rightSync.on "end", (e) =>
            if @checkVelocity e then @broadcast options.rightButton.event

        layoutNode = @add layoutModifier
        layoutNode.add leftModifier
                  .add @leftButton
        layoutNode.add rightModifier
                  .add @rightButton

    checkVelocity: (e) ->
        v_max = @options.sliding.velocityThreshold
        if v_max > e.velocity > -v_max then @reset() else true
                
    reset: ->
        @offset.set 0, @options.sliding.touchTransition
        console.log "reset offset transitionable"
        false

SliderSelector.TOP = 0
SliderSelector.BOTTOM = 1

SliderSelector.DEFAULT_OPTIONS =
    height: 80
    sync:
        direction: TouchSync.DIRECTION_X
    layout:
        dimensions: [1,2]
    sliding:
        touchOffset: 60
        offsetThreshold: 180
        velocityThreshold: 2
        touchTransition:
           method: "snap"

module.exports = SliderSelector

