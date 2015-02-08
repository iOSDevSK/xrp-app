import XView from '../XView'

import Transitionable from 'famous/transitions/Transitionable'

const transition = {
    method: 'spring',
    period: 800,
    dampingRatio: 0.8
}

export default class PageView extends XView {
    constructor() {
        super()
        this.progress = new Transitionable(1)
    }

    hide(cb) {
        this.progress.set(1, transition, cb)
    //  console.log('hide', this, transition)
    }

    focus(cb) {
        this.progress.set(0, transition, cb)
    //  console.log('focus', this, transition)
    }
}

