Surface = require "famous/core/Surface"
Modifier = require "famous/core/Modifier"
Transform = require "famous/core/Transform"
PageView = require "./PageView"
Transitionable = require "famous/transitions/Transitionable"

QR = require "../../lib/qr"
XRP = require "xrp-app-lib"
Contact = require "../../lib/contact"
home = require "../../templates/home-button.jade"
importAccount = require "../../templates/add-contact-import-account.jade"
importContact = require "../../templates/add-contact-import-contact.jade"

class AddContactView extends PageView
    constructor: ->
        super
        background = new Surface @options.background

        backgroundPositioningModifier = new Modifier
            transform: =>
                x = @progress.get()
                x *= -@options.xOffset
                return Transform.translate x, 0, 10

        node = @add backgroundPositioningModifier
        node.add background

        homeButton = new Surface content: home()

        homeButtonModifier = new Modifier
            size: [100, 100]
            origin: [1, 1]
            align: [1, 1]
            transform: =>
                y =  @progress.get()
                y *= 100
                Transform.translate 0, y, 1

        node.add homeButtonModifier
             .add homeButton

        upperPositioningModifier = new Modifier
            size: [innerWidth, 0.5 * innerHeight]
            origin: [0, 0]
            align: [0, 0]
            transform: Transform.translate 0, 0, 1

        lowerPositioningModifier = new Modifier
            size: [innerWidth, 0.5 * innerHeight]
            origin: [1, 1]
            align: [1, 1]
            transform: Transform.translate 0, 0, 1

        middlePositioningModifier = new Modifier
            origin: [0.5, 0.5]
            align: [0.5, 0.5]

        @middleButtonProgress = new Transitionable 1

        middleSizingModifier = new Modifier
            size: => [innerWidth, 80 * (1 - @middleButtonProgress.get())]

        upperNode = node.add upperPositioningModifier
        lowerNode = node.add lowerPositioningModifier
        middleNode = node.add middlePositioningModifier
        
        middleNode.add middleSizingModifier
                  .add middleBackground = new Surface @options.middleBackground

        homeButton.on "touchstart", => @broadcast "openHomeView"

        @lowerLabel = new Surface @options.lowerLabel
        @setLowerContent()
        @lowerLabel.on "touchstart", => @scanQuery()

        @upperLabel = new Surface @options.upperLabel
        @setUpperContent()
        @upperLabel.on "touchstart", => @getContact()

        lowerNode.add @lowerLabel
        upperNode.add @upperLabel

AddContactView::scanQuery = ->
    QR.scanRippleURI()
      .then @openQuery.bind @
      .catch QR.CloseScannerError, =>
          @setLowerContent error: "closedScanner"
          @resetLowerDefaultAccount()
      .catch QR.ScannerNotAvailableError, =>
          @setLowerContent error: "scannerNotAvailable"
          @resetLowerDefaultAccount()
      .catch XRP.Errors.URIError, =>
          @setLowerContent error: "parseError"
          @resetLowerDefaultAccount()

AddContactView::setLowerContent = (options) ->
    @lowerLabel.setContent importAccount options

AddContactView::setUpperContent = (options) ->
    @upperLabel.setContent importContact options

AddContactView::openQuery = (data) ->
    console.log 'import-account-open-query', data
    QR.clearNodes @options.id
      .then => @resolveQuery data

AddContactView::resolveQuery = ({account, parsedURI}) ->
    console.log "query-account-resolve-query", account, parsedURI
    @account = account
    @checkIfCanSaveAssociation()

AddContactView::getContact = ->
    Contact.pickOne()
           .then => @resolveContact()
           .catch (e) -> throw e

AddContactView::resolveContact = (contact) ->
    @contact = contact
    console.log "contact resolved", contact
    @setUpperContent contact: contact
    @checkIfCanSaveAssociation()

AddContactView::checkIfCanSaveAssociation = ->
    if @account? and @contact? then @showSaveButton

AddContactView::showSaveButton = ->
    @middleButtonProgress.set 0
    # @subscribe saveButton

AddContactView::hideSaveButton = ->
    @middleButtonProgress.set 1
    # @unsubscribe saveButton

AddContactView.DEFAULT_OPTIONS =
    xOffset: innerWidth
    background:
        classes: ["add-contact-view-background"]
    middleBackground:
        classes: ["add-contact-middle-background"]
    lowerLabel:
        classes: ["add-contact-import-account"]
    upperLabel:
        classes: ["add-contact-import-contact"]
    id:           "qr-add-contact"

module.exports = AddContactView

