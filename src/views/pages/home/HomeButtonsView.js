import XButtonsView from '../../XButtonsView'

/**
 * declare the buttons for the home page
 *
 * @class SendPaymentButtonsView
 * @extends XButtonsView
 */
export default class HomeButtonsView extends XButtonsView {
    /**
     * declare those buttons
     * @constructor
     */
    constructor() {
        super([
            {
                name: 'share',
                classes: ['home-share-button'],
                content: '<i class="fa fa-share-alt"></i>',
                eventName: 'sharePublicKey',
            },
            {
                name: 'payments',
                classes: ['home-send-button'],
                content: '<i class="fa fa-paper-plane"></i>',
                eventName: 'openSendPaymentsView',
            }
        ])
    }
}

