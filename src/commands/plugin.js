const RichEmbed = require('discord.js').RichEmbed;

const request = require('request');
const leven = require('leven');

const api = request.defaults({
    headers: {
        'X-Api-Token': require('../bot.js').config.curseforgeAPIToken
    },
    baseUrl: 'https://api.curseforge.com/servermods'
});

exports.run = async function (bot, msg, args) {
    if (args.length < 1) {
        usage(bot, msg);
        return;
    }
    var sub = args[0];
    args = args.splice(1);
    if (sub === 'search') {
        if (args.length < 1) {
            msg.channel.sendMessage(':no_entry_sign: You must provide something to search for!');
            return;
        }

        var m = await msg.channel.sendMessage(':arrows_counterclockwise: Searching...');

        try {
            var query = args.join('-').toLowerCase();
            var data = await search(query);
            m.edit('', {
                embed: new RichEmbed({ fields: getResults(data) })
                    .setTitle('Search results')
                    .setDescription(`Search results for \`${query}\`:`)
                    .setColor(bot.config.color)
            });
        } catch (err) {
            m.edit(`:no_entry_sign: ${err}`);
        }

    } else if (sub === 'info') {
        if (args.length < 1) {
            usage(bot, msg);
            return;
        }

        var m = await msg.channel.sendMessage(':arrows_counterclockwise: Loading data...');
        try {
            var versions = await getVersions(args);
            versions = versions.map(v => {
                return {
                    name: v.name,
                    value: `
**Release type:** ${v.releaseType}
**Game version:** ${v.gameVersion}
**File name:** ${v.fileName}
:inbox_tray: [Download](${v.downloadUrl})`
                };
            });

            m.edit('', {
                embed: new RichEmbed({ fields: versions })
                    .setTitle('Results:')
                    .setDescription(`Click [here](https://dev.bukkit.org/projects/${args.join('-')}/) to see the project page.`)
                    .setColor(bot.config.color)
            });
        } catch (err) {
            m.edit(`:no_entry_sign: ${err}`);
        }
    } else if (sub === 'download') {
        if (args.length < 1) {
            usage(bot, msg);
            return;
        }

        var m = await msg.channel.sendMessage(':arrows_counterclockwise: Loading data...');

        try {
            var versions = await getVersions(args);
            var version = versions[0];
            download(version.downloadUrl, version.fileName, msg.author);
            m.edit(':inbox_tray: Downloading file, expect a PM shortly with the file!');
        } catch (err) {
            m.edit(`:no_entry_sign: ${err}`);
        }
    } else {
        usage(bot, msg);
    }
};

function getResults(data) {
    return data
        .map(p => {
            return {
                name: p.name,
                value: `
**Slug:** \`${p.slug}\`
**ID:** \`${p.id}\`
**Stage:** \`${p.stage}\``
            };
        })
        .slice(0, 5);
}

async function search(query) {
    return new Promise((resolve, reject) => {
        api.get(`/projects?search=${query}`, (err, res, body) => {
            if (!err && res && res.statusCode === 200) {
                let data = JSON.parse(body);
                if (data.length < 1) {
                    reject('No plugins found with that ID!');
                    return;
                }
                resolve(data.sort((a, b) => leven(query, a.slug) - leven(query, b.slug)));
            } else {
                reject(err);
            }
        });
    });
}

function getVersions(args) {
    return new Promise(async (resolve, reject) => {
        var id = args[0];
        if (isNaN(id)) {
            try {
                var query = args.join('-').toLowerCase();
                var results = await search(query);
                id = results[0].id;
            } catch (err) {
                reject(err);
                return;
            }
        }

        api.get(`/files?projectids=${id}`, (err, res, body) => {
            if (!err && res.statusCode === 200) {
                let data = JSON.parse(body);
                if (data.length < 1) {
                    reject('No plugins found with that ID!');
                    return;
                }
                resolve(data.splice(data.length - 5).reverse());
            } else {
                reject(err);
            }
        });
    });
}

function download(url, name, user) {
    var buffer = Buffer.alloc(0);
    request.get(url).on('data', (data) => {
        buffer = Buffer.concat([buffer, data]);
    }).on('end', () => {
        if (buffer.length > 8 * 1024 * 1024) {
            user.sendMessage(`:no_entry_sign: The file was too big to send! Click the following link to download it yourself:\n${url}`);
        }
        user.sendFile(buffer, name);
    }).on('error', (err) => {
        user.sendMessage(`:no_entry_sign: Failed to download file: ${err}`);
    });
}

function usage(bot, msg) {
    msg.channel.sendEmbed(
        new RichEmbed({
            fields: [
                {
                    name: 'search',
                    value: `\`${bot.config.prefix}plugin search <name>\``
                },
                {
                    name: 'info',
                    value: `\`${bot.config.prefix}plugin info <slug|id>\``
                },
                {
                    name: 'download',
                    value: `\`${bot.config.prefix}plugin download <projectid>\``
                }
            ]
        })
            .setTitle(`Usage for \`${bot.config.prefix}plugin\`:`)
            .setColor(bot.config.color)
    );
}

exports.info = {
    name: 'plugin',
    usage: 'plugin <info|search|download> <plugin>',
    description: 'Various plugin-related commands'
};