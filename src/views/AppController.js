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
 *
 * @class AppController
 * @extends XView
 */

export default class AppController extends XView {
    /**
     * create dependent views, delegate actions to events
     * start listening to ripple wallet
     *
     * @constructor
     */
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
        this.balanceUpdated = false

        this.viewInFocus = this.homeView
        this.homeView.focus()

        this.updateBalanceUntilShown()
    }

    /**
     * try a few times to update the wallet balance
     *
     * @async
     * @method updateBalanceUntilShown
     */
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

    /**
     * immediately show a view, or if given the on option,
     * show that view on a given event
     *
     * @method show
     * @param {View} view
     * @param {String} options.on
     */
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

    /**
     * show the flash view with various levels of importance
     * to alert the user to some action by the app
     *
     * @method flash
     * @param {FlashData} passedData
     */
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

    /**
     * when the SendPayment form button is pressed,
     * verify the form data and alert the user if invalid
     * confirm the payment with the user and submit the payment
     * if confirmed. Alert the user if cancelled
     *
     * @async
     * @method sendPayment
     * @param {PaymentFormSerializedData} payment
     */
    async sendPayment(payment) {
        const verified = this.paymentsController.verifyPayment(payment)
        if (!verified) {
            this.onSendPaymentsFormValidationError()
            return
        }

        const confirmed = await confirmPayment(payment)
        if (confirmed) {
            this.paymentsController.sendPayment(payment)
        }
        else {
            this.onSendPaymentsCancel()
        }
    }

    /**
     * display an error message when the form cannot
     * be correctly validated
     *
     * @method onSendPaymentsFormValidationError
     */
    onSendPaymentsFormValidationError() {
      this.flash({
          level: 'error',
          title: 'Invaid Format',
          message: 'payment cannot be submitted'
      })
    }

    /**
     * display a warning message when the payment
     * submission is cancelled
     *
     * @method onSendPaymentsCancel
     */
    onSendPaymentsCancel() {
      this.flash({
          level: 'warning',
          title: 'Payment Cancelled',
          message: 'payment cancelled by user'
      })
    }

    /**
     * display a message when a payment is submitted
     * to the ripple network
     *
     * @method onPaymentSubmitted
     * @param {XRPLib.Payment}
     */
    onPaymentSubmitted(payment) {
        console.log('PAYMENT SUBMITTED', payment)
        this.flash({
            level: 'warning',
            title: 'Submitted',
            message: 'payment submitted'
        })
    }

    /**
     * display a message when payment is recieved
     * update the wallet balance
     *
     * @method onPaymentReceived
     * @param {XRPLib.Payment} payment
     */
    onPaymentReceived(payment) {
        console.log('PAYMENT RECEIVED', payment)
        this.walletController.updateBalance()
        this.flash({
            title: 'Payment Received',
            message: `received ${payment.amount} XRP!`
        })
    }

    /**
     * display a success message when payment sent to the
     * ripple network succeeds
     * update the wallet balance
     *
     * @method onPaymentConfirmed
     * @param {XRPLib.Payment} payment
     */
    onPaymentConfirmed(payment) {
        console.log('PAYMENT CONFIRMED', payment)
        this.flash({
            title: 'Success',
            message: 'payment confirmed'
        })
        this.walletController.updateBalance()
    }

    /**
     * display an error message when payment sent to the
     * ripple network fails 
     *
     * @method onPaymentFailed
     * @param {Error} error
     */
    onPaymentFailed(error) {
        console.log('PAYMENT FAILED', error)
        this.flash({
            level: 'error',
            title: 'Ripple Error',
            message: 'payment failed'
        }) 
    }

    /**
     * update the UI balance
     *
     * @method onBalanceUpdated
     * @param {Number} balance
     */
    onBalanceUpdated(balance) {
      this.balanceUpdated = true
      console.log('BALANCE UPDATED', balance)
      this.homeView.updateBalance(balance)
    }

    /**
     * flashe an error message when the camera is not available
     *
     * @method onQRFailed
     */
    onQRFailed() {
        this.flash({
            level: 'error',
            title: 'Camera Error',
            message: 'qr scanner not available'
        })
    }

    /**
     * call to the share plugoin to share the public key
     * flashes an error message on failure
     *
     * @method sharePublicKey
     */
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

    /**
     * flash a warning message on import error
     *
     * @method onRippleImportError
     * @param {Error} err
     */
    onRippleImportError(err) {
        this.flash({
            level: 'warning',
            title: 'Ripple URI Import Error',
            message: err.message
        })
    }

    /**
     * use the xrp-app-lib ot decode uri into data,
     * and present that data into the send-payment form
     *
     * @method importRippleDataFromURI
     * @param {XRPAppLib.URIData} data
     */
    importRippleDataFromURI(data) {
        console.log('importing ripple uri', data)
        this.sendPaymentsView.showAddress(data)
        this.show(this.sendPaymentsView)
        this.openURLController.quiet()
    }

    /**
     * scan a qr code to import into the send-payment field
     * emit an error if the lookup or parsing fails
     *
     * @async
     * @method scanQRCode
     * @returns {Promise}
     */
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

