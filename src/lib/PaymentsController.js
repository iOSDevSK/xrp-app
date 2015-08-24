import EventEmitter from 'famous/core/EventEmitter'

/**
 * @module controllers
 */

/**
 * Wraps the XRPLib wallet's sendPayment method
 * 
 * @class Payments controller
 * @extends EventEmitter
 */
export default class PaymentsController extends EventEmitter {

  /**
   * @constructor
   * @param {XRPLib:Wallet} options.wallet
   */
  constructor(options) {
    super()
    this.wallet = options.wallet
  }
  
  /**
   * Sends the payment to the wallet object to be submitted to the ripple
   * network
   *
   * @async
   * @method sendPayment
   * @param {XRPLib:Account} recipient
   * @param {Number} amount
   * @emits payment:submitted when called
   * @emits payment:confirmed when successful
   * @emits payment:failed when failed
   * @return {Promise}
   */
  async sendPayment(options) {

    this.emit('payment:submitted', options)

    try {
      const payment = await this.wallet.sendPayment({
        to: {
          publicKey: options.recipient
        },
        amount: options.amount
      })
      this.emit('payment:confirmed', payment)
    }
    catch (error) {
      this.emit('payment:failed', error)
    }

  }

  /**
   * naïve check that the payment can be submitted
   *
   * @method verifyForm
   * @param {String} data.amount
   * @param {String} data.recipient
   */
  verifyPayment({amount, recipient}) {
    const verified = (typeof amount === 'string') &&
                      (amount.length > 0)          &&
                      (/^\d*\.?\d*$/.test(amount))

    console.log(`form verified: ${verified}`)
    return verified
  }
}

