import XButtonsView from '../../XButtonsView'
import SliderButton from '../../SliderButton'

export default class HomeButtonsView extends XButtonsView {
    constructor() {
        super([
            {
                name: 'info',
                classes: ['home-info-button'],
                content: '<i class="fa fa-info"></i>',
                eventName: 'openInfoView',
                direction: SliderButton.DIRECTION_RIGHT
            },
            {
                name: 'share',
                classes: ['home-share-button'],
                content: '<i class="fa fa-share-alt"></i>',
                eventName: 'sharePublicKey',
                direction: SliderButton.DIRECTION_UP
            },
            {
                name: 'payments',
                classes: ['home-send-button'],
                content: '<i class="fa fa-paper-plane"></i>',
                eventName: 'openSendPaymentsView',
                direction: SliderButton.DIRECTION_LEFT
            }
        ])
    }
}

