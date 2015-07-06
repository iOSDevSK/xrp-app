import XView from './XView'
import XButton from './XButton'
import SliderButton from './SliderButton'

import GridLayout from 'famous/views/GridLayout'

const iconLineHeight = innerHeight * 0.09

export default class XButtonsView extends XView {
    constructor(buttonsData) {
        super()

        const layout = new GridLayout({
            // 3 columns, one row
            dimensions: [buttonsData.length, 1]
        });

        const buttons = this.buttons = buttonsData
        .map(data => {
            if (data.properties === undefined) {
                data.properties = {}
            }
            data.properties.lineHeight = iconLineHeight + 'px'
            data.classes.push('center')
            return data
        })
        .map(data => {
            let button = this[data.name + 'Button'] = new RowButton(data)
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

    hide({except = null}) {
        // pushes all buttons but selected button off page
        // if called with undefined or no arguments, pushes all off
        this.buttons.forEach(button => {
            if (button !== except) button.hideAway()
        })
    }
}

class RowButton extends XButton {
    onPressDown(e) {
        super.onPressDown(e)
        this._emit(e)
        this.content.addClass('pressDown')
    }

    onPressUp(e) {
        super.onPressUp(e)
        this.content.removeClass('pressDown')
    }

    onClick(e) {
        this.content.removeClass('pressDown')
    }
}

