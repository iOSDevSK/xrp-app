import PageView from './PageView'
import InfoContentView from './info/InfoContentView'

import Surface from 'famous/core/Surface'
import Modifier from 'famous/core/Modifier'
import Transform from 'famous/core/Transform'
import HeaderFooterLayout from 'famous/views/HeaderFooterLayout'

export default class InfoView extends PageView {
    constructor() {
        super()
    
        const postitioningModifier = new Modifier({
            transform: () => Transform.translate(-innerWidth * this.progress.get(), 0, 0)
        })
        
        const layoutPositioningModifier = new Modifier({
            transform: Transform.translate(0, 0, 1)
        })

        const layout = new HeaderFooterLayout(this.options.layout)

        layout.header = new Surface(this.options.header)
        layout.content = new InfoContentView()

        const background = new Surface({
            properties: {
                backgroundColor: 'white'
            }
        })

        const node = this.add(postitioningModifier)
        node.add(background)
        node.add(layoutPositioningModifier).add(layout)

        background.on('click', () => this._eventOutput.emit('openHomeView'))
    }
}

InfoView.DEFAULT_OPTIONS = {
    background: {
        classes: ['info-background']
    },
    layout: {
        headerSize: innerHeight * 0.12,
        footerSize: innerHeight * 0.18
    }
}

