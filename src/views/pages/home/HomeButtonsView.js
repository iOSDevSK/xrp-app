import XView from '../../XView'
import XButton from '../../XButton'
import SliderButton from '../../SliderButton'

import GridLayout from 'famous/views/GridLayout'

export default class HomeButtonsView extends XView {
    constructor() {
        super()

        const layout = new GridLayout({
            // 3 columns, one row
            dimensions: [3, 1]
        });

        const buttonsData = [
            {
                name: 'info',
                classes: ['home-info-button'],
                content: 'i',
                eventName: 'openInfoView',
                direction: SliderButton.DIRECTION_RIGHT
            },
            {
                name: 'share',
                classes: ['home-share-button'],
                content: 's',
                eventName: 'sharePublicKey',
                direction: SliderButton.DIRECTION_UP
            },
            {
                name: 'payments',
                classes: ['home-send-button'],
                content: 'p',
                eventName: 'openSendPaymentsView',
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

