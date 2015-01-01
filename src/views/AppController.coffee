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
        @show @rootContentView, on: "openHomeView"

        # AddContactView for associating an entry in the phone's
        # contacts with a public key
        @addSubView @addContactView = new AddContactView
        @show @addContactView, on: "openAddContactView"

        # QueryAccountView for finding the balance of a public key
        @addSubView @queryAccountView = new QueryAccountView
        @show @queryAccountView, on: "openAccountView"

        # SendPaymentView for sending money from app's wallet to
        # a public key or a contact
        @addSubView @sendPaymentView = new SendPaymentView
        @show @sendPaymentView, on: "openSendPaymentView"

        # WalletView for exporting secret key or changing pin
        @addSubView @walletView = new WalletView
        @show @walletView, on: "openWalletView"

        @viewInFocus = @rootContentView

        @listen "content-clicked", -> @rootContentView.showDefaultContent()

AppController::show = (view, options = {}) ->
    if options.on
        @_eventInput.on options.on, @show.bind @, view
    else
        console.log "show", view, options
        @viewInFocus.hide()
        view.focus()
        @viewInFocus = view

###*
 * @exports App
###
module.exports = AppController

