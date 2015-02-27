import PageView from './PageView'
import SendPaymentContentView from './sendPayments/SendPaymentContentView'
import SendPaymentButtonsView from './sendPayments/SendPaymentButtonsView'

import Surface from 'famous/core/Surface'
import Modifier from 'famous/core/Modifier'
import Transform from 'famous/core/Transform'
import HeaderFooterLayout from 'famous/views/HeaderFooterLayout'

export default class SendPaymentsView extends PageView {
    constructor() {
        super()

        let postitioningModifier = new Modifier({
            transform: () => Transform.translate(innerWidth * this.progress.get(), 0, 0) 
        })

        const layoutPositioningModifier = new Modifier({
            transform: Transform.translate(0, 0, 1)
        })

        const background = new Surface(this.options.background)
        const layout = new HeaderFooterLayout(this.options.layout)

        this.subscribe(layout.header  = new Surface(this.options.header))
        this.subscribe(layout.content = this.content = new SendPaymentContentView())
        this.subscribe(layout.footer  = new SendPaymentButtonsView())

        this.pipeThrough([
            'send-payments-form-submitted',
            'openHomeView',
            'scan-qr-code'
        ])

        this.listen('sendPayment', this.sendPayment)

        const node = this.add(postitioningModifier)
        node.add(background)

        background.on('click', () => this._eventOutput.emit('openHomeView'))
        node.add(layoutPositioningModifier).add(layout)
    }

    sendPayment() {
        this.content.sendPayment()
    }

    showAddress(data) {
        this.content.showAddress(data)
    }
}

SendPaymentsView.DEFAULT_OPTIONS = {
    background: {
        classes: ['send-payment-background']
    },
    header: {
        content: 'send payment',
        classes: ['header', 'send-payment-header']
    },
    layout: {
        headerSize: innerHeight * 0.12,
        footerSize: innerHeight * 0.18
    }
}

