import { MessageEmbed, MessageEmbedOptions } from 'discord.js'
import { getConfig } from './helpers/config'

export const createEmbed = (options?: MessageEmbedOptions) => new MessageEmbed(options)
    // ----- Apply defaults -----
    .setColor(getConfig().color)

export const usageBuilder = command => {
    const config = getConfig()

    const embed = createEmbed()
        .setTitle(`Usage for \`${config.prefix}${command}\`:`)
        .setDescription('\u200b')

    return {
        addCommand(usage: string, description: string) {
            embed.addField(`\`${config.prefix}${command} ${usage}\``, `*${description}*`)
            return this
        },
        build() {
            return embed
        }
    }
}
