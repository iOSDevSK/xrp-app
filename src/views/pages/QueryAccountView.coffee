PageView = require "./PageView"
Surface = require "famous/core/Surface"
Modifier = require "famous/core/Modifier"
Transform = require "famous/core/Transform"
Timer = require "famous/utilities/Timer"
XRP = require "xrp-app-lib"

home = require "../../templates/home-button.jade"
queryAccount = require "../../templates/query-account.jade"

class QueryAccountView extends PageView
    constructor: ->
        super
        background = new Surface classes: ['query-account-background']
        positioningModifier = new Modifier
            transform: =>
                x =  @progress.get()
                x *= @options.xOffset
                Transform.translate x, 0, 10

        node = @add positioningModifier
        node.add background

        homeButton = new Surface content: home()

        homeButtonModifier = new Modifier
            size: [100, 100]
            origin: [0, 1]
            align: [0, 1]
            transform: =>
                y =  @progress.get()
                y *= 100
                Transform.translate 0, y, 1

        node.add homeButtonModifier
            .add homeButton

        homeButton.on "click", => @broadcast "openHomeView"

        @titleLabel = new Surface content: queryAccount()
        titleModifier = new Modifier
            size: [innerWidth, innerWidth]
            transform: Transform.inFront

        node.add titleModifier
            .add @titleLabel

        @subscribe background
        @subscribe @titleLabel

        @listen "click", @query
        @code = null

        @updateQRCode "rfemvFrpCAPc4hUa1v8mPRYdmaCqR1iFpe", "#7f8c8d"

QueryAccountView::query = ->
    acc = XRP.importAccountFromAddress "rfemvFrpCAPc4hUa1v8mPRYdmaCqR1iFpe"
    acc.updateBalance()
       .then (b) =>
           @clearNodes =>
               @titleLabel.setContent queryAccount accountToShow: balance: b
               @updateQRCode acc.publicKey

QueryAccountView::clearNodes = (cb) ->
    r = document.getElementById "qr-query"
    while r.firstChild
        r.removeChild r.firstChild
    cb()

QueryAccountView::updateQRCode = (key, color) ->
    Timer.after @_updateQRCode.bind(@, key, color), 2

QueryAccountView::_updateQRCode = (key, color = "#000") ->
    @code = new QRCode(document.getElementById("qr-query"),
        text: "ripple://" + key
        width: 180
        height: 180
        colorDark: color
    )

QueryAccountView.DEFAULT_OPTIONS =
    xOffset: innerWidth

module.exports = QueryAccountView

