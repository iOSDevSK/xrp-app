import EventEmitter from 'famous/core/EventEmitter'

export default class PaymentsController extends EventEmitter {

  constructor(options) {
    super()
    this.wallet = options.wallet
  }
  
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
}

