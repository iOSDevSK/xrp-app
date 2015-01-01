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
        super options

        # Create transitionables for dragging
        @offset = offset = new Transitionable 0
        @dragOffset = dragOffset = new Transitionable 0

        # Add left and right buttons
        @leftButton = new XButton options.leftButton
        @rightButton = new XButton options.rightButton

        @leftLabel = new options.leftLabelMaker
        @rightLabel = new options.rightLabelMaker

        # Add left and right touchSyncs
        @subscribe @leftSync = leftSync = new TouchSync @options.sync
        @subscribe @rightSync = rightSync = new TouchSync @options.sync

        # Coordinate eventing
        #
        # Piping through touch events inside the XButton instances
        # to then pipe to the touchsyncs
        #
        @leftButton.pipeThroughTouchEvents()
        @rightButton.pipeThroughTouchEvents()
        @unquiet()

        # Positioning modifiers for left and right root nodes
        # Sizing modifiers will be added to these
        leftPositioningModifier = new Modifier
            size: [innerWidth / 2, undefined]
            align: [0, 0]
            origin: [0, 0]

        leftSizingModifier = new Modifier
            origin: [1, 0]
            align: [1, 0]
            size: [@options.buttonWidth, undefined]

        leftLabelPositioningModifier = new Modifier
            origin: [1, 0]
            align: [1, 0]
            size: [innerWidth / 2, undefined]

        rightPositioningModifier = new Modifier
            size: [window.innerWidth / 2, undefined]
            align: [1, 0]
            origin: [1, 0]

        rightSizingModifier = new Modifier
            origin: [0, 0]
            align: [0, 0]
            size: [@options.buttonWidth, undefined]

        rightLabelPositioningModifier = new Modifier
            origin: [0, 0]
            align: [0, 0]
            size: [innerWidth / 2, undefined]

        # Layout modifier for the slider
        layoutModifier = new Modifier
            size: [undefined, @options.height]
            align: [0, options.placement]
            origin: [0, options.placement]
            transform: =>
                x = offset.get() + dragOffset.get()
                if x > @options.sliding.offsetThreshold
                    @broadcast options.leftButton.event
                if x < -@options.sliding.offsetThreshold
                    @broadcast options.rightButton.event
                Transform.translate x, 0, 0

        # Set up event listeners
        leftSync.on "start", =>
            @_quietRight()
            @broadcast "touchDownOnView", @
            x = offset.get()
            x += @options.sliding.touchOffset
            offset.set x, @options.sliding.touchTransition

        rightSync.on "start", =>
            @_quietLeft()
            @broadcast "touchDownOnView", @
            x = offset.get()
            x -= @options.sliding.touchOffset
            offset.set x, @options.sliding.touchTransition

        moveSlider = (event) ->
            x = dragOffset.get()
            x += event.delta
            dragOffset.set x

        leftSync.on "update", moveSlider
        rightSync.on "update", moveSlider

        leftSync.on "end", (e) =>
            @_unquietRight()
            @broadcast "touchUpOnView"
            if @checkVelocity e then @broadcast options.leftButton.event

        rightSync.on "end", (e) =>
            @_unquietLeft()
            @broadcast "touchUpOnView"
            if @checkVelocity e then @broadcast options.rightButton.event
        # End Eventing

        # Set up scene graph linkings
        layoutNode = @add layoutModifier

        leftNode = layoutNode.add leftPositioningModifier
                             .add leftSizingModifier

        leftNode.add @leftButton
        leftNode.add leftLabelPositioningModifier
                .add @leftLabel

        rightNode = layoutNode.add rightPositioningModifier
                              .add rightSizingModifier

        rightNode.add @rightButton
        rightNode.add rightLabelPositioningModifier
                 .add @rightLabel

SliderSelector::quiet = -> @_quietLeft() and @_quietRight()
SliderSelector::unquiet = -> @_unquietLeft() and @_unquietRight()

SliderSelector::_quietLeft = ->
    @leftButton.unpipe @leftSync
    @leftLabel.unpipe @leftSync

SliderSelector::_quietRight = ->
    @rightButton.unpipe @rightSync
    @rightLabel.unpipe @rightSync

SliderSelector::_unquietLeft = ->
    @leftButton.pipe @leftSync
    @leftLabel.pipe @leftSync

SliderSelector::_unquietRight = ->
    @rightButton.pipe @rightSync
    @rightLabel.pipe @rightSync

SliderSelector::checkVelocity = ({velocity}) ->
    @reset velocity: velocity
    v_max = @options.sliding.velocityThreshold
    console.log velocity, v_max < velocity or velocity < -v_max
    v_max < velocity or velocity < -v_max
                
SliderSelector::reset = ({hasTransition, velocity} = {velocity: 0}) ->
    unless hasTransition? then transition =
        method: "spring"
        period: 400
        dampingRatio: 0.6
        velocity: -velocity

    @offset.set 0, transition
    @dragOffset.set 0, transition
    @unquiet()

SliderSelector.TOP = 0
SliderSelector.BOTTOM = 1

SliderSelector.DEFAULT_OPTIONS =
    height: 80
    buttonWidth: innerWidth * 2
    sync:
        direction: TouchSync.DIRECTION_X
    layout:
        dimensions: [1,2]
    sliding:
        touchOffset: 60
        offsetThreshold: 200
        velocityThreshold: 0.75
        touchTransition:
           method: "spring"
           period: 300
           dampingRatio: 0.5

module.exports = SliderSelector

