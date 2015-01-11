ContainerSurface = require "famous/surfaces/ContainerSurface"
Surface = require "famous/core/Surface"
Modifier = require "famous/core/Modifier"
Transform = require "famous/core/Transform"
PageView = require "./PageView"
Transitionable = require "famous/transitions/Transitionable"
Easing = require "famous/transitions/Easing"
Timer = require "famous/utilities/Timer"

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

        node = new ContainerSurface @options.rootContainer

        @add backgroundPositioningModifier
        .add node

        node.add background

        homeButton = new Surface content: home()

        homeButtonModifier = new Modifier
            size: [100, 100]
            origin: [1, 1]
            align: [1, 1]
            transform: =>
                y =  @progress.get()
                y *= 100
                Transform.translate 0, y, 10

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
            transform: Transform.translate 0, 0, 180

        middleRotationModifier = new Modifier
            transform: Transform.rotate 0, -Math.PI / 8, -Math.PI / 10 

        @middleButtonProgress = new Transitionable 1

        middleSizingModifier = new Modifier
            size: => [innerWidth * 1.5, @options.saveHeight * (1 - @middleButtonProgress.get())]

        upperNode = node.add upperPositioningModifier
        lowerNode = node.add lowerPositioningModifier
        middleNode = node.add middlePositioningModifier
                         .add middleRotationModifier
        
        middleNode.add middleSizingModifier
                  .add middleBackground = new Surface @options.middleBackground

        saveButtonModifier = new Modifier
            size: [undefined, @options.saveHeight]
            transform: =>
                p = @middleButtonProgress.get()
                Transform.translate -window.innerWidth * p, 0, 2

        @saveButton = new Surface @options.saveButton

        middleNode.add saveButtonModifier
                  .add @saveButton

        @saveButton.on "touchstart", => @saveAssociation()

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
    console.log "getting contact"
    Contact.pickOne()
           .then (contact) ->
               console.log JSON.stringify contact
               contact
           .then (contact) => @resolveContact contact
           .catch (e) -> throw e

AddContactView::resolveContact = (contact) ->
    @contact = contact
    console.log "contact resolved", contact
    @setUpperContent contact: contact

    if Contact.hasARippleAddress @contact
        navigator.notification.alert "#{contact.name.formatted} already has a ripple address", (->), "Redundant"
    else
        @checkIfCanSaveAssociation()

AddContactView::checkIfCanSaveAssociation = ->
    if @account? and @contact?
        console.log "have both contact and account, show save button"
        _ = => @showSaveButton()
        Timer.after _, 40

AddContactView::saveAssociation = ->
    console.log "saving association"
    _ = (confirmationCode) =>
        console.log "confirmation response", confirmationCode
        Contact.saveLocally @contact, @account
               .then (res) -> console.log res
               .then => @hideSaveButton()

    message = "Save address to contact?"
    title = "Confirm"
    buttons = ["yes", "cancel"]

    navigator.notification.confirm message, _, title, buttons

AddContactView::showSaveButton = ->
    @middleButtonProgress.set 0, @options.inTransition, => @subscribe @saveButton

AddContactView::hideSaveButton = ->
    @middleButtonProgress.set 1, @options.outTransition, => @unsubscribe @saveButton

AddContactView.DEFAULT_OPTIONS =
    rootContainer:
        classes: ["clipped"]
    saveHeight: 80
    xOffset: innerWidth
    background:
        classes: ["add-contact-view-background"]
    middleBackground:
        classes: ["add-contact-middle-background"]
    lowerLabel:
        classes: ["add-contact-import-account"]
    upperLabel:
        classes: ["add-contact-import-contact"]
    id: "qr-add-contact"
    inTransition:
        method: "spring"
        period: 800
        dampingRatio: 0.6
    outTransition:
        period: 400
        curve: Easing.inBack
    saveButton:
        content: "<h1>save</h1>"
        classes: ["add-contact-save-button", "center"]

module.exports = AddContactView

