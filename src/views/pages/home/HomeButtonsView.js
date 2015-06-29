import XButtonsView from '../../XButtonsView'
import SliderButton from '../../SliderButton'


export default class HomeButtonsView extends XButtonsView {
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

