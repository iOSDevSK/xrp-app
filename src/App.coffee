Engine = require "famous/core/Engine"
Surface = require "famous/core/Surface"

# Register Spring Transition
Transitionable = require "famous/transitions/Transitionable"
SpringTransition = require "famous/transitions/SpringTransition"
SnapTransition = require "famous/transitions/SnapTransition"
Transitionable.registerMethod "spring", SpringTransition
Transitionable.registerMethod "snap", SnapTransition
window._xrp = require "xrp-app-lib"

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
    window.cordova = plugins: barcodeScanner: scan: (s, f) ->
        s text: "ripple://rfemvFrpCAPc4hUa1v8mPRYdmaCqR1iFpe"
    document.addEventListener "DOMContentLoaded", start, false

