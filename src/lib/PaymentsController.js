import EventEmitter from 'famous/core/EventEmitter'

export default class PaymentsController extends EventEmitter {

  constructor(wallet) {
    this.wallet = wallet
    super()
  }
  
  sendPayment(options) {

    this.wallet.sendPayment({
      to: {
        publicKey: options.recipient
      },
      amount: options.amount
    })
    .then(payment => this.emit('payment:confirmed', payment))
    .catch(error => this.emit('payment:failed', error))

    this.emit('payment:submitted', options)
  }
}

