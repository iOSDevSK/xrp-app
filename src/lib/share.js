import message from '../templates/share-message.jade'
import subject from '../templates/share-subject.jade'
//import { socialsharing } from 'plugins'

function link({address}) {
    return `ripple:\/\/${address}`
}

export default (address) => {
    window.plugins.socialsharing.share(
        message(),
        subject(),
        null,
        link({address: address})
    )
}

