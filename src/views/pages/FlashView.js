import PageView from './PageView'

import Surface from 'famous/core/Surface'
import Modifier from 'famous/core/Modifier'
import Transform from 'famous/core/Transform'

import Timer from 'famous/utilities/Timer'

import {
    flashNotification,
    flashWarning,
    flashError
} from '../../templates'

/**
 * Flash in-app notifications
 * Think rails
 *
 * @class FlashView
 * @extends PageView
 */

export default class FlashView extends PageView {
    constructor() {
        super()

        const postitioningModifier = new Modifier({
            size: [innerWidth * 0.8, innerWidth * 0.12],
            origin: [0.5, 0.1],
            align: [0.5, 0.1],
            transform: () => Transform.translate(0, -innerHeight * this.progress.get(), 100) 
        })

        this.label = new Surface({
            classes: ['flash'],
            properties: {
                backgroundColor: 'white'
            }
        })

        this.add(postitioningModifier).add(this.label)
    }

    flash() {
        const hide = () => this.hide()
        this.focus(() => Timer.after(hide, 120))
    }

    notify(data) {
        this.label.setContent(flashNotification(data))
    }

    warn(data) {
        this.label.setContent(flashWarning(data))
    }

    err(data) {
        this.label.setContent(flashError(data))
    }
}

