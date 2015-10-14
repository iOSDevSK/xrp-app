import XView from '../../XView'
import sendPaymentsForm from '../../../templates/send-payments-form.jade'

import Surface from 'famous/core/Surface'
import Modifier from 'famous/core/Modifier'
import Transform from 'famous/core/Transform'
import HeaderFooterLayout from 'famous/views/HeaderFooterLayout'
import FormContainerSurface from 'famous/surfaces/FormContainerSurface'

import $ from 'jquery'

/**
 * View Controller for the send payments form
 *
 * @class SendPaymentContentView
 * @extends XView
 */
export default class SendPaymentContentView extends XView {
    /**
     * set up view hierarchy
     *
     * @constructor
     */
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

    /**
     * show the given address and amount in the send payments form
     *
     * @method showAddress
     * @param {RippleURI.Decoded} data
     */
    showAddress({address, amount, dt, currency}) {
        console.log('show address:', address)
        $('input#account-input').val(address)

        if (amount) {
            $('input#amount-input').val(amount)
        }

        if (currency && dt) {
            $('div.disabled-fields').removeClass('hidden')
        }

        if (dt) {
            $('input#dt-input').val(dt)
        }

        if (currency) {
            $('input#currency-input').val(currency)
        }
    }

    /**
     * return a object representing the form data
     *
     * @get data
     * @returns {Object} form data
     */
    get data() {
        let data = {}
        const form = $('form.send-payments-content-form')

        const disabled = form.find(':disabled').removeAttr('disabled')

        form.serializeArray().forEach(item => {
          data[item.name] = item.value
        })

        disabled.attr('disabled', 'disabled')
        return data
    }

    /**
     * emit a send payment form submitted event with the form data
     *
     * @method sendPayment
     * @emits 'send-payments-form-submitted'
     */
    sendPayment() {
        this.broadcast('send-payments-form-submitted', this.data)
    }
}

