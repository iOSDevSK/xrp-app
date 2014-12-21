XView = require "../XView"
Transitionable = require "famous/transitions/Transitionable"

class PageView extends XView
    constructor: ->
        super
        @progress = new Transitionable 0

    transition:
        method: "spring"
        period: 800
        dampingRatio: 0.8

    name: "page"
    hide:  ->
        @progress.set 0, @transition
    focus: ->
        @progress.set 1, @transition

module.exports = PageView

