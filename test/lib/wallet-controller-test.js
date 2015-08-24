import WalletController from '../../src/lib/WalletController'
import EventEmitter from 'famous/core/EventEmitter'
import assert from 'assert'
import { before, describe, it } from 'mocha'

describe('Wallet Controller', () => {
  before(() => {
    GLOBAL.localStorage = {
      getItem(key) {
        return this[key]
      },
      
      setItem(key, value) {
        this[key] = value
      }
    }
  })

  after(() => {
    GLOBAL.localStorage = null
  })

  it('should extend EventEmitter', () => {
    localStorage.setItem('wallet:secret', null)
    const controller = new WalletController()
    assert(controller instanceof EventEmitter, 'not correct subclass')
  })

  const privateKey = 'shvBzd5CPv9uoTySw8UWDTea6fTdM'

  it('should import the wallet from the private key', () => {
    localStorage.setItem('wallet:secret', privateKey)
    const controller = new WalletController()
    const key = controller.wallet.privateKey
    assert.strictEqual(key, privateKey, 'privateKey doesnt match')
  })

  it('should emit an event when balance is checked and updated', done => {
    localStorage.setItem('wallet:secret', privateKey)
    const controller = new WalletController()
    const wallet = controller.wallet

    wallet.updateBalance = function() {
      return Promise.resolve()
    }

    controller.on('balance:updated', () => {
      done()
    })
    
    controller.updateBalance()
  })

})

