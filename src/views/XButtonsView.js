import XView from './XView'
import XButton from './XButton'
import SliderButton from './SliderButton'

import GridLayout from 'famous/views/GridLayout'

export default class XButtonsView extends XView {
    constructor(buttonsData) {
        super()

        const layout = new GridLayout({
            // 3 columns, one row
            dimensions: [3, 1]
        });

        const buttons = this.buttons = buttonsData.map(data => {
            let button = this[data.name + 'Button'] = new SliderButton(data)
            this.subscribe(button)
            this.pipeThrough(data.eventName)
            return button
        })

        this.listen('started', button => this.onlyListenTo(button))
        this.listen('ended', button => this.subscribeAll())
    
        layout.sequenceFrom(buttons)
        this.add(layout)
    }
    
    onlyListenTo(viewToListenTo) {
        super.onlyListenTo(viewToListenTo)
        this.hide({except: viewToListenTo})
    }

    subscribeAll() {
        super.subscribeAll()
        this.focus()
    }

    focus() {
        // resets all the buttons
        this.buttons.forEach(button => button.hide())
    }

    hide({except} = {except: null}) {
        // pushes all buttons but selected button off page
        // if called with undefined or no arguments, pushes all off
        this.buttons.forEach(button => {
            if (button !== except) button.hideAway()
        })
    }
}

