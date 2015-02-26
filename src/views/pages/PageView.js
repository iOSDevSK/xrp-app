import XView from '../XView'

import Transitionable from 'famous/transitions/Transitionable'

const transition = {
    curve: 'easeOut',
    duration: 600
}

const noTransition = {
    duration: 0
}

/*
const transition = {
    method: 'spring',
    period: 600,
    dampingRatio: 0.8
}
/**/

export default class PageView extends XView {
    constructor(options) {
        super(options)
        this.progress = new Transitionable(1)
    }

    get transition() {
        return transition
    }

    hide(cb) {
        this.progress.set(1, this.transition, () => {
            this.progress.set(1, noTransition, cb)
        })
    }

    focus(cb) {
        this.progress.set(0, this.transition, () => {
            this.progress.set(0, noTransition, cb)
        })
    }
}

