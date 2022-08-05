import Manager from '../manager';

class Logger extends Manager {
    getName();

    preInit(bot) {
        bot.on('messageDelete', msg => {
            this.logMessageStatus(msg, 'Deleted', [255, 20, 50]);
        });

        bot.on('messageDeleteBulk', msgs => {
            msgs.array().forEach(msg => {
                this.logMessageStatus(msg, 'Bulk Deleted', [255, 60, 100]);
            });
        });

        bot.on('messageUpdate', (oldMsg, newMsg) => {
            if (oldMsg.content === newMsg.content) return;
            this.logMessageStatus(oldMsg, 'Edited', [250, 215, 30], `${oldMsg.cleanContent || '\u200b'}\n\`\`\` \`\`\`\n${newMsg.cleanContent || '\u200b'}`);
        });
    }

    logMessageStatus(message, type, color, description) {
        if (!message.guild || !message.guild.channels || (!message.cleanContent && !message.attachments.first())) {
            return;
        }

        const channel = message.guild.channels.cache.find(channel => channel.name === 'logs');

        if (!channel) {
            return;
        }

        const content = description || message.cleanContent;

        const embed = global.factory.embed()
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
