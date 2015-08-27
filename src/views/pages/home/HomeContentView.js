import XView from '../../XView'
import * as QR from '../../../lib/qr'

import Surface from 'famous/core/Surface'
import ImageSurface from 'famous/surfaces/ImageSurface'
import Modifier from 'famous/core/Modifier'
import Transform from 'famous/core/Transform'
import HeaderFooterLayout from 'famous/views/HeaderFooterLayout'
import $ from 'jquery'

const defaultRippleURI = 'rfemvFrpCAPc4hUa1v8mPRYdmaCqR1iFpe'
import {defaultQRDataURI as defaultData} from '../../../templates'

export default class HomeContentView extends XView {
    constructor(options) {
        super()
        this.content = new ImageSurface(this.options.content)
        this.footer = new Surface(this.options.footer)
        let contentModifier = new Modifier({
            size: [innerWidth * 0.667, innerWidth * 0.667],
            origin: [0.5, 0.5],
            align: [0.5, 0.5]
        })

        const layout = new HeaderFooterLayout(this.options.layout)
        layout.header.add(new Surface(this.options.header))
        layout.content.add(contentModifier).add(this.content)
        layout.footer.add(this.footer)

        this.add(layout)
        this.getDataURL({ uri: `ripple:\/\/${options.address}`})
    }

    setQrCode(url) {
      this.content.setContent(url)
    }

    getDataURL({uri = defaultRippleURI}, n = 0) {
        if (n > 100) {
            this.broadcast('qr:failed')
            return
        }
        let code = QR.encodeOnHiddenCanvas({
            text: uri
        })

        let url = $(code._el).find('img').attr('src')
        if (url === undefined) {
            setTimeout((() => this.getDataURL({uri: uri}, ++n)), 0)
        }
        else {
            this.setQrCode(url)
        }
    }

    setBalance(balance) {
      this.footer.setContent(`<span>balance: XRP ${balance}</span>`)
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
        content: '<h2>Recieve Payment</h2>',
        classes: ['center', 'dark']
    },
    content: {
        content: defaultData(),
        classes: ['center', 'qr', 'shadow-2']
    },
    footer: {
        content: '<span>balance: XRP</span>',
        classes: ['home-content-footer', 'center', 'dark']
    }
}

