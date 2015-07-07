import XView from '../../XView'
import sendPaymentsForm from '../../../templates/send-payments-form.jade'

import Surface from 'famous/core/Surface'
import Modifier from 'famous/core/Modifier'
import Transform from 'famous/core/Transform'
import HeaderFooterLayout from 'famous/views/HeaderFooterLayout'
import FormContainerSurface from 'famous/surfaces/FormContainerSurface'

import $ from 'jquery'

export default class SendPaymentContentView extends XView {
    constructor() {
        super()

        const formModifier = new Modifier({
            size: [undefined, innerHeight * 9 / 16],
            transform: Transform.translate(0, 0, 2)
        })

        const recentTransactionsModifier = new Modifier({
            size: [undefined, innerHeight * (1 - .12 - .18 - 9/16)]
        })

        const form = new FormContainerSurface({
            classes: ['send-payments-content-form']
        })

        const formMarkup = new Surface({
            content: sendPaymentsForm()
        })

        form.add(formMarkup)
        this.add(formModifier).add(form)

        this.subscribe(form)
    }

    showAddress(data) {
        const address = data.address || data.to
        console.log('show address:', address)
        $('input#account-input').val(address)

        if (data.amount) {
            $('input#amount-input').val(data.amount)
        }
    }

    verifyForm() {
        let data = {}
        $('form.send-payments-content-form')
          .serializeArray().map(item => {
            data[item.name] = item.value
          })

        const { amount, recipient } = data

        const verified = (typeof amount === 'string') &&
                         (amount.length > 0)          &&
                         (/^\d*\.?\d*$/.test(amount))

        console.log(`form verified: ${verified}`)
        return verified
    }

    sendPayment(event) {
        let data = {}
        $('form.send-payments-content-form')
          .serializeArray().map(item => {
            data[item.name] = item.value
          })
        this.broadcast('send-payments-form-submitted', data)
    }
}

