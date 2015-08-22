import Timer from "famous/utilities/Timer"
import XView from './XView'
import {HomeView, InfoView, SendPaymentsView, FlashView} from './pages'
import WalletController from '../lib/WalletController'
import PaymentsController from '../lib/PaymentsController'
import OpenUrlController from '../lib/OpenUrlController'

import QR from '../lib/qr'
import confirmPayment from '../lib/action-sheet'
import share from '../lib/share'
import $ from 'jquery'
import {Listener} from 'xrp-app-lib'

/**
 * Top Level App Controller
 * @class App
 * @extends XView
 */

export default class AppController extends XView {
    constructor() {
        super()

        this.subscribe(this.walletController = new WalletController())
        this.subscribe(this.openURLController = new OpenUrlController())
        this.subscribe(this.paymentsController = new PaymentsController({
          wallet: this.walletController.wallet
        }))

        this.listener = new Listener({
          address: this.walletController.wallet.publicKey,
          onPayment(payment) {
            if (payment.amount > 0) {
              this.onPaymentReceived(payment)
            }
          }
        })
        this.listener.subscribe()

        this.listen('balance:updated',   this.onBalanceUpdated)
        this.listen('payment:submitted', this.onPaymentSubmitted)
        this.listen('payment:confirmed', this.onPaymentConfirmed)
        this.listen('payment:failed',    this.onPaymentFailed)
        this.listen('qr:failed',         this.onQRFailed)
        this.listen('openURL',           this.importRippleDataFromURI)
        this.listen('openURLError',      this.onRippleImportError)
        this.listen('sharePublicKey',    this.sharePublicKey)
        this.listen('scan-qr-code',      this.scanQRCode)
        this.listen('send-payments-form-submitted', this.sendPayment)

        this.addSubView(this.homeView = new HomeView({
          address: this.walletController.wallet.publicKey
        }))
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

        window.flash = this.flash.bind(this)

        this.balanceUpdated = false

        this.viewInFocus = this.homeView
        this.homeView.focus()

        this.updateBalanceUntilShown()
    }

    async updateBalanceUntilShown() {
        let attempts = 0
        while(attempts < 6) {
            await this.walletController.updateBalance()
            if (this.balanceUpdated) {
                return
            }
        }

        console.log('could not update balance')
    }

    show(view, options = {}) {
        if (options.on) {
            this._eventInput.on(options.on, this.show.bind(this, view))
        }
        else {
            console.log('show', view, options)

            if (this.viewInFocus === view) {
                return
            }

            this.viewInFocus.hide()
            view.focus()
            this.viewInFocus = view
        }
    }

    flash(passedData) {
        switch (passedData.level) {
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

    async sendPayment(e) {

        const verified = this.sendPaymentsView.verifyForm()

        if (!verified) {
            this.flash({
                level: 'error',
                title: 'Invaid Format',
                message: 'payment cannot be submitted'
            })
            return
        }

        const confirmed = await confirmPayment(e)

        if (confirmed) {
            this.paymentsController.sendPayment(e)
        }
        else {
            this.flash({
                level: 'warning',
                title: 'Payment Cancelled',
                message: 'payment cancelled by user'
            })
        }
    }

    onPaymentSubmitted(payment) {
        console.log('PAYMENT SUBMITTED', payment)
        this.flash({
            level: 'warning',
            title: 'Submitted',
            message: 'payment submitted'
        })
    }

    onPaymentReceived(payment) {
        console.log('PAYMENT RECEIVED', payment)
        this.walletController.updateBalance()
        this.flash({
            title: 'Payment Received',
            message: `received ${payment.amount} XRP!`
        })
    }

    onPaymentConfirmed(payment) {
        console.log('PAYMENT CONFIRMED', payment)
        this.flash({
            title: 'Success',
            message: 'payment confirmed'
        })
        this.walletController.updateBalance()
    }

    onPaymentFailed(error) {
        console.log('PAYMENT FAILED', error)
        this.flash({
            level: 'error',
            title: 'Ripple Error',
            message: 'payment failed'
        }) 
    }

    onBalanceUpdated(balance) {
      this.balanceUpdated = true
      console.log('BALANCE UPDATED', balance)
      this.homeView.updateBalance(balance)
    }

    onQRFailed() {
        this.flash({
            level: 'error',
            title: 'Camera Error',
            message: 'qr scanner not available'
        })
    }

    sharePublicKey() {
        try {
            share(this.walletController.wallet.publicKey)
        } catch (_) {
            this.flash({
                level: 'error',
                title: 'Share Unavailable',
                message: 'cannot share address at this time'
            })
        }
        console.log('share the public key')
    }

    onRippleImportError(err) {
        this.flash({
            level: 'warning',
            title: 'Ripple URI Import Error',
            message: err.message
        })
    }

    // use xrp-app-lib to decode uri into data
    importRippleDataFromURI(data) {
        console.log('importing ripple uri', data)
        this.sendPaymentsView.showAddress(data)
        this.show(this.sendPaymentsView)
        this.openURLController.quiet()
    }

    async scanQRCode() {
        try {
            const data = await QR.scanRippleURI()
            this.importRippleDataFromURI(data)
        }
        catch (err) {
            if (err instanceof QR.CloseScannerError) {
              console.log(err)
            }
            else {
              this.onQRFailed()
            }
        }
    }
}

