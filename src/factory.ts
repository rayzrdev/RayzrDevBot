import { MessageEmbed, MessageEmbedOptions } from "discord.js";

export const embed = (options: MessageEmbedOptions) =>
  new MessageEmbed(options)
    // ----- Apply defaults -----
    .setColor((global as any).config.color);

// @ts-expect-error TS(7006): Parameter 'command' implicitly has an 'any' type.
export const usageBuilder = (command) => {
  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
  const embed = this.embed()
    .setTitle(`Usage for \`${(global as any).config.prefix}${command}\`:`)
    .setDescription("\u200b");

  return {
    // @ts-expect-error TS(7006): Parameter 'usage' implicitly has an 'any' type.
    addCommand(usage, description) {
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
