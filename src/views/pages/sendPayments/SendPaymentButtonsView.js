import XButtonsView from '../../XButtonsView'
import SliderButton from '../../SliderButton'

export default class SendPaymentButtonsView extends XButtonsView {
    constructor() {
        super([
            {
                name: 'back',
                classes: ['left-back-button'],
                content: '<i class="fa fa-chevron-left"></i>',
                eventName: 'openHomeView',
            },
            {
                name: 'send',
                classes: ['send-payments-send-button'],
                content: '<i class="fa fa-check"></i>',
                eventName: 'sendPayment',
            }
        ])
    }
}

