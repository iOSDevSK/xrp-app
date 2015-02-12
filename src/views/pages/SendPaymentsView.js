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
            'openHomeView'
        ])

        this.listen('sendPayment', this.sendPayment)

        const node = this.add(postitioningModifier)
        node.add(background)

        background.on('click', () => this._eventOutput.emit('openHomeView'))
        node.add(layoutPositioningModifier).add(layout)
    }

    sendPayment() {
        this.content.sendPayment();
    }
}

SendPaymentsView.DEFAULT_OPTIONS = {
    background: {
        classes: ['send-payment-background'],
        properties: {
            backgroundColor: 'red'
        }
    },
    header: {
        content: 'send payment',
        classes: ['send-payments-header'],
        properties: {
            backgroundColor: 'orange'
        }
    },
    layout: {
        headerSize: innerHeight * 0.12,
        footerSize: innerHeight * 0.18
    }
}

