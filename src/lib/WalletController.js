import XRP from 'xrp-app-lib'
import EventEmitter from 'famous/core/EventEmitter'

export default class WalletController extends EventEmitter {
  constructor() {
    super()
    this.wallet
    this.updateBalance()
  }

  get wallet() {
    if (!this._wallet) { this.getWallet() }
    return this._wallet
  }

  setWallet() {
    this._wallet = XRP.createWallet()
    localStorage.setItem('wallet:secret', this._wallet.privateKey)
  }

  getWallet() {
    var secret = localStorage.getItem('wallet:secret')
    if (secret) {
      this._wallet = XRP.importWalletFromSecret(secret)
    } else {
      this.setWallet()
    }
  }

  async updateBalance() {
    await this._wallet.updateBalance()
    this.emit('balance:updated', this._wallet.balance)
  }
}

