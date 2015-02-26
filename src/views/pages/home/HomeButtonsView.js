import XButtonsView from '../../XButtonsView'
import SliderButton from '../../SliderButton'

export default class HomeButtonsView extends XButtonsView {
    constructor() {
        super([
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
        ])
    }
}

