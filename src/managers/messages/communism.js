const {ChannelFilterManager} = require('./channelFilter')

class Communism extends ChannelFilterManager {
    getName() {
        return 'communism'
    }
}

module.exports = Communism
