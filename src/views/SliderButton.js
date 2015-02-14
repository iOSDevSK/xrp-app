import PageView from './pages/PageView'

import Surface from 'famous/core/Surface'
import Modifier from 'famous/core/Modifier'
import Transform from 'famous/core/Transform'
import ImageSurface from 'famous/surfaces/ImageSurface'
import TouchSync from 'famous/inputs/TouchSync'
import Transitionable from 'famous/transitions/Transitionable'

const tracksPath = 'images/tracks.jpg',
      radius = innerWidth

export default class SliderButton extends PageView {
    constructor(options) {
        super(options)

        const tracksModifier = new Modifier({
            origin: [0.5, 0.5],
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
                const p = this.progress.get()
                return [radius * p, radius * p]
            },
            opacity: () => 1 - this.progress.get()
        })

        const originBackground = new Surface({
            classes: ['slider-button-gradient-background']
        })

        const button = new Surface({
            classes: ['round', 'silder-button'],
            properties: {
                backgroundColor: 'blue'
            }
        })


        let direction,
            tracksRotation = 0

        const onUpdate = ({delta}) => dragProgress.set(dragProgress.get() + delta)

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
                tracksRotation = Math.PI * 0.5
                break
            default:
                throw new Error('Specify a direction')
                break
        }

        button.on('touchstart', () => this.focus())
        button.on('touchend', () => this.hide())

        const sync = new TouchSync({
            direction: direction
        })

        button.pipe(sync)
        sync.on('update', onUpdate)

        const tracksRotationModifier = new Modifier({
            transform: Transform.rotate(0, 0, tracksRotation)
        })

        const dragProgress = new Transitionable(0)

        const buttonModifier = new Modifier({
            size: [50, 50],
            origin: [0.5, 0.5],
            align: [0.5, 0.5],
            transform: () => {
                return direction ? 
                    Transform.translate(0, dragProgress.get(), 3) :
                    Transform.translate(dragProgress.get(), 0, 3)
            }
        })

        this.add(originBackgroundModifier).add(originBackground)
        this.add(tracksModifier).add(tracksRotationModifier).add(tracks)
        this.add(buttonModifier).add(button)
    }
}

SliderButton.DEFAULT_OPTIONS = {
    direction: SliderButton.DIRECTION_RIGHT
}

SliderButton.DIRECTION_RIGHT = 0
SliderButton.DIRECTION_LEFT = 1
SliderButton.DIRECTION_UP = 2

