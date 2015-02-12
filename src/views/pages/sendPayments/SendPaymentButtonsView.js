import XView from '../../XView'
import XButton from '../../XButton'

import GridLayout from 'famous/views/GridLayout'

export default class SendPaymentButtonsView extends XView {
    constructor() {
        super()

        const layout = new GridLayout({
            // 3 columns, one row
            dimensions: [3, 1]
        });

        const buttonsData = [
            {
                name: 'back',
                classes: ['left-back-button'],
                content: '<',
                eventName: 'openHomeView'
            },
            {
                name: 'check',
                classes: ['send-payments-check-balance-button'],
                content: '?',
                eventName: 'checkAccountBalance'
            },
            {
                name: 'send',
                classes: ['send-payments-send-button'],
                content: '>',
                eventName: 'sendPayment'
            }
        ]

        const buttons = buttonsData.map(data => {
            let button = this[data.name + 'Button'] = new XButton(data)
            this.subscribe(button)
            this.pipeThrough(data.eventName)
            return button
        })

        layout.sequenceFrom(buttons)
        this.add(layout)
    }
}

