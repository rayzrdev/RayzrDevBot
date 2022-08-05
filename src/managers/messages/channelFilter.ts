import Manager from '../manager';

class ChannelFilter extends Manager {
    // @ts-expect-error TS(2416): Property 'preInit' in type 'ChannelFilter' is not ... Remove this comment to see the full error message
    preInit(bot: any) {
        bot.on('messageUpdate', (oldMsg: any, newMsg: any) => {
            if (oldMsg.content === newMsg.content) return;
            this.checkMessage(newMsg);
        });
    }

    onMessage(message: any) {
        this.checkMessage(message);
    }

    checkMessage(msg: any) {
        if (msg.channel.id !== this.getChannelID()) {
            return;
        }

        if (!this.getEmojis().includes(msg.content.trim().toLowerCase())) {
            msg.delete();
        }
    }

    // @ts-expect-error TS(2391): Function implementation is missing or not immediat... Remove this comment to see the full error message
    getChannelID();

    // @ts-expect-error TS(2391): Function implementation is missing or not immediat... Remove this comment to see the full error message
    getEmojis();
}

export default ChannelFilter;
