import got from 'got';
import leven from 'leven';

const apiToken = (global as any).config.curseforgeAPIToken;

const opts = {
    headers: {
        'X-Api-Token': apiToken
    }
};

export const run = async (bot: any, msg: any, args: any) => {
    if (!apiToken) {
        throw 'Please get a CurseForge API token at https://www.curseforge.com/account/api-tokens, put it in your config file, and restart the bot.';
    }

    if (args.length < 1) {
        return usage(msg);
    }

    const sub = args[0].toLowerCase();
    args = args.slice(1);

    if (sub === 'search') {
        if (args.length < 1) {
            throw 'You must provide something to search for!';
        }

        const query = args.join('-').toLowerCase();
        const data = await search(query);
        msg.channel.send({
    embed: (global as any).factory.embed({ fields: getResults(data) })
        .setTitle(`Search results for __\`${query}\`__`)
});

    } else if (sub === 'info') {
        if (args.length < 1) {
            return usage(msg);
        }

        const versions = await getVersions(args);
        const fields = versions.map((v: any) => {
            return {
                name: v.name,
                value: `
**Release type:** ${v.releaseType}
**Game version:** ${v.gameVersion}
**File name:** ${v.fileName}
:inbox_tray: [Download](${v.downloadUrl})`
            };
        });

        msg.channel.send({
    embed: (global as any).factory.embed({ fields })
        .setDescription(`Click [here](https://dev.bukkit.org/projects/${args.join('-')}/) to see the project page.`)
});

    } else if (sub === 'download') {
        if (args.length < 1) {
            return usage(msg);
        }

        const versions = await getVersions(args);
        const version = versions[0];
        download(version.downloadUrl, version.fileName, msg.author);
        msg.channel.send(':inbox_tray: Downloading plugin, expect a PM shortly with the file!');

    } else {
        usage(msg);
    }
};

const getResults = (data: any) => {
    return data
        .map((p: any) => {
            return {
                name: p.name,
                value: `
**Slug:** \`${p.slug}\`
**ID:** \`${p.id}\`
**Stage:** \`${p.stage}\``
            };
        })
        .slice(0, 5);
};

const search = async (query: any) => {
    const res = await got(`https://api.curseforge.com/servermods/projects?search=${query}`, opts);
    const data = JSON.parse(res.body);

    if (data.length < 1) {
        throw 'No plugins found with that ID!';
    }

    return data.sort((a: any, b: any) => leven(query, a.slug) - leven(query, b.slug));
};

const getVersions = async (args: any) => {
    let id = args[0];
    if (isNaN(id)) {
        const query = args.join('-').toLowerCase();
        const results = await search(query);
        id = results[0].id;
    }

    const res = await got(`https://api.curseforge.com/servermods/files?projectids=${id}`);
    const data = JSON.parse(res.body);

    if (data.length < 1) {
        throw 'No plugins found with that ID!';
    }

    return data.splice(data.length - 5).reverse();
};

const download = async (url: any, name: any, user: any) => {
    // @ts-expect-error TS(2769): No overload matches this call.
    const result = await got(url, Object.assign(opts, { encoding: null }));

    if (result.body.length > 8 * 1024 * 1024) {
        user.send(`:no_entry_sign: The file was too big to send! Click the following link to download it yourself:\n${url}`);
    } else {
        user.send({
            file: {
                attachment: result.body,
                name: name
            }
        });
    }
};

const usage = (msg: any) => {
    msg.channel.send({
    embed: (global as any).factory.usageBuilder('plugin')
        .addCommand('search <name>', 'Searches for a plugin by name')
        .addCommand('info <slug|id>', 'Gets info about a plugin by its slug or ID')
        .addCommand('download <slug|id>', 'Downloads the plugin with the given project ID')
        .build()
});
};

export const info = {
    name: 'plugin',
    usage: 'plugin <info|search|download> <plugin>',
    description: 'Various plugin-related commands'
};
