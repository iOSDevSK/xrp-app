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

        homeButton.on "touchstart", => @broadcast "openHomeView"

        @titleLabel = new Surface content: queryAccount()
        titleModifier = new Modifier
            size: [innerWidth, innerWidth]
            transform: Transform.inFront

        node.add titleModifier
            .add @titleLabel

        @subscribe background
        @subscribe @titleLabel

        @listen "touchstart", @scanQuery

        @updateQRCode()

QueryAccountView::scanQuery = ->
    QR.scanRippleURI().then (data) => @openQuery data

QueryAccountView::openQuery = (data) ->
    QR.clearNodes(@options.id)
      .then  => @resolveQuery data
      .catch => @failedQuery e

QueryAccountView::resolveQuery = ({account, parsedURI}) ->
    account.updateBalance().then =>
        @titleLabel.setContent queryAccount account: balance: account.balance
        @updateQRCode uri: parsedURI, color: "#000"

QueryAccountView::failedQuery = (e) ->
    console.error "something broke", e
    @titleLabel.setContent queryAccount error: yes
    @updateQRCode()

QueryAccountView::updateQRCode = ({uri, color} = color: "#34495e") ->
    unless uri? then uri = "ripple://rfemvFrpCAPc4hUa1v8mPRYdmaCqR1iFpe"
    divID = @options.id
    _ = -> QR.encode divID, text: uri, width: 180, height: 180, colorDark: color
    Timer.after _, 2
      
QueryAccountView.DEFAULT_OPTIONS =
    xOffset: innerWidth
    id: "qr-query"

module.exports = QueryAccountView
