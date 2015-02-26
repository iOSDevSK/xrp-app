Engine = require "famous/core/Engine"
Surface = require "famous/core/Surface"

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
