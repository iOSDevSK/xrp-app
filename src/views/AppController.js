import XRP from 'xrp-app-lib'

import XView from './XView'
import Surface from 'famous/core/Surface'
import View from 'famous/core/View'
import TouchSync from 'famous/inputs/TouchSync'
import {HomeView, InfoView, SendPaymentsView} from './pages'
import WalletController from './../lib/WalletController'
import PaymentsController from './../lib/PaymentsController'

/**
 * Top Level App Controller
 * @class App
 * @extends XView
 */

export default class AppController extends XView {
    constructor() {
        super()
        var trigger = window.trigger = this._eventInput.trigger.bind(this._eventInput)

        var walletController = new WalletController()
        this.paymentsController = new PaymentsController(walletController.wallet)

        walletController.updateBalance()

        walletController.on('balance:updated', (balance) => {
          console.log('BALANCE UPDATED', balance)
        })

        this.paymentsController.on('payment:submitted', function(payment) {
          console.log('PAYMENT SUBMITTED', payment)
        })

        this.paymentsController.on('payment:confirmed', function(payment) {
          console.log('PAYMENT CONFIRMED', payment)
        })

        this.paymentsController.on('payment:failed', function(error) {
          console.log('PAYMENT FAILED', error)
        })

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

    sendPayment(e) {
      this.paymentsController.sendPayment(e)
    }

    sharePublicKey() {
        console.log('share the public key')
    }
}

