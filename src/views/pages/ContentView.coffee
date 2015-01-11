PageView = require "./PageView"
SliderSelector = require "../SliderSelector"
Modifier = require "famous/core/Modifier"
Surface = require "famous/core/Surface"
Transitionable = require "famous/transitions/Transitionable"
Transform = require "famous/core/Transform"
Timer = require "famous/utilities/Timer"

#Slider labels
AddContactLabel = require "./labels/AddContactLabel"
SendPaymentLabel = require "./labels/SendPaymentLabel"
WalletLabel = require "./labels/WalletLabel"
QueryAccountLabel = require "./labels/QueryAccountLabel"

defaultContentTemplate = require "../../templates/default-content.jade"

QR = require "../../lib/qr"

class ContentView extends PageView
    constructor: ->
        super
        @progress.set 0

        @sliderTransitionable = new Transitionable 0

        @subscribe @upperSlider = new SliderSelector @options.upperSelector
        @subscribe @lowerSlider = new SliderSelector @options.lowerSelector
        @pipeThrough [
            "openWalletView"
            "openSendPaymentView"
            "openAddContactView"
            "openAccountView"
        ]

        @listen "touchDownOnView", (view) => @onlyListenTo view
        @listen "touchUpOnView", ->
            @subscribeAll()

        upperSliderPositioningModifier = new Modifier
            transform: =>
                y = @sliderTransitionable.get()
                y *= SliderSelector.DEFAULT_OPTIONS.height
                y *= -@options.sliderOffsetMultiplier
                Transform.translate 0, y, 1

        lowerSliderPositioningModifier = new Modifier
            transform: =>
                y = @sliderTransitionable.get()
                y *= SliderSelector.DEFAULT_OPTIONS.height
                y *= @options.sliderOffsetMultiplier
                Transform.translate 0, y, 1

        @add upperSliderPositioningModifier
        .add @upperSlider

        @add lowerSliderPositioningModifier
        .add @lowerSlider

        filter = new Surface @options.filter
        filterModifier = new Modifier
            transform: Transform.translate 0, 0, -1
            opacity: => @progress.get()

        @add filterModifier
        .add filter

        contentBackground = new Surface @options.contentBackground
        positioningModifier = new Modifier
            origin: [0.5, 0.5]
            align: [0.5, 0.5]
            transform: => Transform.translate 0, 0, -1000 * @progress.get()

        contentNode = @add positioningModifier
        contentNode.add contentBackground

        contentPositioningModifier = new Modifier
            size: [innerWidth, innerWidth]
            transform: Transform.translate 0, 0, 1

        @content = new Surface
            content: defaultContentTemplate()
            classes: ['content']

        @content.on "click", => @broadcast "content-clicked"

        contentNode.add contentPositioningModifier
                   .add @content

        @showDefaultContent()

ContentView::setContent = (data) ->
    @content.setContent data

ContentView::showDefaultContent = ->
    @setContent defaultContentTemplate()
    divID = @options.id
    console.log divID
    __ = ->
        QR.encode divID, text: QR.defaultURI, width: 180, height: 180, colorDark: "#666"

    _ = =>
        QR.clearNodes @options.id
          .then -> Timer.after __, 3

    Timer.after _, 3

ContentView::showSliders = ->
    @sliderTransitionable.set 0, @transition, => @_subscribeSliders()

ContentView::hideSliders = ->
    @_unsubscribeSliders()
    @sliderTransitionable.set 1, @transition

ContentView::resetSliders = ->
    @upperSlider.reset velocity: 0, hasTransition: no
    @lowerSlider.reset velocity: 0, hasTransition: no
    @showSliders()

ContentView::_subscribeSliders = ->
    @subscribe @upperSlider
    @subscribe @lowerSlider

ContentView::_unsubscribeSliders = ->
    @unsubscribe @upperSlider
    @unsubscribe @lowerSlider

ContentView::hide = ->
    super
    @hideSliders()

ContentView::focus = ->
    super
    @resetSliders()

ContentView::transition = duration: 800, curve: 'easeOut'

ContentView.DEFAULT_OPTIONS =

    id: "qr-default"

    height: innerHeight - 2 * SliderSelector.DEFAULT_OPTIONS.height

    sliderOffsetMultiplier: 2

    upperSelector:
        height: SliderSelector.DEFAULT_OPTIONS.height + 20
        placement: SliderSelector.TOP
        leftLabelMaker: WalletLabel
        leftButton:
            event: "openWalletView"
            classes: ["left-button", "wallet-button"]
        rightLabelMaker: SendPaymentLabel
        rightButton:
            event: "openSendPaymentView"
            classes: ["right-button", "send-payment-button"]

    lowerSelector:
        placement: SliderSelector.BOTTOM
        leftLabelMaker: AddContactLabel
        leftButton:
            event: "openAddContactView"
            classes: ["left-button", "add-contact-button"]
        rightLabelMaker: QueryAccountLabel
        rightButton:
            event: "openAccountView"
            classes: ["right-button", "query-account-button"]

    filter:
        classes: ['midground-filter']

    contentBackground:
        classes: ['content-background']

    transition:
        method: "spring"
        period: 450
        dampingRatio: 0.5

module.exports = ContentView

