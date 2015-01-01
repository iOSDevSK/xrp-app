Engine = require "famous/core/Engine"
Surface = require "famous/core/Surface"

# Register Spring Transition
Transitionable = require "famous/transitions/Transitionable"
SpringTransition = require "famous/transitions/SpringTransition"
SnapTransition = require "famous/transitions/SnapTransition"
Transitionable.registerMethod "spring", SpringTransition
Transitionable.registerMethod "snap", SnapTransition

AppController = require "./views/AppController"

# Set debug or production environment
#window.__environment = environment = "debug"
window.__environment = environment = "debug"
window.log = require("./log")(environment)

# Create context and set Perspective
start = ->
    console.log "Start the app"
    mainContext = Engine.createContext()
    mainContext.setPerspective 800

    # Add app to the mainContext
    mainContext.add new AppController

switch environment
    when "debug"
        document.addEventListener "deviceready", start, false
    when "production"
        document.addEventListener "deviceready", start, false
    when "chrome"
        window.cordova = plugins: barcodeScanner: scan: (s, f) ->
            s text: "ripple://rfemvFrpCAPc4hUa1v8mPRYdmaCqR1iFpe"
        start()

