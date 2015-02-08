import XView from '../../XView'

import Surface from 'famous/core/Surface'
import HeaderFooterLayout from 'famous/views/HeaderFooterLayout'

export default class HomeContentView extends XView {
    constructor() {
        super()

        const layout = new HeaderFooterLayout(this.options.layout)
        layout.header = new Surface(this.options.header)
        layout.content = new Surface(this.options.content)
        layout.footer = new Surface(this.options.footer)

        this.add(layout)
    }
}

HomeContentView.DEFAULT_OPTIONS = {
    layout: {
        headerSize: innerHeight * 0.1,
        footerSize: innerHeight * 0.1
    },
    header: {
        content: 'receive payment',
        classes: ['center']
    },
    content: {
        content: 'a qr code',
        classes: ['center', 'qr']
    },
    footer: {
        content: 'balance: 14705XRP',
        classes: ['center']
    }
}

