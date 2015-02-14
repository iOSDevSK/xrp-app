import XView from '../../XView'
import QR from '../../../lib/qr'

import Surface from 'famous/core/Surface'
import ImageSurface from 'famous/surfaces/ImageSurface'
import Modifier from 'famous/core/Modifier'
import Transform from 'famous/core/Transform'
import HeaderFooterLayout from 'famous/views/HeaderFooterLayout'
import $ from 'jquery'

const defaultRippleURI = 'rfemvFrpCAPc4hUa1v8mPRYdmaCqR1iFpe'
import {defaultQRDataURI as defaultData} from '../../../templates'

function angle() {
    return Math.PI * 1/6 * Math.sin(Date.now() * 0.01)
}

export default class HomeContentView extends XView {
    constructor() {
        super()

        this.content = new ImageSurface(this.options.content)
        let contentModifier = new Modifier({
            origin: [0.5, 0.5],
            align: [0.5, 0.5],
            transform: () => Transform.rotate(0, angle(), 0)
        })

        const layout = new HeaderFooterLayout(this.options.layout)
        layout.header.add(new Surface(this.options.header))
        layout.content.add(contentModifier).add(this.content)
        layout.footer.add(new Surface(this.options.footer))

        this.add(layout)
        this.getDataURL()
    }

    getDataURL({uri} = {uri: defaultRippleURI}, n = 0) {
        if (n > 100) throw new Error("can't render canvas for some reason")
        let code = QR.encodeOnHiddenCanvas({
            text: defaultRippleURI
        })
        let url = $(code._el).find('img').attr('src')
        if (url === undefined) setTimeout((() => this.getDataURL({uri: uri}, ++n)), 0)
        else {
            console.log(url)
        }
    }

    setMiddleContent(uri, balance) {

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
        content: defaultData(),
        classes: ['center', 'qr', 'backfaceVisibility', 'backface-visibility']
    },
    footer: {
        content: 'balance: 14705XRP',
        classes: ['center']
    }
}

