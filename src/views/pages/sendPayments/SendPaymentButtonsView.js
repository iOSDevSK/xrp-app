import XButtonsView from '../../XButtonsView'

/**
 * declare the buttons for the send payment page
 *
 * @class SendPaymentButtonsView
 * @extends XButtonsView
 */
export default class SendPaymentButtonsView extends XButtonsView {
    /**
     * declare those buttons
     * @constructor
     */
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

