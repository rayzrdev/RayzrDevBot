const { RichEmbed } = require('discord.js');

exports.embed = options => new RichEmbed(options)
    // ----- Apply defaults -----
    .setColor(global.config.color);

exports.usageBuilder = command => {
    const embed = this.embed()
        .setTitle(`Usage for \`${global.config.prefix}${command}\`:`)
        .setDescription('\u200b');

    return {
        addCommand(usage, description) {
            embed.addField(`\`${global.config.prefix}${command} ${usage}\``, `*${description}*`);
            return this;
        },
        build() {
            return embed;
        }
    };
};
