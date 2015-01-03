PageView = require "./PageView"
Surface = require "famous/core/Surface"
Modifier = require "famous/core/Modifier"
Transform = require "famous/core/Transform"
Timer = require "famous/utilities/Timer"
XRP = require "xrp-app-lib"
QR = require "../../lib/qr"
helpers = require "../../lib/helpers"

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
    QR.scanRippleURI()
      .then @openQuery.bind @
      .catch QR.CloseScannerError, =>
          @setContent error: "closedScanner"
          @resetDefaultQRCode()
      .catch QR.ScannerNotAvailableError, =>
          @setContent error: "scannerNotAvailable"
          @resetDefaultQRCode()
      .catch XRP.Errors.URIError, =>
          @setContent error: "parseError"
          @resetDefaultQRCode()

QueryAccountView::setContent = (options) ->
    @titleLabel.setContent queryAccount options

QueryAccountView::resetDefaultQRCode = ->
    QR.clearNodes @options.id
      .then => @updateQRCode()

QueryAccountView::openQuery = (data) ->
    console.log "open query", data
    QR.clearNodes @options.id
      .then => @resolveQuery data

QueryAccountView::resolveQuery = ({account, parsedURI}) ->
    console.log "resolve query", account, parsedURI
    account.updateBalance()
           .then =>
               console.log "balance updated"
               @setContent
                 account:
                   balance: helpers.truncateThousandths account.balance
               @updateQRCode uri: parsedURI, color: "#000"
           .catch XRP.Errors.NetworkError, (e) =>
               console.log "network not available"
               @setContent error: "networkError"
               @updateQRCode()

QueryAccountView::updateQRCode = ({uri, color} = color: "#34495e") ->
    unless uri? then uri = "ripple://rfemvFrpCAPc4hUa1v8mPRYdmaCqR1iFpe"
    console.log "updating qr code", uri

    divID = @options.id
    console.log divID

    _ = ->
        console.log "callback to encode qr"
        QR.encode divID, text: uri, width: 180, height: 180, colorDark: color

    Timer.after _, 2
      
QueryAccountView.DEFAULT_OPTIONS =
    xOffset: innerWidth
    id: "qr-query"

module.exports = QueryAccountView
