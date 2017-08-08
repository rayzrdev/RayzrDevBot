const { RichEmbed } = require('discord.js');

exports.embed = (options) => new RichEmbed(options)
    // ----- Apply defaults -----
    .setColor(global.config.color);