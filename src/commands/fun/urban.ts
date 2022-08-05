import got from 'got';

const API = 'http://api.urbandictionary.com';
const ENDPOINT = '/v0/define?term=';

const searchFor = async (input: any) => await got(`${API}${ENDPOINT}${encodeURIComponent(input)}`).json();

export const run = async (bot: any, msg: any, args: any) => {
    if (args.length < 1) {
        throw 'Please provide a word or phrase to search for.';
    }

    const query = args.join(' ');

    const data = await searchFor(query);
    if (!data || !(data as any).list || (data as any).list.length < 1) {
        throw 'That word could not be found.';
    }

    const result = (data as any).list[0];

    msg.channel.send({
    embed: (global as any).factory.embed()
        .setTitle(`:book: ${result.word}`)
        .setURL(result.permalink)
        .setDescription(result.definition.replace(/\[[^\][]+\]/g, (val: any, args: any) => {
        const phrase = val.slice(1, -1);
        return `[${phrase}](https://urbandictionary.com/define.php?term=${encodeURIComponent(phrase)})`;
    }))
        .setFooter(`Author: ${result.author} | +${result.thumbs_up}/-${result.thumbs_down}`)
});
};

export const info = {
    name: 'urban',
    usage: 'urban <word>',
    description: 'Searches for a word on Urban Dictionary'
};
