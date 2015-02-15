import XView from '../../XView'
import XButton from '../../XButton'
import SliderButton from '../../SliderButton'

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
                eventName: 'openHomeView',
                direction: SliderButton.DIRECTION_RIGHT
            },
            {
                name: 'check',
                classes: ['send-payments-check-balance-button'],
                content: '?',
                eventName: 'checkAccountBalance',
                direction: SliderButton.DIRECTION_UP
            },
            {
                name: 'send',
                classes: ['send-payments-send-button'],
                content: '>',
                eventName: 'sendPayment',
                direction: SliderButton.DIRECTION_LEFT
            }
        ]

        const buttons = buttonsData.map(data => {
            let button = this[data.name + 'Button'] = new SliderButton(data)
            this.subscribe(button)
            this.pipeThrough(data.eventName)
            return button
        })

        layout.sequenceFrom(buttons)
        this.add(layout)
    }
}

