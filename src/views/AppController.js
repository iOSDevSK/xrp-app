import XView from './XView'
import {HomeView, InfoView, SendPaymentsView, FlashView} from './pages'
import WalletController from '../lib/WalletController'
import PaymentsController from '../lib/PaymentsController'

import QR from '../lib/qr'

/**
 * Top Level App Controller
 * @class App
 * @extends XView
 */

export default class AppController extends XView {
    constructor() {
        super()

        this.walletController = new WalletController()

        this.paymentsController = new PaymentsController({
          wallet: this.walletController.wallet
        })

        this.subscribe(this.paymentsController)
        this.subscribe(this.walletController)

        this.listen('balance:updated',   this.onBalanceUpdated)
        this.listen('payment:submitted', this.onPaymentSubmitted)
        this.listen('payment:confirmed', this.onPaymentConfirmed)
        this.listen('payment:failed',    this.onPaymentFailed)

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

        this.addSubView(this.flashView = new FlashView())

        this.listen('sharePublicKey', this.sharePublicKey)
        this.listen('send-payments-form-submitted', this.sendPayment)
        this.listen('scan-qr-code', this.scanQRCode)

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

    flash({level, title, message}) {
        const passedData = {
            title: title,
            message: message
        }

        switch (level) {
            case 'warning':
                this.flashView.warn(passedData)
                break
            case 'error':
                this.flashView.err(passedData)
                break
            default:
                this.flashView.notify(passedData)
        }

        this.flashView.flash()
    }

    sendPayment(e) {
      this.paymentsController.sendPayment(e)
    }

    onPaymentSubmitted(payment) {
      console.log('PAYMENT SUBMITTED', payment)
    }

    onPaymentConfirmed(payment) {
      console.log('PAYMENT CONFIRMED', payment)
      this.walletController.updateBalance()
    }

    onPaymentFailed(error) {
      console.log('PAYMENT FAILED', error)
    }

    onBalanceUpdated(balance) {
      console.log('BALANCE UPDATED', balance)
    }

    sharePublicKey() {
        console.log('share the public key')
    }

    scanQRCode() {
        QR.scanRippleURI().then(data => this.sendPaymentsView.showAddress(data))
    }
}

