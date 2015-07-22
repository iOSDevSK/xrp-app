import Engine from 'famous/core/Engine'
import EventEmitter from 'famous/core/EventEmitter'
import {decodeURI} from 'xrp-app-lib'

/**
 * @module controllers
 */

/*
let urlOpened = false
let urlOpenedWithUrl = ''

window.handleOpenURL = function handleOpenURL(url) {
    window.__urlOpened = true
    window.__urlOpenedWithUrl = url 
}
*/

/**
 * Controller for opening custom scheme URL
 *
 * @class OpenUrlController
 * @extends EventEmitter
 */
export default class OpenUrlController extends EventEmitter {
    /**
     * @constructor
     */
    constructor() {
        super()
        Engine.on('prerender', () => this.detectOpenUrl())
    }

    /**
     * Until caught, will emit an openURL event with the parsed URL
     *
     * @method detectOpenUrl
     * @emits openURL
     */
    detectOpenUrl() {
        if (window.__urlOpened) {
            try {
                this.emit('openURL', decodeURI(window.__urlOpenedWithUrl))
            }
            catch (error) {
                this.throw(error)
            }
        }
    }

    /**
     * @method throw
     * @emits openURLError
     */
    throw(error) {
        this.emit('openURLError', error)
    }

    /**
     * Sets the __urlOpened flag to false to prevent superfluous emetting of the
     * openURL event above
     *
     * @method quiet
     */
    quiet() {
        window.__urlOpened = false
    }
}

