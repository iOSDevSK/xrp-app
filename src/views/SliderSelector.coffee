XView = require "./XView"
XButton = require "./XButton"
TouchSync = require "famous/inputs/TouchSync"
Modifier = require "famous/core/Modifier"
Transitionable = require "famous/transitions/Transitionable"
Timer = require "famous/utilities/Timer"

class SliderSelector extends XView
    constructor: (options) ->
        super

        @offset = offset = new Transitionable 0

        @leftButton = new XButton options.leftButton
        @rightButton = new XButton options.rightButton

        @subscribe @sync = new TouchSync @options.sync

        @layout = new GridLayout @options.layout
        @layout.sequenceFrom [@leftNode, @rightNode]

        @layoutModifier = new Modifier
            transform: ->
                x = offset.get()
                if x > @options.sliding.offsetThreshold
                    @broadcast options.leftButton.event
                    @reset
                if x < -@options.sliding.offsetThreshold
                    @broadcast options.rightButton.event
                    @reset
                Transform.translate x, 0, 0

        # When left button is slid far enough or thrown
            @broadcast options.leftButton.event

        # When right button is the same
            @broadcast options.rightButton.event

        @leftButton.content.on "touchstart", =>
            x = offset.get()
            x += @options.sliding.touchOffset
            offset.set x, @options.sliding.touchTransition

        @rightButton.content.on "touchstart", =>
            x = offset.get()
            x -= @options.sliding.touchOffset
            offset.set x, @options.sliding.touchTransition

        @listen "update", (event) ->
            x = offset.get()
            x += event.delta
            offset.set x

        @listen "end", @checkVelocity

    checkVelocity: (e) ->
        v_min = @options.sliding.velocityThreshold
        @reset if v_min > e.velocity < -v_min
                
    reset: ->
        @offset.set 0, @options.sliding.touchTransition
        console.log "reset offset transitionable"

SliderSelector.DEFAULT_OPTIONS =
    sync:
        direction: TouchSync.DIRECTION_X
    layout:
        dimensions: [1,2]
    sliding:
        touchOffset: 60
        offsetThreshold: 180
        velocityThreshold: 1.5
        touchTransition:
           method: "snap"

module.exports = SliderSelector

