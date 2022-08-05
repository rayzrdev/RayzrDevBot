import { MessageEmbed } from 'discord.js';

export const embed = options => new MessageEmbed(options)
    // ----- Apply defaults -----
    .setColor(global.config.color);

export const usageBuilder = command => {
    const embed = this.embed()
        .setTitle(`Usage for \`${global.config.prefix}${command}\`:`)
        .setDescription('\u200b');

    return {
        addCommand(usage, description) {
            embed.addField(`\`${global.config.prefix}${command} ${usage}\``, `*${description}*`);
            return this;
        },
        build();
    };
};
