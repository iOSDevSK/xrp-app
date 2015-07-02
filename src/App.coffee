Engine = require "famous/core/Engine"
Surface = require "famous/core/Surface"

# Register Spring Transition
Transitionable = require "famous/transitions/Transitionable"
SpringTransition = require "famous/transitions/SpringTransition"
SnapTransition = require "famous/transitions/SnapTransition"
Timer = require "famous/utilities/Timer"
Transitionable.registerMethod "spring", SpringTransition
Transitionable.registerMethod "snap", SnapTransition

AppController = require "./views/AppController"

# Create context and set Perspective
start = ->
    console.log "Start the app"
    mainContext = Engine.createContext()
    mainContext.setPerspective 800

    # hot swap the background Splash Image for the gray background
    # after the scene graph is created
    Timer.after((() => document.getElementsByTagName('body')[0].classList.add('gray')), 12)

    # Add app to the mainContext
    mainContext.add new AppController

eventName = if window.cordova? then "deviceready" else "DOMContentLoaded"
document.addEventListener eventName, start, false
    
