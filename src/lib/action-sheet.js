//import { actionsheet }  from 'plugins'
/* global window */

/**
 * @module helpers
 */

const buttons = [
    'Confirm'
]


/**
 * Displays a native actionsheet with cancel button on iOS, using the hardware
 * or soft back button on Android or WP to cancel
 *
 * @function confirmAction
 * @param {Number} params.amount
 * @return {Promise<Boolean>} confirmed
 */
export default function confirmAction({amount}) {

    const confirmPrompt = `Please confirm you would like to send ${amount} XRP`

    return new Promise((res, rej) => {

        window.cordova? nativeActionSheet() : browserActionSheet()

        function nativeActionSheet() {
            window.plugins.actionsheet.show({
                title: confirmPrompt,
                addCancelButtonWithLabel: 'Cancel',
                buttonLabels: buttons,
            }, num => {
                switch (num) {
                case 1: // user selected yes
                    res(true);
                    break;
                case 2: // user selected cancel
                default:
                    res(false);
                    break;
                }
            })
        }

        function browserActionSheet() {
            const shouldProceed = window.confirm(confirmPrompt)
            res(Number(shouldProceed))
        }
    })
}

