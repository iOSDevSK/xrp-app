const buttons = [
    'Confirm'
]

export default function confirmAction({amount}) {

    const confirmPrompt = `Please confirm you would like to send ${amount} XRP`

    return new Promise((res, rej) => {

        window.cordova? nativeActionSheet() : browserActionSheet()

        function nativeActionSheet() {
            window.plugins.actionsheet.show({
                title: confirmPrompt,
                androidEnableCancelButton: true, // default false
                winphoneEnableCancelButton: true, // default false
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

