Engine = require "famous/core/Engine"

# Register Spring Transition
Transitionable = require "famous/transitions/Transitionable"
SpringTransition = require "famous/transitions/SpringTransition"
SnapTransition = require "famous/transitions/SnapTransition"
Transitionable.registerMethod "spring", SpringTransition
Transitionable.registerMethod "snap", SnapTransition

Surface = require "famous/core/Surface"

# Set debug or production environment
window.__environment = environment = "debug"
window.log = require("./log")(environment)

# Create context and set Perspective
start = ->
    console.log "Start the app"
    mainContext = Engine.createContext()
    mainContext.setPerspective 800

    # Add app to the mainContext
    AppController = require "./views/AppController"
    mainContext.add new AppController

document.addEventListener "deviceready", start, false

