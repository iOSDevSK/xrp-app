import PageView from '../PageView'

import HeaderFooterLayout from 'famous/views/HeaderFooterLayout'
import Surface from 'famous/core/Surface'
import Transform from 'famous/core/Transform'
import Modifier from 'famous/core/Modifier'

export default class InfoContentPane extends PageView {
    constructor(data, spacing) {
        super()
        this.position = data.position        
        this.focused = false

        const layout = new HeaderFooterLayout(this.options.layout)
        layout.header = new Surface({
            content: data.heading
        })

        layout.content = new Surface({
            content: data.content
        })

        const buttonModifier = new Modifier({
            size: [innerHeight * 0.22, innerHeight * 0.22],
            origin: [1, 0],
            align: [1, 0],
            transform: () => Transform.rotateZ(this.progress.get() * Math.PI)
        }) 

        const button = new Surface({
            content: '^'
        })

        this.subscribe(button)
        this._eventInput.on('click', () => {
            if (this.focused) {
                this._eventOutput.emit('collapsePane')
            }
            else {
                this._eventOutput.emit('focusPane', this)
            }
        })

        this.add(layout)
        this.add(buttonModifier).add(button)
    }
}

InfoContentPane.DEFAULT_OPTIONS = {
    layout: {
        headerSize: innerHeight * 0.22,
        footerSize: 0
    }
}

