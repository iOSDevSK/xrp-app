Engine = require "famous/core/Engine"
Surface = require "famous/core/Surface"
Promise = require 'bluebird'

# Register Spring Transition
Transitionable = require "famous/transitions/Transitionable"
SpringTransition = require "famous/transitions/SpringTransition"
SnapTransition = require "famous/transitions/SnapTransition"
Transitionable.registerMethod "spring", SpringTransition
Transitionable.registerMethod "snap", SnapTransition

AppController = require "./views/AppController"

# Create context and set Perspective
start = ->
    console.log "Start the app"
    mainContext = Engine.createContext()
    mainContext.setPerspective 800

    # Add app to the mainContext
    mainContext.add new AppController

if window.cordova?
    document.addEventListener "deviceready", start, false
else
    contacts =
        pickContact: ->
            Promise.resolve {"id":263,"rawId":null,"displayName":null,"name":{"givenName":"Steven","honorificSuffix":null,"formatted":"Steven Zeiler","middleName":null,"familyName":"Zeiler","honorificPrefix":null},"nickname":null,"phoneNumbers":[{"value":"+18022220128","pref":false,"id":0,"type":"mobile"}],"emails":[{"value":"zeiler.steven@gmail.com","pref":false,"id":0,"type":"work"}],"addresses":null,"ims":null,"organizations":null,"birthday":null,"note":null,"photos":[{"value":"/var/mobile/Containers/Data/Application/62C81CE2-BBA9-45EC-86EB-7002D73FE063/tmp/photo_Mqiy6","type":"url","pref":"false"}],"categories":null,"urls":[{"value":"fb://profile/1515360215","pref":false,"id":0,"type":"profile"}]}
        find: -> null

    window.cordova = plugins: barcodeScanner: scan: (s, f) ->
        s cancelled: 0, text: "ripple://rfemvFrpCAPc4hUa1v8mPRYdmaCqR1iFpe"

    if window.navigator
        window.navigator.contacts = contacts
    else
        window.navigator = contacts: contacts
    document.addEventListener "DOMContentLoaded", start, false

