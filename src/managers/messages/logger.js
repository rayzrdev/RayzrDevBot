const RichEmbed = require('discord.js').RichEmbed;
const Manager = require('../manager');

class Logger extends Manager {
    getName() {
        return 'logger';
    }

    init(bot) {
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
            this.logMessageStatus(oldMsg, 'Edited', [250, 215, 30], `${oldMsg.cleanContent}\n\`\`\` \`\`\`\n${newMsg.cleanContent}`);
        });
    }

    logMessageStatus(message, type, color, description) {
        if (!message.guild || !message.guild.channels || (!message.cleanContent && !message.attachments.first())) {
            return;
        }

        const channel = message.guild.channels.find('name', 'logs');

        if (channel) {
            channel.send({
                embed: new RichEmbed()
                    .setTitle(type)
                    .setDescription(`\`\`\`\n${(description || message.cleanContent).substr(0, 1950)}\n\`\`\``)
                    .addField('Channel', `${message.channel}`)
                    .setColor(color)
                    .setTimestamp(new Date())
                    .setFooter(message.author.username, message.author.avatarURL)
            });
        }
    }
}

module.exports = Logger;