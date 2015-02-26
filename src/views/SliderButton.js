import PageView from './pages/PageView'

import Surface from 'famous/core/Surface'
import Modifier from 'famous/core/Modifier'
import Transform from 'famous/core/Transform'
import ImageSurface from 'famous/surfaces/ImageSurface'
import TouchSync from 'famous/inputs/TouchSync'
import Transitionable from 'famous/transitions/Transitionable'

const tracksPath = 'images/tracks.jpg',
      radius = innerWidth,
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
            opacity: () => (1-this.progress.get())
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

        const button = this.button = new Surface({
            classes: ['round', 'silder-button'],
            properties: {
                backgroundColor: 'blue'
            }
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

        button.on('touchstart', () => this.start() && this.focus())
        button.on('touchend', () => this.end() && this.hide())

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

        const buttonOffsetModifier = this.buttonOffsetModifier = new Modifier()
        this.direction = options.direction

        this.add(originBackgroundModifier).add(originBackground)
        this.add(tracksModifier).add(tracksRotationModifier).add(tracks)
        this.add(buttonOffsetModifier).add(buttonModifier).add(button)
    }

    start() {
        this.broadcast('started')
    }

    end() {
        this.broadcast('ended')
    }

    reset() {
        this.dragProgress.set(0)
        console.log('slider button reset')
        this.broadcast(this.options.eventName)
        this.end()
    }

    quiet() {
        this.unsubscribe(this.button)
    }

    unquiet() {
        this.subscribe(this.button)
    }

    hide() {
        super.hide()
        this.dragProgress.set(0)
        this.buttonOffsetModifier.setTransform(Transform.identity, this.options.transition)
    }

    hideAway() {
        let translation
        switch (this.options.direction) {
            case SliderButton.DIRECTION_RIGHT:
                // translate to the left
                translation = [-innerWidth / 2, 0, 0]
                break
            case SliderButton.DIRECTION_LEFT:
                // translate to the left
                translation = [innerWidth / 2, 0, 0]
                break
            case SliderButton.DIRECTION_UP:
                // translate to the left
                translation = [0, innerWidth / 2, 0]
                break
        }
        this.buttonOffsetModifier.setTransform(Transform.translate.apply(translation), this.options.transition)
    }
}

SliderButton.DEFAULT_OPTIONS = {
    direction: SliderButton.DIRECTION_RIGHT,
    eventName: 'foo',
    transition: {
        method: 'spring',
        dampingRatio: 0.5,
        period: 700
    }
}

SliderButton.DIRECTION_RIGHT = 0
SliderButton.DIRECTION_LEFT = 1
SliderButton.DIRECTION_UP = 2

