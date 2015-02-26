import XButtonsView from '../../XButtonsView'
import SliderButton from '../../SliderButton'

export default class SendPaymentButtonsView extends XButtonsView {
    constructor() {
        super([
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
        ])
    }
}

