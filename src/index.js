import './styles'
import 'famous-polyfills'
import Engine from 'famous/core/Engine'
import Transitionable from 'famous/transitions/Transitionable'
import SpringTransition from 'famous/transitions/SpringTransition'
import SnapTransition from 'famous/transitions/SnapTransition'
import Timer from 'famous/utilities/Timer'
import AppController from './views/AppController'

// register transitionable methods
Transitionable.registerMethod('spring', SpringTransition)
Transitionable.registerMethod('snap', SnapTransition)

// allow for cordova or desktop browser based development
const eventName = window.cordova? 'deviceready' : 'DOMContentLoaded'

// start that app
document.addEventListener(eventName, start, false)

function start() {
  console.log('start the app')

  // Create context and set Perspective
  const mainContext = Engine.createContext()
  mainContext.setPerspective(800)

  // hot swap the background Splash Image for the gray background
  // after the scene graph is created
  Timer.after(changeBackground, 12)

  // Add app to the mainContext
  mainContext.add(new AppController())
}

function changeBackground() {
  document.body.classList.add('gray')
}

