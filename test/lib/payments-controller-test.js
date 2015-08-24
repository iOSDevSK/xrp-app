import PaymentsController from '../../src/lib/PaymentsController'
import EventEmitter from 'famous/core/EventEmitter'
import { describe, it } from 'mocha'
import assert from 'assert'

describe('PaymentsController', () => {
  it('should extend EventEmitter', () => {
    const controller = new PaymentsController({})
    assert(controller instanceof EventEmitter, 'not correct subclass')
  })

  it('should keep a reference to a ripple wallet', () => {
    const wallet = {}
    const controller = new PaymentsController({wallet})
    assert.strictEqual(controller.wallet, wallet, 'not same wallet')
  })

  it('should emit a confirm event on wallet sendPayment', done => {
    const token = {}
    const wallet = {
      sendPayment() {
        return Promise.resolve(token)
      }
    }

    const controller = new PaymentsController({wallet})
    controller.on('payment:confirmed', payment => {
      assert.strictEqual(token, payment, 'not emitting confirmed message')
      done()
    })

    controller.sendPayment({}) 
  }) 

  it('should emit a failed event on wallet sendPayment failure', done => {
    const token = {}
    const wallet = {
      sendPayment() {
        return Promise.reject(token)
      }
    }

    const controller = new PaymentsController({wallet})
    controller.on('payment:failed', error => {
      assert.strictEqual(token, error, 'not emitting error message')
      done()
    })

    controller.sendPayment({}) 
  }) 
})

