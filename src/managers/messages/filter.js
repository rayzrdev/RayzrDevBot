const Manager = require('../manager');
const emojis = [
    ':angry:',
    ':face_palm:',
    ':confused:',
    ':unamused:',
    ':-1:',
    ':raised_hand:',
    ':eyes:',
    ':wink:',
    ':upside_down:',
    ':stuck_out_tongue_winking_eye:',
    ':thinking:'
];

const filters = [
    {
        name: 'caps spam',
        filter: /(([A-Z]{3,}\s+){25,}[A-Z]{3,})|([A-Z]{150,})/,
        messages: [
            'Please don\'t do that.',
            'Don\'t spam caps.',
            'Disable your capslock, please.',
            'Really?'
        ]
    },
    {
        name: 'character spam',
        // In the regex token '{X,}', the number of
        // chars needed to count as char spam is X + 1
        filter: /([a-z])\1{50,}/i,
        messages: [
            'Don\'t spam characters, really.',
            'Character spam is pointless.',
            'No need to repeat yourself.',
            'Character spam is not allowed here!',
            'Are you done yet?',
            'No more of that!'
        ]
    },
    {
        name: 'invite link',
        filter: (input, context) => {
            return context.channel.name !== 'advertisements'
                && !context.member.hasPermission('MANAGE_MESSAGES')
                && /(https?)?(:\/\/)?discord\.(io|gg|me)\/?[^/]+/i.test(input);
        },
        messages: [
            'Please post server invites in #advertisements.',
            'Server invites belong in #advertisements.',
            'Please move all server invites to #advertisements.'
        ]
    }
];

const randomItem = arr => arr[Math.floor(Math.random() * arr.length)];

class FilterManager extends Manager {
    getName() { return 'filter'; }

    init() {
        const bot = this.bot;

        bot.on('messageUpdate', (oldMessage, newMessage) => {
            if (!newMessage.guild || !newMessage.member || newMessage.author.id === bot.user.id || newMessage.author.bot) {
                return;
            }

            if (oldMessage.content === newMessage.content) return;

            this.onMessage(newMessage);
        });
    }

    onMessage(message) {
        let warning = this.getFilterMessage(message, message.content);

        if (!warning && message.embeds.length > 0) {
            message.embeds.forEach(embed => {
                warning = warning
                    || this.getFilterMessage(message, embed.title)
                    || this.getFilterMessage(message, embed.description)
                    || this.getFilterMessage(message, (embed.footer || {}).text);
            });
        }

        if (warning) {
            message.delete();
            message.channel.send(warning).then(m => m.delete(2000));

            message.author.send('**The following message was deleted:**').then(() => {
                message.author.send(message.content);
            });
            return;
        }

        if (message.channel.name === 'advertisements') {
            this.handler.get('levels').getLevel(message.author.id).then(level => {
                if (level < 5) {
                    message.delete();
                    message.author.send(':x: You must be at least level **5** to post in #advertisements');
                }
            });
        }
    }

    getFilterMessage(context, content) {
        if (!content) return;

        const violatedFilter = filters.find(item => {
            if (item.filter instanceof RegExp) {
                return item.filter.test(content);
            } else if (typeof item.filter === 'function') {
                return item.filter(content, context);
            }
        });

        if (violatedFilter) {
            return `${randomItem(violatedFilter.messages)} ${randomItem(emojis)} **[${violatedFilter.name}]**`;
        }
    }
}

module.exports = FilterManager;
