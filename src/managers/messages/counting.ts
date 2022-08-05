import Manager from '../manager';

class Counting extends Manager {
    // @ts-expect-error TS(7010): 'getName', which lacks return-type annotation, imp... Remove this comment to see the full error message
    getName();

    // @ts-expect-error TS(2389): Function implementation name must be 'getName'.
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
        if (msg.channel.id !== (global as any).config.countingChannel) {
            return;
        }

        if (!/^\d+$/.test(msg.content)) {
            msg.delete();
        }
    }
}

export default Counting;
