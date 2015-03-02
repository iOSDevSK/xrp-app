import PageView from './pages/PageView'

import Surface from 'famous/core/Surface'
import Modifier from 'famous/core/Modifier'
import StateModifier from 'famous/modifiers/StateModifier'
import Transform from 'famous/core/Transform'
import ImageSurface from 'famous/surfaces/ImageSurface'
import TouchSync from 'famous/inputs/TouchSync'
import Transitionable from 'famous/transitions/Transitionable'

const tracksPath = 'images/chevrons-2.png',
      radius = 2 * innerWidth,
      threshold = innerWidth * 0.5

export default class SliderButton extends PageView {
    constructor(options) {
        super(options)

        const tracksModifier = new Modifier({
            origin: [0, 0.5],
            align: [0.5, 0.5],
            transform: Transform.translate(0, 0, 2),
            size: () => {
                const p = this.progress.get()
                return [(0.5 + 0.5*(1-p)) * innerWidth * 0.5, 
                        (0.5 + 0.5*(1-p)) * innerWidth * 0.5 * 0.25]
            },
            opacity: () => (0.8 * (1 - this.progress.get()))
        })

        const tracks = new ImageSurface({
            content: tracksPath
        })

        const originBackgroundModifier = new Modifier({
            origin: [0.5, 0.5],
            align: [0.5, 0.5],
            size: () => {
                const p = 1 - this.progress.get()
                return [radius * p, radius * p]
            },
            opacity: () => 1 - this.progress.get()
        })

        const originBackground = new Surface({
            classes: ['slider-button-gradient-background']
        })

        const buttonClasses = ['round', 'silder-button', ...options.classes]

        let button = this.button = new Surface({
            classes: buttonClasses.concat('shadow-2'),
            content: options.content
        })

        let direction,
            tracksRotation = 0

        let onUpdate = ({delta}) => dragProgress.set(dragProgress.get() + delta)

        switch (options.direction) {
            case SliderButton.DIRECTION_RIGHT:
                direction = 0
                break
            case SliderButton.DIRECTION_LEFT:
                direction = 0
                tracksRotation = Math.PI
                break
            case SliderButton.DIRECTION_UP:
                direction = 1
                tracksRotation = Math.PI * 1.5
                break
            default:
                throw new Error('Specify a direction')
                break
        }

        button.on('touchstart', () => {
            this.start()

            // remove shadow class
            button.setClasses(buttonClasses.concat('shadow-1'))
            this.focus()
        })

        button.on('touchend', () => {
            this.end()
            this.hide(() => {
                // reset shadow class
                button.setClasses(buttonClasses.concat('shadow-2'))
            })
        })

        const sync = this.sync = new TouchSync({
            direction: direction
        })

        this.subscribe(button)
        this._eventInput.pipe(sync)

        sync.on('update', onUpdate)

        const tracksRotationModifier = new Modifier({
            origin: [0, 0.5],
            align: [0, 0.5],
            transform: Transform.rotate(0, 0, tracksRotation)
        })

        const dragProgress = this.dragProgress = new Transitionable(0)

        const buttonModifier = new Modifier({
            size: [50, 50],
            origin: [0.5, 0.5],
            align: [0.5, 0.5],
            transform: () => {
                let p = dragProgress.get()

                switch (options.direction) {
                    case SliderButton.DIRECTION_RIGHT:
                        if (p > threshold) this.reset()
                        break
                    case SliderButton.DIRECTION_LEFT:
                        if (p < -threshold) this.reset()
                        break
                    case SliderButton.DIRECTION_UP:
                        if (p < -threshold) this.reset()
                }

                return direction ? Transform.translate(0, p, 3) : Transform.translate(p, 0, 3)
            }
        })

        this.buttonOffsetModifier = new StateModifier()
        this.direction = options.direction

        this.add(originBackgroundModifier).add(originBackground)
        this.add(tracksModifier).add(tracksRotationModifier).add(tracks)
        this.add(this.buttonOffsetModifier).add(buttonModifier).add(button)
    }

    start() {
        return this.broadcast('started', this)
    }

    end() {
        return this.broadcast('ended', this)
    }

    reset() {
        this.dragProgress.set(0)
        this.broadcast(this.options.eventName)
        return this.end()
    }

    quiet() {
        this.unsubscribe(this.button)
    }

    unquiet() {
        this.subscribe(this.button)
    }

    hide(cb) {
        super.hide(cb)
        this.dragProgress.set(0)
        this.buttonOffsetModifier.setTransform(Transform.identity, this.options.transition)
    }

    hideAway() {
        let translation
        let d = this.options.displacement
        switch (this.options.direction) {
            case SliderButton.DIRECTION_RIGHT:
                // translate to the left
                translation = [-d, 0, 0]
                break
            case SliderButton.DIRECTION_LEFT:
                // translate to the left
                translation = [d, 0, 0]
                break
            case SliderButton.DIRECTION_UP:
                // translate to the left
                translation = [0, d, 0]
                break
        }
        this.buttonOffsetModifier.setTransform(Transform.translate.apply(Transform, translation), this.options.transition)
    }

    get transition() {
        return this.options.transition
    }
}

SliderButton.DEFAULT_OPTIONS = {
    direction: SliderButton.DIRECTION_RIGHT,
    eventName: 'foo',
    displacement: innerWidth / 4,
    transition: {
        method: 'spring',
        dampingRatio: 0.5,
        period: 300
    }
}

SliderButton.DIRECTION_RIGHT = 0
SliderButton.DIRECTION_LEFT = 1
SliderButton.DIRECTION_UP = 2

