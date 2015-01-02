PageView = require "./PageView"
Surface = require "famous/core/Surface"
Modifier = require "famous/core/Modifier"
Transform = require "famous/core/Transform"
Timer = require "famous/utilities/Timer"
Promise = require "bluebird"
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

        @listen "touchstart", @query
        @code = null

        @updateQRCode()

QueryAccountView::query = ->
    success = (_) => @resolveQuery _
    failure = => @failedQuery()
    cordova.plugins.barcodeScanner.scan success, failure

QueryAccountView::resolveQuery = ({text}) ->
    Promise.resolve (text)
           .then (_text) ->
               data = XRP.decodeURI _text

           .then (data) =>
               address = data.address or data.to or throw new QueryAccountView::Exit
               XRP.importAccountFromAddress address

           .then (account) ->
               account.updateBalance().then -> account

           .then (account) =>
               @clearNodes().then -> account

           .then (account) =>
               @titleLabel.setContent queryAccount accountToShow: balance: account.balance
               @updateQRCode account.publicKey

           .catch QueryAccountView::Exit, ->
               @failedQuery()

           .catch (e) =>
               console.error "something else went wrong", e
               @failedQuery()

QueryAccountView::failedQuery = ->
    @clearNodes().then =>
        @titleLabel.setContent queryAccount error: yes
        @updateQRCode()

QueryAccountView::clearNodes = ->
    r = document.getElementById "qr-query"
    while r.firstChild
        r.removeChild r.firstChild
    Promise.resolve()

QueryAccountView::updateQRCode = (key = "rfemvFrpCAPc4hUa1v8mPRYdmaCqR1iFpe",
                                  color = "#7f8c8d") ->
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

QueryAccountView::Error = class QueryAccountViewError extends PageView::Error
QueryAccountView::Exit  = class QueryAccountViewExitError extends PageView::Error

module.exports = QueryAccountView

