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

        @leftButton = new XButton options.leftButton
        @rightButton = new XButton options.rightButton

        @subscribe @leftSync = leftSync = new TouchSync @options.sync
        @subscribe @rightSync = rightSync = new TouchSync @options.sync

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
                if x < -@options.sliding.offsetThreshold
                    @broadcast options.rightButton.event
                Transform.translate x, 0, 0

        leftSync.on "start", =>
            @broadcast "touchDownOnView", @
            x = offset.get()
            x += @options.sliding.touchOffset
            offset.set x, @options.sliding.touchTransition

        rightSync.on "start", =>
            @broadcast "touchDownOnView", @
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
            @broadcast "touchUpOnView"
            if @checkVelocity e then @broadcast options.leftButton.event

        rightSync.on "end", (e) =>
            @broadcast "touchUpOnView"
            if @checkVelocity e then @broadcast options.rightButton.event

        layoutNode = @add layoutModifier
        leftNode = layoutNode.add leftModifier
        leftNode.add new Modifier origin: [1, 0], align: [1, 0], size: [innerWidth, undefined]
                .add @leftButton
        rightNode = layoutNode.add rightModifier

        rightNode.add new Modifier origin: [0, 0], align: [0, 0], size: [innerWidth, undefined]
                 .add @rightButton

SliderSelector::quiet = ->
    @leftButton.unpipe @leftSync
    @rightButton.unpipe @rightSync
        
SliderSelector::unquiet = ->
    @leftButton.pipe @leftSync
    @rightButton.pipe @rightSync

SliderSelector::checkVelocity = (e) ->
    @reset e
    v_max = @options.sliding.velocityThreshold
    v_max > e.velocity > -v_max
                
SliderSelector::reset = (e = {velocity: 0}) ->
    @offset.set 0, method: "spring", period: 400, dampingRatio: 0.6, velocity: -e.velocity

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
           method: "spring"
           period: 300
           dampingRatio: 0.5

module.exports = SliderSelector

