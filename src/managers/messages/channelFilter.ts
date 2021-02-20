import {getConfig} from '../../helpers/config'
import {Manager} from '../manager'

export abstract class ChannelFilterManager extends Manager {
    preInit(bot) {
        bot.on('messageUpdate', (oldMsg, newMsg) => {
            if (oldMsg.content === newMsg.content) return
            this.checkMessage(newMsg)
        })
    }

    onMessage(message) {
        this.checkMessage(message)
    }

    checkMessage(msg) {
        if (msg.channel.id !== this.getChannelID()) {
            return
        }

        if (!this.getEmojis().includes(msg.content.trim().toLowerCase())) {
            msg.delete()
        }
    }

    getConfig() {
        return getConfig()[this.getName()]
    }

    getChannelID() {
        return this.getConfig().channel
    }

    getEmojis() {
        return this.getConfig().emojis
    }
}

module.exports = ChannelFilterManager
