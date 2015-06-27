import XButtonsView from '../../XButtonsView'
import SliderButton from '../../SliderButton'

export default class HomeButtonsView extends XButtonsView {
    constructor() {
        super([
            /*
            {
                name: 'info',
                classes: ['center', 'home-info-button'],
                content: '<i class="fa fa-info"></i>',
                eventName: 'openInfoView',
                direction: SliderButton.DIRECTION_RIGHT
            },
            */
            {
                name: 'share',
                classes: ['center', 'home-share-button'],
                content: '<i class="fa fa-share-alt"></i>',
                eventName: 'sharePublicKey',
                direction: SliderButton.DIRECTION_UP
            },
            {
                name: 'payments',
                classes: ['center', 'home-send-button'],
                content: '<i class="fa fa-paper-plane"></i>',
                eventName: 'openSendPaymentsView',
                direction: SliderButton.DIRECTION_LEFT
            }
        ])
    }
}

