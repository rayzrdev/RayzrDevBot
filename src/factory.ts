import { MessageEmbed, MessageEmbedOptions } from "discord.js";

export const embed = (options: MessageEmbedOptions) =>
  new MessageEmbed(options)
    // ----- Apply defaults -----
    .setColor((global as any).config.color);

export const usageBuilder = (command: any) => {
  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
  const embed = this.embed()
    .setTitle(`Usage for \`${(global as any).config.prefix}${command}\`:`)
    .setDescription("\u200b");

  return {
    addCommand(usage: any, description: any) {
      embed.addField(
        `\`${(global as any).config.prefix}${command} ${usage}\``,
        `*${description}*`
      );
      return this;
    },
    build() {
      return embed;
    },
  };
};
