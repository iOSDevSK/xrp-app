import Engine from 'famous/core/Engine'
import EventEmitter from 'famous/core/EventEmitter'
import {decodeURI} from 'xrp-app-lib'

/*
let urlOpened = false
let urlOpenedWithUrl = ''

window.handleOpenURL = function handleOpenURL(url) {
    window.__urlOpened = true
    window.__urlOpenedWithUrl = url 
}
*/

export default class OpenUrlController extends EventEmitter {
    constructor() {
        super()
        Engine.on('prerender', () => this.detectOpenUrl())
    }

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

    throw(error) {
        this.emit('openURLError', error)
    }

    quiet() {
        window.__urlOpened = false
    }
}

