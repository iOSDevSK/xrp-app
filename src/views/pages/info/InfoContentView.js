import data from './infoPanesData.json'
import XView from '../../XView'
import InfoContentPane from './InfoContentPane'

import Modifier from 'famous/core/Modifier'
import Surface from 'famous/core/Surface'
import Transform from 'famous/core/Transform'
import Transitionable from 'famous/transitions/Transitionable'

export default class InfoContentView extends XView {
    constructor() {
        super()
        this.panes = []
        this.paneInFocus = null

        this.panes.forEach(pane => this.addPane(pane))

        this._eventInput.on('focusPane', _pane => this.panes.forEach(pane => {
            if (pane.position > _pane.position) pane.hide()
        }))

        this._eventInput.on('collapsePane', () => this.panes.forEach(pane => pane.reset()))
    }

    addPane(paneData) {
        const pane = new InfoContentPane(paneData)
        const modifier = new Modifier({
            transform: () => Transform.translate(
                0, 
                pane.progress.get() * innerHeight + (1 - pane.progress.get()) * pane.position * this.options.paneSpacing,
                0
            )
        })
        this.panes.push(pane)
        this.add(modifier).add(pane)
        this.subscribe(pane)
    }
}

InfoContentView.DEFAULT_OPTIONS = {
    paneSpacing: innerHeight * 0.22
}
