import Manager from '../manager';

class Logger extends Manager {
    // @ts-expect-error TS(7010): 'getName', which lacks return-type annotation, imp... Remove this comment to see the full error message
    getName();

    // @ts-expect-error TS(2389): Function implementation name must be 'getName'.
    preInit(bot: any) {
        bot.on('messageDelete', (msg: any) => {
            // @ts-expect-error TS(2554): Expected 4 arguments, but got 3.
            this.logMessageStatus(msg, 'Deleted', [255, 20, 50]);
        });

        bot.on('messageDeleteBulk', (msgs: any) => {
            msgs.array().forEach((msg: any) => {
                // @ts-expect-error TS(2554): Expected 4 arguments, but got 3.
                this.logMessageStatus(msg, 'Bulk Deleted', [255, 60, 100]);
            });
        });

        bot.on('messageUpdate', (oldMsg: any, newMsg: any) => {
            if (oldMsg.content === newMsg.content) return;
            this.logMessageStatus(oldMsg, 'Edited', [250, 215, 30], `${oldMsg.cleanContent || '\u200b'}\n\`\`\` \`\`\`\n${newMsg.cleanContent || '\u200b'}`);
        });
    }

    logMessageStatus(message: any, type: any, color: any, description: any) {
        if (!message.guild || !message.guild.channels || (!message.cleanContent && !message.attachments.first())) {
            return;
        }

        const channel = message.guild.channels.cache.find((channel: any) => channel.name === 'logs');

        if (!channel) {
            return;
        }

        const content = description || message.cleanContent;

        const embed = (global as any).factory.embed()
    .setTitle(type)
    .addField('Channel', `${message.channel}`)
    .setColor(color)
    .setTimestamp(new Date())
    .setFooter(message.author.username, message.author.avatarURL());

        if (content) {
            embed.setDescription(`\`\`\`\n${content.substr(0, 1750)}\n\`\`\``);
        }

        if (message.attachments.size > 0) {
            const attachment = message.attachments.first();

            if (attachment.width) {
                embed.setImage(attachment.url);
            } else {
                embed.attachFile(attachment.url);
            }

            if (!content) {
                embed.setDescription(`[File](${attachment.url})`);
            }
        }

        channel.send({ embed });
    }
}

export default Logger;
