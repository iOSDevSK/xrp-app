import XRP from 'xrp-app-lib'

import XView from './XView'
import Surface from 'famous/core/Surface'
import TouchSync from 'famous/inputs/TouchSync'
import {HomeView, InfoView, SendPaymentsView} from './pages'

/**
 * Top Level App Controller
 * @class App
 * @extends XView
 */

export default class AppController extends XView {
    constructor() {
        super()

        this.wallet = XRP.createWallet()
        window.wallet = this.wallet

        this.addSubView(this.homeView = new HomeView())
        this.show(this.homeView, {
            on: 'openHomeView'
        })

        this.addSubView(this.infoView = new InfoView())
        this.show(this.infoView, {
            on: 'openInfoView'
        })

        this.addSubView(this.sendPaymentsView = new SendPaymentsView())
        this.show(this.sendPaymentsView, {
            on: 'openSendPaymentsView'
        })

        this.listen('sharePublicKey', this.sharePublicKey)
        this.listen('send-payments-form-submitted', this.sendPayment)

        this.viewInFocus = this.homeView
        this.homeView.focus()
    }

    show(view, options = {}) {
        if (options.on) {
            this._eventInput.on(options.on, this.show.bind(this, view))
        }
        else {
            console.log('show', view, options)
            this.viewInFocus.hide()
            view.focus()
            this.viewInFocus = view
        }
    }

    sharePublicKey() {
        console.log('share the public key')
    }

    sendPayment(e) {
        console.log('sending payment', e)
    }
}

