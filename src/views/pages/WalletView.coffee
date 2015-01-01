Surface = require "famous/core/Surface"
Modifier = require "famous/core/Modifier"
Transform = require "famous/core/Transform"
PageView = require "./PageView"

class WalletView extends PageView
    constructor: ->
        super
        background = new Surface
            classes: ["wallet-view-background"]

        backgroundPositioningModifier = new Modifier
            transform: =>
                x = @progress.get()
                x *= -@options.xOffset
                return Transform.translate x, 0, 10

        @node = @add backgroundPositioningModifier
        @node.add background

        @label = new Surface
            content: "Wallet"
            classes: ["wallet-view-label"]

        @node.add @label

        @subscribe background
        @subscribe @label
        @listen "click", => @broadcast "openHomeView"

WalletView.DEFAULT_OPTIONS =
    xOffset: innerWidth

module.exports = WalletView


