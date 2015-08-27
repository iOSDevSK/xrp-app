import PageView from './PageView'
import SendPaymentContentView from './sendPayments/SendPaymentContentView'
import SendPaymentButtonsView from './sendPayments/SendPaymentButtonsView'

import Surface from 'famous/core/Surface'
import Modifier from 'famous/core/Modifier'
import Transform from 'famous/core/Transform'
import HeaderFooterLayout from 'famous/views/HeaderFooterLayout'
import { RowButton } from '../XButtonsView'

import $ from 'jquery'

const lineHeight = innerHeight * 0.12 - 20

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

        node.add(layoutPositioningModifier).add(layout)

        const cameraButton = new RowButton({
            classes: [
                'send-payments-camera-button',
                'center'
            ],
            content: '<i class="fa fa-qrcode" style="padding: 20px 0 0 0; line-height: ' + lineHeight + 'px"></i>',
            eventName: 'scan-qr-code'
        })
        this.subscribe(cameraButton)

        const cameraButtonModifier = new Modifier({
            size: [innerHeight * 0.12, innerHeight * 0.12],
            origin: [1, 0],
            align: [1, 0],
            transform: Transform.translate(0, 0, 3)
        })

        node.add(cameraButtonModifier).add(cameraButton)
    }

    sendPayment() {
        this.content.sendPayment()
    }

    verifyForm() {
        return this.content.verifyForm()
    }

    showAddress(data) {
        this.content.showAddress(data)
    }

    focus(cb) {
        super.focus(cb)
        $('div.press-here-for-qr-code').children().each((_, child) => {
          $(child).addClass('fadeout')
        })
    }
}

SendPaymentsView.DEFAULT_OPTIONS = {
    background: {
        classes: ['send-payment-background']
    },
    header: {
        content: '<h1>Send Payment</h1>',
        classes: ['header', 'send-payment-header'],
        properties: {
            lineHeight: lineHeight + 'px'
        }
    },
    layout: {
        headerSize: innerHeight * 0.12,
        footerSize: innerHeight * 0.09
    }
}

