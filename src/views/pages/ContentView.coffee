PageView = require "./PageView"
SliderSelector = require "../SliderSelector"
Modifier = require "famous/core/Modifier"
Surface = require "famous/core/Surface"
Transitionable = require "famous/transitions/Transitionable"
Transform = require "famous/core/Transform"

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

        content = new Surface @options.content
        contentModifier = new Modifier
            transform: => Transform.translate 0, 0, -300 * @progress.get()

        @add contentModifier
        .add content

        window.cv = @

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

    sliderOffsetMultiplier: 2

    upperSelector:
        placement: SliderSelector.TOP
        leftButton:
            content: "wallet"
            event: "openWalletView"
            classes: ["left-button", "wallet-button"]
        rightButton:
            content: "send payment"
            event: "openSendPaymentView"
            classes: ["right-button", "send-payment-button"]

    lowerSelector:
        placement: SliderSelector.BOTTOM
        leftButton:
            content: "add contact"
            event: "openAddContactView"
            classes: ["left-button", "add-contact-button"]
        rightButton:
            content: "query account"
            event: "openAccountView"
            classes: ["right-button", "query-account-button"]

    filter:
        classes: ['midground-filter']

    content:
        classes: ['content']

    transition:
        method: "spring"
        period: 450
        dampingRatio: 0.5

module.exports = ContentView

