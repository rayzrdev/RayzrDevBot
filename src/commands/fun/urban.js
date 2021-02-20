import got from 'got'
import {createEmbed} from '../../factory'

const API = 'http://api.urbandictionary.com'

const client = got.extend({
    prefixUrl: API
})

const ENDPOINT = '/v0/define?term='

const searchFor = async input => await client(`${ENDPOINT}${encodeURIComponent(input)}`).json()

exports.run = async (bot, msg, args) => {
    if (args.length < 1) {
        throw 'Please provide a word or phrase to search for.'
    }

    const query = args.join(' ')

    const data = await searchFor(query)
    if (!data || !data.list || data.list.length < 1) {
        throw 'That word could not be found.'
    }

    const result = data.list[0]

    msg.channel.send({
        embed: createEmbed()
            .setTitle(`:book: ${result.word}`)
            .setURL(result.permalink)
            .setDescription(result.definition.replace(/\[[^\][]+\]/g, (val, args) => {
                const phrase = val.slice(1, -1)
                return `[${phrase}](https://urbandictionary.com/define.php?term=${encodeURIComponent(phrase)})`
            }))
            .setFooter(`Author: ${result.author} | +${result.thumbs_up}/-${result.thumbs_down}`)
    })
}

exports.info = {
    name: 'urban',
    usage: 'urban <word>',
    description: 'Searches for a word on Urban Dictionary'
}
