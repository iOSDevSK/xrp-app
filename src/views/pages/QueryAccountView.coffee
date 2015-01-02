PageView = require "./PageView"
Surface = require "famous/core/Surface"
Modifier = require "famous/core/Modifier"
Transform = require "famous/core/Transform"
Timer = require "famous/utilities/Timer"
Promise = require "bluebird"
XRP = require "xrp-app-lib"
QR = require "../../lib/qr"

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

        Timer.after @updateQRCode.bind(@), 2

QueryAccountView::query = ->
    QR.scanRippleURI()
      .then (data) => QR.clearNodes(@options.id).then -> data
      .then (data) => @resolveQuery data
      .catch (e)   => @failedQuery e

QueryAccountView::resolveQuery = ({account, parsedURI}) ->
    account.updateBalance()
           .then =>
               @titleLabel.setContent queryAccount accountToShow: balance: account.balance
               @updateQRCode uri: parsedURI, color: "#000"

QueryAccountView::failedQuery = (e) ->
    console.error "something broke", e
    @titleLabel.setContent queryAccount error: yes
    @updateQRCode()

QueryAccountView::updateQRCode = ({uri, color} = color: "#34495e") ->
    unless uri? then uri = "ripple://rfemvFrpCAPc4hUa1v8mPRYdmaCqR1iFpe"
    _encode = (div) ->
        QR.encode div,
            text: uri
            width: 180
            height: 180
            colorDark: color

    Timer.after _encode.bind(null, "qr-query"), 10
      
QueryAccountView.DEFAULT_OPTIONS =
    xOffset: innerWidth
    id: "qr-query"

QueryAccountView::Error = class QueryAccountViewError extends PageView::Error
QueryAccountView::Exit  = class QueryAccountViewExitError extends PageView::Error

module.exports = QueryAccountView
