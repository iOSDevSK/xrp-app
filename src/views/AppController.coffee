XView = require "./XView"
Surface = require "famous/core/Surface"
TouchSync = require "famous/inputs/TouchSync"
SliderSelector = require "./SliderSelector"
ContentView = require "./pages/ContentView"
AddContactView = require "./pages/AddContactView"
QueryAccountView = require "./pages/QueryAccountView"
SendPaymentView = require "./pages/SendPaymentView"
WalletView = require "./pages/WalletView"

###*
 * Top Level App Controller
 * @class App
 * @extends XView
###

class AppController extends XView
  
    constructor: ->
        super

        # Root content in center of app, for creating wallet and 
        # displaying public key
        @addSubView @rootContentView = new ContentView

        ##################################
        #
        # Modal Views for app actions
        #
        ##################################

        # AddContactView for associating an entry in the phone's
        # contacts with a public key
        @addSubView @addContactView = new AddContactView
        @show @addContactView, on: "showContactView"

        # QueryAccountView for finding the balance of a public key
        @addSubView @queryAccountView = new QueryAccountView
        @show @queryAccountView, on: "openAccountView"

        # SendPaymentView for sending money from app's wallet to
        # a public key or a contact
        @addSubView @sendPaymentView = new SendPaymentView
        @show @sendPaymentView, on: "openPaymentView"

        # WalletView for exporting secret key or changing pin
        @addSubView @walletView = new WalletView
        @show @walletView, on: "openWalletView"

        @addSubView @upperSlider = new SliderSelector @options.upperSelector
        @addSubView @lowerSlider = new SliderSelector @options.lowerSelector
        @viewInFocus = null

AppController.DEFAULT_OPTIONS =

    upperSelector:
        placement: SliderSelector.TOP
        leftButton:
            content: "wallet"
            event: "openWalletView"
            classes: ["button", "wallet-button"]
        rightButton:
            content: "send payment"
            event: "openSendPaymentView"
            classes: ["button", "send-payment-button"]

    lowerSelector:
        placement: SliderSelecter.BOTTOM
        leftButton:
            content: "add contact"
            event: "openAddContactView"
            classes: ["button", "add-contact-button"]
        rightButton:
            content: "query account"
            event: "openAccountView"
            classes: ["button", "query-account-button"]

AppController::show = (view, options) ->
    if options.on
        @_eventInput.on "openWalletView", @show.bind(@, view)
    else
        view.focus()
        if @viewInFocus then @viewInFocus.hide()
        @viewInFocus = view

###*
 * @exports App
###
module.exports = AppController

