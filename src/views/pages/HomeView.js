import PageView from './PageView'
import {HomeContentView, HomeButtonsView} from './home'

import Surface from 'famous/core/Surface'
import Modifier from 'famous/core/Modifier'
import Transform from 'famous/core/Transform'
import HeaderFooterLayout from 'famous/views/HeaderFooterLayout'

export default class HomeView extends PageView {
    constructor() {
        super()

        const postitioningModifier = new Modifier({
            transform: () => Transform.translate(0, 0, -1000 * this.progress.get()) 
        })

        const layoutPositioningModifier = new Modifier({
            transform: Transform.translate(0, 0, 1)
        })
        const background = new Surface({
            properties: {
                backgroundColor: 'white'
            }
        })

        const layout = new HeaderFooterLayout(this.options.layout)

        this.subscribe(layout.header  = new Surface(this.options.header))
        this.subscribe(layout.content = new HomeContentView())
        this.subscribe(layout.footer  = new HomeButtonsView())

        this.pipeThrough([
            "openInfoView",
            "openSendPaymentsView",
            "sharePublicKey"
        ])

        let node = this.add(postitioningModifier)
        node.add(background)
        node.add(layoutPositioningModifier).add(layout)
    }
}

HomeView.DEFAULT_OPTIONS = {
    background: {
        classes: ['home-background']
    },
    header: {
        content: 'XRP',
        classes: ['home-header']
    },
    layout: {
        headerSize: innerHeight * 0.12,
        footerSize: innerHeight * 0.18
    }
}

