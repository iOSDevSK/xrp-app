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

    sendPayment() {
        let formData = $('form.send-payments-content-form')
            .serializeArray()
        /*
            .reduce(
                ((old, current) => old[current.name] = current.value && old),
                {}
            )
        /**/
        this.broadcast('send-payments-form-submitted', formData) 
    }
}

